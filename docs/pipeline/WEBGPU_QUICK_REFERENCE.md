# WebGPU 快速参考卡片

**打印友好版本** - 一页速查表

---

## 系统架构一页纸

```
┌─ WebGPURenderer [场景树遍历] (994行)
├─ WebGPURenderContext [GPU核心执行] (1956行) ⭐⭐⭐⭐⭐
│  ├─ WebGPUDrawCmdManager [命令缓冲]
│  ├─ WebGPUVertexArrayObject [顶点数据]
│  ├─ 管线缓存 [texture/primitive/filter/stencil]
│  └─ BindGroup缓存 [uniform+sampler+texture]
├─ WebGPURenderBuffer [渲染状态] (377行)
├─ WebGPURenderTarget [离屏纹理+深度模板] (274行)
├─ WebGPUVertexArrayObject [顶点缓冲] (317行)
└─ WGShaderLib [WGSL着色器] (~500行)
```

---

## 每帧渲染流程 (3步)

```
① render(displayObject) → 递归遍历
   └─ 调用 drawImage/drawRect/drawMesh
   
② 积累命令和顶点数据
   └─ drawCmdManager.push* + vao.cacheArrays
   
③ $drawWebGPU() → 统一执行
   └─ writeBuffer + drawIndexed × N + queue.submit
```

---

## GPU缓冲快速查询

| 缓冲 | 大小 | 用途 |
|------|------|------|
| vertexBuffer | 32KB | 2048 quads × 4 verts × 20 bytes |
| indexBuffer | 24KB | 2048 quads × 6 indices × 2 bytes |
| uniformBuffer | 256B | projectionVector |
| filterUniformBuffer | 512B | ColorTransform/Blur/Glow |

---

## 命令类型速查

```
GPU_DRAWABLE_TYPE {
  TEXTURE,        // 纹理绘制
  RECT,           // 矩形绘制
  PUSH_MASK,      // stencil++
  POP_MASK,       // stencil--
  BLEND,          // 混合模式切换
  ACT_BUFFER,     // 激活渲染目标
  ENABLE_SCISSOR, // 启用剪裁
  DISABLE_SCISSOR,// 禁用剪裁
  ...
}
```

---

## 管线命名规则

```
[type]_[blend]_[stencil_optional]

type: texture | primitive | filter_* | stencil_push | stencil_pop
blend: source-over | lighter | destination-out | destination-in | lighter-in
stencil: [optional] _stencil
```

**例**: `texture_source-over_stencil`

---

## 着色器列表

| 着色器 | 作用 | 用途 |
|-------|------|------|
| default_vert | 顶点变换 | 所有管线 |
| texture_frag | 纹理采样 | 图像绘制 |
| primitive_frag | 纯色 | 矩形绘制 |
| colorTransform_frag | 颜色矩阵 | 颜色调整 |
| blur_frag | 高斯模糊 | 模糊效果 |
| glow_frag | 发光 | 发光效果 |

---

## 性能优化要点

```
✓ 批次合并         // 相同纹理自动合并
✓ 管线缓存         // 预编译WGSL
✓ BindGroup复用    // 创建后存储
✓ Stencil惰性启用  // 首次需要时创建
✓ 延迟纹理销毁     // 下一帧批量销毁
✓ 采样器固定       // 仅2个全局采样器
```

**效果**: UI界面 100+ draw calls → 10-50 (5-10x)

---

## 初始化

```typescript
// ✓ 正确
const context = WebGPURenderContext.getInstance()
await context.ensureInitialized()
app.run()

// ✗ 错误
const context = WebGPURenderContext.getInstance()
app.run()  // 黑屏！
```

---

## 常用API

```typescript
// 渲染入口
context.$drawWebGPU()

// 纹理管理
context.getGPUTexture(bitmapData)
context.updateTexture(texture, bitmapData)
context.deleteGPUTexture(gpuTexture)

// 状态管理
context.pushBuffer(buffer)
context.popBuffer()

// 绘制接口
context.drawImage(bitmap, x, y, w, h, matrix, ...)
context.drawRect(x, y, w, h, color, ...)
context.drawMesh(vertices, indices, uvs, colors, ...)

// Mask/Scissor
context.pushMask(x, y, w, h)
context.popMask()
context.enableScissor(x, y, w, h)
context.disableScissor()
```

---

## 混合模式映射

| Egret | GPU | 效果 |
|------|-----|------|
| NORMAL | source-over | 标准透明合成 |
| ADD | lighter | 加法混合 |
| ERASE | destination-out | 反向减法 |
| DARKEN | destination-in | 与运算 |
| LIGHTEN | lighter-in | Alpha混合 |

---

## Stencil嵌套

```
pushMask() → stencilHandleCount++
  [绘制时: setStencilReference(count)]
  [仅匹配的像素通过]
popMask() → stencilHandleCount--

支持: 无限深度 (建议 < 8层)
```

---

## 调试

```typescript
// 性能指标
console.log('Draw calls:', drawCmdManager.drawData.length)
console.log('Vertices:', vao.verticesCount)
console.log('Stencil depth:', stencilHandleCount)
console.log('Textures:', textureCache.size)

// 预警阈值
Draw calls > 1000      ⚠️ 考虑优化批次
Stencil depth > 8      ⚠️ 考虑替代方案
Textures > 100         ⚠️ 考虑释放
Memory > 100MB         ⚠️ 考虑优化
```

---

## 常见错误

| 症状 | 原因 | 解决 |
|------|------|------|
| 黑屏 | 未等待初始化 | await ensureInitialized() |
| 纹理倒立 | UV翻转错误 | 着色器已修正 |
| Stencil异常 | depth-stencil未创建 | ensureDepthStencilSize() |
| 批次无效 | 有滤镜/blend不同 | 检查纹理一致性 |
| 卡顿 | Stencil过深 | 避免 > 8层嵌套 |
| 内存泄漏 | 纹理未销毁 | deleteGPUTexture + dispose |

---

## 扩展点

```
添加着色器:
  1. WGShaderLib.ts 定义代码
  2. createShaderModules() 编译
  3. createFilterPipelines() 创建管线
  4. getFilterPipeline() 分派

添加混合模式:
  1. initBlendMode() 定义GPUBlendState
  2. createDefaultPipelines() 创建变体
  3. setGlobalCompositeOperation() 使用

自定义滤镜:
  1. 继承 egret.Filter
  2. 定义 type + $uniforms
  3. buildFilterUniformData() 处理
```

---

## 与WebGL的关键区别

| 特性 | WebGL | WebGPU |
|------|-------|--------|
| 编译 | 动态 | 预编译 |
| 执行 | 立即 | 批量 |
| 管线 | 动态选择 | 预创建 |
| Sampler | 内联 | 独立对象 |
| 初始化 | 同步 | 异步 |

---

## 性能基准 (参考值)

```
UI界面 (100+ 元素):
  • 无优化:    150 draw calls, 60ms
  • 有优化:    20 draw calls, 5ms
  • 改进:      12x ↑

游戏关卡 (500 精灵):
  • 无优化:    500 draw calls, 30ms
  • 有优化:    50 draw calls, 3ms
  • 改进:      10x ↑

复杂滤镜 (50 对象):
  • 无优化:    100 draw calls, 20ms
  • 有优化:    30 draw calls, 6ms
  • 改进:      3-4x ↑
```

---

## 文件位置

```
src/egret/web/rendering/webgpu/
├── WebGPURenderer.ts           (994行)
├── WebGPURenderContext.ts      (1956行) ⭐
├── WebGPURenderBuffer.ts       (377行)
├── WebGPURenderTarget.ts       (274行)
├── WebGPUDrawCmdManager.ts     (297行)
├── WebGPUVertexArrayObject.ts  (317行)
├── WebGPUUtils.ts              (197行)
└── shaders/
    ├── WGShaderLib.ts
    ├── *.wgsl                  (着色器源码)
    └── ...
```

---

## 快速诊断清单

```
□ 初始化完成?             await ensureInitialized()
□ Draw calls过多?         检查批次合并条件
□ 纹理显示错误?           确认UV翻转
□ Stencil异常?            检查depth-stencil创建
□ 性能差?                 检查滤镜/混合模式
□ 内存泄漏?               检查纹理销毁
□ 黑屏?                   检查RenderPass
□ Scissor无效?            检查坐标计算
```

---

## 关键数字

- 最大Quads: 2048
- 最大顶点: 8192
- 最大索引: 12288
- 管线数: ~100 (type × blend × stencil变体)
- Stencil推荐深度: < 8
- 批次合并通常比例: 5-10x
- GPU内存静态: ~57KB

---

**版本**: 1.0  
**打印页数**: 1  
**最后更新**: 2026-03-12

💡 **提示**: 保存本页面为PDF，便于离线查阅！

