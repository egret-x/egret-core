# Egret WebGPU渲染系统完整架构分析

## 一、系统概述

Egret WebGPU渲染系统是一个完整的GPU渲染管线实现，对标WebGL渲染器。该系统采用**现代化的GPU渲染架构**，包括单例上下文管理、命令缓冲、批次合并、多管线支持等高级特性。

### 核心特性
- **异步初始化**: WebGPU初始化通过Promise异步完成
- **命令缓冲架构**: 所有绘制命令先压入缓冲区，统一提交
- **批次合并**: 自动合并相同纹理和混合模式的绘制指令
- **Stencil支持**: 实现复杂的遮罩（mask）和裁剪（clip）操作
- **滤镜管线**: 专用的ColorTransform、Blur、Glow滤镜管线
- **纹理缓存**: 多层次纹理缓存策略

---

## 二、目录结构与文件职责

```
/src/egret/web/rendering/webgpu/
├── WebGPURenderer.ts           # 主渲染器（实现sys.SystemRenderer接口）
├── WebGPURenderContext.ts      # GPU上下文管理（单例，核心执行引擎）
├── WebGPURenderBuffer.ts       # 渲染缓冲区（对标WebGLRenderBuffer）
├── WebGPURenderTarget.ts       # 渲染目标（离屏纹理、深度模板）
├── WebGPUDrawCmdManager.ts     # 绘制命令管理器
├── WebGPUVertexArrayObject.ts  # 顶点数据管理
├── WebGPUUtils.ts              # 工具函数
├── webgpu.d.ts                 # WebGPU API类型定义
└── shaders/
    ├── WGShaderLib.ts          # 着色器库（WGSL代码字符串）
    ├── default_vert.wgsl       # 默认顶点着色器
    ├── texture_frag.wgsl       # 纹理片段着色器
    ├── primitive_frag.wgsl     # 图元（矩形）片段着色器
    ├── colorTransform_frag.wgsl # 颜色变换滤镜
    ├── blur_frag.wgsl          # 模糊滤镜
    └── glow_frag.wgsl          # 发光滤镜
```

---

## 三、各组件详细职责

### 3.1 WebGPURenderer.ts - 主渲染器

**职责**:
- 实现 `sys.SystemRenderer` 接口
- 协调场景树的递归遍历与绘制
- 处理显示对象的不同渲染节点类型
- 支持滤镜、遮罩、裁剪等高级渲染模式

**关键方法**:
```typescript
render(displayObject, buffer, matrix, forRenderTexture?)  // 主渲染入口
drawDisplayObject()                                        // 递归遍历和绘制
renderBitmap/renderText/renderGraphics/renderMesh()      // 各种节点类型的渲染
drawWithFilter/drawWithClip/drawWithScrollRect()          // 特殊渲染模式
```

**数据流**:
1. `render()` 接收显示对象和变换矩阵
2. 调用 `pushBuffer()` 入栈当前渲染缓冲
3. 递归遍历子对象，根据类型分派到不同的render方法
4. 各render方法调用 `buffer.context` 的接口（drawImage/drawRect等）
5. 命令累积到VAO和DrawCmdManager
6. 调用 `$drawWebGPU()` 一次性提交所有命令
7. 调用 `popBuffer()` 恢复渲染缓冲栈

**特殊处理**:
- **对象池管理**: 使用 `gpuRenderBufferPool` 缓存offscreen buffer
- **嵌套level跟踪**: `nestLevel` 用于控制何时清理对象池
- **滤镜优化**: 单一colorTransform滤镜可直接应用，无需创建额外buffer

---

### 3.2 WebGPURenderContext.ts - GPU上下文（核心）

**职责**:
- 单例管理GPU设备和Canvas上下文
- 初始化所有着色器、管线、采样器
- 管理绘制命令的执行
- 纹理和缓冲区生命周期管理

**核心组件**:

#### 3.2.1 初始化流程
```
constructor()
  → initWebGPU() [异步]
    → requestAdapter()
    → requestDevice()
    → createGPUBuffers()              // 顶点/索引缓冲
    → createShaderModules()           // 编译所有着色器
    → createSamplers()                // linear/nearest采样器
    → createBindGroupLayouts()        // BindGroup布局模板
    → createDefaultPipelines()        // 为每种blend创建管线
    → createFilterPipelines()         // 滤镜专用管线
    → createDefaultEmptyTexture()     // 备用白色纹理
```

#### 3.2.2 GPU缓冲（VertexBuffer + IndexBuffer + UniformBuffer）
```typescript
vertexGPUBuffer      // 2048 quads = 8192 floats = 32KB
indexGPUBuffer       // 2048 quads * 6 indices = 24KB
uniformBuffer        // projectionVector (vec2) + padding = 256B
filterUniformBuffer  // 滤镜独用 = 512B
```

#### 3.2.3 着色器模块缓存
```
着色器类型:
  - default_vert           (顶点着色器，所有管线共用)
  - texture_frag           (纹理采样 + blend)
  - primitive_frag         (纯色矩形)
  - colorTransform_frag    (颜色矩阵滤镜)
  - blur_frag              (高斯模糊)
  - glow_frag              (发光效果)
  - texture_etc_alphamask_frag  (ETC纹理透明度遮罩)
```

#### 3.2.4 管线缓存（Pipeline Cache）
```
管线名称命名规则: [type]_[blend]_[stencil_optional]

type: texture / primitive / filter_[filtername] / stencil_push / stencil_pop
blend: source-over / lighter / destination-out / destination-in / lighter-in
stencil: [可选后缀] _stencil

示例:
  texture_source-over              // 纹理+标准混合
  texture_stencil_source-over      // 纹理+标准混合+stencil测试
  filter_colorTransform_frag       // 颜色变换滤镜
  filter_colorTransform_frag_stencil
  stencil_push                     // Stencil缓冲INCR
  stencil_pop                      // Stencil缓冲DECR
```

#### 3.2.5 BindGroup布局
```
group(0) - 纹理管线:
  binding(0): uniform buffer    [VERTEX]
  binding(1): sampler           [FRAGMENT]
  binding(2): texture_2d        [FRAGMENT]

group(0) - 图元管线:
  binding(0): uniform buffer    [VERTEX]

group(1) - 滤镜:
  binding(0): filter uniform buffer  [FRAGMENT]

group(0) - ETC alpha mask:
  binding(0): uniform buffer
  binding(1): sampler
  binding(2): texture_2d
  binding(3): alphaMask sampler
  binding(4): alphaMask texture_2d
```

#### 3.2.6 核心绘制执行 - $drawWebGPU()

**执行流程**:
```
1. 确保初始化完成 (_initialized)
2. 销毁待销毁纹理 (flushDestroyTextures)
3. 确保首命令为 ACT_BUFFER
4. 将VAO的顶点/索引数据写入GPU缓冲
5. 创建单一CommandEncoder
6. 遍历DrawCmdManager中的所有命令:
   
   ACT_BUFFER:
     - 结束前一个RenderPass
     - 获取目标纹理视图（canvas或离屏）
     - 更新投影uniform
     - 开始新RenderPass (beginRenderPass)
   
   TEXTURE:
     - 选择管线（是否有滤镜、是否需要stencil）
     - 创建BindGroup（uniform + sampler + texture）
     - 如有滤镜，创建filter uniform BindGroup
     - drawIndexed()
   
   RECT:
     - 选择图元管线
     - 使用cached primitive BindGroup
     - drawIndexed()
   
   PUSH_MASK:
     - 首次push时重启RenderPass以附加depthStencil
     - 使用 stencil_push 管线
     - stencilFront: incr-clamp
     - drawIndexed()
   
   POP_MASK:
     - 最后一个pop时重启RenderPass（移除depthStencil）
     - 使用 stencil_pop 管线
     - stencilFront: decr-clamp
     - drawIndexed()
   
   BLEND:
     - 更新 currentBlendMode (用于选择管线)
   
   CLEAR_COLOR:
     - 重启RenderPass with loadOp='clear'
   
   ENABLE_SCISSOR:
     - setScissorRect()
   
   DISABLE_SCISSOR:
     - setScissorRect() 重置为全屏

7. 结束RenderPass
8. 提交CommandEncoder
9. 清空DrawCmdManager和VAO缓冲
```

**关键优化**:
- **Stencil惰性启用**: 仅在首次pushMask时创建depth-stencil纹理
- **Blend缓存**: 同一blend状态不重复压入
- **Buffer激活优化**: 同一buffer的连续激活指令会覆盖
- **BindGroup复用**: Primitive BindGroup每帧缓存
- **TextureView缓存**: 每个GPUTexture的视图被缓存

---

### 3.3 WebGPURenderBuffer.ts - 渲染缓冲区

**职责**:
- 为每个渲染目标维护状态（矩阵、alpha、tint色）
- 管理Stencil和Scissor测试状态
- 提供矩阵变换接口

**关键属性**:
```typescript
context: WebGPURenderContext           // 关联GPU上下文
rootRenderTarget: WebGPURenderTarget   // 离屏或canvas纹理
root: boolean                          // 是否为舞台缓冲
globalMatrix: Matrix                   // 当前变换矩阵
globalAlpha: number                    // 全局透明度
globalTintColor: number                // 色调乘法
stencilHandleCount: number             // stencil深度计数
$offsetX/$offsetY: number              // 绘制偏移
$stencilList: Rectangle[]              // stencil矩形栈
```

**对象池**:
```typescript
// 静态方法
WebGPURenderBuffer.create(w, h)   // 从池中取出或新建
WebGPURenderBuffer.release(buf)   // 归还到池
```

---

### 3.4 WebGPURenderTarget.ts - 渲染目标

**职责**:
- 管理离屏渲染纹理
- 管理depth-stencil纹理（惰性创建）
- 提供纹理视图接口

**关键方法**:
```typescript
initFrameBuffer()              // 首次创建离屏纹理
enabledStencil()               // 首次启用stencil时创建depth-stencil
ensureDepthStencilSize()       // 确保depth-stencil尺寸与target一致
resize(width, height)          // 销毁旧纹理，创建新纹理
```

**特点**:
- **Lazy Initialization**: depth-stencil仅在需要时创建
- **Delayed Destruction**: 纹理销毁延迟处理，避免WebGPU错误
- **Size Synchronization**: resize时自动重建所有纹理

---

### 3.5 WebGPUDrawCmdManager.ts - 绘制命令管理

**职责**:
- 维护绘制命令队列
- 实现批次合并逻辑
- 指令优化（冗余剔除）

**命令类型**:
```typescript
enum GPU_DRAWABLE_TYPE {
  TEXTURE,          // 纹理绘制
  RECT,             // 矩形/图元绘制
  PUSH_MASK,        // Stencil increment
  POP_MASK,         // Stencil decrement
  BLEND,            // 混合模式变更
  RESIZE_TARGET,    // 渲染目标大小变更
  CLEAR_COLOR,      // 清空颜色缓冲
  ACT_BUFFER,       // 激活缓冲区
  ENABLE_SCISSOR,   // 启用裁剪
  DISABLE_SCISSOR,  // 禁用裁剪
  SMOOTHING         // 采样器变更
}
```

**批次合并规则**:
```typescript
// TEXTURE 合并条件
if (lastCmd.type === TEXTURE && 
    lastCmd.texture === current.texture &&
    !lastCmd.filter) {
  lastCmd.count += current.count;  // 合并
} else {
  // 创建新命令
}

// BLEND 优化
if (previousBlendIs(currentBlend)) {
  return;  // 跳过冗余blend
}

// ACT_BUFFER 优化
if (noDrawCallBetween && previousCmdIsActBuffer) {
  overwrite(previousCmd);  // 覆盖
}
```

---

### 3.6 WebGPUVertexArrayObject.ts - 顶点数据管理

**职责**:
- 缓存顶点数据（Float32Array）
- 管理索引数据（Uint16Array）
- 支持Quad和Mesh两种索引模式

**顶点格式** (20字节/顶点):
```
[float32 x] [float32 y] [float32 u] [float32 v] [uint32 color+alpha]
  0-3        4-7        8-11       12-15       16-19
```

**缓冲容量**:
```typescript
maxQuadsCount = 2048          // 最多2048个四边形
maxVertexCount = 8192         // 最多8192个顶点
maxIndicesCount = 12288       // 最多12288个索引
```

**Mesh vs Quad索引**:
- **Quad模式**: 预生成 (0,1,2,0,2,3) 的重复索引
- **Mesh模式**: 使用自定义索引数组（供drawMesh使用）

---

### 3.7 WebGPUUtils.ts - 工具函数

**职责**:
- WebGPU支持检测
- Tint色预乘Alpha处理
- 管线创建辅助

**关键函数**:
```typescript
checkCanUseWebGPU()           // 同步检测（首次假设支持）
checkWebGPUSupportAsync()     // 异步真实检测
checkRequiredFeatures()        // 验证最小能力集
premultiplyTint(tint, alpha)  // 预乘处理（RGB * alpha）
createRenderPipeline()        // 管线创建辅助
```

---

## 四、完整渲染流程

### 4.1 初始化阶段

```
应用启动
  → WebGPURenderContext.getInstance()
    → constructor()
      → initWebGPU() [异步Promise]
        ↓ [并行]
        → 获取GPU设备
        → 创建各种GPU缓冲
        → 编译所有着色器
        → 创建管线
        → 初始化完毕
        
  → WebGPURenderBuffer(root=true)
    → 创建主渲染缓冲（对应canvas）
    → rootRenderTarget.useFrameBuffer = false
    → context.pushBuffer(this)
```

### 4.2 每帧渲染流程

```
MainLoop.render(displayObject, buffer, matrix)
  
  1. WebGPURenderer.render(displayObject, buffer, matrix)
     → buffer.pushBuffer()
     → drawDisplayObject(displayObject, buffer, offsetX, offsetY)
     
  2. 递归遍历所有子对象
     → for each child:
       → switch (renderMode):
         - NONE: 直接递归
         - FILTER: drawWithFilter()
         - CLIP: drawWithClip()
         - SCROLLRECT: drawWithScrollRect()
         - DEFAULT: 递归 drawDisplayObject()
     
  3. 对每个RenderNode调用对应的render方法:
     
     renderBitmap() / renderNormalBitmap()
       → buffer.context.drawImage()
       → context.drawCmdManager.pushDrawTexture()
       → vao.cacheArrays() [将四边形顶点写入VAO]
     
     renderText()
       → 使用CanvasRenderer渲染文本到offscreen canvas
       → 创建或更新GPUTexture
       → 调用 drawImage()
     
     renderGraphics()
       → 使用CanvasRenderer渲染图形到offscreen canvas
       → 创建或更新GPUTexture
       → 调用 drawImage()
     
     renderMesh()
       → buffer.context.drawMesh()
       → vao.cacheArrays(meshUVs, meshVertices, meshIndices)
     
     renderGroup()
       → 递归渲染子节点
     
  4. 特殊处理: drawWithFilter
     ┌─ 判断滤镜类型
     ├─ 如果只有单个colorTransform且无mask:
     │  → 直接标记filter，传递给drawCmdManager
     └─ 否则:
        → 创建offscreen buffer
        → 递归渲染到offscreen
        → 调用 context.drawTargetWidthFilters()
        → 渲染滤镜后的纹理回到主buffer
  
  5. 特殊处理: drawWithClip
     → 判断是否有mask或scrollRect
     → 如果有mask:
       ├─ 创建两个offscreen buffer (display + mask)
       ├─ 在mask buffer中渲染mask
       ├─ 在display buffer中渲染对象
       └─ 使用 composition="destination-in" 合并
     → 如果仅有scrollRect:
       ├─ 启用scissor测试
       └─ 渲染对象
  
  6. 所有命令累积完毕
     → context.$drawWebGPU()  [执行]
     
  7. context.$drawWebGPU() 内部逻辑:
     
     a. 数据上传阶段:
        → writeBuffer(vertexGPUBuffer, vao.vertices)
        → writeBuffer(indexGPUBuffer, vao.indices)
     
     b. 创建CommandEncoder
     
     c. 遍历drawData中的每个命令:
        
        [ACT_BUFFER]:
          → 结束前一个RenderPass (if exists)
          → 确定目标纹理视图 (canvas或framebuffer)
          → 更新投影uniform
          → beginRenderPass() [创建新RenderPass]
        
        [TEXTURE]:
          → 选择合适的管线（基于filter类型、blend、stencil）
          → 创建纹理BindGroup
          → (可选)创建filter BindGroup
          → setStencilReference(stencilLevel)
          → drawIndexed(indexCount)
        
        [RECT]:
          → 选择primitive管线
          → 使用cached primitive BindGroup
          → drawIndexed(indexCount)
        
        [PUSH_MASK/POP_MASK]:
          → 首次push时重启RenderPass (附加depthStencil)
          → 使用stencil_push/stencil_pop管线
          → drawIndexed()
          → stencilHandleCount++/--
        
        [其他]: BLEND, CLEAR, SCISSOR等状态变更
     
     d. 结束RenderPass
     
     e. 提交CommandBuffer
        → device.queue.submit([commandEncoder.finish()])
     
     f. 清理
        → drawCmdManager.clear()
        → vao.clear()
  
  8. buffer.onRenderFinish()
     → 重置 $drawCalls 计数
  
  9. buffer.popBuffer()
     → 恢复上级buffer
  
  10. 对象池清理 (仅nestLevel===0时)
      → 如果gpuRenderBufferPool.length > 6，截断
      → 调用 resize(0,0) 释放offscreen缓冲
```

### 4.3 混合模式映射

```typescript
WebGPURenderContext.blendModesForGPU = {
  "source-over": {
    color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
    alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' }
  },
  "lighter": {
    color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
    alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' }
  },
  "lighter-in": {
    color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
    alpha: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' }
  },
  "destination-out": {
    color: { srcFactor: 'zero', dstFactor: 'one-minus-src-alpha', operation: 'add' },
    alpha: { srcFactor: 'zero', dstFactor: 'one-minus-src-alpha', operation: 'add' }
  },
  "destination-in": {
    color: { srcFactor: 'zero', dstFactor: 'src-alpha', operation: 'add' },
    alpha: { srcFactor: 'zero', dstFactor: 'src-alpha', operation: 'add' }
  }
}
```

---

## 五、纹理和缓冲管理

### 5.1 纹理生命周期

```
BitmapData
  ↓ getGPUTexture()
  ├─ 检查 bitmapData["gpuTexture"]
  ├─ 如果不存在:
  │  ├─ createTexture(bitmapData)
  │  │  ├─ device.createTexture()
  │  │  ├─ copyExternalImageToTexture() [异步处理]
  │  │  └─ 标记 texture[UNPACK_PREMULTIPLY_ALPHA_WEBGL]=true
  │  └─ 缓存到 bitmapData["gpuTexture"]
  └─ 返回纹理引用
  
  更新:
  bitmapData["gpuTexture"] ← updateTexture()
  ├─ 检查尺寸是否变化
  ├─ 如变化: deleteGPUTexture() → createTexture()
  └─ 否则: copyExternalImageToTexture()
  
  销毁:
  deleteGPUTexture(texture)
  ├─ 移除纹理视图缓存
  └─ 加入待销毁队列 (延迟销毁)
  
  延迟销毁:
  flushDestroyTextures() [在$drawWebGPU开始]
  └─ 对所有待销毁纹理调用 texture.destroy()
```

### 5.2 缓冲区生命周期

#### Vertex/Index GPU缓冲:
```
constructor() → createGPUBuffers()
  → vertexGPUBuffer (COPY_DST | VERTEX)
  → indexGPUBuffer (COPY_DST | INDEX)

每帧:
  $drawWebGPU() → device.queue.writeBuffer()
    → 将vao.vertices数据上传到vertexGPUBuffer
    → 将vao.indices数据上传到indexGPUBuffer

RenderPass: setVertexBuffer(0, vertexGPUBuffer)
            setIndexBuffer(indexGPUBuffer, 'uint16')

销毁: context.destroy() → vertexGPUBuffer.destroy()
```

#### Uniform GPU缓冲:
```
创建: 256字节 (projectionVector: vec2<f32> + padding)

每帧ACT_BUFFER时:
  if (projectionX或Y变化) {
    writeBuffer(uniformBuffer, [projectionX, projectionY])
    invalidatePrimitiveBindGroup()  // 需要重建
  }

滤镜Uniform:
  filterUniformBuffer (512字节)
  ├─ ColorTransform: mat4x4(16) + colorAdd(4) = 80B
  ├─ Blur: blur(2) + pad(2) + size(2) + pad(2) = 32B
  └─ Glow: (dist, angle, color, alpha, blur, strength, inner, knockout, hideObject, size) = 80B
```

### 5.3 RenderTarget（离屏缓冲）

#### Root Buffer (舞台缓冲):
```
WebGPURenderBuffer(root=true)
  → rootRenderTarget.useFrameBuffer = false
  → 使用 canvasContext.getCurrentTexture()
  → depth-stencil 与canvas尺寸同步
```

#### Offscreen Buffer:
```
WebGPURenderBuffer(root=false)
  → rootRenderTarget.useFrameBuffer = true
  → device.createTexture(RENDER_ATTACHMENT | TEXTURE_BINDING | COPY_SRC)
  → depth-stencil 首次pushMask时创建

对象池:
  gpuRenderBufferPool
  ├─ 最多保持6个缓冲
  └─ 超过时移除，释放纹理
```

---

## 六、着色器系统

### 6.1 顶点着色器 (default_vert)

```wgsl
struct Uniforms {
  projectionVector: vec2<f32>,  // [width/2, -height/2]
};

@group(0) @binding(0) var<uniform> u: Uniforms;

@vertex
fn main(
  @location(0) aVertexPosition: vec2<f32>,
  @location(1) aTextureCoord: vec2<f32>,
  @location(2) aColor: vec4<f32>,
) -> VertexOutput {
  // 标准化坐标转换: pixel → [-1,1]
  let center = vec2<f32>(-1.0, 1.0);
  output.position = vec4<f32>(
    (aVertexPosition / u.projectionVector) + center,
    0.0, 1.0
  );
  output.vTextureCoord = aTextureCoord;
  output.vColor = aColor;
  return output;
}
```

**关键点**:
- projectionVector = [width/2, -height/2] (注意负号)
- 将屏幕坐标转换为WebGPU的 [-1,1]² 范围
- Y轴翻转内置在projectionVector中

### 6.2 片段着色器集合

#### texture_frag - 纹理采样
```wgsl
@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  // V坐标翻转 (WebGPU纹理原点在左上)
  let uv = vec2<f32>(
    input.vTextureCoord.x,
    1.0 - input.vTextureCoord.y
  );
  return textureSample(uTexture, uSampler, uv) * input.vColor;
}
```

#### primitive_frag - 纯色
```wgsl
@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  return input.vColor;  // 直接使用顶点色
}
```

#### colorTransform_frag - 颜色矩阵
```wgsl
// group(1) binding(0) = filter uniform (ColorMatrix)
@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  let color = textureSample(uTexture, uSampler, uv);
  let transformed = colorMatrix * color + colorAdd;
  return transformed * input.vColor;
}
```

#### blur_frag - 高斯模糊
```wgsl
// 可分离的高斯模糊 (blurX/blurY)
// group(1) binding(0) = blur uniform (blur.x/y, textureSize)
@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  // 沿X或Y方向采样多个像素并加权求和
  var result = vec4<f32>(0.0);
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    let offset = blur * (f32(i) - f32(SAMPLE_COUNT/2)) / textureSize;
    result += textureSample(..., uv + offset) * gaussianWeight(i);
  }
  return result * input.vColor;
}
```

#### glow_frag - 发光效果
```wgsl
// 更复杂的发光算法，支持:
// - 向外距离 (dist) 和方向 (angle)
// - 发光色、透明度、强度
// - 内发光、击出效果、隐藏原始对象
@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
  let original = textureSample(uTexture, uSampler, uv);
  let glow = calculateGlow(original, ...);
  return mix(original, glow, ...) * input.vColor;
}
```

### 6.3 着色器编译和缓存

```
createShaderModules()
  → device.createShaderModule({ code: WGShaderLib.default_vert })
  → device.createShaderModule({ code: WGShaderLib.texture_frag })
  → ... 其他着色器
  → 缓存在 shaderModuleCache[name]

pipeline创建:
  → 从缓存获取 shaderModuleCache['default_vert']
  → 从缓存获取 shaderModuleCache[fragmentShaderName]
  → device.createRenderPipeline({ vertex, fragment })
  → 缓存管线
```

---

## 七、高级特性

### 7.1 Stencil遮罩

```
应用mask:
  
  pushMask(x, y, w, h)
    → buffer.$stencilList.push({x, y, w, h})
    → drawCmdManager.pushPushMask()
  
  $drawWebGPU() 处理 PUSH_MASK:
    ├─ 首次: 重启RenderPass，附加depthStencil
    ├─ 使用 stencil_push 管线
    │ └─ stencilFront: compare='equal', passOp='increment-clamp'
    ├─ colorMask=0 (不写颜色)
    ├─ drawIndexed() 绘制mask几何
    └─ stencilHandleCount++
  
  popMask()
    → drawCmdManager.pushPopMask()
  
  $drawWebGPU() 处理 POP_MASK:
    ├─ 使用 stencil_pop 管线
    │ └─ stencilFront: compare='equal', passOp='decrement-clamp'
    ├─ drawIndexed()
    ├─ stencilHandleCount--
    └─ 最后一个pop: 重启RenderPass，移除depthStencil

后续TEXTURE/RECT:
  → setStencilReference(stencilHandleCount)
  → compare='equal'
  └─ 仅当stencil值 == stencilReference时通过
```

**特点**:
- Stencil缓冲深度可叠加（nested mask）
- 支持任意mask复杂度
- 使用increment-clamp避免溢出

### 7.2 Scissor测试

```
enableScissor(x, y, w, h)
  → drawCmdManager.pushEnableScissor(x, y, w, h)

$drawWebGPU() 处理 ENABLE_SCISSOR:
  → 计算与RenderTarget的交集 (clipping)
  → renderPassEncoder.setScissorRect(x, y, w, h)
  → buffer.$hasScissor = true

disableScissor()
  → drawCmdManager.pushDisableScissor()

$drawWebGPU() 处理 DISABLE_SCISSOR:
  → setScissorRect(0, 0, width, height)  // 重置为全屏
  → buffer.$hasScissor = false
```

**用途**:
- drawWithScrollRect 使用scissor优化
- clearRect 需要scissor限制

### 7.3 滤镜管线

```
setFilter(filter)
  → buffer.context.$filter = filter

drawImage() 时:
  ├─ 如有filter:
  │  ├─ drawCmdManager.pushDrawTexture(..., filter)
  │  └─ 不执行批次合并
  └─ 否则:
     └─ 正常批次合并

$drawWebGPU() 处理带滤镜的TEXTURE:
  ├─ 获取 getFilterPipeline(filter, stencil)
  ├─ 创建 textureBindGroup (group(0))
  ├─ 创建 filterBindGroup (group(1))
  │  └─ buildFilterUniformData(filter) → 构造uniform数据
  └─ drawIndexed()

drawTargetWidthFilters() - 多滤镜链:
  ├─ 如有多个滤镜:
  │  ├─ 遍历前 N-1 个滤镜
  │  ├─ 每个创建offscreen buffer
  │  └─ 链式处理: output = applyFilter(filter[i], input)
  ├─ 最后一个滤镜:
  │  └─ 直接渲染到当前buffer
  └─ 释放中间buffer
```

**滤镜uniform数据**:
- **ColorTransform**: mat4x4 (16个f32) + colorAdd vec4 (4个f32)
- **Blur**: blur vec2 + textureSize vec2
- **Glow**: dist, angle, color, alpha, blur, strength, inner, knockout, hideObject, size

---

## 八、性能优化

### 8.1 批次合并

```
目的: 减少draw call数量

实现:
  1. 连续相同纹理 → 合并到一个TEXTURE命令
     只要 texture不变 && 没有filter
  
  2. 连续相同blend模式 → 无需重复设置
     从尾部检查，覆盖冗余BLEND命令
  
  3. 连续的ACT_BUFFER → 覆盖前一个
     如果两者之间没有draw命令
```

**效果**:
- 典型的UI界面: 从数百个draw call降至 10-50
- 复杂场景: 至少 2-3 倍的性能提升

### 8.2 缓存策略

#### Pipeline缓存
```
按 [type]_[blend]_[stencil] 编号
创建后永久保存在 pipelineCache
零创建开销
```

#### BindGroup缓存
```
Primitive BindGroup: 每ACT_BUFFER时创建一次
Texture BindGroup: 每个纹理+采样器组合创建
TextureView缓存: 每个GPUTexture一个View
```

#### Sampler缓存
```
仅2个: linear 和 nearest
根据纹理的smoothing属性选择
```

### 8.3 数据上传优化

```
1. 批量上传:
   → 一次writeBuffer()上传所有顶点
   → 一次writeBuffer()上传所有索引
   (不是逐个上传)

2. 对齐:
   → WebGPU要求offset和size都是4字节对齐
   → VAO中的字节长度自动对齐
   → writeBuffer()时计算对齐后的长度

3. 延迟销毁:
   → 纹理不立即destroy()
   → 加入销毁队列
   → 下一帧$drawWebGPU开始时批量销毁
   → 避免GPU-CPU同步点
```

### 8.4 内存管理

```
对象池:
  ├─ WebGPURenderBuffer 对象池
  │  └─ 最多6个offscreen buffer
  ├─ DrawCmdManager 复用
  └─ Float32Array/Uint16Array 复用

复用策略:
  ├─ 创建时: 从池pop，不存在则new
  ├─ 使用后: 调用release()入池
  └─ 清理: 对象池大小超过6时截断

效果:
  ├─ 减少GC压力
  ├─ 避免频繁分配大数组
  └─ 特别是处理offscreen rendering时
```

---

## 九、关键数据结构

### 9.1 显示对象渲染流程中的数据流

```
DisplayObject
  ├─ $renderNode: RenderNode
  │  ├─ BitmapNode { image, drawData, matrix, blendMode, alpha, filter }
  │  ├─ TextNode { width, height, x, y, drawData, $texture, $textureWidth, $textureHeight }
  │  ├─ GraphicsNode { width, height, x, y, drawData, $texture }
  │  ├─ MeshNode { image, drawData, uvs, vertices, indices, bounds, matrix }
  │  ├─ GroupNode { matrix, drawData: RenderNode[] }
  │  └─ NormalBitmapNode { image, sourceX/Y/W/H, drawX/Y/W/H, rotated, smoothing }
  │
  ├─ $matrix: Matrix          (变换矩阵)
  ├─ $blendMode: number       (混合模式索引)
  ├─ $alpha: number           (透明度 0-1)
  ├─ $filters: Filter[]       (滤镜数组)
  ├─ $mask: DisplayObject     (遮罩对象)
  ├─ $scrollRect: Rectangle   (滚动矩形)
  ├─ $children: DisplayObject[] (子对象列表)
  └─ ...

RenderNode.drawData:
  ├─ BitmapNode: [sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH, ...]
  ├─ TextNode: []
  ├─ GraphicsNode: []
  └─ MeshNode: []
```

### 9.2 WebGPU命令队列结构

```
drawCmdManager.drawData: IGPUDrawData[]

IGPUDrawData {
  type: GPU_DRAWABLE_TYPE,
  texture?: GPUTexture,
  filter?: Filter,
  count?: number,           // 图元数量(通常是*2代表两个三角形)
  value?: string,           // blend mode name
  buffer?: WebGPURenderBuffer,
  width?: number,
  height?: number,
  textureWidth?: number,
  textureHeight?: number,
  smoothing?: boolean,
  x?: number, y?: number,
}
```

### 9.3 矩阵变换栈

```
WebGPURenderBuffer {
  globalMatrix: Matrix         (当前累积变换)
  savedGlobalMatrix: Matrix    (保存点)
  $offsetX, $offsetY: number   (绘制偏移)
}

Matrix {
  a, b, c, d: number   // 2x2 变换矩阵
  tx, ty: number       // 平移分量
}

变换操作:
  setTransform(a,b,c,d,tx,ty)  // 替换
  transform(a,b,c,d,tx,ty)     // 追加 (累乘)
  useOffset()                    // 应用offset到matrix，清零offset
  saveTransform()                // 保存当前matrix
  restoreTransform()             // 恢复matrix
```

---

## 十、常见问题解决方案

### 10.1 坐标系问题

**问题**: 纹理倒立或位置错误

**原因**: WebGPU纹理原点在左上，但WebGL原点在左下

**解决**:
```typescript
// 顶点着色器
let uv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);

// 或在VAO中存储时
vStart = 1.0 - sourceY - normalizedSourceHeight;
vEnd = 1.0 - sourceY;
```

### 10.2 渲染目标尺寸不匹配

**问题**: depthStencilTexture尺寸与renderTarget不符

**解决**:
```typescript
// resize()时
rootRenderTarget.resize(width, height)
  → 销毁旧纹理
  → 创建新纹理
  → 如原来启用stencil，立即重建depthStencil

// ACT_BUFFER时
ensureDepthStencilSize()
  → 检查尺寸，不符则重建
```

### 10.3 批次合并不生效

**问题**: 相同纹理的draw call没有合并

**原因**:
- 纹理之间有filter
- blend模式不同
- 纹理对象引用不同

**优化**:
```typescript
// 避免
drawImage(tex); drawImage(tex, null, blendMode); drawImage(tex);  // 3个call

// 改为
setBlendMode(defaultMode);
drawImage(tex); drawImage(tex); drawImage(tex);  // 1个call
setBlendMode(specialMode);
```

### 10.4 Stencil mask的嵌套限制

**问题**: 过多的嵌套mask导致性能下降或失败

**原因**: Stencil缓冲的值范围有限（通常0-255）

**解决**:
- 避免超过8层嵌套mask
- 必要时用offscreen rendering替代
- 合并相邻的mask对象

### 10.5 异步初始化导致的绘制延迟

**问题**: 应用启动时WebGPU初始化未完成

**解决**:
```typescript
// 等待初始化完成
await context.ensureInitialized();

// 或检查状态
if (!context._initialized) {
  defer.draw();  // 延迟绘制
}
```

---

## 十一、与WebGL渲染器的对比

| 特性 | WebGLRenderer | WebGPURenderer |
|------|---|---|
| **管线创建** | 动态编译GLSL | 预编译WGSL |
| **混合模式** | WebGLRenderingContext.blendFunc | GPURenderPipeline.fragment.blend |
| **Stencil** | glStencilFunc/glStencilOp | depthStencilAttachment + stencilFront/Back |
| **Sampler** | WebGLTexture内联参数 | 独立GPUSampler对象 |
| **Buffer绑定** | glBindBuffer(target, buffer) | setVertexBuffer/setIndexBuffer |
| **数据上传** | bufferData/bufferSubData | device.queue.writeBuffer |
| **Viewport/Scissor** | gl.viewport/gl.scissor | RenderPass配置 + setScissorRect |
| **FrameBuffer** | WebGLFramebuffer | 纹理 + RenderPass.colorAttachments |
| **指令提交** | 立即执行 | 批量提交CommandBuffer |
| **异步** | 同步 | 设备创建/初始化异步 |
| **错误处理** | 立即异常 | 延迟或静默（device lost） |

---

## 十二、扩展和定制

### 12.1 添加新的着色器

```typescript
// 1. 在 WGShaderLib.ts 中添加着色器代码
export class WGShaderLib {
  public static readonly myFilter_frag: string = `
    @fragment
    fn main(...) -> @location(0) vec4<f32> {
      ...
    }
  `;
}

// 2. 在 WebGPURenderContext.createShaderModules() 中编译
this.shaderModuleCache['myFilter_frag'] = this.device.createShaderModule({
  code: WGShaderLib.myFilter_frag
});

// 3. 在 createFilterPipelines() 中创建管线
this.pipelineCache['filter_myFilter_frag'] = ...;

// 4. 使用时
getFilterPipeline(filter, stencil) {
  if (filter.type === "myFilter") {
    return this.pipelineCache['filter_myFilter_frag' + (stencil ? '_stencil' : '')];
  }
}
```

### 12.2 添加新的混合模式

```typescript
// 1. 在 initBlendMode() 中注册
WebGPURenderContext.blendModesForGPU["myBlendMode"] = {
  color: { srcFactor: '...', dstFactor: '...', operation: 'add' },
  alpha: { srcFactor: '...', dstFactor: '...', operation: 'add' }
};

// 2. 创建该混合模式的所有管线变体
for (const blendName in WebGPURenderContext.blendModesForGPU) {
  if (blendName === "myBlendMode") {
    this.pipelineCache['texture_myBlendMode'] = ...;
    this.pipelineCache['texture_myBlendMode_stencil'] = ...;
    this.pipelineCache['primitive_myBlendMode'] = ...;
    // ...
  }
}

// 3. 使用时
setGlobalCompositeOperation("myBlendMode");
```

### 12.3 自定义滤镜

继承自 `egret.Filter`:
```typescript
class MyFilter extends egret.Filter {
  constructor() {
    super();
    this.type = "myFilter";
    this.$uniforms = {
      // 定义uniform数据
      $filterScale: 1,
      customParam: 0.5,
    };
  }
}

// 在 buildFilterUniformData() 中处理
private buildFilterUniformData(...) {
  if (filter.type === "myFilter") {
    const data = new Float32Array(...);
    // 填充uniform数据
    return data;
  }
}
```

---

## 总结

Egret WebGPU渲染系统是一个**设计精妙、功能完整的现代GPU渲染引擎**：

1. **架构优雅**: 单例+命令缓冲+批次合并的经典组合
2. **功能全面**: 支持bitmap、text、graphics、mesh等所有渲染类型
3. **高效能**: 管线预编译、缓存策略、延迟销毁等优化手段
4. **兼容性强**: 保持与WebGL的API接口一致性
5. **可扩展**: 易于添加新着色器、混合模式、滤镜
6. **健壮性**: 异步初始化、设备丢失恢复、Stencil嵌套支持

该系统是现代Web游戏引擎的典范实现。

