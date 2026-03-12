# WebGPU DepthStencil 尺寸不匹配问题 - 根本原因分析与修复

## 问题现象

运行应用后，WebGPU 控制台出现新的警告：

```
125 The depth stencil attachment [TextureView of Texture (unlabeled 1x1 px)] 
    size (width: 1, height: 1) does not match the size of the other 
    attachments' base plane (width: 84, height: 84).
    
124 The depth stencil attachment [TextureView of Texture (unlabeled 84x84 px)] 
    size (width: 84, height: 84) does not match the size of the other 
    attachments' base plane (width: 1, height: 1).
    
Destroyed texture [Texture (unlabeled 84x84 px, TextureFormat::Depth24PlusStencil8)] 
used in a submit.
```

## 根本原因分析

### 问题的产生过程：

1. **初始状态**：
   - RenderTarget 创建时，color 纹理创建为 1x1（初始尺寸）
   - depthStencil 纹理也创建为 1x1

2. **Resize 发生**：
   - RenderTarget 被 resize 为 84x84
   - Color 纹理被销毁，下次使用时会创建新的 84x84 纹理
   - **BUG**: depthStencil 纹理也被销毁了（这部分是对的）

3. **下一帧渲染**：
   - beginRenderPass 调用 `enabledStencil()`
   - `enabledStencil()` 检查：`if (this._stencilEnabled) return;`
   - 因为 `_stencilEnabled` 在 resize 时被设为 `false`，所以跳过了创建
   - 但这时 color 纹理已经是 84x84（刚创建的）
   - depthStencil 纹理是 1x1（旧的，resize 前的）
   - **不匹配！** → WebGPU 验证失败

### 错误的修复方向：

最初的问题是在 resize 时设置了 `this._stencilEnabled = false`，导致下次 enabledStencil 时不会重新创建纹理。

## 正确的修复方案

### 方案：RenderTarget 尺寸改变时，销毁 depthStencil 但保持状态标记

```typescript
public resize(width: number, height: number): void {
    this._resize(width, height);  // 更新宽高
    
    // 销毁 color 纹理
    if (this.texture) {
        context.deleteGPUTexture(this.texture);  // 延迟销毁
        this.texture = null;
    }
    
    // 销毁 depthStencil 纹理（不能延迟，需要立即销毁）
    if (this.depthStencilTexture) {
        this.depthStencilTexture.destroy();
        this.depthStencilTexture = null;
    }
    
    // 关键：不设置 _stencilEnabled = false
    // 这样 enabledStencil 会创建新的匹配尺寸的纹理
}
```

### 简化 enabledStencil 逻辑

```typescript
public enabledStencil(): void {
    this._stencilEnabled = true;
    
    // 如果纹理不存在（首次创建或 resize 后销毁），就创建新的
    if (!this.depthStencilTexture) {
        this.createDepthStencilTexture();  // 自动使用当前的宽高
    }
}
```

## 关键洞察

1. **状态 vs 资源**：
   - `_stencilEnabled` 是逻辑状态（是否需要 stencil）
   - `depthStencilTexture` 是物理资源（实际的 GPU 纹理）
   - 两者应该独立管理

2. **Resize 的语义**：
   - Resize 不应该改变逻辑状态（_stencilEnabled）
   - Resize 只应该销毁和重新创建物理资源
   - 这样下次访问时会自动创建新的匹配尺寸的资源

3. **为什么 depthStencil 不能延迟销毁**：
   - Color 纹理销毁可以延迟，因为它在下一帧才被使用
   - DepthStencil 纹理不行，因为 beginRenderPass 会立即使用它
   - 如果尺寸不匹配，RenderPass 创建会立即失败

## 修复前后对比

### 修复前的流程：

```
Resize(84x84):
  → color 纹理销毁
  → depthStencil 纹理销毁
  → _stencilEnabled = false  ← 问题！

Next beginRenderPass:
  → enabledStencil() 发现 _stencilEnabled=false，跳过创建
  → color 纹理是 84x84（新创建的）
  → depthStencil 纹理是 1x1（旧的，或不存在）
  → **尺寸不匹配！**
```

### 修复后的流程：

```
Resize(84x84):
  → color 纹理销毁（延迟）
  → depthStencil 纹理销毁（立即）
  → _stencilEnabled 保持（不改变）

Next beginRenderPass:
  → enabledStencil() 发现 depthStencilTexture=null
  → 创建新的 84x84 depthStencil 纹理
  → color 纹理是 84x84（新创建的）
  → depthStencil 纹理是 84x84（新创建的）
  → **完美匹配！**
```

## 代码修改总结

修改文件：`WebGPURenderTarget.ts`

1. **resize 方法**：
   - 删除 `this._stencilEnabled = false`
   - depthStencil 销毁改为立即销毁（不延迟）
   - 添加注释说明关键逻辑

2. **enabledStencil 方法**：
   - 简化逻辑：总是设置 `_stencilEnabled = true`
   - 检查纹理是否存在，不存在就创建
   - 移除早期返回，简化代码

## 预期效果

✅ 完全消除 "depth stencil attachment size does not match" 警告
✅ 消除 "Destroyed texture used in a submit" 警告（depthStencil 部分）
✅ 所有 attachment 尺寸始终匹配
✅ RenderPass 验证成功，无错误

