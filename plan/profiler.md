Chrome DevTools Performance Profiler 操作指引：

**录制步骤**

1. `F12` → Performance 面板 → 点击录制
2. 执行目标操作（滚动 3 秒）→ 停止录制
3. 底部切换到 **Bottom-Up** 视图，按 **Self Time** 降序排列

**重点观察函数**

|函数名|出现说明|
|---|---|
|`validateDisplayList`|非虚拟滚动不应出现|
|`getPreferredBounds`|仍在走旧布局路径|
|`onPropertyChanged`|scrollbar 监听未断开|
|`scrollPositionChanged`|虚拟列表回收触发（正常）|
|`measure` / `validateSize`|有不必要的尺寸重计算|

**预期正常结果**：非虚拟滚动的 JS 热路径应只剩 `updateScrollRect`、`syncThumb` 和 egret 渲染层（`updateTransform`、`drawCalls`），Validator 链路消失。

拿到 Profiler 截图或函数耗时分布后，可以带来一起分析，精准定位下一个目标。