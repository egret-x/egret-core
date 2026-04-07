基于对两个框架架构的了解，性能差距主要来自以下几个方面：

---

## 1. Layout 验证机制（最主要）

**EUI**：Flex 风格三阶段失效-验证循环

```
invalidateProperties → invalidateSize → invalidateDisplayList
       ↓                    ↓                   ↓
validateProperties →  validateSize  →  validateDisplayList
```

每帧所有失效组件都要过一遍这三个队列，存在队列管理和多次 measure 开销。

**FairyGUI**：不走框架级验证队列，布局由父容器直接驱动，更接近"命令式"而非"响应式"。

---

## 2. Skin 皮肤系统

**EUI**：逻辑与皮肤分离，每个 Component 维护一套状态机 + Skin 对象，部件解析、皮肤切换、状态变更都有额外开销，组件树层级更深。

**FairyGUI**：组件和显示直接绑定，无皮肤状态机层。

---

## 3. 数据绑定 & PropertyEvent

**EUI**：大量使用 `PropertyEvent.dispatchPropertyEvent()`，scrollH/scrollV 每次变化都要派发事件，监听链路长。

**FairyGUI**：绑定更轻量，滚动位置直接写 scrollRect，不走事件系统。

---

## 4. 对象分配 & 池化

**EUI**：组件创建时有较多中间对象（Skin、State、DepthBin、DepthQueue 等），GC 压力更大。

**FairyGUI**：内置 renderer 池、组件池，复用更激进。

---

## 5. 预编译资产

**FairyGUI**：编辑器导出二进制包，运行时直接反序列化，无 EXML/JSON 解析开销。

**EUI**：皮肤解析在运行时进行。

---

## 优先级排序

|影响程度|原因|
|---|---|
|★★★★★|Layout 三阶段验证循环|
|★★★★|Skin 状态机 + 组件树层级|
|★★★|PropertyEvent 派发频率|
|★★|GC 压力（对象分配）|
|★|资产加载解析|

---

我们这次做的优化（`scrollDisableLayout` + 虚拟列表修复）正好针对的是最主要的 Layout 验证循环，方向是对的。如果要进一步缩小差距，Skin 状态机和 PropertyEvent 的频率是下一个值得优化的方向。



## 框架层优化进度

对照 `eui.md` 计划，**所有可做的框架层优化已完成**：

|项目|结论|
|---|---|
|★★★★★ Layout 验证循环|✅ scrollDirect + syncThumb|
|★★★★ Skin 状态机|✅ 已在 commitProperties 懒化|
|★★★★ 组件树层级（Skin 层）|⚠️ 架构债，无法在不破坏 API 的前提下消除|
|★★★ PropertyEvent|✅ 滚动路径已绕过|
|★★ GC / DepthBin|✅ swap-remove|