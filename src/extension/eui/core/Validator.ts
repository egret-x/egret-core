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
//////////////////////////////////////////////////////////////////////////////////////


namespace eui.sys {

    /**
     * @private
     * Single-array queue sorted by nestLevel on drain.
     * Deduplication is handled upstream in UIComponent.$dirtyFlags, so no hash map is needed.
     */
    class FlatQueue {
        public items: UIComponent[] = [];
        public count: number = 0;

        public enqueue(client: UIComponent): void {
            this.items[this.count++] = client;
        }

        /**
         * Sort ascending (shallowest first) and process the current snapshot.
         * Items enqueued during processing are kept for the next drain call.
         */
        public drainAsc(process: (c: UIComponent) => void): void {
            if (this.count === 0) return;
            const n = this.count;
            const arr = this.items;
            // insertion sort ascending by nestLevel (nearly sorted in practice)
            for (let i = 1; i < n; i++) {
                const cur = arr[i];
                const level = cur.$nestLevel;
                let j = i - 1;
                while (j >= 0 && arr[j].$nestLevel > level) {
                    arr[j + 1] = arr[j];
                    j--;
                }
                arr[j + 1] = cur;
            }
            for (let i = 0; i < n; i++) {
                const c = arr[i];
                arr[i] = null;
                if (c.$stage) process(c);
            }
            // slide items added during processing to the front
            const added = this.count - n;
            for (let i = 0; i < added; i++) {
                arr[i] = arr[n + i];
                arr[n + i] = null;
            }
            this.count = added;
        }

        /**
         * Sort descending (deepest first) and process the current snapshot.
         * Items enqueued during processing are kept for the next drain call.
         */
        public drainDesc(process: (c: UIComponent) => void): void {
            if (this.count === 0) return;
            const n = this.count;
            const arr = this.items;
            // insertion sort descending by nestLevel
            for (let i = 1; i < n; i++) {
                const cur = arr[i];
                const level = cur.$nestLevel;
                let j = i - 1;
                while (j >= 0 && arr[j].$nestLevel < level) {
                    arr[j + 1] = arr[j];
                    j--;
                }
                arr[j + 1] = cur;
            }
            for (let i = 0; i < n; i++) {
                const c = arr[i];
                arr[i] = null;
                if (c.$stage) process(c);
            }
            const added = this.count - n;
            for (let i = 0; i < added; i++) {
                arr[i] = arr[n + i];
                arr[n + i] = null;
            }
            this.count = added;
        }

        public isEmpty(): boolean {
            return this.count === 0;
        }
    }

    /**
     * @private
     * 失效验证管理器
     */
    export class Validator extends egret.EventDispatcher {
        /**
         * @private
         * 创建一个Validator对象
         */
        public constructor() {
            super();
        }

        /**
         * @private
         */
        private targetLevel: number = Number.POSITIVE_INFINITY;

        /**
         * @private
         * 是否已经添加了tick监听
         */
        private tickAttached: boolean = false;

        /**
         * @private
         * 是否已经添加了事件监听
         */
        private listenersAttached: boolean = false;

        /**
         * @private
         */
        private propertiesQueue: FlatQueue = new FlatQueue();

        /**
         * @private
         */
        private sizeQueue: FlatQueue = new FlatQueue();

        /**
         * @private
         */
        private displayListQueue: FlatQueue = new FlatQueue();

        /**
         * @private
         * 标记组件属性失效
         */
        public invalidateProperties(client: UIComponent): void {
            this.propertiesQueue.enqueue(client);
            if (!this.listenersAttached)
                this.attachListeners();
        }

        /**
         * @private
         * 标记需要重新测量尺寸
         */
        public invalidateSize(client: UIComponent): void {
            this.sizeQueue.enqueue(client);
            if (!this.listenersAttached)
                this.attachListeners();
        }

        /**
         * @private
         * 标记需要重新布局
         */
        public invalidateDisplayList(client: UIComponent): void {
            this.displayListQueue.enqueue(client);
            if (!this.listenersAttached)
                this.attachListeners();
        }

        /**
         * @private
         * 添加事件监听
         */
        private attachListeners(): void {
            if (!this.tickAttached) {
                this.tickAttached = true;
                egret.startTick(this.onTick, this);
            }
            this.listenersAttached = true;
        }

        /**
         * @private
         * tick回调
         */
        private onTick(timeStamp: number): boolean {
            this.doPhasedInstantiation();
            return true;
        }

        /**
         * @private
         */
        private doPhasedInstantiation(): void {
            this.propertiesQueue.drainAsc(c => c.validateProperties());
            this.sizeQueue.drainDesc(c => c.validateSize());
            this.displayListQueue.drainAsc(c => c.validateDisplayList());

            if (this.propertiesQueue.count === 0 &&
                this.sizeQueue.count === 0 &&
                this.displayListQueue.count === 0) {
                if (this.tickAttached) {
                    this.tickAttached = false;
                    egret.stopTick(this.onTick, this);
                }
                this.listenersAttached = false;
            }
        }

        /**
         * @private
         * 使大于等于指定组件层级的元素立即应用属性
         * @param target 要立即应用属性的组件
         */
        public validateClient(target: UIComponent): void {
            let oldTargetLevel = this.targetLevel;

            if (this.targetLevel === Number.POSITIVE_INFINITY)
                this.targetLevel = target.$nestLevel;

            let done = false;
            while (!done) {
                done = true;

                let obj = this.removeSubtreeItem(this.propertiesQueue, target, false);
                while (obj) {
                    if (obj.$stage) obj.validateProperties();
                    obj = this.removeSubtreeItem(this.propertiesQueue, target, false);
                }

                obj = this.removeSubtreeItem(this.sizeQueue, target, true);
                while (obj) {
                    if (obj.$stage) obj.validateSize();
                    if (this.hasSubtreeItems(this.propertiesQueue, target)) {
                        done = false;
                        break;
                    }
                    obj = this.removeSubtreeItem(this.sizeQueue, target, true);
                }

                obj = this.removeSubtreeItem(this.displayListQueue, target, false);
                while (obj) {
                    if (obj.$stage) obj.validateDisplayList();
                    if (this.hasSubtreeItems(this.propertiesQueue, target) ||
                        this.hasSubtreeItems(this.sizeQueue, target)) {
                        done = false;
                        break;
                    }
                    obj = this.removeSubtreeItem(this.displayListQueue, target, false);
                }
            }

            if (oldTargetLevel === Number.POSITIVE_INFINITY)
                this.targetLevel = Number.POSITIVE_INFINITY;
        }

        /**
         * @private
         * Remove and return an item from the queue that belongs to target's subtree.
         * When maxLevel is true, returns the deepest matching item; otherwise the shallowest.
         */
        private removeSubtreeItem(queue: FlatQueue, target: UIComponent, maxLevel: boolean): UIComponent {
            const nestLevel = target.$nestLevel;
            const arr = queue.items;
            const n = queue.count;
            if (n === 0) return null;

            let bestIdx = -1;
            let bestLevel = maxLevel ? -1 : 2147483647;
            const isContainer = egret.is(target, "egret.DisplayObjectContainer");

            for (let i = 0; i < n; i++) {
                const c = arr[i];
                if (c.$nestLevel < nestLevel) continue;
                const isSelf = (c as any) === (target as any);
                if (!isSelf) {
                    if (!isContainer) continue;
                    if (!(target as any as egret.DisplayObjectContainer).contains(c as any)) continue;
                }
                if (maxLevel ? c.$nestLevel > bestLevel : c.$nestLevel < bestLevel) {
                    bestLevel = c.$nestLevel;
                    bestIdx = i;
                }
            }

            if (bestIdx < 0) return null;

            const result = arr[bestIdx];
            // swap-remove to avoid O(n) shift
            queue.count--;
            arr[bestIdx] = arr[queue.count];
            arr[queue.count] = null;
            return result;
        }

        /**
         * @private
         * Check whether the queue contains any item that belongs to target's subtree.
         */
        private hasSubtreeItems(queue: FlatQueue, target: UIComponent): boolean {
            const nestLevel = target.$nestLevel;
            const arr = queue.items;
            const n = queue.count;
            const isContainer = egret.is(target, "egret.DisplayObjectContainer");
            for (let i = 0; i < n; i++) {
                const c = arr[i];
                if (c.$nestLevel < nestLevel) continue;
                if ((c as any) === (target as any)) return true;
                if (isContainer && (target as any as egret.DisplayObjectContainer).contains(c as any)) return true;
            }
            return false;
        }
    }
}
