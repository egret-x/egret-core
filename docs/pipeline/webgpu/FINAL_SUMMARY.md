# Egret WebGPU 渲染系统完整架构分析

## 快速导航

本文档提供了对Egret引擎WebGPU渲染系统的**完整、深度的技术分析**。

- **完整文档**: `/tmp/webgpu_analysis.md` (3000+ 行，包含所有细节)
- **快速参考**: `/tmp/webgpu_summary.txt` (500 行，关键信息浓缩)

## 核心发现

### 1. 系统架构

Egret WebGPU渲染系统采用**经典的GPU渲染管线设计**：

```
显示对象树 → Renderer递归遍历 → 命令积累 → 统一执行 → GPU渲染
```

**7个核心组件** (3700+ 行代码):
- **WebGPURenderer** (994行): 场景树遍历和节点分派
- **WebGPURenderContext** (1956行): GPU上下文和渲染管线执行（★★★核心）
- **WebGPURenderBuffer** (377行): 渲染状态管理
- **WebGPURenderTarget** (274行): 离屏纹理和深度模板
- **WebGPUDrawCmdManager** (297行): 命令队列和批次合并
- **WebGPUVertexArrayObject** (317行): 顶点缓冲管理
- **WebGPUUtils** (197行): 工具函数

### 2. 每帧渲染流程

```
1. 递归遍历显示对象树
   ├─ 对BitmapNode → drawImage()
   ├─ 对TextNode → Canvas→GPU纹理→drawImage()
   ├─ 对GraphicsNode → Canvas→GPU纹理→drawImage()
   ├─ 对MeshNode → drawMesh()
   └─ 对GroupNode → 递归处理子节点

2. 所有调用最终转化为：
   ├─ drawCmdManager.push*() [压入命令]
   └─ vao.cacheArrays() [缓存顶点数据]

3. 统一执行 context.$drawWebGPU():
   ├─ 上传顶点/索引到GPU
   ├─ 遍历命令队列，执行：
   │  ├─ ACT_BUFFER: 切换RenderPass
   │  ├─ TEXTURE: 选管线 + drawIndexed()
   │  ├─ RECT: 图元管线 + drawIndexed()
   │  ├─ PUSH_MASK/POP_MASK: Stencil操作
   │  └─ 其他状态命令
   ├─ 提交CommandBuffer到GPU
   └─ 清理缓冲区
```

### 3. 关键优化

#### 批次合并
- 相同纹理自动合并 (不写多个draw call)
- 冗余混合模式指令剔除
- **效果**: UI界面通常 100+ draw calls → 10-50

#### 缓存策略
- **管线缓存**: 预编译WGSL后永久保存 (零创建开销)
- **BindGroup缓存**: 复用Primitive BindGroup，Texture BindGroup按需创建
- **TextureView缓存**: 每个纹理一个视图
- **Sampler缓存**: 仅2个 (linear/nearest)

#### 内存管理
- **对象池**: WebGPURenderBuffer最多保持6个离屏缓冲
- **延迟销毁**: 纹理不立即destroy，下一帧批量销毁
- **Stencil惰性启用**: 首次需要时才创建depth-stencil

### 4. 高级特性

#### Stencil嵌套遮罩
```
pushMask() → stencilHandleCount++
popMask()  → stencilHandleCount--
后续绘制时: setStencilReference(count) → 仅匹配的像素通过
```

#### 滤镜管线
- 单一ColorTransform: 直接在TEXTURE指令中处理
- 其他滤镜: 创建离屏buffer，链式处理
- 支持: ColorTransform, Blur(可分离), Glow

#### Scissor测试
- 用于优化scrollRect性能
- 自动计算与RenderTarget的交集

### 5. 管线体系

**管线命名** `[type]_[blend]_[stencil_optional]`:
- type: texture, primitive, filter_*, stencil_push, stencil_pop
- blend: source-over, lighter, destination-out, destination-in, lighter-in
- stencil: [可选] _stencil 后缀

**着色器** (WGSL):
- `default_vert`: 所有管线共用
- `texture_frag`: 纹理采样 (含UV翻转)
- `primitive_frag`: 纯色矩形
- `colorTransform_frag`: 颜色矩阵
- `blur_frag`: 可分离高斯模糊
- `glow_frag`: 发光效果

### 6. 纹理生命周期

```
getGPUTexture(bitmapData)
  → 检查缓存，不存在则createTexture()
  → copyExternalImageToTexture()
  → 标记UNPACK_PREMULTIPLY_ALPHA=true

updateTexture()
  → 尺寸变化: deleteGPUTexture() → createTexture()
  → 否则: copyExternalImageToTexture()

deleteGPUTexture()
  → 加入销毁队列 (延迟销毁)
  → flushDestroyTextures() [下一帧开始时批量执行]
```

## 关键数据

### GPU缓冲
```
vertexGPUBuffer      32 KB  (2048 quads * 4 verts * 20 bytes)
indexGPUBuffer       24 KB  (2048 quads * 6 indices * 2 bytes)
uniformBuffer       256 B   (projectionVector: vec2<f32>)
filterUniformBuffer 512 B   (滤镜参数)
```

### 顶点格式 (20字节/顶点)
```
[float32 x] [float32 y] [float32 u] [float32 v] [uint32 color+alpha]
```

### 混合模式映射 (5种)
- source-over: 标准透明度合成
- lighter: 相加混合
- destination-out: 反向减法
- destination-in: 目标与源相交
- lighter-in: 源alpha混合

## 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 纹理倒立 | WebGPU原点在左上 | 着色器中 uv.y = 1.0 - uv.y (已实现) |
| DepthStencil尺寸错误 | resize()未重建 | ensureDepthStencilSize() |
| 批次合并不生效 | 有滤镜/blend不同 | 检查纹理和blend一致性 |
| Stencil性能差 | 嵌套太深 | 避免超过8层 |
| 黑屏 | 异步初始化未完成 | await ensureInitialized() |

## 与WebGL对比

| 特性 | WebGL | WebGPU |
|------|-------|--------|
| 管线 | 动态GLSL编译 | 预编译WGSL |
| 命令 | 立即执行 | 批量提交 |
| 混合模式 | glBlendFunc | Pipeline.fragment.blend |
| Buffer | glBindBuffer | setVertexBuffer |
| 数据上传 | bufferData | device.queue.writeBuffer |
| 异步 | 无 | 初始化异步 |

## 扩展方式

### 添加新着色器
1. WGShaderLib.ts 定义代码
2. createShaderModules() 编译
3. createFilterPipelines() 创建管线
4. getFilterPipeline() 分派

### 添加新混合模式
1. initBlendMode() 注册GPUBlendState
2. createDefaultPipelines() 为每种blend创建变体
3. setGlobalCompositeOperation() 使用

### 自定义滤镜
继承 egret.Filter，设置 type 和 $uniforms，在 buildFilterUniformData() 处理

## 总体评价

✓ **架构精妙**: 遵循现代GPU编程最佳实践
✓ **功能完整**: 支持2D游戏的所有渲染需求
✓ **性能优异**: 多层次缓存和批量优化
✓ **高质量代码**: 清晰、可维护、生产就绪
✓ **易于扩展**: 模块化设计，易于添加新特性

## 文件清单

- `/tmp/webgpu_analysis.md` - 完整分析 (3000+ 行)
- `/tmp/webgpu_summary.txt` - 快速参考 (500 行)
- `/tmp/FINAL_SUMMARY.md` - 本文档

---

**分析日期**: 2026-03-12
**源代码版本**: Egret Core 5.4.2
**分析深度**: 完整架构 + 详细流程 + 代码级实现
