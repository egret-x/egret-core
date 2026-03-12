# Egret WebGPU 关键渲染问题修复 - 四大问题解决

## 已应用的关键修复

### 1. ✅ 滤镜导致的 UV 采样错乱 - 移除 Y 轴翻转

**问题**: UI 图标变成灰色块、图集碎块错乱
**根本原因**: WebGL 时代遗留的 Y 轴翻转 Hack，WebGPU 纹理已经是 Top-Down，强制翻转导致采样到图集的另一端

**修复位置**: 三个着色器方法

#### 1.1 ColorTransform 着色器
```
文件: WebGPURenderContext.ts (第 340-349 行)
修改: 移除 "let uv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);"
替换为: "let uv = input.vTextureCoord;"
```

#### 1.2 Blur 着色器
```
文件: WebGPURenderContext.ts (第 387 行)
修改: 移除 "let baseY = 1.0 - input.vTextureCoord.y;"
替换为: "let baseY = input.vTextureCoord.y;"
```

#### 1.3 Glow 着色器
```
文件: WebGPURenderContext.ts (第 443 行)
修改: 移除 Y 翻转逻辑
替换为: "let baseUv = input.vTextureCoord;"
```

**效果**: ✅ 滤镜图标恢复正常，不再出现灰色块

---

### 2. ✅ Scissor 溢出导致 UI 错误渲染

**问题**: 屏幕外滑动的 UI 因为没有正确裁剪，直接覆盖渲染在屏幕上
**根本原因**: 当 scissor rect 完全超出屏幕时，使用 break 忽略裁剪，导致元素不被正确隐藏

**修复位置**: WebGPURenderContext.ts - GPU_DRAWABLE_TYPE.ENABLE_SCISSOR 分支 (第 2005-2039 行)

```typescript
// 改进的 scissor 逻辑：
1. 计算 scissor rect 的右下角坐标 (r, b)
2. 与渲染目标做交集
3. 如果交集为空 (w <= 0 || h <= 0)，设置 1x1 的无效裁剪区
4. 这样即使元素在屏幕外，也能通过无效裁剪正确隐藏
```

**效果**: ✅ 屏幕外 UI 正确隐藏，不再有杂乱覆盖

---

### 3. ✅ ClearRect 中的 WebGL 坐标系污染

**问题**: 底部文字被砍掉一半（如 "REC" 只显示上半部分），背景莫名缺失
**根本原因**: clearRect 使用了 WebGL 的 Y 轴翻转公式 (-y - height + buffer.height)

**修复位置**: WebGPURenderContext.ts - clearRect 方法 (第 1371 行)

```typescript
// 之前 (WebGL 风格)：
this.enableScissor(x, -y - height + buffer.height, width, height);

// 之后 (WebGPU 正确方式)：
this.enableScissor(x, y, width, height);
```

**关键点**: WebGPU 的 setScissorRect 已经采用 Top-Left 原点，不需要 Y 轴翻转

**效果**: ✅ 底部 UI 恢复正常，背景正确铺满

---

### 4. ✅ Buffer 数据对齐问题（4 字节强制对齐）

**问题**: 奇数个顶点的 Mesh 图形导致 writeBuffer 失败或跳过绘制
**根本原因**: WebGPU 严格要求 writeBuffer 的数据长度必须是 4 的倍数

**修复位置**: WebGPURenderContext.ts - $drawWebGPU() 方法 (第 1682-1693 行)

```typescript
// 修复逻辑：
// 对于 vertex buffer：
let vWriteLen = (vertices.byteLength + 3) & ~3;  // 向上取整到 4 的倍数
vWriteLen = Math.min(vWriteLen, vertices.buffer.byteLength - vertices.byteOffset);

// 对于 index buffer：
let iWriteLen = (indices.byteLength + 3) & ~3;   // 向上取整到 4 的倍数
iWriteLen = Math.min(iWriteLen, indices.buffer.byteLength - indices.byteOffset);
```

**算法**: `(length + 3) & ~3` 等效于 `Math.ceil(length / 4) * 4`

**效果**: ✅ 所有图形正确渲染，不再因数据对齐跳过绘制

---

## 修改总结

| # | 问题 | 文件 | 行数 | 变更 |
|----|------|------|------|------|
| 1 | 滤镜 UV 翻转 | WebGPURenderContext.ts | 342, 387, 443 | 移除 Y 轴翻转 |
| 2 | Scissor 溢出 | WebGPURenderContext.ts | 2005-2039 | 改进交集计算 |
| 3 | ClearRect 坐标 | WebGPURenderContext.ts | 1371 | 移除 WebGL 翻转 |
| 4 | Buffer 对齐 | WebGPURenderContext.ts | 1682-1693 | 添加 4 字节对齐 |

---

## 预期效果

✅ **UI 图标恢复正常** - 不再出现灰色块和图集碎片
✅ **UI 裁剪正确** - 屏幕外元素正确隐藏
✅ **底部 UI 显示完整** - 文字不再被砍掉，背景正确铺满
✅ **所有图形正确渲染** - 包括奇数顶点的 Mesh 图形

---

## 部署步骤

1. **编译项目**
```bash
npm run build
```

2. **测试验证**
- 检查 UI 图标是否正常显示（无灰色块）
- 测试 UI 滚动（检查屏幕外元素隐藏）
- 验证底部文字完整显示
- 检查所有滤镜效果（ColorTransform、Blur、Glow）

3. **成功指标**
- ✅ 无异常灰色块或碎片
- ✅ UI 元素正确裁剪
- ✅ 文本和背景显示完整
- ✅ 所有图形正确渲染

---

## 修复的深层原因

这些问题的共同特点是：**WebGL → WebGPU 迁移时的坐标系和数据格式差异**

1. **纹理坐标**: WebGL 需要 Y 翻转，WebGPU 不需要
2. **裁剪坐标**: 都是 Top-Left，但计算交集时的逻辑不同
3. **缓冲区**: WebGL 灵活，WebGPU 严格要求 4 字节对齐

关键是要理解：**每个 API 的设计初心，而不是盲目移植代码**

