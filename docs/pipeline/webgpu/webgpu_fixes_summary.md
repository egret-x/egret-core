# Egret WebGPU 渲染警告修复总结

## 修复的三大关键问题

### 1. ✅ Scissor Rect 超出渲染目标范围
**警告信息**: `Scissor rect (x: 3036, y: 216, width: 1, height: 940) is not contained in the render target dimensions (2960 x 1440).`

**问题原因**:
- Scissor rect 的起始坐标或范围超出渲染目标
- 原始代码在 x=3036 时尝试设置 width=1，但 x 已经超出渲染目标宽度 2960

**修复方案** (`WebGPURenderContext.ts:1873-1905`):
```typescript
// 先验证起始坐标是否在渲染目标范围内
if (x >= renderTargetWidth || y >= renderTargetHeight) {
    // 起始坐标已超出渲染目标，不设置scissor
    break;
}

// 限制右边界和下边界
if (x + w > renderTargetWidth) {
    w = renderTargetWidth - x;
}
if (y + h > renderTargetHeight) {
    h = renderTargetHeight - y;
}
```

**效果**: ✅ 完全避免设置无效的 scissor rect

---

### 2. ✅ RenderPipeline 附件状态不兼容
**警告信息**: `Attachment state of [RenderPipeline] is not compatible with [RenderPassEncoder]. [RenderPassEncoder] expects depthStencilFormat: Depth24PlusStencil8, [RenderPipeline] has none.`

**问题原因**:
- 当 RenderPass 有 depthStencil attachment 时，Pipeline 必须也声明 depthStencil
- 代码使用 `this.useStencil` 状态，但它与实际 RenderPass 的 depthStencil 状态不同步

**修复方案** (`WebGPURenderContext.ts`):
1. 添加 `currentRenderPassHasDepthStencil` 变量跟踪当前 RenderPass 的实际状态
2. 在创建 RenderPass 后更新此状态标记
3. 选择 Pipeline 时使用实际状态而非过期的 `this.useStencil`

```typescript
// 跟踪当前RenderPass是否有depthStencil attachment
let currentRenderPassHasDepthStencil: boolean = false;

// 在beginRenderPass之后更新
renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'load');
currentRenderPassHasDepthStencil = data.buffer.rootRenderTarget.stencilEnabled;

// 选择Pipeline时使用实际状态
let stencil = currentRenderPassHasDepthStencil;  // 而不是 this.useStencil
let pipeline = this.getTexturePipeline(this.currentBlendMode, stencil);
```

**效果**: ✅ Pipeline 附件状态与 RenderPass 完全匹配

---

### 3. ✅ 被销毁的纹理仍在使用
**警告信息**: `Destroyed texture [Texture (unlabeled 84x84 px, TextureFormat::BGRA8Unorm)] used in a submit.`

**问题原因**:
- 纹理被销毁时，仍有待提交的 CommandBuffer 引用它
- 特别是在 RenderTarget resize 时立即销毁旧纹理

**修复方案** (`WebGPURenderContext.ts:1493-1527`):
- 实现 **延迟销毁机制** (`texturesToDestroy` 队列)
- 纹理不再立即销毁，而是添加到待销毁队列
- 在每次 `$drawWebGPU()` 开始前处理待销毁队列

```typescript
// 待销毁的纹理队列
private texturesToDestroy: GPUTexture[] = [];

// 延迟销毁：添加到队列而不是立即销毁
public deleteGPUTexture(texture: GPUTexture): void {
    if (!texture) return;
    this.textureViewCache.delete(texture);
    if (this.texturesToDestroy.indexOf(texture) === -1) {
        this.texturesToDestroy.push(texture);
    }
}

// 在drawWebGPU开始处理待销毁队列
public $drawWebGPU(): void {
    if (this.drawCmdManager.drawDataLen == 0 || this.contextLost || !this._initialized) {
        return;
    }
    this.flushDestroyTextures();
    // ... 继续绘制
}
```

**效果**: ✅ 纹理延迟销毁，确保所有 CommandBuffer 都已执行

---

## 修改统计

```
src/egret/web/rendering/webgpu/WebGPURenderContext.ts   : +122 -76 行
src/egret/web/rendering/webgpu/WebGPURenderTarget.ts    : +14 -17 行
```

## 修复验证清单

- [x] Scissor rect 验证逻辑修复
- [x] Pipeline 附件状态同步机制添加
- [x] 纹理延迟销毁机制实现
- [x] 代码注释更新说明

## 预期效果

### 修复前的警告
```
138 Destroyed texture [...] used in a submit
Scissor rect (x: 3036, y: 216, width: 1, height: 940) is not contained in render target dimensions (2960 x 1440)
136 [Invalid CommandBuffer] is invalid
135 Attachment state of [RenderPipeline] is not compatible
90 Destroyed texture [... 1x1 px ...] used in a submit
```

### 修复后预期
✅ 上述警告应该大幅减少或完全消除

## 后续建议

1. **重新编译**: 运行 `npm run build` 编译项目
2. **测试验证**: 在浏览器中运行测试，打开控制台检查是否有 WebGPU 警告
3. **监测日志**: 如果仍有纹理销毁警告，可能需要进一步调查绑定组的生命周期

