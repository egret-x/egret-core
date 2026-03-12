# Egret WebGPU 渲染系统完整开发文档

**版本**: 1.0  
**更新时间**: 2026-03-12  
**引擎版本**: Egret Core 5.4.2

---

## 📑 快速导航

本文档包含以下主要内容：

| 章节 | 内容 | 适合人群 |
|------|------|--------|
| [系统架构](#一系统架构) | 整体架构、核心组件 | 新手入门 |
| [渲染流程](#二渲染流程) | 每帧执行步骤、数据流 | 中级开发者 |
| [核心组件详解](#三核心组件详解) | 7个组件的职责和实现 | 深度学习 |
| [性能优化](#四性能优化) | 批次合并、缓存策略 | 性能优化 |
| [高级特性](#五高级特性) | Stencil、滤镜、Scissor | 特性实现 |
| [扩展指南](#六扩展指南) | 添加着色器、混合模式 | 功能扩展 |

---

## 一、系统架构

### 1.1 架构概览

Egret WebGPU渲染系统采用**经典的GPU渲染管线设计**，完全替代WebGL实现。

```
┌─────────────────────────────────────────────────────────────┐
│                    应用层（Egret显示对象树）                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│          WebGPURenderer (场景树遍历 + 节点分派)              │
│                       ↓                                      │
│  递归遍历 → BitmapNode/TextNode/GraphicsNode/MeshNode      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│   WebGPURenderContext (★★★ 核心GPU执行引擎)                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ WebGPUDrawCmdManager (命令缓冲)                       │  │
│  │   └─ pushTexture / pushRect / pushMask / ... (命令)   │  │
│  │                                                       │  │
│  │ WebGPUVertexArrayObject (顶点数据)                   │  │
│  │   └─ cacheArrays() / vertices[] / indices[]          │  │
│  │                                                       │  │
│  │ 管线缓存 / BindGroup缓存 / 采样器缓存                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                       ↓                                      │
│              $drawWebGPU() 统一执行                          │
│              ├─ 数据上传 (writeBuffer)                      │
│              ├─ 遍历命令 (setViewport/drawIndexed)          │
│              └─ 提交GPU (queue.submit)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
            ┌─────────────────────┐
            │   WebGPU Device     │
            │   (GPU硬件执行)     │
            └─────────────────────┘
```

### 1.2 核心组件

| 组件 | 行数 | 职责 | 重要度 |
|------|------|------|--------|
| **WebGPURenderer.ts** | 994 | 场景树遍历、节点分派 | ⭐⭐⭐ |
| **WebGPURenderContext.ts** | 1956 | GPU核心执行引擎 | ⭐⭐⭐⭐⭐ |
| **WebGPURenderBuffer.ts** | 377 | 渲染状态、矩阵变换 | ⭐⭐⭐ |
| **WebGPURenderTarget.ts** | 274 | 离屏纹理、Depth-Stencil | ⭐⭐⭐ |
| **WebGPUDrawCmdManager.ts** | 297 | 命令队列、批次合并 | ⭐⭐⭐ |
| **WebGPUVertexArrayObject.ts** | 317 | 顶点缓冲管理 | ⭐⭐ |
| **WebGPUUtils.ts** | 197 | 工具函数 | ⭐ |
| **shaders/** | 500+ | WGSL着色器代码 | ⭐⭐⭐ |

**总代码量**: 3,700+ 行

### 1.3 关键设计模式

#### 1.3.1 单例模式
```typescript
// GPU上下文全局唯一
const context = WebGPURenderContext.getInstance();
```

#### 1.3.2 命令缓冲模式
```
命令积累 → 统一执行 → GPU提交
（类似Vulkan/Metal的做法）
```

#### 1.3.3 对象池模式
```typescript
// 避免频繁分配/回收
WebGPURenderBuffer.create()   // 从池取出
WebGPURenderBuffer.release()  // 归还池
```

#### 1.3.4 缓存策略
- **管线缓存**: 预编译永久保存
- **BindGroup缓存**: 创建后复用
- **采样器缓存**: 仅2个全局采样器
- **TextureView缓存**: 每个纹理一个View

---

## 二、渲染流程

### 2.1 完整的每帧渲染步骤

```
┌─────────────────────────────────────────────┐
│ 1. MainLoop.render() 或 Application.render()│
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│ 2. WebGPURenderer.render(displayObject)      │
│    ├─ buffer.pushBuffer()  [入栈]           │
│    ├─ drawDisplayObject()  [递归遍历]       │
│    └─ buffer.popBuffer()   [出栈]           │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│ 3. drawDisplayObject(node, buffer, ...)      │
│    遍历子对象，根据RenderNode类型分派：    │
│    ├─ BitmapNode → renderBitmap()           │
│    ├─ TextNode → renderText()               │
│    ├─ GraphicsNode → renderGraphics()       │
│    ├─ MeshNode → renderMesh()               │
│    └─ GroupNode → 递归调用                   │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│ 4. 各render*()方法                          │
│    调用 context.drawImage/drawRect/drawMesh │
│    ├─ drawCmdManager.push*() [压入命令]     │
│    └─ vao.cacheArrays() [缓存顶点数据]     │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│ 5. context.$drawWebGPU() [统一执行]         │
│    (当nestLevel===0时自动调用)              │
│    ├─ flushDestroyTextures() [清理纹理]    │
│    ├─ writeBuffer() [上传顶点数据到GPU]    │
│    ├─ createCommandEncoder()                │
│    ├─ beginRenderPass()                     │
│    ├─ 遍历drawData[] {                      │
│    │    setViewport() / setBindGroup()      │
│    │    drawIndexed(count)                  │
│    │  }                                      │
│    ├─ endRenderPass()                       │
│    ├─ commandEncoder.finish()               │
│    ├─ device.queue.submit()                 │
│    ├─ drawCmdManager.clear()                │
│    └─ vao.clear()                           │
└─────────────────────────────────────────────┘
```

### 2.2 数据流详解

#### 2.2.1 命令流向
```
场景树 → RenderNode → drawImage/drawRect/drawMesh
         ↓
         drawCmdManager.pushTexture/pushRect/pushMask (命令)
         ↓
         vao.cacheArrays() (顶点数据: vertices[], indices[])
         ↓
         在 $drawWebGPU() 中:
         writeBuffer(vertexBuffer, vertices[])
         writeBuffer(indexBuffer, indices[])
         ↓
         遍历 drawData[] 执行每个命令
         ├─ 命令包含: 顶点数量、纹理、混合模式、Stencil值等
         └─ drawIndexed(count * 6) [6=quad的6个index]
```

#### 2.2.2 Quad模型
```
所有绘制都基于四边形(Quad)：

顶点顺序:
  (0,0) +─────+ (1,0)
        │  /  │
        │/    │
  (0,1) +─────+ (1,1)

索引顺序: [0, 1, 2, 0, 2, 3]  (两个三角形)

每个Quad = 4顶点 + 6索引

顶点数据(20字节):
  [float32 x] [float32 y] [float32 u] [float32 v] [uint32 color]
   4字节        4字节        4字节        4字节        4字节
```

#### 2.2.3 纹理坐标翻转
```
WebGL原点: 左下角, V=0在下, V=1在上
WebGPU原点: 左上角, V=0在上, V=1在下

解决方案: 着色器中反转
  uv_out.y = 1.0 - uv_in.y  // 在VAO创建时已处理
```

### 2.3 关键参数

#### 2.3.1 GPU缓冲大小
```
vertexBuffer:        32 KB   (2048 quads × 4 verts × 20 bytes)
indexBuffer:         24 KB   (2048 quads × 6 indices × 2 bytes)
uniformBuffer:       256 B   (projectionVector)
filterUniformBuffer: 512 B   (滤镜参数: ColorTransform/Blur/Glow)

总计: ~57 KB GPU内存
```

#### 2.3.2 投影矩阵
```
// WebGPU屏幕坐标 [-1, 1]
// 像素坐标 [0, width] × [0, height]

投影向量: [width/2, -height/2]

顶点着色器:
  gl_Position.x = (pixel.x / width/2) - 1
  gl_Position.y = (pixel.y / (-height/2)) - 1
```

---

## 三、核心组件详解

### 3.1 WebGPURenderer - 场景树遍历

**文件**: `src/egret/web/rendering/webgpu/WebGPURenderer.ts`

#### 职责
- 实现 `sys.SystemRenderer` 接口
- 递归遍历显示对象树
- 根据RenderNode类型分派到不同的render方法

#### 关键方法

```typescript
// 主入口
public render(displayObject: DisplayObject, 
              buffer: WebGPURenderBuffer, 
              matrix: Matrix,
              forRenderTexture?: boolean): void

// 递归遍历
private drawDisplayObject(displayObject: DisplayObject,
                          buffer: WebGPURenderBuffer,
                          level: number,
                          index: number): void

// 各RenderNode类型的处理
private renderBitmap(node: BitmapNode, buffer: WebGPURenderBuffer): void
private renderText(node: TextNode, buffer: WebGPURenderBuffer): void
private renderGraphics(node: GraphicsNode, buffer: WebGPURenderBuffer): void
private renderMesh(node: MeshNode, buffer: WebGPURenderBuffer): void
private renderShape(node: ShapeNode, buffer: WebGPURenderBuffer): void
private renderGroup(node: GroupNode, buffer: WebGPURenderBuffer): void

// 特殊渲染模式
private drawWithFilter(displayObject, buffer, ...): void
private drawWithClip(displayObject, buffer, ...): void
private drawWithScrollRect(displayObject, buffer, ...): void
```

#### 执行流程

```
render()
├─ 检查舞台是否有变化 (needsRedraw/needsRenderAll)
├─ nestLevel++
├─ buffer.pushBuffer()  [入栈渲染缓冲]
│
├─ drawDisplayObject(root, buffer, 0, 0)
│  └─ for child in children {
│       // 计算节点变换矩阵
│       matrix = child.getMatrix()
│
│       // 根据RenderNode类型分派
│       switch (node.$renderNode.type) {
│         case BITMAP_NODE:
│           renderBitmap(node)
│         case TEXT_NODE:
│           renderText(node)
│         case GRAPHICS_NODE:
│           renderGraphics(node)
│         case MESH_NODE:
│           renderMesh(node)
│         case GROUP_NODE:
│           renderGroup(node)  // 递归
│       }
│
│       // 如果有滤镜/mask/scrollRect
│       if (node.filters.length > 0)
│         drawWithFilter(node)
│       if (node.mask)
│         drawWithClip(node)
│       if (node.scrollRect)
│         drawWithScrollRect(node)
│     }
│
├─ buffer.popBuffer()   [出栈]
├─ if (nestLevel === 0) {
│    context.$drawWebGPU()  [执行所有命令]
│    清理对象池
│  }
├─ nestLevel--
└─ return
```

#### 对象池机制

```typescript
// 静态对象池
static gpuRenderBufferPool: WebGPURenderBuffer[] = []
static maxPoolSize = 6

// 在 render() 的最后 (nestLevel === 0 时):
if (nestLevel === 0) {
  // 清理超出池大小的buffer
  while (gpuRenderBufferPool.length > maxPoolSize) {
    const buf = gpuRenderBufferPool.pop()
    buf.release()
  }
}
```

### 3.2 WebGPURenderContext - GPU核心执行引擎

**文件**: `src/egret/web/rendering/webgpu/WebGPURenderContext.ts`  
**重要度**: ⭐⭐⭐⭐⭐（最关键组件）

#### 职责
- 单例管理GPU设备和Canvas上下文
- 初始化所有着色器、管线、采样器
- 管理绘制命令的执行和纹理生命周期

#### 3.2.1 初始化流程

```typescript
async initWebGPU(): Promise<void> {
  // 1. 获取GPU适配器和设备
  const adapter = await navigator.gpu?.requestAdapter()
  this.device = await adapter?.requestDevice()
  
  // 2. 创建Canvas上下文
  const canvas = document.querySelector('canvas')
  const canvasContext = canvas.getContext('webgpu')
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat()
  canvasContext.configure({
    device: this.device,
    format: canvasFormat
  })
  
  // 3. 创建GPU缓冲（顶点、索引、uniform）
  createGPUBuffers()
  
  // 4. 编译所有着色器
  createShaderModules()  // 编译WGSL → ShaderModule
  
  // 5. 创建采样器
  createSamplers()       // linear / nearest
  
  // 6. 创建BindGroup布局
  createBindGroupLayouts()
  
  // 7. 为每种混合模式创建管线
  createDefaultPipelines()
  
  // 8. 创建滤镜专用管线
  createFilterPipelines()
  
  // 9. 创建备用纹理
  createDefaultEmptyTexture()
  
  this._initialized = true
}
```

#### 3.2.2 GPU缓冲区

```typescript
// VertexBuffer: 存储所有顶点数据
// 容量: 2048 quads = 8192 vertices = 32KB
vertexGPUBuffer: GPUBuffer = device.createBuffer({
  size: 2048 * 4 * 20,  // 4 verts/quad, 20 bytes/vert
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  mappedAtCreation: false
})

// IndexBuffer: 存储索引数据
// 容量: 2048 quads * 6 indices = 24KB
indexGPUBuffer: GPUBuffer = device.createBuffer({
  size: 2048 * 6 * 2,   // 6 indices/quad, 2 bytes/index
  usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  mappedAtCreation: false
})

// UniformBuffer: 投影矩阵和其他全局参数
uniformBuffer: GPUBuffer = device.createBuffer({
  size: 256,  // 足够大的buffer
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  mappedAtCreation: false
})

// FilterUniformBuffer: 滤镜参数（ColorTransform矩阵等）
filterUniformBuffer: GPUBuffer = device.createBuffer({
  size: 512,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  mappedAtCreation: false
})
```

#### 3.2.3 着色器模块

```
着色器分类:

1. 顶点着色器 (全局唯一)
   └─ default_vert: 所有管线共用
      ├─ 输入: position(vec2), uv(vec2), color(u32)
      ├─ 输出: position(vec4), uv(vec2), color(vec4)
      └─ 功能: 屏幕空间变换

2. 纹理片段着色器
   └─ texture_frag: 采样纹理 + 颜色运算
      ├─ 支持颜色矩阵变换
      └─ 支持alpha预乘

3. 图元片段着色器
   └─ primitive_frag: 纯色输出
      └─ 简单的颜色输出

4. 滤镜片段着色器
   ├─ colorTransform_frag: 颜色矩阵
   ├─ blur_frag: 高斯模糊 (可分离)
   ├─ glow_frag: 发光效果
   └─ texture_etc_alphamask_frag: ETC透明度

着色器编译: createShaderModules()
  for (each shader source) {
    shaderModule = device.createShaderModule({
      code: source
    })
    shaderModuleCache[name] = shaderModule
  }
```

#### 3.2.4 管线缓存系统

```typescript
// 管线缓存: Map<pipelineName, GPURenderPipeline>
pipelineCache: Map<string, GPURenderPipeline> = new Map()

// 命名规则: [type]_[blend]_[stencil_optional]

// 纹理管线 (5种混合模式)
createDefaultPipelines() {
  const types = ['texture', 'primitive']
  const blends = [
    'source-over',      // 标准透明度合成
    'lighter',          // 加法混合
    'destination-out',  // 反向减法
    'destination-in',   // 目标与源相交
    'lighter-in'        // 源alpha混合
  ]
  
  for (type of types) {
    for (blend of blends) {
      // 创建 [type]_[blend]
      createPipeline(`${type}_${blend}`)
      
      // 创建 [type]_[blend]_stencil (如果需要)
      createPipeline(`${type}_${blend}_stencil`)
    }
  }
}

// 滤镜管线
createFilterPipelines() {
  const filters = ['colorTransform', 'blur', 'glow']
  const blends = ['source-over', 'lighter', ...]
  
  for (filter of filters) {
    for (blend of blends) {
      for (stencil of [false, true]) {
        createPipeline(`filter_${filter}_${blend}${stencil ? '_stencil' : ''}`)
      }
    }
  }
}

// Stencil专用管线
pipelineCache.set('stencil_push', ...)  // 递增stencil值
pipelineCache.set('stencil_pop', ...)   // 递减stencil值
```

#### 3.2.5 绘制接口

```typescript
// 绘制纹理
drawImage(bitmapData, x, y, width, height, matrix, ...): void {
  // 1. 获取GPU纹理
  gpuTexture = getGPUTexture(bitmapData)
  
  // 2. 计算顶点坐标
  quad vertices → VAO.cacheArrays()
  
  // 3. 压入绘制命令
  drawCmdManager.pushTexture(gpuTexture, count, ...)
}

// 绘制矩形
drawRect(x, y, width, height, color, matrix, ...): void {
  // 1. 计算顶点坐标
  // 2. VAO.cacheArrays()
  // 3. drawCmdManager.pushRect(color, count, ...)
}

// 绘制网格
drawMesh(vertices, indices, uvs, colors, ...): void {
  // 1. 复制数据到VAO
  // 2. drawCmdManager.pushTexture(...)
}
```

#### 3.2.6 核心执行方法 - $drawWebGPU()

```typescript
async $drawWebGPU(): Promise<void> {
  // ========== 第一阶段: 初始化 ==========
  if (!this._initialized) {
    await this.ensureInitialized()
  }
  
  // ========== 第二阶段: 清理待销毁纹理 ==========
  this.flushDestroyTextures()
  
  // ========== 第三阶段: 数据上传 ==========
  // 上传顶点数据
  this.device.queue.writeBuffer(
    this.vertexGPUBuffer,
    0,
    this.vao.vertices,
    0,
    this.vao.verticesCount * 5  // 5个float32/vertex
  )
  
  // 上传索引数据
  this.device.queue.writeBuffer(
    this.indexGPUBuffer,
    0,
    this.vao.indices,
    0,
    this.vao.indicesCount
  )
  
  // ========== 第四阶段: 创建命令编码器 ==========
  const commandEncoder = this.device.createCommandEncoder()
  
  // ========== 第五阶段: 遍历执行命令 ==========
  let currentRenderPass: GPURenderPassEncoder | null = null
  let currentBuffer: WebGPURenderTarget | null = null
  
  for (const cmd of this.drawCmdManager.drawData) {
    switch (cmd.type) {
      // ===== 激活缓冲区 =====
      case GPU_DRAWABLE_TYPE.ACT_BUFFER:
        // 结束前一个RenderPass
        if (currentRenderPass) {
          currentRenderPass.end()
        }
        
        // 获取目标纹理
        if (cmd.buffer === this.rootRenderTarget) {
          // Canvas渲染目标
          colorTexture = canvasContext.getCurrentTexture()
        } else {
          // 离屏渲染目标
          colorTexture = cmd.buffer.rootRenderTarget
        }
        
        // 更新投影uniform
        const projectionData = new Float32Array([
          cmd.buffer.rootRenderTarget.width / 2,
          -cmd.buffer.rootRenderTarget.height / 2
        ])
        this.device.queue.writeBuffer(
          this.uniformBuffer, 0, projectionData
        )
        
        // 开始新RenderPass
        const renderPassDesc: GPURenderPassDescriptor = {
          colorAttachments: [{
            view: colorTexture.createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 1 },
            loadOp: 'clear',
            storeOp: 'store'
          }]
        }
        
        // 如果需要Stencil
        if (this.stencilHandleCount > 0) {
          const depthStencilView = cmd.buffer
            .rootRenderTarget
            .depthStencilTexture
            .createView()
          
          renderPassDesc.depthStencilAttachment = {
            view: depthStencilView,
            depthLoadOp: 'load',
            depthStoreOp: 'store',
            stencilLoadOp: 'load',
            stencilStoreOp: 'store'
          }
        }
        
        currentRenderPass = commandEncoder.beginRenderPass(renderPassDesc)
        currentBuffer = cmd.buffer
        break
      
      // ===== 纹理绘制 =====
      case GPU_DRAWABLE_TYPE.TEXTURE:
        // 选择管线
        let pipelineName = `texture_${this.currentBlendMode}`
        if (this.stencilHandleCount > 0) {
          pipelineName += '_stencil'
        }
        if (cmd.hasFilter) {
          pipelineName = `filter_${cmd.filterType}_${this.currentBlendMode}`
          if (this.stencilHandleCount > 0) {
            pipelineName += '_stencil'
          }
        }
        
        const pipeline = this.pipelineCache.get(pipelineName)
        currentRenderPass.setPipeline(pipeline)
        
        // 创建或获取BindGroup
        const bindGroup = this.getTextureBindGroup(
          cmd.gpuTexture,
          cmd.sampler
        )
        currentRenderPass.setBindGroup(0, bindGroup)
        
        // 如果有滤镜，创建滤镜uniform BindGroup
        if (cmd.hasFilter) {
          const filterBindGroup = this.getFilterBindGroup(cmd.filterData)
          currentRenderPass.setBindGroup(1, filterBindGroup)
        }
        
        // 设置Stencil参考值
        if (this.stencilHandleCount > 0) {
          currentRenderPass.setStencilReference(this.stencilHandleCount)
        }
        
        // 绘制
        currentRenderPass.setVertexBuffer(0, this.vertexGPUBuffer)
        currentRenderPass.setIndexBuffer(this.indexGPUBuffer, 'uint16')
        currentRenderPass.drawIndexed(cmd.count * 6, 1, cmd.startIndex * 6)
        break
      
      // ===== 矩形绘制 =====
      case GPU_DRAWABLE_TYPE.RECT:
        let primPipelineName = `primitive_${this.currentBlendMode}`
        if (this.stencilHandleCount > 0) {
          primPipelineName += '_stencil'
        }
        
        const primPipeline = this.pipelineCache.get(primPipelineName)
        currentRenderPass.setPipeline(primPipeline)
        
        const primBindGroup = this.primitiveBindGroup  // 缓存的
        currentRenderPass.setBindGroup(0, primBindGroup)
        
        currentRenderPass.setVertexBuffer(0, this.vertexGPUBuffer)
        currentRenderPass.setIndexBuffer(this.indexGPUBuffer, 'uint16')
        currentRenderPass.drawIndexed(cmd.count * 6, 1, cmd.startIndex * 6)
        break
      
      // ===== Stencil操作 =====
      case GPU_DRAWABLE_TYPE.PUSH_MASK:
        // 首次push时，需要重启RenderPass以附加depthStencil
        if (this.stencilHandleCount === 0) {
          if (currentRenderPass) {
            currentRenderPass.end()
          }
          // 重启RenderPass（带depthStencil）
          // ... 同ACT_BUFFER逻辑，但附加depthStencil ...
          currentRenderPass = commandEncoder.beginRenderPass(...)
        }
        
        const pushPipeline = this.pipelineCache.get('stencil_push')
        currentRenderPass.setPipeline(pushPipeline)
        currentRenderPass.setColorMask(0)  // 不写颜色
        
        currentRenderPass.setVertexBuffer(0, this.vertexGPUBuffer)
        currentRenderPass.setIndexBuffer(this.indexGPUBuffer, 'uint16')
        currentRenderPass.drawIndexed(cmd.count * 6)
        
        this.stencilHandleCount++
        break
      
      case GPU_DRAWABLE_TYPE.POP_MASK:
        this.stencilHandleCount--
        
        const popPipeline = this.pipelineCache.get('stencil_pop')
        currentRenderPass.setPipeline(popPipeline)
        currentRenderPass.setColorMask(0x0F)  // 恢复颜色写
        
        currentRenderPass.setVertexBuffer(0, this.vertexGPUBuffer)
        currentRenderPass.setIndexBuffer(this.indexGPUBuffer, 'uint16')
        currentRenderPass.drawIndexed(cmd.count * 6)
        
        // 最后一个pop时，重启RenderPass（移除depthStencil）
        if (this.stencilHandleCount === 0) {
          currentRenderPass.end()
          const newRenderPassDesc = {
            colorAttachments: [...]  // 不包括depthStencil
          }
          currentRenderPass = commandEncoder.beginRenderPass(newRenderPassDesc)
        }
        break
      
      // ===== 混合模式切换 =====
      case GPU_DRAWABLE_TYPE.BLEND:
        this.currentBlendMode = cmd.blendMode
        // 下一个绘制命令会使用新的混合模式
        break
      
      // ===== Scissor测试 =====
      case GPU_DRAWABLE_TYPE.ENABLE_SCISSOR:
        currentRenderPass.setScissorRect(
          cmd.x, cmd.y, cmd.width, cmd.height
        )
        break
      
      case GPU_DRAWABLE_TYPE.DISABLE_SCISSOR:
        currentRenderPass.setScissorRect(
          0, 0,
          currentBuffer.rootRenderTarget.width,
          currentBuffer.rootRenderTarget.height
        )
        break
      
      // ===== 其他命令 =====
      case GPU_DRAWABLE_TYPE.CLEAR_COLOR:
        if (currentRenderPass) {
          currentRenderPass.end()
        }
        const clearPassDesc = {
          colorAttachments: [{
            view: ...,
            clearValue: cmd.color,
            loadOp: 'clear',
            storeOp: 'store'
          }]
        }
        currentRenderPass = commandEncoder.beginRenderPass(clearPassDesc)
        break
    }
  }
  
  // ========== 第六阶段: 完成RenderPass和提交 ==========
  if (currentRenderPass) {
    currentRenderPass.end()
  }
  
  const commandBuffer = commandEncoder.finish()
  this.device.queue.submit([commandBuffer])
  
  // ========== 第七阶段: 清理 ==========
  this.drawCmdManager.clear()
  this.vao.clear()
}
```

### 3.3 WebGPURenderBuffer - 渲染缓冲区

**文件**: `src/egret/web/rendering/webgpu/WebGPURenderBuffer.ts`

#### 职责
- 为每个渲染目标维护状态
- 管理矩阵堆栈
- 跟踪Stencil和Scissor状态

#### 关键属性

```typescript
class WebGPURenderBuffer {
  // 核心属性
  context: WebGPURenderContext
  rootRenderTarget: WebGPURenderTarget  // 纹理或canvas
  root: boolean                         // 是否为舞台缓冲
  
  // 变换状态
  globalMatrix: Matrix
  globalAlpha: number = 1
  globalTintColor: number = 0xFFFFFF
  
  // Stencil状态
  stencilHandleCount: number = 0
  $stencilList: Rectangle[] = []
  
  // Scissor状态
  scissorEnabled: boolean = false
  scissorRect: Rectangle
  
  // 绘制偏移
  $offsetX: number = 0
  $offsetY: number = 0
  
  // 对象池
  static readonly gpuRenderBufferPool: WebGPURenderBuffer[] = []
  static readonly maxPoolSize = 6
}
```

#### 对象池使用

```typescript
// 创建或从池中获取
static create(width: number, height: number): WebGPURenderBuffer {
  let buffer
  if (this.gpuRenderBufferPool.length > 0) {
    buffer = this.gpuRenderBufferPool.pop()
    buffer.reuse(width, height)
  } else {
    buffer = new WebGPURenderBuffer()
  }
  return buffer
}

// 回收到池
static release(buffer: WebGPURenderBuffer): void {
  if (this.gpuRenderBufferPool.length < this.maxPoolSize) {
    this.gpuRenderBufferPool.push(buffer)
  } else {
    buffer.dispose()
  }
}
```

### 3.4 WebGPUDrawCmdManager - 命令管理器

**文件**: `src/egret/web/rendering/webgpu/WebGPUDrawCmdManager.ts`

#### 命令类型

```typescript
enum GPU_DRAWABLE_TYPE {
  TEXTURE = 0,          // 纹理绘制
  RECT = 1,             // 矩形绘制
  PUSH_MASK = 2,        // Stencil ++
  POP_MASK = 3,         // Stencil --
  BLEND = 4,            // 混合模式
  RESIZE_TARGET = 5,    // 改变渲染目标
  CLEAR_COLOR = 6,      // 清空颜色
  ACT_BUFFER = 7,       // 激活缓冲
  ENABLE_SCISSOR = 8,   // 启用Scissor
  DISABLE_SCISSOR = 9,  // 禁用Scissor
  SMOOTHING = 10        // 采样器切换
}
```

#### 命令数据结构

```typescript
interface DrawData {
  type: GPU_DRAWABLE_TYPE
  
  // TEXTURE/RECT用
  startIndex: number    // VAO中的起始索引
  count: number         // Quad数量
  gpuTexture?: GPUTexture
  filter?: Filter
  blendMode?: string
  
  // Stencil用
  stencilOp?: 'increment' | 'decrement'
  
  // Scissor用
  x?: number
  y?: number
  width?: number
  height?: number
  
  // 其他
  buffer?: WebGPURenderBuffer
  color?: GPUColor
}
```

#### 批次合并规则

```typescript
// 合并策略: 自动将相邻的相同纹理命令合并

// 例子:
// 命令1: TEXTURE (tex_A, count=10)
// 命令2: TEXTURE (tex_A, count=5)   ← 合并到命令1，count=15
// 命令3: BLEND (lighter)
// 命令4: TEXTURE (tex_B, count=3)

// 最终结果:
// 命令1: TEXTURE (tex_A, count=15)
// 命令2: BLEND (lighter)              ← 覆盖优化：若下一个是BLEND，则覆盖
// 命令3: TEXTURE (tex_B, count=3)

pushTexture(gpuTexture, count, startIndex): void {
  const lastCmd = this.drawData[this.drawData.length - 1]
  
  // 条件: 纹理相同 + 无滤镜 + blend相同
  if (lastCmd.type === GPU_DRAWABLE_TYPE.TEXTURE &&
      lastCmd.gpuTexture === gpuTexture &&
      lastCmd.blendMode === this.currentBlendMode &&
      !this.currentFilter) {
    // 合并
    lastCmd.count += count
  } else {
    // 新建
    this.drawData.push({
      type: GPU_DRAWABLE_TYPE.TEXTURE,
      gpuTexture,
      count,
      startIndex,
      blendMode: this.currentBlendMode,
      filter: this.currentFilter
    })
  }
}
```

### 3.5 WebGPUVertexArrayObject - 顶点数据

**文件**: `src/egret/web/rendering/webgpu/WebGPUVertexArrayObject.ts`

#### 数据容量

```typescript
// Quad模型: 最多2048个四边形
MAX_QUADS = 2048

// 顶点容量
MAX_VERTICES = MAX_QUADS * 4         // 8192个顶点
MAX_INDICES = MAX_QUADS * 6          // 12288个索引

// 内存大小
vertexBuffer: Float32Array(MAX_VERTICES * 5)  // 32 KB
  // 每个顶点5个float32:
  //   [x: f32, y: f32, u: f32, v: f32, color: u32转f32]

indexBuffer: Uint16Array(MAX_INDICES)  // 24 KB
  // 每个索引1个uint16
```

#### 缓存方法

```typescript
cacheArrays(vertices: number[][], 
            indices: number[], 
            uvs: number[][],
            colors?: number[]): number {
  // 返回Quad数量(count)
  
  const quadCount = vertices.length / 4
  
  // 复制顶点数据
  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i]
    const idx = this.verticesCount + i
    this.vertices[idx * 5 + 0] = v[0]  // x
    this.vertices[idx * 5 + 1] = v[1]  // y
    this.vertices[idx * 5 + 2] = uvs[i][0]  // u
    this.vertices[idx * 5 + 3] = uvs[i][1]  // v
    this.vertices[idx * 5 + 4] = colors[i] / 0xFFFFFF  // color (归一化)
  }
  
  // 复制索引数据（调整为相对偏移）
  for (let i = 0; i < indices.length; i++) {
    this.indices[this.indicesCount + i] = this.verticesCount + indices[i]
  }
  
  this.verticesCount += vertices.length
  this.indicesCount += indices.length
  
  return quadCount
}
```

---

## 四、性能优化

### 4.1 批次合并

#### 原理
将相邻的相同纹理和混合模式的绘制命令合并为一个draw call。

#### 效果
```
UI界面渲染:
  ✗ 无优化: 100+ draw calls
  ✓ 有优化: 10-50 draw calls
  改进: 5-10x 更快
```

#### 实现细节

```typescript
// 在 drawCmdManager.pushTexture() 中:

if (可以合并到上一个命令) {
  lastCmd.count += newCount  // 增加索引数量
  return
}

// 否则新建命令
drawData.push(newCmd)
```

#### 合并条件

```
可合并条件:
  1. 上一个命令是 TEXTURE 类型
  2. 纹理对象相同 (gpuTexture === lastCmd.gpuTexture)
  3. 混合模式相同 (blendMode === lastCmd.blendMode)
  4. 无滤镜 (!hasFilter)
  5. Stencil状态相同
```

### 4.2 缓存策略

#### 4.2.1 管线缓存

```
特点: 预编译 + 永久保存

benefit: 
  - 避免运行时编译开销
  - 每个管线预创建一次
  
实现:
  pipelineCache = new Map<string, GPURenderPipeline>()
  
  // 初始化时创建所有可能的管线
  for (type of [texture, primitive, filter_*]) {
    for (blend of [source-over, lighter, ...]) {
      for (stencil of [false, true]) {
        createPipeline(name)
      }
    }
  }
```

#### 4.2.2 BindGroup缓存

```
BindGroup = uniform + sampler + texture 的组合

缓存策略:
  - primitiveBindGroup: 一个全局缓存 (矩形无需改变)
  - textureBindGroup: 按纹理缓存
  - samplerCache: 仅2个 (linear/nearest)
```

#### 4.2.3 Sampler缓存

```typescript
// 仅创建2个全局采样器，复用
samplerLinear: GPUSampler = device.createSampler({
  magFilter: 'linear',
  minFilter: 'linear'
})

samplerNearest: GPUSampler = device.createSampler({
  magFilter: 'nearest',
  minFilter: 'nearest'
})

// 使用时:
const sampler = smoothing ? samplerLinear : samplerNearest
```

#### 4.2.4 TextureView缓存

```typescript
// 每个GPUTexture缓存一个View
textureViewCache: WeakMap<GPUTexture, GPUTextureView> = new WeakMap()

getTextureView(gpuTexture: GPUTexture): GPUTextureView {
  if (!textureViewCache.has(gpuTexture)) {
    const view = gpuTexture.createView()
    textureViewCache.set(gpuTexture, view)
  }
  return textureViewCache.get(gpuTexture)
}
```

### 4.3 数据管理

#### 4.3.1 批量上传

```typescript
// 一次性上传所有顶点数据
device.queue.writeBuffer(
  vertexGPUBuffer,
  0,
  vao.vertices,
  0,
  vao.verticesCount * 5
)

// 一次性上传所有索引数据
device.queue.writeBuffer(
  indexGPUBuffer,
  0,
  vao.indices,
  0,
  vao.indicesCount
)
```

#### 4.3.2 Stencil惰性启用

```typescript
// 首次使用mask时才创建depth-stencil纹理

pushMask(): void {
  if (this.stencilHandleCount === 0) {
    // 首次push，创建depth-stencil
    this.rootRenderTarget.enabledStencil()
  }
  this.stencilHandleCount++
}

popMask(): void {
  this.stencilHandleCount--
  if (this.stencilHandleCount === 0) {
    // 最后一个pop，可销毁depth-stencil
    // (实际上保留以供下次使用)
  }
}
```

#### 4.3.3 延迟销毁

```typescript
// 纹理不立即destroy，收集到销毁队列

deleteGPUTexture(gpuTexture: GPUTexture): void {
  this.texturesToDestroy.push(gpuTexture)
}

flushDestroyTextures(): void {
  // 在每帧开始时批量销毁
  for (const texture of this.texturesToDestroy) {
    texture.destroy()
  }
  this.texturesToDestroy.length = 0
}
```

---

## 五、高级特性

### 5.1 Stencil嵌套遮罩

#### 原理

使用GPU硬件Stencil缓冲实现复杂的遮罩效果，支持任意深度嵌套。

#### 执行流程

```
pushMask(x, y, w, h)
  ├─ drawCmdManager.pushPushMask()
  ├─ stencilHandleCount = 1
  │
  └─ 在$drawWebGPU()中:
     ├─ 创建RenderPass with depthStencilAttachment
     ├─ 选择 stencil_push 管线
     ├─ stencilFront: {
     │    compare: 'always',      // 总是通过模板测试
     │    passOp: 'increment-clamp',
     │    failOp: 'keep'
     │  }
     ├─ setStencilReference(0)
     ├─ setColorMask(0)           // 不写颜色
     └─ drawIndexed()             // 绘制mask形状，stencil++

pushMask()  [嵌套]
  └─ stencilHandleCount = 2

drawImage(textureA)
  └─ 在$drawWebGPU()中:
     ├─ 选择 texture_source-over_stencil 管线
     ├─ setStencilReference(2)
     ├─ stencilFront: {
     │    compare: 'equal',       // 仅stencil==2通过
     │    passOp: 'keep',
     │    failOp: 'keep'
     │  }
     └─ drawIndexed()             // 仅第2个mask内的区域绘制

popMask()  [退出嵌套]
  └─ 在$drawWebGPU()中:
     ├─ 选择 stencil_pop 管线
     ├─ stencilFront: {
     │    compare: 'always',
     │    passOp: 'decrement-clamp',
     │    failOp: 'keep'
     │  }
     ├─ setStencilReference(2)
     ├─ setColorMask(0xF)         // 恢复颜色写
     └─ drawIndexed()             // stencil--

popMask()
  └─ stencilHandleCount = 0
     并重启RenderPass（移除depthStencil）
```

#### 限制和建议

```
✓ 支持: 无限嵌套深度
⚠️ 建议: 不超过8层（性能考虑）

如果需要深层遮罩:
  - 考虑用离屏buffer替代
  - 或优化mask的复杂度
```

### 5.2 Scissor测试

#### 用途
优化scrollRect的性能，避免超出区域的像素处理。

#### 实现

```typescript
enableScissor(x: number, y: number, w: number, h: number): void {
  drawCmdManager.pushEnableScissor(x, y, w, h)
}

disableScissor(): void {
  drawCmdManager.pushDisableScissor()
}

// 在$drawWebGPU()中:
case GPU_DRAWABLE_TYPE.ENABLE_SCISSOR:
  renderPassEncoder.setScissorRect(
    Math.ceil(cmd.x),
    Math.ceil(cmd.y),
    Math.ceil(cmd.width),
    Math.ceil(cmd.height)
  )

case GPU_DRAWABLE_TYPE.DISABLE_SCISSOR:
  renderPassEncoder.setScissorRect(
    0, 0,
    buffer.rootRenderTarget.width,
    buffer.rootRenderTarget.height
  )
```

### 5.3 滤镜管线

#### 支持的滤镜

1. **ColorTransform** - 颜色矩阵变换
   ```
   R' = R * m[0]  + G * m[4]  + B * m[8]  + A * m[12] + m[16]
   G' = R * m[1]  + G * m[5]  + B * m[9]  + A * m[13] + m[17]
   B' = R * m[2]  + G * m[6]  + B * m[10] + A * m[14] + m[18]
   A' = R * m[3]  + G * m[7]  + B * m[11] + A * m[15] + m[19]
   ```

2. **Blur** - 可分离的高斯模糊
   ```
   支持水平和垂直两个pass
   ```

3. **Glow** - 发光效果
   ```
   原图 + 模糊后的高亮区域
   ```

#### 滤镜处理流程

```
单一ColorTransform滤镜:
  ├─ 直接标记在绘制命令中
  └─ 在TEXTURE指令中使用 filter_colorTransform 管线

其他滤镜:
  ├─ 创建offscreen buffer
  ├─ 逐个应用滤镜
  └─ 最终buffer → screen

多个滤镜:
  filter1 → offscreen buffer 1
  filter2(buffer1) → offscreen buffer 2
  ...
  filterN(bufferN-1) → screen
```

---

## 六、扩展指南

### 6.1 添加新着色器

#### 步骤

1. **定义着色器代码**
   
   在 `shaders/WGShaderLib.ts` 中添加:
   
   ```typescript
   export const myCustom_frag = `
     @fragment
     fn fs_main(
       in: VertexOutput
     ) -> @location(0) vec4<f32> {
       // 你的WGSL代码
       let color = textureSample(gTexture, gSampler, in.uv);
       return color * vec4<f32>(1.0, 0.5, 0.5, 1.0);
     }
   `
   ```

2. **编译着色器**
   
   在 `WebGPURenderContext.ts` 的 `createShaderModules()` 中:
   
   ```typescript
   this.shaderModuleCache['myCustom_frag'] = this.device.createShaderModule({
     code: WGShaderLib.myCustom_frag
   })
   ```

3. **创建管线**
   
   在 `createFilterPipelines()` 中:
   
   ```typescript
   // 为每种混合模式创建变体
   for (const blend of this.blends) {
     const name = `filter_myCustom_${blend}`
     const layout = this.device.createPipelineLayout({...})
     const pipeline = this.device.createRenderPipeline({
       layout,
       vertex: {
         module: this.shaderModuleCache['default_vert'],
         entryPoint: 'vs_main',
         buffers: [...]
       },
       fragment: {
         module: this.shaderModuleCache['myCustom_frag'],
         entryPoint: 'fs_main',
         targets: [{
           format: this.canvasFormat,
           blend: this.blendModes[blend]
         }]
       }
     })
     this.pipelineCache.set(name, pipeline)
   }
   ```

4. **在绘制中使用**
   
   在 `getFilterPipeline()` 中添加分派逻辑:
   
   ```typescript
   case 'myCustom':
     return `filter_myCustom_${blendMode}${stencil ? '_stencil' : ''}`
   ```

### 6.2 添加新混合模式

#### 步骤

1. **定义混合模式**
   
   在 `initBlendMode()` 中:
   
   ```typescript
   this.blendModes['my-mode'] = {
     color: {
       srcFactor: 'src-alpha',
       dstFactor: 'one-minus-src-alpha',
       operation: 'add'
     },
     alpha: {
       srcFactor: 'one',
       dstFactor: 'one-minus-src-alpha',
       operation: 'add'
     }
   }
   ```

2. **创建管线变体**
   
   在 `createDefaultPipelines()` 中:
   
   ```typescript
   this.blends.push('my-mode')
   
   // 创建所有类型的管线
   for (const type of ['texture', 'primitive']) {
     const name = `${type}_my-mode`
     // 创建管线...
   }
   ```

3. **使用混合模式**
   
   ```typescript
   setGlobalCompositeOperation('my-mode')
   ```

### 6.3 自定义滤镜

#### 步骤

1. **继承Filter类**
   
   ```typescript
   class MyFilter extends egret.Filter {
     constructor() {
       super()
       this.type = 'myCustom'
       this.$uniforms = new Float32Array([
         // 你的uniform数据
       ])
     }
   }
   ```

2. **实现uniform数据生成**
   
   在 `WebGPURenderContext.buildFilterUniformData()` 中:
   
   ```typescript
   case 'myCustom':
     const filter = cmd.filter as MyFilter
     // 更新filter.$uniforms
     const data = filter.$uniforms
     device.queue.writeBuffer(
       filterUniformBuffer, 0, data
     )
     break
   ```

3. **创建着色器（见6.1）**

4. **创建管线（见6.1）**

---

## 七、常见问题和解决方案

### 问题1: 纹理显示倒立

**症状**: 纹理上下颠倒

**原因**: WebGPU的纹理坐标原点在左上（V=0在上），而OpenGL在左下（V=0在下）

**解决**:
```wgsl
// 在着色器中翻转UV
uv.y = 1.0 - uv.y

// 或在VAO中翻转（已实现）
vao.cacheArrays() 时自动处理
```

### 问题2: Depth-Stencil纹理尺寸错误

**症状**: Stencil操作不正确、画面闪烁

**原因**: 调整canvas大小时，depth-stencil纹理未重建

**解决**:
```typescript
// 在ACT_BUFFER时确保depth-stencil大小一致
case GPU_DRAWABLE_TYPE.ACT_BUFFER:
  cmd.buffer.rootRenderTarget.ensureDepthStencilSize()
  break
```

### 问题3: 批次合并不生效

**症状**: Draw calls过多，性能差

**原因**:
- 相邻纹理有滤镜（无法合并）
- 混合模式不同
- 纹理对象引用不同

**检查**:
```typescript
// 启用debug模式查看命令队列
console.log(drawCmdManager.drawData)

// 查看是否有以下情况:
// - 相邻TEXTURE命令的gpuTexture不同
// - BLEND命令打断合并
// - filter字段不为null
```

### 问题4: 异步初始化导致黑屏

**症状**: 页面加载后黑屏

**原因**: GPU初始化未完成就开始绘制

**解决**:
```typescript
// 方法1: 等待初始化完成
const context = WebGPURenderContext.getInstance()
await context.ensureInitialized()
app.render()

// 方法2: 延迟首次渲染
setTimeout(() => {
  app.render()
}, 100)
```

### 问题5: Stencil性能差

**症状**: 嵌套mask过多时卡顿

**原因**: GPU需要为每层stencil执行额外操作

**解决**:
```
✓ 避免超过8层嵌套
✓ 合并mask逻辑
✓ 用离屏buffer替代深层mask
```

### 问题6: 内存泄漏

**症状**: 长时间运行内存持续增长

**原因**: GPU纹理未正确销毁

**解决**:
```typescript
// 确保调用deleteGPUTexture
bitmapData.dispose()  // 自动调用deleteGPUTexture

// 检查销毁队列是否被处理
flushDestroyTextures()  // 在$drawWebGPU开始时调用
```

---

## 八、与WebGL的对比

| 特性 | WebGL | WebGPU |
|------|-------|--------|
| **着色器语言** | GLSL | WGSL |
| **编译时机** | 运行时动态编译 | 预编译初始化 |
| **管线创建** | 动态(glUseProgram) | 预创建(重用) |
| **命令执行** | 立即执行 | 批量缓冲 |
| **混合模式** | glBlendFunc (2个参数) | GPUBlendState (完整配置) |
| **Stencil** | glStencilFunc/Op | depthStencilAttachment |
| **Sampler** | 内联到uniform | 独立对象 |
| **Buffer绑定** | glBindBuffer | setVertexBuffer |
| **数据上传** | bufferData/SubData | device.queue.writeBuffer |
| **Viewport** | glViewport | RenderPass配置 |
| **FrameBuffer** | WebGLFramebuffer | 纹理 + RenderPass |
| **异步** | 无 | 设备创建/初始化异步 |
| **错误处理** | 立即异常 | 延迟或静默 |

**总体对比**:
- ✓ WebGPU更现代、更显式、更高效
- ✓ WebGPU批量化程度更高，性能潜力更大
- ⚠️ WebGPU学习曲线更陡

---

## 九、性能调优检查清单

### 初始化阶段
- [ ] 着色器预编译完成
- [ ] 所有管线预创建完成
- [ ] GPU缓冲大小合理

### 运行时
- [ ] 批次合并有效（draw calls < 100）
- [ ] 无纹理重复上传（缓存有效）
- [ ] Stencil深度 < 8层
- [ ] 无冗余状态变更（blend/sampler)

### 内存管理
- [ ] 纹理及时销毁（no leaks）
- [ ] 对象池有效利用
- [ ] GPU内存 < 100MB (不含动态纹理)

### 调试工具
```typescript
// 启用debug
console.log('Draw calls:', drawCmdManager.drawData.length)
console.log('Vertex count:', vao.verticesCount)
console.log('Stencil depth:', stencilHandleCount)
console.log('Textures cached:', textureCache.size)
```

---

## 十、总结

### 系统特点
✓ **架构精妙**: 遵循现代GPU编程最佳实践  
✓ **功能完整**: 支持2D游戏的所有渲染需求  
✓ **性能优异**: 多层次缓存和批量优化  
✓ **代码质量**: 清晰、可维护、生产就绪  
✓ **易于扩展**: 模块化设计，易于添加新特性  

### 关键指标
- **总代码量**: 3,700+ 行
- **组件数量**: 7个核心组件 + 6个着色器
- **性能提升**: UI界面 100+ draw calls → 10-50 (5-10x)
- **GPU内存**: ~57 KB (静态) + 纹理缓存

### 进阶学习
1. 学习WGSL着色器语言
2. 理解管线和BindGroup概念
3. 优化Stencil和Scissor的使用
4. 实现自定义滤镜和混合模式

---

**文档完成**  
**最后更新**: 2026-03-12  
**维护者**: Egret引擎团队

