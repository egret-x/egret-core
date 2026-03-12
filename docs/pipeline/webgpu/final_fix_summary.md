# Egret WebGPU 渲染警告 - 最终修复方案

## 核心问题识别

之前的修复虽然识别了问题，但在实施时遇到了关键难题：
- Pipeline 和 RenderPass 的 depthStencil 附件状态必须**完全一致**
- 无法同时拥有"有 depthStencil"和"无 depthStencil"的两种状态
- 状态追踪中存在时序问题（PUSH_MASK 发生时状态改变）

## 最终解决方案：统一使用 depthStencil

### 方案概述
**简化架构**：不再区分"有 stencil"和"无 stencil"的状态，而是**所有 RenderPass 都统一地包含 depthStencil attachment**。

### 优点
✅ Pipeline 和 RenderPass 附件状态完全一致
✅ 消除所有 "Attachment state not compatible" 警告
✅ 状态追踪简化，消除时序问题
✅ 代码逻辑更清晰

### 修改内容

#### 1. beginRenderPass 改动
```typescript
// 之前：只在需要时附加 depthStencil
if (renderTarget && renderTarget.stencilEnabled) {
    // 附加 depthStencil
}

// 之后：总是附加 depthStencil
if (renderTarget) {
    renderTarget.enabledStencil();  // 预先启用
    // 总是附加 depthStencil
}
```

#### 2. Pipeline 选择简化
```typescript
// 之前：根据动态状态选择 Pipeline
let stencil = currentRenderPassHasDepthStencil;
let pipeline = this.getTexturePipeline(blendMode, stencil);

// 之后：总是使用 stencil 变体
let stencil = true;  // 所有 RenderPass 都有 depthStencil
let pipeline = this.getTexturePipeline(blendMode, stencil);
```

#### 3. ETC Alpha Mask Pipeline 补全
添加了缺失的 stencil 变体：
- `texture_etc_alpha_source-over_stencil`
- `filter_colorTransform_etc_alpha_stencil`

#### 4. Scissor Rect 验证
改进的边界检查逻辑：
```typescript
// 检查起始坐标是否在范围内
if (x >= renderTargetWidth || y >= renderTargetHeight) {
    break;  // 跳过设置
}

// 限制右边界和下边界
if (x + w > renderTargetWidth) {
    w = renderTargetWidth - x;
}
if (y + h > renderTargetHeight) {
    h = renderTargetHeight - y;
}
```

#### 5. 纹理延迟销毁
保留之前实现的延迟销毁机制，确保纹理不被过早销毁。

## 修改文件统计

```
WebGPURenderContext.ts : +165 lines (完整修复，包含 ETC Pipeline 变体)
WebGPURenderTarget.ts  : +14 lines (纹理销毁保护)
```

## 警告消除效果

### 修复前的警告
```
250 Attachment state of [RenderPipeline] is not compatible with [RenderPassEncoder]
    [RenderPassEncoder] expects depthStencilFormat: Depth24PlusStencil8
    [RenderPipeline] has none
250 [Invalid CommandBuffer] is invalid
```

### 修复后预期
✅ **完全消除** - 所有 Pipeline 和 RenderPass 现在附件状态一致

## 关键改进

| 问题 | 修复方案 | 效果 |
|-----|--------|------|
| **Scissor Rect 超出边界** | 范围验证 + 限制 | ✅ 避免无效设置 |
| **Pipeline 附件不兼容** | 统一使用 depthStencil | ✅ 完全兼容 |
| **ETC Pipeline 缺失** | 添加 stencil 变体 | ✅ 完整覆盖 |
| **纹理过早销毁** | 延迟销毁机制 | ✅ 避免 use-after-free |

## 性能考虑

**轻微性能影响**：
- 所有 RenderTarget 现在都创建 depthStencil 纹理（即使不使用 stencil mask）
- 这是为了确保 Pipeline 兼容性的必要代价
- 性能影响极小（depthStencil 纹理创建开销）

## 验证步骤

1. **重新编译**
   ```bash
   npm run build
   ```

2. **测试验证**
   - 打开应用在浏览器中
   - 打开 DevTools Console
   - 应该看不到 "Attachment state not compatible" 警告

3. **功能测试**
   - 验证 scissor rect 剪裁正常工作
   - 确认 stencil mask 功能正常
   - 检查纹理渲染（文本、图形、滤镜）

## 总结

这次修复的核心思想是**简化而不是复杂化**：与其维护两套 Pipeline 系统和复杂的状态追踪，不如统一所有 RenderPass 都使用 depthStencil。这样做不仅消除了所有兼容性问题，还使代码更易维护。

