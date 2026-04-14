//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// //////////////////////////////////////////////////////////////////////////////////////

namespace eui {

    //==========================================================================
    // ECS Dirty Flags (bitfield for efficient dirty tracking)
    //==========================================================================

    /**
     * @language en_US
     * ECS-style dirty flags for efficient component state tracking.
     * Combines multiple dirty states into a single bitfield.
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ECS风格的脏标记，用于高效的组件状态跟踪。
     * 将多个脏状态组合成单个位域。
     * @version eui 1.0
     * @platform Web,Native
     */
    export const ECS_DIRTY_NONE: number = 0;
    export const ECS_DIRTY_PROPERTIES: number = 1;
    export const ECS_DIRTY_MEASURE: number = 2;
    export const ECS_DIRTY_LAYOUT: number = 4;

    //==========================================================================
    // ECS Node - Base class for ECS-style components
    //==========================================================================

    /**
     * @language en_US
     * ECSNode is the base class for ECS-style EUI components.
     * It extends DisplayObjectContainer and provides lifecycle hooks for
     * properties committing, measuring, and layout.
     * 
     * Key differences from Component:
     * - No Skin container layer (reduced display tree depth)
     * - World scheduler instead of Validator (simpler dirty management)
     * - Direct function calls instead of IOverride iteration
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ECSNode 是 ECS 风格 EUI 组件的基类。
     * 它继承自 DisplayObjectContainer，提供属性提交、测量和布局的生命周期钩子。
     * 
     * 与 Component 的主要区别：
     * - 无 Skin 容器层（减少显示树深度）
     * - World 调度器替代 Validator（更简单的脏管理）
     * - 直接函数调用替代 IOverride 遍历
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    export class ECSNode extends egret.DisplayObjectContainer {

        //======================================================================
        // ECS Identity
        //======================================================================

        /**
         * Unique node ID assigned by ECSWorld
         */
        public readonly ecsNodeId: number;

        /**
         * Reference to the ECSWorld this node belongs to
         */
        public $ecsWorld: ECSWorld = null;

        /**
         * Nest level in the display tree (used for traversal order)
         */
        public nestLevel: number = 0;

        //======================================================================
        // Layout Properties
        //======================================================================

        /** Explicit width set by user */
        public explicitWidth: number = NaN;

        /** Explicit height set by user */
        public explicitHeight: number = NaN;

        /** Measured width from layout */
        public measuredWidth: number = 0;

        /** Measured height from layout */
        public measuredHeight: number = 0;

        /** Layout width (after constraints applied) */
        public layoutWidth: number = 0;

        /** Layout height (after constraints applied) */
        public layoutHeight: number = 0;

        //======================================================================
        // Constraint Properties
        //======================================================================

        public left: number = NaN;
        public right: number = NaN;
        public top: number = NaN;
        public bottom: number = NaN;
        public horizontalCenter: number = NaN;
        public verticalCenter: number = NaN;
        public percentWidth: number = NaN;
        public percentHeight: number = NaN;

        //======================================================================
        // Dirty Flag
        //======================================================================

        /**
         * Dirty bitfield - combines ECS_DIRTY_PROPERTIES, ECS_DIRTY_MEASURE, ECS_DIRTY_LAYOUT
         */
        public ecsDirty: number = ECS_DIRTY_NONE;

        //======================================================================
        // Constructor
        //======================================================================

        public constructor() {
            super();
            this.ecsNodeId = ECSWorld.nextId();
        }

        //======================================================================
        // Lifecycle Hooks (to be overridden by subclasses)
        //======================================================================

        /**
         * Called when children should be created. Equivalent to createChildren().
         * @internal
         */
        $createChildren(): void {
            // Override in subclass
        }

        /**
         * Called when properties should be committed.
         * This is where state changes, binding updates, etc. happen.
         * @internal
         */
        $commitProperties(): void {
            // Override in subclass
        }

        /**
         * Called when measurement should be performed.
         * Should set measuredWidth and measuredHeight.
         * @internal
         */
        $measure(): void {
            // Override in subclass
        }

        /**
         * Called when layout should be performed.
         * Should position and size children based on layout rules.
         * @internal
         */
        $doLayout(): void {
            // Override in subclass
        }

        //======================================================================
        // Invalidation API (called by subclasses or user code)
        //======================================================================

        /**
         * Mark properties as dirty, requiring $commitProperties() in next flush.
         */
        public invalidateProperties(): void {
            if (this.$ecsWorld) {
                this.$ecsWorld.markDirty(this, ECS_DIRTY_PROPERTIES);
            }
        }

        /**
         * Mark size as dirty, requiring $measure() in next flush.
         */
        public invalidateSize(): void {
            if (this.$ecsWorld) {
                this.$ecsWorld.markDirty(this, ECS_DIRTY_MEASURE);
            }
        }

        /**
         * Mark display list as dirty, requiring $doLayout() in next flush.
         */
        public invalidateDisplayList(): void {
            if (this.$ecsWorld) {
                this.$ecsWorld.markDirty(this, ECS_DIRTY_LAYOUT);
            }
        }

        /**
         * Immediately validate and flush all dirty states.
         * Use with caution - bypasses the normal frame batching.
         */
        public validateNow(): void {
            if (this.$ecsWorld) {
                this.$ecsWorld.validateNode(this);
            }
        }

        //======================================================================
        // Helper Methods
        //======================================================================

        /**
         * Check if this node has any dirty flags set.
         */
        public isDirty(): boolean {
            return this.ecsDirty !== ECS_DIRTY_NONE;
        }

        /**
         * Clear all dirty flags.
         */
        public clearDirty(): void {
            this.ecsDirty = ECS_DIRTY_NONE;
        }

        /**
         * Register this node with an ECSWorld.
         * @internal
         */
        public $register(world: ECSWorld): void {
            this.$ecsWorld = world;
            this.updateNestLevel();
        }

        /**
         * Unregister this node from its ECSWorld.
         * @internal
         */
        public $unregister(): void {
            this.$ecsWorld = null;
        }

        /**
         * Update nest level based on parent's level.
         * @internal
         */
        public $onParentChanged(): void {
            this.updateNestLevel();
        }

        /**
         * Update nest level recursively.
         */
        private updateNestLevel(): void {
            let parent = this.$parent;
            if (parent && parent instanceof ECSNode) {
                this.nestLevel = parent.nestLevel + 1;
            } else {
                this.nestLevel = 1;
            }

            // Update children recursively
            let children = this.$children;
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    let child = children[i];
                    if (child instanceof ECSNode) {
                        child.updateNestLevel();
                    }
                }
            }
        }

        /**
         * Dispose this node and all its children.
         */
        public dispose(): void {
            // Unregister from world
            if (this.$ecsWorld) {
                this.$unregister();
            }

            // Dispose children
            let children = this.$children;
            if (children) {
                for (let i = children.length - 1; i >= 0; i--) {
                    let child = children[i];
                    if (child instanceof ECSNode) {
                        child.dispose();
                    } else if ('dispose' in child && typeof (child as any).dispose === 'function') {
                        (child as any).dispose();
                    }
                }
            }

            // Remove from parent
            if (this.$parent) {
                this.$parent.removeChild(this);
            }
        }
    }

    //==========================================================================
    // ECS Container Node - Container with layout support
    //==========================================================================

    /**
     * @language en_US
     * ECSContainer is an ECSNode with layout support.
     * It holds an ECSLayoutStrategy reference and delegates measurement/layout to it.
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ECSContainer 是支持布局的 ECSNode。
     * 它持有 ECSLayoutStrategy 引用，并将测量/布局委托给它。
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    export class ECSContainer extends ECSNode {

        //======================================================================
        // Layout Component
        //======================================================================

        /** The layout strategy used by this container */
        public layout: ECSLayoutStrategy = null;

        /** Whether layout should be automatically updated */
        public autoLayout: boolean = true;

        //======================================================================
        // Content Size (IViewport)
        //======================================================================

        private _contentWidth: number = 0;
        private _contentHeight: number = 0;

        /** Horizontal scroll position */
        private _scrollH: number = 0;

        /** Vertical scroll position */
        private _scrollV: number = 0;

        /** Whether scroll is enabled */
        private _scrollEnabled: boolean = false;

        //======================================================================
        // Cached ScrollRect for Performance
        //======================================================================

        private _scrollRect: egret.Rectangle = null;

        //======================================================================
        // Scroll begin/end for layout pause during scrolling
        //======================================================================

        private _isScrolling: boolean = false;

        //======================================================================
        // Lifecycle - Override
        //======================================================================

        $measure(): void {
            if (this.layout) {
                this.layout.measure(this);
            } else {
                // Default: use explicit or measured size
                this.measuredWidth = isNaN(this.explicitWidth) ? this.$getWidth() : this.explicitWidth;
                this.measuredHeight = isNaN(this.explicitHeight) ? this.$getHeight() : this.explicitHeight;
            }
        }

        $doLayout(): void {
            if (!this.layout) return;

            const width = isNaN(this.explicitWidth) ? this.$getWidth() : this.explicitWidth;
            const height = isNaN(this.explicitHeight) ? this.$getHeight() : this.explicitHeight;

            this.layout.layout(this, width, height);

            // Update scrollRect if needed
            this.updateScrollRect();

            // Invalidate parent size if content size changed
            if (this.autoLayout) {
                const newContentWidth = this.calculateContentWidth();
                const newContentHeight = this.calculateContentHeight();

                if (newContentWidth !== this._contentWidth || newContentHeight !== this._contentHeight) {
                    this._contentWidth = newContentWidth;
                    this._contentHeight = newContentHeight;
                    this.invalidateSize();
                }
            }
        }

        //======================================================================
        // Layout API
        //======================================================================

        /**
         * Set the layout strategy.
         */
        public setLayout(strategy: ECSLayoutStrategy): void {
            if (this.layout === strategy) return;

            this.layout = strategy;

            if (strategy) {
                // Register for virtual layout if needed
                if (strategy.useVirtualLayout) {
                    this.setupVirtualLayout();
                }
            }

            this.invalidateSize();
            this.invalidateDisplayList();
        }

        /**
         * Set element at index to visible/invisible for virtual layout.
         */
        public setElementVisible(index: number, visible: boolean): void {
            const child = this.$children[index];
            if (child) {
                child.visible = visible;
            }
        }

        /**
         * Get visible range for virtual layout.
         */
        public getVisibleRange(): [number, number] {
            if (this.layout && this.layout.getVisibleRange) {
                return this.layout.getVisibleRange(this._scrollV, this.$getHeight());
            }
            return [0, this.$children ? this.$children.length - 1 : 0];
        }

        /**
         * Setup virtual layout support.
         */
        private setupVirtualLayout(): void {
            // Virtual layout will be implemented in ECSVirtualList
            // This is a placeholder for common setup
        }

        //======================================================================
        // Scroll begin/end for layout pause
        //======================================================================

        /**
         * Called when scroll begins - pause layout validation
         */
        public setScrollBegin(): void {
            this._isScrolling = true;
        }

        /**
         * Called when scroll ends - resume layout validation
         */
        public setScrollEnd(): void {
            this._isScrolling = false;
            this.invalidateDisplayList();
        }

        /**
         * Check if currently scrolling
         */
        public get isScrolling(): boolean {
            return this._isScrolling;
        }

        //======================================================================
        // Scroll API (IViewport compatible)
        //======================================================================

        public get scrollH(): number {
            return this._scrollH;
        }

        public set scrollH(value: number) {
            value = Math.max(0, value);
            if (value !== this._scrollH) {
                this._scrollH = value;
                this.updateScrollRect();
                this.invalidateDisplayList();
            }
        }

        public get scrollV(): number {
            return this._scrollV;
        }

        public set scrollV(value: number) {
            value = Math.max(0, value);
            if (value !== this._scrollV) {
                this._scrollV = value;
                this.updateScrollRect();
                this.invalidateDisplayList();
            }
        }

        public get scrollEnabled(): boolean {
            return this._scrollEnabled;
        }

        public set scrollEnabled(value: boolean) {
            if (value !== this._scrollEnabled) {
                this._scrollEnabled = value;
                this.updateScrollRect();
            }
        }

        public get contentWidth(): number {
            return this._contentWidth;
        }

        public set contentWidth(value: number) {
            if (value !== this._contentWidth) {
                this._contentWidth = value;
            }
        }

        public get contentHeight(): number {
            return this._contentHeight;
        }

        public set contentHeight(value: number) {
            if (value !== this._contentHeight) {
                this._contentHeight = value;
            }
        }

        //======================================================================
        // ScrollRect Optimization
        //======================================================================

        private updateScrollRect(): void {
            if (this._scrollEnabled) {
                if (!this._scrollRect) {
                    this._scrollRect = new egret.Rectangle();
                }
                this._scrollRect.x = this._scrollH;
                this._scrollRect.y = this._scrollV;
                this._scrollRect.width = isNaN(this.explicitWidth) ? this.$getWidth() : this.explicitWidth;
                this._scrollRect.height = isNaN(this.explicitHeight) ? this.$getHeight() : this.explicitHeight;
                this.scrollRect = this._scrollRect;
            } else if (this.scrollRect) {
                this.scrollRect = null;
            }
        }

        //======================================================================
        // Helper Methods
        //======================================================================

        /**
         * Calculate total content width based on children.
         */
        private calculateContentWidth(): number {
            let maxWidth = 0;
            const children = this.$children;
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child.visible) {
                        maxWidth = Math.max(maxWidth, child.x + child.width);
                    }
                }
            }
            return maxWidth;
        }

        /**
         * Calculate total content height based on children.
         */
        private calculateContentHeight(): number {
            let maxHeight = 0;
            const children = this.$children;
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (child.visible) {
                        maxHeight = Math.max(maxHeight, child.y + child.height);
                    }
                }
            }
            return maxHeight;
        }

        /**
         * Get element at specific index.
         */
        public getElementAt(index: number): egret.DisplayObject {
            return this.$children ? this.$children[index] : null;
        }

        /**
         * Get number of elements.
         */
        public get numElements(): number {
            return this.$children ? this.$children.length : 0;
        }

        /**
         * Dispose this container and its children.
         */
        public dispose(): void {
            // Dispose children first
            let children = this.$children;
            if (children) {
                for (let i = children.length - 1; i >= 0; i--) {
                    let child = children[i];
                    if (child instanceof ECSContainer) {
                        child.dispose();
                    } else if ('dispose' in child && typeof (child as any).dispose === 'function') {
                        (child as any).dispose();
                    }
                }
            }

            // Clear layout
            this.layout = null;

            // Call super dispose
            super.dispose();
        }
    }

    //==========================================================================
    // ECS Layout Strategy - Interface for layout algorithms
    //==========================================================================

    /**
     * @language en_US
     * ECSLayoutStrategy defines the interface for ECS-style layout algorithms.
     * Unlike the old LayoutBase which extends EventDispatcher and holds state,
     * ECSLayoutStrategy is a pure function object with no state and no events.
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ECSLayoutStrategy 定义了 ECS 风格布局算法的接口。
     * 与旧的继承 EventDispatcher 并持有状态的 LayoutBase 不同，
     * ECSLayoutStrategy 是无状态、无事件的纯函数对象。
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    export interface ECSLayoutStrategy {

        //======================================================================
        // Properties
        //======================================================================

        /**
         * Whether virtual layout is enabled.
         * Virtual layout only works with ECSContainer that has virtual list support.
         */
        useVirtualLayout: boolean;

        /**
         * The horizontal alignment of layout elements.
         * Valid values: "left", "center", "right", "justify"
         */
        horizontalAlign: string;

        /**
         * The gap between elements in pixels.
         */
        gap: number;

        /**
         * Padding on the left in pixels.
         */
        paddingLeft: number;

        /**
         * Padding on the right in pixels.
         */
        paddingRight: number;

        /**
         * The vertical alignment of layout elements.
         * Valid values: "top", "middle", "bottom", "justify"
         */
        verticalAlign: string;

        /**
         * Padding on the top in pixels.
         */
        paddingTop: number;

        /**
         * Padding on the bottom in pixels.
         */
        paddingBottom: number;

        /**
         * Typical item width (for virtual layout calculation).
         */
        typicalWidth: number;

        /**
         * Typical item height (for virtual layout calculation).
         */
        typicalHeight: number;

        //======================================================================
        // Methods
        //======================================================================

        /**
         * Measure the container and calculate its preferred size.
         * @param container The container to measure
         */
        measure(container: ECSContainer): void;

        /**
         * Layout the container's children.
         * @param container The container to layout
         * @param width The available width
         * @param height The available height
         */
        layout(container: ECSContainer, width: number, height: number): void;

        /**
         * Get the visible range for virtual layout.
         * @param scrollV The vertical scroll position
         * @param height The viewport height
         * @returns [startIndex, endIndex] of visible items
         */
        getVisibleRange?(scrollV: number, height: number): [number, number];
    }

    //==========================================================================
    // ECS Layout Constants
    //==========================================================================

    export const ECS_HORIZONTAL_ALIGN_LEFT = "left";
    export const ECS_HORIZONTAL_ALIGN_CENTER = "center";
    export const ECS_HORIZONTAL_ALIGN_RIGHT = "right";
    export const ECS_HORIZONTAL_ALIGN_JUSTIFY = "justify";

    export const ECS_VERTICAL_ALIGN_TOP = "top";
    export const ECS_VERTICAL_ALIGN_MIDDLE = "middle";
    export const ECS_VERTICAL_ALIGN_BOTTOM = "bottom";
    export const ECS_VERTICAL_ALIGN_JUSTIFY = "justify";

    //==========================================================================
    // ECS World - Scheduler replacing Validator
    //==========================================================================

    /**
     * @language en_US
     * ECSWorld is the scheduler that replaces Validator.
     * It manages dirty nodes and flushes them in three ordered passes:
     * 1. Properties (parent before child, shallow to deep)
     * 2. Measure (child before parent, deep to shallow)
     * 3. Layout (parent before child, shallow to deep)
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ECSWorld 是替代 Validator 的调度器。
     * 它管理脏节点并在三趟有序遍历中刷新：
     * 1. 属性提交（父先于子，浅到深）
     * 2. 测量（子先于父，深到浅）
     * 3. 布局（父先于子，浅到深）
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    export class ECSWorld {

        //======================================================================
        // Singleton
        //======================================================================

        /**
         * Global singleton instance
         */
        public static readonly instance: ECSWorld = new ECSWorld();

        /**
         * Generate next unique node ID
         */
        public static nextId(): number {
            return ++ECSWorld._idSeq;
        }

        private static _idSeq: number = 0;

        //======================================================================
        // Private State
        //======================================================================

        /** Nodes with dirty properties */
        private propertiesDirty: ECSNode[] = [];

        /** Nodes with dirty measure */
        private measureDirty: ECSNode[] = [];

        /** Nodes with dirty layout */
        private layoutDirty: ECSNode[] = [];

        /** Whether tick is currently active */
        private tickActive: boolean = false;

        /** Frame callback bound to this context */
        private tickCallback: (timeStamp: number) => boolean;

        //======================================================================
        // Constructor
        //======================================================================

        public constructor() {
            this.tickCallback = this.onTick.bind(this);
        }

        //======================================================================
        // Public API
        //======================================================================

        /**
         * Mark a node as dirty with specified flags.
         * @param node The node to mark dirty
         * @param flag Dirty flags (can be combined with bitwise OR)
         */
        public markDirty(node: ECSNode, flag: number): void {
            const wasClean = node.ecsDirty === ECS_DIRTY_NONE;
            node.ecsDirty |= flag;

            // Push to appropriate queues
            if (flag & ECS_DIRTY_PROPERTIES) {
                this.propertiesDirty.push(node);
            }
            if (flag & ECS_DIRTY_MEASURE) {
                this.measureDirty.push(node);
            }
            if (flag & ECS_DIRTY_LAYOUT) {
                this.layoutDirty.push(node);
            }

            // Start tick if needed
            if (wasClean && !this.tickActive) {
                this.tickActive = true;
                egret.startTick(this.tickCallback, this);
            }
        }

        /**
         * Validate a single node immediately, bypassing the queue.
         * @param node The node to validate
         */
        public validateNode(node: ECSNode): void {
            // Pass 1: Properties
            if (node.ecsDirty & ECS_DIRTY_PROPERTIES) {
                node.ecsDirty &= ~ECS_DIRTY_PROPERTIES;
                node.$commitProperties();
            }

            // Pass 2: Measure
            if (node.ecsDirty & ECS_DIRTY_MEASURE) {
                node.ecsDirty &= ~ECS_DIRTY_MEASURE;
                node.$measure();
            }

            // Pass 3: Layout
            if (node.ecsDirty & ECS_DIRTY_LAYOUT) {
                node.ecsDirty &= ~ECS_DIRTY_LAYOUT;
                node.$doLayout();
            }
        }

        /**
         * Manually flush all dirty nodes. Usually called by tick.
         * @returns Whether any work was done
         */
        public flush(): boolean {
            let didWork = false;

            // Pass 1: Properties (shallow to deep - sort by nestLevel ascending)
            if (this.propertiesDirty.length > 0) {
                this.sortAscending(this.propertiesDirty);
                const nodes = this.propertiesDirty;
                let i = 0;
                const len = nodes.length;
                while (i < len) {
                    const n = nodes[i];
                    nodes[i++] = null!; // Help GC
                    if (n.$stage && (n.ecsDirty & ECS_DIRTY_PROPERTIES)) {
                        n.ecsDirty &= ~ECS_DIRTY_PROPERTIES;
                        n.$commitProperties();
                        didWork = true;
                    }
                }
                nodes.length = 0;
            }

            // Pass 2: Measure (deep to shallow - sort by nestLevel descending)
            if (this.measureDirty.length > 0) {
                this.sortDescending(this.measureDirty);
                const nodes = this.measureDirty;
                let i = 0;
                const len = nodes.length;
                while (i < len) {
                    const n = nodes[i];
                    nodes[i++] = null!;
                    if (n.$stage && (n.ecsDirty & ECS_DIRTY_MEASURE)) {
                        n.ecsDirty &= ~ECS_DIRTY_MEASURE;
                        n.$measure();
                        didWork = true;
                    }
                }
                nodes.length = 0;
            }

            // Pass 3: Layout (shallow to deep - sort by nestLevel ascending)
            if (this.layoutDirty.length > 0) {
                this.sortAscending(this.layoutDirty);
                const nodes = this.layoutDirty;
                let i = 0;
                const len = nodes.length;
                while (i < len) {
                    const n = nodes[i];
                    nodes[i++] = null!;
                    if (n.$stage && (n.ecsDirty & ECS_DIRTY_LAYOUT)) {
                        n.ecsDirty &= ~ECS_DIRTY_LAYOUT;
                        n.$doLayout();
                        didWork = true;
                    }
                }
                nodes.length = 0;
            }

            // Stop tick if no more work
            if (this.propertiesDirty.length === 0 &&
                this.measureDirty.length === 0 &&
                this.layoutDirty.length === 0) {
                if (this.tickActive) {
                    this.tickActive = false;
                    egret.stopTick(this.tickCallback, this);
                }
            }

            return didWork;
        }

        /**
         * Check if there are any dirty nodes.
         */
        public isDirty(): boolean {
            return this.propertiesDirty.length > 0 ||
                this.measureDirty.length > 0 ||
                this.layoutDirty.length > 0;
        }

        /**
         * Get count of dirty nodes (for debugging).
         */
        public getDirtyCount(): number {
            return this.propertiesDirty.length +
                this.measureDirty.length +
                this.layoutDirty.length;
        }

        /**
         * Clear all dirty queues (for debugging/testing).
         */
        public clear(): void {
            this.propertiesDirty.length = 0;
            this.measureDirty.length = 0;
            this.layoutDirty.length = 0;
            if (this.tickActive) {
                this.tickActive = false;
                egret.stopTick(this.tickCallback, this);
            }
        }

        //======================================================================
        // Private Methods
        //======================================================================

        /**
         * Frame tick callback
         */
        private onTick(timeStamp: number): boolean {
            this.flush();
            return true; // Continue ticking
        }

        /**
         * Sort nodes by nestLevel ascending (shallow first)
         */
        private sortAscending(nodes: ECSNode[]): void {
            // Insertion sort is faster for nearly-sorted arrays
            const len = nodes.length;
            for (let i = 1; i < len; i++) {
                const node = nodes[i];
                let j = i - 1;
                while (j >= 0 && nodes[j].nestLevel > node.nestLevel) {
                    nodes[j + 1] = nodes[j];
                    j--;
                }
                nodes[j + 1] = node;
            }
        }

        /**
         * Sort nodes by nestLevel descending (deep first)
         */
        private sortDescending(nodes: ECSNode[]): void {
            // Insertion sort is faster for nearly-sorted arrays
            const len = nodes.length;
            for (let i = 1; i < len; i++) {
                const node = nodes[i];
                let j = i - 1;
                while (j >= 0 && nodes[j].nestLevel < node.nestLevel) {
                    nodes[j + 1] = nodes[j];
                    j--;
                }
                nodes[j + 1] = node;
            }
        }
    }
}
