# EUI → ECS 架构全量重写方案

---

## 背景与动机

上一阶段的框架层增量优化（scrollDirect + syncThumb + swap-remove）已达到天花板：所有可做的优化已完成，剩余性能差距来自 EUI 架构本身两个不可绕过的结构性开销：

1. **Skin 作为独立 DisplayObjectContainer 层** — 每个 Component 多一层容器节点，组件树比 FairyGUI 深一级
2. **Validator 三队列失效-验证循环** — `while(!done)` 重入循环 + 三个 DepthQueue 管理开销

目标：将 EUI 重写为 **数据驱动 ECS 风格架构**，消除上述两项结构性开销，使热路径与 FairyGUI 的命令式布局路径等价。

> **注意**：JavaScript 运行时不受益于 C++ ECS 的 SIMD/缓存行对齐。本方案的 ECS 收益来自：消除 Validator 队列管理、消除 Skin 容器层、简化 dirty 传播路径。

---

## 核心架构对比

|概念|现有 EUI|新 ECS 架构|
|---|---|---|
|组件基类|`UIComponent` 接口 + mixin 注入|`UINode extends DisplayObjectContainer`|
|脏标记|三个独立 bool flag + 三个 DepthQueue|单 bitfield `dirty: number`|
|调度器|`Validator.doPhasedInstantiation` (`while(!done)`)|`World.flush()` 三趟有序遍历|
|皮肤层|`Skin extends DisplayObjectContainer`（额外容器）|`SkinTemplate`（纯数据，无容器）|
|状态机|`State/IOverride` 对象数组 + `commitCurrentState()`|`SkinTemplate.applyState(node, state)` 直接函数|
|布局策略|`LayoutBase extends EventDispatcher`（含状态）|纯函数 `LayoutStrategy`（无状态）|
|虚拟列表|`DataGroup` + `LinearLayoutBase.scrollPositionChanged`|`VirtualListNode` 内置，无 Validator 介入|

---

## 关键设计

### 1. UINode（实体基类）

替代现有 `UIComponent` 接口 + Component/Group 的 `$xxx` 枚举数组。

```typescript
// src/extension/eui/ecs/UINode.ts
export class UINode extends egret.DisplayObjectContainer {
    // ECS identity
    readonly nodeId: number = World.nextId();
    nestLevel: number = 0;
    $world: World = null;

    // Layout component（原散落在 UIComponent values + $Group 数组里）
    explicitWidth: number = NaN;
    explicitHeight: number = NaN;
    measuredWidth: number = 0;
    measuredHeight: number = 0;
    layoutWidth: number = 0;
    layoutHeight: number = 0;

    // Constraint component（原 UIComponent 的 left/right/top/bottom 等）
    left: number = NaN;  right: number = NaN;
    top: number = NaN;   bottom: number = NaN;
    horizontalCenter: number = NaN;
    verticalCenter: number = NaN;
    percentWidth: number = NaN;
    percentHeight: number = NaN;

    // Dirty bitfield（替代三队列）
    dirty: number = Dirty.NONE;

    // 生命周期钩子（子类覆盖）
    protected createChildren(): void {}
    protected commitProperties(): void {}
    protected measure(): void {}
    protected layout(): void {}

    // 标脏 API（子类/业务代码调用）
    invalidateProperties(): void { this.$world?.markDirty(this, Dirty.PROPERTIES); }
    invalidateSize(): void      { this.$world?.markDirty(this, Dirty.MEASURE); }
    invalidateDisplayList(): void { this.$world?.markDirty(this, Dirty.LAYOUT); }
}
```

### 2. World（调度器，替代 Validator）

```typescript
// src/extension/eui/ecs/World.ts
export class World {
    static readonly instance = new World();
    static nextId(): number { return ++World._idSeq; }
    private static _idSeq = 0;

    private propertiesDirty: UINode[] = [];
    private measureDirty: UINode[] = [];
    private layoutDirty: UINode[] = [];
    private tickActive = false;

    markDirty(node: UINode, flag: number): void {
        const wasClean = node.dirty === Dirty.NONE;
        node.dirty |= flag;
        if (flag & Dirty.PROPERTIES) this.propertiesDirty.push(node);
        if (flag & Dirty.MEASURE)    this.measureDirty.push(node);
        if (flag & Dirty.LAYOUT)     this.layoutDirty.push(node);
        if (wasClean && !this.tickActive) {
            this.tickActive = true;
            egret.startTick(this.onTick, this);
        }
    }

    private onTick(): boolean {
        this.flush();
        return true;
    }

    flush(): void {
        // 趟1：properties（浅→深，父先于子）
        sortAsc(this.propertiesDirty);
        for (const n of this.propertiesDirty) {
            if (n.$stage && (n.dirty & Dirty.PROPERTIES)) {
                n.dirty &= ~Dirty.PROPERTIES;
                n.commitProperties();
            }
        }
        this.propertiesDirty.length = 0;

        // 趟2：measure（深→浅，子先于父）
        sortDesc(this.measureDirty);
        for (const n of this.measureDirty) {
            if (n.$stage && (n.dirty & Dirty.MEASURE)) {
                n.dirty &= ~Dirty.MEASURE;
                n.measure();
            }
        }
        this.measureDirty.length = 0;

        // 趟3：layout（浅→深，父先于子）
        sortAsc(this.layoutDirty);
        for (const n of this.layoutDirty) {
            if (n.$stage && (n.dirty & Dirty.LAYOUT)) {
                n.dirty &= ~Dirty.LAYOUT;
                n.layout();
            }
        }
        this.layoutDirty.length = 0;

        if (this.propertiesDirty.length === 0 &&
            this.measureDirty.length === 0 &&
            this.layoutDirty.length === 0) {
            this.tickActive = false;
            egret.stopTick(this.onTick, this);
        }
    }
}
```

**对比 Validator 的改进**：去掉了 `while(!done)` 重入循环。三趟线性遍历之所以安全：`commitProperties` 可能产生新的 measure/layout dirty，但它们已被 push 进对应数组，在同帧的后续趟中处理。measure 不会产生新 properties dirty（单向依赖）。

### 3. SkinTemplate（替代 Skin 容器）

**当前问题**：`Component` 有一个 `Skin` 子节点（DisplayObjectContainer），每个 Button/List/Panel 的显示树多一层。

**新设计**：皮肤在运行时**无容器对象**，仅在创建时将皮肤子部件作为直接子项添加到组件自身。

```typescript
// src/extension/eui/skin/SkinTemplate.ts
export interface SkinPart {
    name: string;
    factory: () => egret.DisplayObject;
}

export interface SkinTemplate {
    parts: SkinPart[];
    states: string[];
    applyState(node: UINode, stateName: string): void; // 编译自 EXML 的直接函数
}

// 使用方（ButtonNode.createChildren 内）：
protected createChildren(): void {
    const tmpl = resolveSkin(this.skinName);
    for (const part of tmpl.parts) {
        const obj = part.factory();
        this.addChild(obj);
        (this as any)[part.name] = obj; // 绑定 skinPart 引用
    }
    this._skinTemplate = tmpl;
}
```

**显示树对比**：

```
旧: ButtonNode → Skin(容器) → [bg, labelDisplay, iconDisplay]
新: ButtonNode            → [bg, labelDisplay, iconDisplay]
```

消除了整个 Skin 层的 DisplayObjectContainer 开销（构建、命中测试、transform 传播）。

### 4. LayoutStrategy（替代 LayoutBase 继承链）

```typescript
// src/extension/eui/layouts/LayoutStrategy.ts
export interface LayoutStrategy {
    measure(container: ContainerNode): void;
    layout(container: ContainerNode): void;
    useVirtualLayout: boolean;
    // 虚拟布局专用
    getVisibleRange?(scrollV: number, height: number): [number, number];
}

// 实现为纯函数对象（无状态，无 EventDispatcher 开销）
export const VerticalLayout: LayoutStrategy = { ... };
export const HorizontalLayout: LayoutStrategy = { ... };
export const BasicLayout: LayoutStrategy = { ... };
export const TileLayout: LayoutStrategy = { ... };
```

---

## 文件结构

```
src/extension/eui/
├── ecs/
│   ├── Dirty.ts              # bitfield 常量
│   ├── World.ts              # 调度器（替代 Validator）
│   └── UINode.ts             # 实体基类（替代 UIComponent + Component + Group）
├── containers/
│   ├── ContainerNode.ts      # 带 layout 的容器（替代 Group）
│   ├── VirtualListNode.ts    # 虚拟列表（替代 DataGroup + LinearLayoutBase 虚拟逻辑）
│   └── RendererPool.ts       # renderer 复用池
├── layouts/
│   ├── LayoutStrategy.ts     # 接口
│   ├── VerticalLayout.ts
│   ├── HorizontalLayout.ts
│   ├── BasicLayout.ts
│   └── TileLayout.ts
├── skin/
│   ├── SkinTemplate.ts       # 皮肤数据接口（替代 Skin 类）
│   └── SkinSystem.ts         # 状态应用（替代 State/IOverride）
├── scroll/
│   ├── TouchScroll.ts        # 物理引擎（保留现有逻辑）
│   └── ScrollSystem.ts       # 滚动同步（保留 scrollDirect/syncThumb 模式）
├── widgets/
│   ├── Label.ts              # 直接包 egret.TextField，无 Skin 层
│   ├── Image.ts
│   ├── Button.ts
│   ├── List.ts               # 替代 ListBase + List + DataGroup
│   ├── Scroller.ts
│   ├── TextInput.ts
│   ├── Slider.ts             # 替代 SliderBase + HSlider + VSlider
│   ├── ScrollBar.ts          # 替代 ScrollBarBase + HScrollBar + VScrollBar
│   ├── ProgressBar.ts
│   ├── CheckBox.ts
│   ├── RadioButton.ts
│   ├── ToggleButton.ts
│   ├── ViewStack.ts
│   └── Panel.ts
├── collections/              # 保留（ArrayCollection、ICollection）
├── events/                   # 保留
├── binding/                  # 保留
└── exml/
    ├── EXMLParser.ts         # 保留解析逻辑
    └── CodeFactory.ts        # 重写：输出 SkinTemplate 而非 Skin 子类
```

**删除的文件**（被新架构替代）：

- `core/Validator.ts` → `ecs/World.ts`
- `core/UIComponent.ts` → `ecs/UINode.ts`
- `components/Component.ts` → `ecs/UINode.ts` (skinnable 部分)
- `components/Group.ts` → `containers/ContainerNode.ts`
- `components/DataGroup.ts` → `containers/VirtualListNode.ts`
- `components/Skin.ts` → `skin/SkinTemplate.ts`
- `components/supportClasses/ListBase.ts` → 合并进 `widgets/List.ts`
- `components/supportClasses/ScrollBarBase.ts` → 合并进 `widgets/ScrollBar.ts`
- `components/supportClasses/SliderBase.ts` → 合并进 `widgets/Slider.ts`
- `layouts/supportClasses/LayoutBase.ts` → `layouts/LayoutStrategy.ts`
- `layouts/supportClasses/LinearLayoutBase.ts` → `layouts/VerticalLayout.ts` + `HorizontalLayout.ts`
- `states/State.ts`, `states/AddItems.ts`, `states/SetProperty.ts`, `states/SetStateProperty.ts` → `skin/SkinSystem.ts`

---

## 实现阶段

### Phase 1：ECS 核心（不依赖其他任何阶段）

**文件**：`ecs/Dirty.ts`、`ecs/World.ts`、`ecs/UINode.ts`

- `Dirty` bitfield 常量
- `World` 调度器（替代 Validator）
- `UINode` 基类，含 nestLevel、dirty、标脏 API、生命周期钩子

### Phase 2：布局策略层

**文件**：`layouts/LayoutStrategy.ts`、`layouts/VerticalLayout.ts`、`layouts/HorizontalLayout.ts`、`layouts/BasicLayout.ts`、`layouts/TileLayout.ts`

- 纯策略对象，无继承，无 EventDispatcher
- `ContainerNode.ts`：容器节点，持有 layout 引用，`layout()` 委托给策略

### Phase 3：Skin 消除

**文件**：`skin/SkinTemplate.ts`、`skin/SkinSystem.ts`、`exml/CodeFactory.ts`（重写）

- `SkinTemplate` 接口 + EXML 编译器输出新格式
- `SkinSystem` 处理状态切换（直接函数调用，无 IOverride 遍历）

### Phase 4：滚动系统

**文件**：`scroll/TouchScroll.ts`（保留）、`scroll/ScrollSystem.ts`

- 保留现有 `scrollDirect`/`syncThumb` 逻辑
- `ContainerNode` 实现 `IViewport` 接口

### Phase 5：虚拟列表

**文件**：`containers/VirtualListNode.ts`、`containers/RendererPool.ts`

- 内置虚拟布局逻辑，滚动时直接同步执行（不进 World 队列）
- renderer 池化复用

### Phase 6：Widget 层

**文件**：`widgets/` 下所有组件

- 每个 widget 继承 `UINode`，调用 `SkinTemplate.init(this)` 直接展开皮肤部件
- 无 Skin 容器层

### Phase 7：EXML 集成验证

- `CodeFactory` 输出 `SkinTemplate` 格式
- 端到端编译并运行一个包含 Button + List + Scroller 的场景

---

## 性能预期

|场景|来源|预期收益|
|---|---|---|
|所有组件初始化|消除 Skin 容器分配|每个 Component 少 1 个 DisplayObjectContainer 构造|
|静态 UI 帧（无脏标记）|World 无 tick|与现在相同（已优化）|
|非虚拟滚动|scrollDirect 保留|与现在相同|
|虚拟列表滚动|Validator 队列消除|减少排序和队列管理开销；renderer 回收仍是必要开销|
|状态切换（按钮/回收）|直接函数替代 IOverride 遍历|减少对象分配，调用更直接|
|命中测试 / transform 传播|树深度 -1 层|egret 底层遍历少一层|

---

## 验证方法

1. **编译验证**：`./tools/bin/egret make`，无编译错误
2. **场景验证**（按顺序）：
    - Button 点击 → 状态切换正常
    - Group + VerticalLayout 静态布局正常
    - Scroller + Group 非虚拟滚动正常（scrollDirect 路径）
    - List + useVirtualLayout=true 虚拟滚动正常
3. **Profiler 对比**：Chrome DevTools Performance，对比重构前后 `flush()` 和 `validateDisplayList` 的 Self Time

---

## 旧分析（已归档）

以下为上一阶段的增量优化分析，保留供参考：

---

## 逐项评估

### ★★★★ Skin 状态机

**代码现状**（`states/State.ts`，`StateClient`）：

- `currentState` setter → 立即同步调用 `commitCurrentState()`
- `commitCurrentState()` 遍历旧状态 overrides 数组 `.remove()`，再遍历新状态 `.apply()`
- `SetProperty.apply` 直接赋值 `obj[name] = value`，触发目标对象的 setter（可能级联 `invalidateDisplayList`）
- **`stateIsDirty` 标志已声明但从未使用**（dead code）

**是否是每帧热路径？** 状态切换发生在触摸事件（按下/抬起/hover），不是连续每帧。对纯滚动性能无直接影响。

但有一个间接影响：虚拟列表滚动时，Item Renderer 被回收并重新赋值 `data`，可能触发业务代码 调用 `currentState` 改变状态，每个回收的 renderer 触发一次 `commitCurrentState()`，同帧可能有多个。

**优化方案**：利用已有的 `stateIsDirty` 标志，将状态应用推迟到 `commitProperties` 阶段：

```typescript
// currentState setter 改为：
values.stateIsDirty = true;
this.invalidateProperties();  // 进队 Validator，不立即执行

// commitProperties 内：
if (values.stateIsDirty) {
    values.stateIsDirty = false;
    commitCurrentState();
}
```

效果：同帧多次 `currentState` 变更合并为一次 override 遍历。

**结论**：★★★ 值得做，但仅对交互密集型 UI（按钮组、ItemRenderer 频繁回收）有感知提升，对纯滚动帧率影响很小。

---

### ★★★ PropertyEvent 派发频率

**代码现状**（grep 结果）：

- `scrollH/scrollV`：已通过 scrollDirect 绕过 ✅
- `contentWidth/contentHeight`（Group.ts:254/257）：在布局完成后派发，非每帧
- `data`（ItemRenderer.ts:107）：每次 renderer 回收时派发一次，非连续
- 其余所有 dispatch：用户交互触发（选中变化、文字变化等）

**结论**：✅ 已是最优状态。剩余 dispatch 均为事件驱动，非每帧热路径。无需进一步处理。

---

### ★★★★★ Layout 三阶段验证循环（虚拟列表场景遗留）

**代码现状**：

- 非虚拟布局：`scrollDirect` 完全绕过 Validator ✅ Validator 滚动期间空闲
- 虚拟布局（DataGroup + useVirtualLayout=true）：`scrollDirect` 调用 `layout.scrollPositionChanged()`， `LinearLayoutBase.scrollPositionChanged()` 调用 `this.$target.invalidateDisplayList()`， 导致 DataGroup 每帧仍入队 Validator → 走完整 `updateDisplayList`（回收/创建 renderer）

这是**必要开销**：虚拟布局必须在每帧重新计算哪些 renderer 可见。

**可能的优化**：在 `scrollDirect` 中对虚拟布局直接调用同步布局，绕过 Validator 的异步队列：

```typescript
// scrollDirect 内，虚拟布局分支替换为：
if (this.$layout && this.$layout.useVirtualLayout) {
    this.$layout.scrollPositionChanged();
    // 直接同步执行，不等下一 tick
    this.validateDisplayList();  // 代替进队等待
}
```

**风险**：`validateDisplayList` 是 `UIComponent` 的公开方法，直接调用会跳过 Validator 的 `validateClient` 嵌套保护和 `$nestLevel` 排序，可能破坏多层嵌套场景下的布局顺序。

**结论**：★★ 谨慎。这个优化把"异步下帧执行"改成"同帧同步执行"，减少 1 帧延迟， 但正确性风险较高。建议先通过 Profiler 确认虚拟布局 Validator 是否真是瓶颈再做。

---

### ★★ GC 压力（对象分配）

**代码现状**：

- `DepthBin`：swap-remove 已完成 ✅；bins 按深度创建一次后持久复用，无 GC 压力
- `PropertyEvent`：使用 egret 事件池，复用对象，GC 压力可接受
- `DepthQueue.depthBins`：对象字面量持久存活，无 GC 问题

**结论**：✅ 已是较优状态。

---

## 优先级总结

|项目|影响范围|影响场景|推荐行动|
|---|---|---|---|
|状态机 stateIsDirty 延迟化|★★★|交互密集型 UI、ItemRenderer 回收|可做，风险低|
|虚拟布局同帧 validateDisplayList|★★|虚拟长列表滚动帧率|谨慎，先 Profiler 验证|
|PropertyEvent 剩余 dispatch|✅ 已优化|—|无需处理|
|DepthBin/GC|✅ 已优化|—|无需处理|

---

## 核心结论

**上一阶段滚动路径重构是正确且最高优先级的改动**。

从 Profiler 角度看：

- 非虚拟滚动：Validator tick 已完全空闲，与 FairyGUI 的直接 scrollRect 路径等价
- 虚拟滚动：仍有 Validator 调用，但这是 renderer 回收的必要代价，FairyGUI 同样有此开销

下一步**性价比最高**的改动是 **Skin 状态机延迟化**（stateIsDirty 接入 commitProperties 流程）， 实现简单（20 行内），对按钮交互和列表回收场景均有正向收益，且无兼容风险。

---

## 状态机分析更正

经代码验证，状态机延迟化**早已实现**：

- `Component.currentState` setter → `invalidateState()` → `ComponentKeys.stateIsDirty = true` → `invalidateProperties()`
- `Component.commitProperties()` 检查 `stateIsDirty` → `skin.currentState = this.currentState`（一帧一次）
- `StateValues.stateIsDirty`（State.ts 里的）是 dead code，可清理但无性能意义

## 下一步：先 Profiler 定位实际瓶颈

框架层明显热路径已完成。在做更多优化前，先用 Chrome DevTools Performance 实测。

### Profiler 操作步骤

1. 打开 Chrome DevTools → Performance 面板
2. 开始录制，执行以下场景各 3 秒：
    - **非虚拟列表滚动**：拖动普通 Scroller
    - **虚拟列表滚动**：拖动带 DataGroup+VerticalLayout(useVirtualLayout=true) 的列表
    - **惯性动画**：快速甩动后放手，录制动画完成过程
3. 停止录制，在 Bottom-Up 视图按 Self Time 降序排列
4. 关注以下函数是否仍出现在热路径：
    - `validateDisplayList` / `validateProperties` / `validateSize`（Validator 工作）
    - `getPreferredBounds` / `measure`（布局测量）
    - `PropertyEvent` / `dispatchEventWith`（事件派发）
    - `scrollPositionChanged`（虚拟布局回收触发）

### 预期结果（优化后）

- 非虚拟滚动：Validator 相关函数不应出现在热路径（已绕过）
- 虚拟滚动：`validateDisplayList` 会出现（正常，renderer 回收必要开销）
- 热路径应主要是 egret 渲染层（`drawCalls`、`updateTransform` 等）

### 如果发现意外热路径

- 如果 `validateDisplayList` 在非虚拟场景仍出现 → 有遗漏的 `invalidateDisplayList` 调用
- 如果 `measure` 大量出现 → 某处触发了不必要的 `invalidateSize`
- 如果业务代码函数出现 → 优化方向转向业务层