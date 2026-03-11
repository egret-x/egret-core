# Egret 引擎 WebGPU 渲染管线分析

> Egret Core 5.4.2

---

## 1. 概述

Egret 引擎的 WebGPU 渲染后端是 WebGL 后端的直接移植，采用**延迟渲染架构**：在场景图遍历期间累积绘制命令，最后在帧末一次性提交到 GPU。这种设计使得命令批处理合并成为可能，显著减少了 GPU API 调用开销。

---

## 2. 文件结构

```
src/egret/web/rendering/webgpu/
├── WebGPURenderContext.ts        # GPU 核心单例：设备、管道、绘制执行
├── WebGPURenderer.ts             # 场景图遍历 + 渲染调度
├── WebGPURenderBuffer.ts         # 渲染缓冲区：变换矩阵栈、模板/裁剪状态
├── WebGPURenderTarget.ts         # 离屏渲染目标（纹理 + 深度模板）
├── WebGPUDrawCmdManager.ts       # 绘制命令队列 + 批处理合并
├── WebGPUVertexArrayObject.ts    # 顶点/索引数据管理
├── WebGPUUtils.ts                # 特性检测 + 管道创建工具
├── webgpu.d.ts                   # WebGPU TypeScript 类型定义
├── WGShaderLib.ts                # WGSL 着色器字符串常量
└── shaders/                      # WGSL 着色器源文件
    ├── default_vert.wgsl
    ├── texture_frag.wgsl
    ├── primitive_frag.wgsl
    ├── blur_frag.wgsl
    ├── glow_frag.wgsl
    └── colorTransform_frag.wgsl
```

---

## 3. 核心类与接口

| 类/接口 | 文件 | 职责 |
|---------|------|------|
| `sys.SystemRenderer` | `SystemRenderer.ts` | 抽象渲染器接口：`render()`、`drawNodeToBuffer()`、`renderClear()` |
| `WebGPURenderer` | `WebGPURenderer.ts` | **场景图遍历器**：遍历显示对象树，分发到 `renderBitmap`/`renderText`/`renderGraphics` 等，处理滤镜/裁剪/滚动矩形 |
| `WebGPURenderContext` | `WebGPURenderContext.ts` | **GPU 核心单例**：管理 `GPUDevice`、`GPUCanvasContext`、所有渲染管道、Shader 模块、Sampler、BindGroup 布局、GPU 缓冲区。包含 `$drawWebGPU()` —— 帧刷新方法 |
| `WebGPURenderBuffer` | `WebGPURenderBuffer.ts` | **渲染缓冲区**：拥有 `WebGPURenderTarget`，管理变换矩阵栈、模板/裁剪状态、全局 alpha/颜色 tint。实现 `sys.RenderBuffer`，通过 `gpuRenderBufferPool` 对象池化 |
| `WebGPURenderTarget` | `WebGPURenderTarget.ts` | **渲染目标**：管理离屏 `GPUTexture`（颜色附件）和可选的深度模板纹理（延迟创建） |
| `WebGPUDrawCmdManager` | `WebGPUDrawCmdManager.ts` | **命令缓冲**：累积绘制命令（`IGPUDrawData[]`），支持批处理合并。命令类型：`TEXTURE`、`RECT`、`PUSH_MASK`、`POP_MASK`、`BLEND`、`RESIZE_TARGET`、`CLEAR_COLOR`、`ACT_BUFFER`、`ENABLE_SCISSOR`、`DISABLE_SCISSOR`、`SMOOTHING` |
| `WebGPUVertexArrayObject` | `WebGPUVertexArrayObject.ts` | **顶点/索引组装**：CPU 端 `Float32Array` + `Uint16Array` 管理。预生成四边形索引。顶点格式：20 字节（position:f32×2, uv:f32×2, tintcolor:u32）。每批最多 2048 个四边形 |
| `WebGPUUtils` | `WebGPUUtils.ts` | **特性检测**：`checkCanUseWebGPU()`、`checkWebGPUSupportAsync()`、`createRenderPipeline()` 辅助函数、`premultiplyTint()` 颜色混合 |
| `WGShaderLib` | `WGShaderLib.ts` | **着色器库**：所有 WGSL 着色器的静态字符串常量，包含 ETC alpha-mask 变体 |

---

## 4. 渲染管线流程

### 4.1 初始化流程

1. **`setRenderMode("webgpu")`** 在 `EgretWeb.ts`:
   - 调用 `WebGPUUtils.checkCanUseWebGPU()` 检查 `navigator.gpu` 可用性
   - 请求 adapter + device 验证支持
   - 设置 `sys.RenderBuffer = WebGPURenderBuffer`
   - 创建 `sys.systemRenderer = new WebGPURenderer()`

2. **`WebGPURenderContext` 单例构建**（首次 `WebGPURenderBuffer` 创建时触发）:
   - 创建 HTML Canvas
   - 实例化 `WebGPUDrawCmdManager` 和 `WebGPUVertexArrayObject`
   - 异步 `initWebGPU()`:
     - `navigator.gpu.requestAdapter({powerPreference:'high-performance'})`
     - `adapter.requestDevice()`
     - 注册设备丢失处理器
     - `canvas.getContext('webgpu')` + `configure({format, alphaMode:'premultiplied'})`
     - 创建 GPU 缓冲区：顶点（maxQuads×4×5×4 字节）、索引（maxQuads×6×2 字节）、Uniform（256 字节）
     - 创建 Shader 模块：8 个着色器
     - 创建 Sampler：linear + nearest
     - 创建 BindGroup 布局
     - 创建默认管道：约 24 个（5 种混合模式 × 多种变体）
     - 创建滤镜管道：6 个
     - 创建默认空纹理：16×16 白色占位符

3. **混合模式初始化**:
   - `"source-over"`: src=one, dst=one-minus-src-alpha
   - `"lighter"`: src=one, dst=one
   - `"lighter-in"`: src=src-alpha, dst=one-minus-src-alpha
   - `"destination-out"`: src=zero, dst=one-minus-src-alpha
   - `"destination-in"`: src=zero, dst=src-alpha

### 4.2 每帧渲染流程

```
Player.tick
  ├── sys.systemRenderer.renderClear()
  │    └── WebGPURenderContext.$beforeRender()  -- 重置混合模式
  └── DisplayList.drawToSurface()
       └── sys.systemRenderer.render(displayObject, buffer, matrix)
            └── WebGPURenderer.render()
                 ├── 推送渲染缓冲区到上下文缓冲区栈
                 ├── 设置根变换矩阵
                 ├── drawDisplayObject()  -- 递归遍历场景图
                 │    ├── BitmapNode -> renderBitmap() -> drawTexture()
                 │    ├── TextNode -> renderText() -> drawTexture()
                 │    ├── GraphicsNode -> renderGraphics() -> drawTexture()
                 │    ├── MeshNode -> renderMesh() -> drawTexture()
                 │    ├── NormalBitmapNode -> renderNormalBitmap() -> drawImage()
                 │    ├── GroupNode -> renderGroup() (递归)
                 │    └── FILTER -> drawWithFilter()
                 │         CLIP -> drawWithClip()
                 │         SCROLLRECT -> drawWithScrollRect()
                 ├── gpuBufferContext.$drawWebGPU()  -- 刷新所有累积命令
                 └── 弹栈释放缓冲区
```

### 4.3 绘制执行 (`$drawWebGPU()`)

这是 `WebGPURenderContext.ts:1531` 的核心方法：

1. **上传顶点/索引数据** 到 GPU：`device.queue.writeBuffer()`
2. **创建 GPUCommandEncoder**
3. **遍历所有绘制命令**:
   - **`ACT_BUFFER`**: 激活渲染缓冲区，获取目标纹理视图，写入投影 uniform，开始渲染通道
   - **`TEXTURE`**: 设置纹理/滤镜管道，创建绑定组，调用 `drawIndexed()`
   - **`RECT`**: 设置纯色管道，调用 `drawIndexed()`
   - **`PUSH_MASK`**: 延迟创建深度模板纹理，使用 stencil_push 管道递增模板值
   - **`POP_MASK`**: 递减模板值，最后一个弹出不带深度附件重启通道
   - **`BLEND`**: 更新当前混合模式
   - **`CLEAR_COLOR`**: 结束当前通道，清除颜色开始新通道
   - **`ENABLE_SCISSOR` / `DISABLE_SCISSOR`**: 设置裁剪矩形
   - **`RESIZE_TARGET`**: 调整离屏纹理大小

4. **结束渲染通道**，**提交**命令缓冲
5. **清空**命令管理器和 VAO，准备下一帧

---

## 5. 着色器

### 5.1 顶点格式（20 字节/顶点）

```
@location(0) aVertexPosition: vec2<f32>   -- offset 0,   format float32x2
@location(1) aTextureCoord:   vec2<f32>   -- offset 8,   format float32x2
@location(2) aColor:          vec4<f32>   -- offset 16,  format unorm8x4 (packed RGBA)
```

### 5.2 绑定布局约定

```
group(0) binding(0) = uniform buffer (projectionVector: vec2<f32>)  [VERTEX]
group(0) binding(1) = sampler                                       [FRAGMENT]
group(0) binding(2) = texture_2d<f32>                               [FRAGMENT]
group(1) binding(0) = filter uniform buffer (optional)             [FRAGMENT]
```

### 5.3 着色器列表

| 着色器 | 用途 | 关键操作 |
|--------|------|----------|
| `default_vert` | 顶点变换 | `position = (vertexPos / projectionVector) + center(-1,1)` |
| `texture_frag` | 标准纹理四边形 | `textureSample(texture, sampler, uv) * vertexColor` |
| `primitive_frag` | 纯色矩形/遮罩 | `return vertexColor` |
| `colorTransform_frag` | 颜色矩阵滤镜 | 预乘 alpha 解算 → 4×4 颜色矩阵 → 颜色加法 → 重新预乘 |
| `blur_frag` | 高斯模糊（1D） | 11-tap 盒式滤波器，方向由 `blur` uniform 控制 |
| `glow_frag` | 发光/阴影滤镜 | 12 角度 × 7 线性步长采样，内外发光混合 |
| `texture_etc_alphamask_frag` | ETC 压缩纹理 + 独立 alpha | 从第二纹理读取 alpha |
| `colorTransform_etc_alphamask_frag` | 颜色矩阵 + ETC alpha mask | 结合 ETC alpha mask 与颜色矩阵变换 |

---

## 6. 资源管理

### 6.1 纹理生命周期

- `createTexture(bitmapData)`: 创建 `GPUTexture`，上传数据
- `getGPUTexture(bitmapData)`: 延迟创建缓存
- `updateTexture(texture, bitmapData)`: 重新上传
- `deleteGPUTexture(texture)`: 销毁纹理

### 6.2 渲染目标

- `WebGPURenderTarget` 管理离屏纹理
- 深度模板纹理延迟创建（仅遮罩需要时）
- `resize()` 销毁并重建纹理

### 6.3 缓冲区池化

- `gpuRenderBufferPool[]`: 可复用 `WebGPURenderBuffer` 数组，最多 6 个

### 6.4 绑定组缓存

- 纯色绑定组按投影变化缓存
- 纹理绑定组每帧创建
- 滤镜绑定组每帧创建

---

## 7. 架构图

```
+-----------------------+
|    Player / Ticker    |
|   (per-frame loop)    |
+-----------+-----------+
            |
            v
+---------------------------+
|   WebGPURenderer          |  <-- sys.SystemRenderer 实现
| (场景图遍历 + 渲染分发)   |
+-----------+-----------+
            |
            | drawDisplayObject()
            | drawWithFilter/Clip/ScrollRect
            | drawImage/drawMesh/drawRect/pushMask/...
            v
+---------------------------+
|   WebGPURenderContext     |  <-- 单例
| GPU 设备、管道、执行器    |
+--+--------+--------+------+--+
   |        |        |        |
   | 累积命令 | 管理顶点 | 管理资源
   |        |        |
+--v--+  +--v-----+  +v--------+
|DrawCmd|  | VAO   |  |RenderTarget|
|Manager|  |(顶点数据)| |(离屏纹理) |
+---+---+  +---+---+  +----+----+--+
    |          |            |
    |          |            |
    +-----> $drawWebGPU() <+
                         |
                         v
+---------------------------------------------------+
|            GPUDevice / GPUQueue                    |
|  createCommandEncoder()                            |
|  beginRenderPass()                                 |
|  setPipeline / setBindGroup                        |
|  setVertexBuffer / setIndexBuffer                  |
|  drawIndexed()                                     |
|  end() + submit()                                   |
+---------------------------------------------------+
```

---

## 8. WebGPU vs WebGL 对比

| 方面 | WebGPU | WebGL |
|------|--------|-------|
| 管道创建时机 | 初始化时预创建 ~24 个管道 | 运行时动态设置 GL 状态 |
| 渲染通道 | 显式 begin/end render pass | 隐式帧缓冲切换 |
| 资源绑定 | BindGroup 组合 uniform/纹理/sampler | 单独 gl.uniform / gl.bindTexture |
| 数据上传 | device.queue.writeBuffer() | gl.bufferSubData() |
| 命令模式 | 延迟累积 → 批量提交 | 同步调用 |
| 批处理 | 相同纹理合并为单次 drawIndexed | 相同状态合并 |

---

## 9. 性能优化要点

1. **命令批处理**：相同纹理的连续绘制合并，最多 2048 四边形/批
2. **预创建管道**：避免运行时创建管道的 GPU 暂停
3. **延迟资源创建**：深度模板纹理仅遮罩需要时创建
4. **对象池**：RenderBuffer 复用
5. **Canvas 2D 混合**：文本和矢量图形先渲染到 Canvas，再作为纹理上传

---

## 10. 相关文件路径

- 核心文件：`src/egret/web/rendering/webgpu/`
- WebGL 对应：`src/egret/web/rendering/webgl/`
- 入口集成：`src/egret/web/EgretWeb.ts`
- 系统渲染器接口：`src/egret/player/SystemRenderer.ts`
