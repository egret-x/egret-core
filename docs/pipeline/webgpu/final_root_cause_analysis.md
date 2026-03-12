# WebGPU DepthStencil 尺寸不匹配 - 真正的根本原因与终极修复

## 问题诊断总结

经过深入分析，发现了真正导致问题的根本原因：**WebGPURenderBuffer.resize() 没有正确调用 RenderTarget.resize()**

## 真正的根本原因

### 问题流程：

```
1. Canvas 大小改变 → WebGPURenderBuffer.resize(width, height) 被调用

2. WebGPURenderBuffer.resize() 中：
   if (width != this.rootRenderTarget.width || ...) {
       this.rootRenderTarget.width = width;       // ← 直接修改属性
       this.rootRenderTarget.height = height;     // ← 直接修改属性
   }
   // 问题：没有调用 rootRenderTarget.resize()

3. 结果：
   - rootRenderTarget 的宽高属性被更新了
   - 但 color 和 depthStencil 纹理仍然是旧的（未销毁）
   - 因为 RenderTarget.resize() 方法没有被调用

4. 下一帧渲染：
   - getTextureView() 调用 activate() → initFrameBuffer() 创建新的 color 纹理（新尺寸）
   - enabledStencil() 调用 createDepthStencilTexture() 创建 depthStencil（新尺寸 OR 旧尺寸？）
   - 由于我们之前的修复，enabledStencil 会调用 createDepthStencilTexture
   - 但如果那时有旧的 depthStencil 纹理仍在队列中被使用...
   - WebGPU 验证失败：attachment 尺寸不匹配
```

### 为什么直接修改属性不行：

```typescript
// 错误做法（之前的代码）：
this.rootRenderTarget.width = width;
this.rootRenderTarget.height = height;
// 这只更新了属性值，并没有销毁旧纹理

// 正确做法：
this.rootRenderTarget.resize(width, height);
// resize() 方法会：
// 1. 更新宽高
// 2. 销毁旧的 color 纹理（延迟销毁）
// 3. 销毁旧的 depthStencil 纹理（延迟销毁）
// 4. 如果之前启用了 stencil，立即创建新的 depthStencil 纹理
```

## 终极修复

修改文件：`WebGPURenderBuffer.ts` (line 187)

```typescript
// 之前（错误）：
this.rootRenderTarget.width = width;
this.rootRenderTarget.height = height;

// 之后（正确）：
this.rootRenderTarget.resize(width, height);
```

## 修复链路

### 修复 1: WebGPURenderBuffer.resize()
**文件**: `WebGPURenderBuffer.ts:187`
- 将直接赋值改为调用 `resize()` 方法
- 这样纹理销毁和重建流程才能正确执行

### 修复 2: WebGPURenderTarget.resize()
**文件**: `WebGPURenderTarget.ts:105-131`
- 销毁 color 纹理（延迟销毁）
- 销毁 depthStencil 纹理（延迟销毁）
- 如果原来启用了 stencil，立即创建新的 depthStencil 纹理

### 修复 3: WebGPURenderTarget.enabledStencil()
**文件**: `WebGPURenderTarget.ts:185-191`
- 简化逻辑：总是设置 `_stencilEnabled = true`
- 如果 depthStencil 纹理不存在，创建新的

## 问题为什么一直存在

1. **初始尺寸错误**：rootRenderTarget 初始化为 3x3
2. **Resize 不完整**：只修改了属性，没有销毁纹理
3. **纹理尺寸不同步**：color 和 depthStencil 宽高不一致
4. **WebGPU 验证失败**：要求所有 attachment 尺寸一致

## 预期效果

✅ DepthStencil 纹理尺寸始终与 color 纹理匹配
✅ Resize 时纹理被正确销毁和重建
✅ 消除所有 "size does not match" 警告
✅ 消除所有 "Destroyed texture used in submit" 警告

## 关键洞察

- **直接修改属性 ≠ 正确的管理资源**
- **必须调用专门的 resize() 方法来完整地处理纹理生命周期**
- **这是一个被忽视的关键环节**

