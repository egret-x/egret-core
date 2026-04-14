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

namespace eui {

    //==========================================================================
    // ECS Vertical Layout
    //==========================================================================

    /**
     * @language en_US
     * ECSVerticalLayout arranges children in a vertical stack.
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ECSVerticalLayout 将子项垂直堆叠排列。
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    export class ECSVerticalLayout implements ECSLayoutStrategy {

        //======================================================================
        // Properties
        //======================================================================

        useVirtualLayout: boolean = false;

        horizontalAlign: string = ECS_HORIZONTAL_ALIGN_LEFT;
        gap: number = 6;
        paddingLeft: number = 0;
        paddingRight: number = 0;

        verticalAlign: string = ECS_VERTICAL_ALIGN_TOP;
        paddingTop: number = 0;
        paddingBottom: number = 0;

        typicalWidth: number = 0;
        typicalHeight: number = 0;

        //======================================================================
        // Measurement
        //======================================================================

        measure(container: ECSContainer): void {
            let maxWidth = 0;
            let totalHeight = this.paddingTop + this.paddingBottom;

            const children = container.$children;
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (!child.visible || !this.elementIncludeInLayout(child)) continue;

                    maxWidth = Math.max(maxWidth, this.getElementPreferredSize(child).width);
                    totalHeight += this.getElementPreferredSize(child).height;

                    if (i < children.length - 1) {
                        totalHeight += this.gap;
                    }
                }
            }

            container.measuredWidth = maxWidth + this.paddingLeft + this.paddingRight;
            container.measuredHeight = totalHeight;
        }

        //======================================================================
        // Layout
        //======================================================================

        layout(container: ECSContainer, width: number, height: number): void {
            const children = container.$children;
            if (!children) return;

            let y = this.paddingTop;
            const contentHeight = height - this.paddingTop - this.paddingBottom;
            let numElements = 0;

            // First pass: count visible elements and calculate total height
            for (let i = 0; i < children.length; i++) {
                if (children[i].visible && this.elementIncludeInLayout(children[i])) {
                    numElements++;
                }
            }

            // Calculate excess space for vertical alignment
            let totalElementHeight = 0;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (!child.visible || !this.elementIncludeInLayout(child)) continue;
                totalElementHeight += this.getElementPreferredSize(child).height;
            }

            const totalGap = (numElements > 1) ? (numElements - 1) * this.gap : 0;
            let excessHeight = contentHeight - totalElementHeight - totalGap;

            // Apply vertical alignment
            let justifyExtra: number = 0;
            if (this.verticalAlign === ECS_VERTICAL_ALIGN_MIDDLE) {
                y += excessHeight / 2;
            } else if (this.verticalAlign === ECS_VERTICAL_ALIGN_BOTTOM) {
                y += excessHeight;
            } else if (this.verticalAlign === ECS_VERTICAL_ALIGN_JUSTIFY) {
                // Distribute extra height among elements
                justifyExtra = numElements > 0 ? excessHeight / numElements : 0;
            }

            // Second pass: position elements
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (!child.visible || !this.elementIncludeInLayout(child)) continue;

                let elementHeight = this.getElementPreferredSize(child).height;

                // Add extra height for justify
                if (this.verticalAlign === ECS_VERTICAL_ALIGN_JUSTIFY) {
                    elementHeight += justifyExtra;
                }

                // Calculate x position based on horizontal alignment
                let x = this.paddingLeft;
                const elementWidth = this.getElementPreferredSize(child).width;

                if (this.horizontalAlign === ECS_HORIZONTAL_ALIGN_CENTER) {
                    x += (width - this.paddingLeft - this.paddingRight - elementWidth) / 2;
                } else if (this.horizontalAlign === ECS_HORIZONTAL_ALIGN_RIGHT) {
                    x += width - this.paddingRight - elementWidth;
                } else if (this.horizontalAlign === ECS_HORIZONTAL_ALIGN_JUSTIFY) {
                    x = this.paddingLeft;
                    // For justify, element takes full width
                    this.setElementBounds(child, x, y, width - this.paddingLeft - this.paddingRight, elementHeight);
                    y += elementHeight;
                    if (i < children.length - 1) {
                        y += this.gap;
                    }
                    continue;
                }

                this.setElementBounds(child, x, y, elementWidth, elementHeight);
                y += elementHeight;

                if (i < children.length - 1) {
                    y += this.gap;
                }
            }
        }

        //======================================================================
        // Helper Methods
        //======================================================================

        private elementIncludeInLayout(element: egret.DisplayObject): boolean {
            if ('includeInLayout' in element) {
                return (element as any).includeInLayout !== false;
            }
            return true;
        }

        private getElementPreferredSize(element: egret.DisplayObject): { width: number; height: number } {
            if ('preferredWidth' in element && 'preferredHeight' in element) {
                return {
                    width: (element as any).preferredWidth,
                    height: (element as any).preferredHeight
                };
            }
            return {
                width: element.width || 0,
                height: element.height || 0
            };
        }

        private setElementBounds(
            element: egret.DisplayObject,
            x: number, y: number,
            width: number, height: number
        ): void {
            element.x = x;
            element.y = y;
            element.width = width;
            element.height = height;
        }
    }

    //==========================================================================
    // ECS Horizontal Layout
    //==========================================================================

    /**
     * @language en_US
     * ECSHorizontalLayout arranges children in a horizontal row.
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ECSHorizontalLayout 将子项水平排列。
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    export class ECSHorizontalLayout implements ECSLayoutStrategy {

        //======================================================================
        // Properties
        //======================================================================

        useVirtualLayout: boolean = false;

        horizontalAlign: string = ECS_HORIZONTAL_ALIGN_LEFT;
        gap: number = 6;
        paddingLeft: number = 0;
        paddingRight: number = 0;

        verticalAlign: string = ECS_VERTICAL_ALIGN_TOP;
        paddingTop: number = 0;
        paddingBottom: number = 0;

        typicalWidth: number = 0;
        typicalHeight: number = 0;

        //======================================================================
        // Measurement
        //======================================================================

        measure(container: ECSContainer): void {
            let totalWidth = this.paddingLeft + this.paddingRight;
            let maxHeight = 0;

            const children = container.$children;
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (!child.visible || !this.elementIncludeInLayout(child)) continue;

                    const size = this.getElementPreferredSize(child);
                    totalWidth += size.width;
                    maxHeight = Math.max(maxHeight, size.height);

                    if (i < children.length - 1) {
                        totalWidth += this.gap;
                    }
                }
            }

            container.measuredWidth = totalWidth;
            container.measuredHeight = maxHeight + this.paddingTop + this.paddingBottom;
        }

        //======================================================================
        // Layout
        //======================================================================

        layout(container: ECSContainer, width: number, height: number): void {
            const children = container.$children;
            if (!children) return;

            let x = this.paddingLeft;
            const contentWidth = width - this.paddingLeft - this.paddingRight;
            let numElements = 0;

            // First pass: count visible elements
            for (let i = 0; i < children.length; i++) {
                if (children[i].visible && this.elementIncludeInLayout(children[i])) {
                    numElements++;
                }
            }

            // Calculate total element width
            let totalElementWidth = 0;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (!child.visible || !this.elementIncludeInLayout(child)) continue;
                totalElementWidth += this.getElementPreferredSize(child).width;
            }

            const totalGap = (numElements > 1) ? (numElements - 1) * this.gap : 0;
            let excessWidth = contentWidth - totalElementWidth - totalGap;

            // Apply horizontal alignment
            let justifyExtra: number = 0;
            if (this.horizontalAlign === ECS_HORIZONTAL_ALIGN_CENTER) {
                x += excessWidth / 2;
            } else if (this.horizontalAlign === ECS_HORIZONTAL_ALIGN_RIGHT) {
                x += excessWidth;
            } else if (this.horizontalAlign === ECS_HORIZONTAL_ALIGN_JUSTIFY) {
                justifyExtra = numElements > 0 ? excessWidth / numElements : 0;
            }

            // Calculate y position based on vertical alignment
            const contentHeight = height - this.paddingTop - this.paddingBottom;

            // Second pass: position elements
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (!child.visible || !this.elementIncludeInLayout(child)) continue;

                let elementWidth = this.getElementPreferredSize(child).width;
                let elementHeight = this.getElementPreferredSize(child).height;

                // Add extra width for justify
                if (this.horizontalAlign === ECS_HORIZONTAL_ALIGN_JUSTIFY) {
                    elementWidth += justifyExtra;
                }

                // Calculate y position based on vertical alignment
                let y = this.paddingTop;
                if (this.verticalAlign === ECS_VERTICAL_ALIGN_MIDDLE) {
                    y += (contentHeight - elementHeight) / 2;
                } else if (this.verticalAlign === ECS_VERTICAL_ALIGN_BOTTOM) {
                    y += contentHeight - elementHeight;
                } else if (this.verticalAlign === ECS_VERTICAL_ALIGN_JUSTIFY) {
                    this.setElementBounds(child, x, y, elementWidth, contentHeight);
                    x += elementWidth;
                    if (i < children.length - 1) {
                        x += this.gap;
                    }
                    continue;
                }

                this.setElementBounds(child, x, y, elementWidth, elementHeight);
                x += elementWidth;

                if (i < children.length - 1) {
                    x += this.gap;
                }
            }
        }

        //======================================================================
        // Helper Methods
        //======================================================================

        private elementIncludeInLayout(element: egret.DisplayObject): boolean {
            if ('includeInLayout' in element) {
                return (element as any).includeInLayout !== false;
            }
            return true;
        }

        private getElementPreferredSize(element: egret.DisplayObject): { width: number; height: number } {
            if ('preferredWidth' in element && 'preferredHeight' in element) {
                return {
                    width: (element as any).preferredWidth,
                    height: (element as any).preferredHeight
                };
            }
            return {
                width: element.width || 0,
                height: element.height || 0
            };
        }

        private setElementBounds(
            element: egret.DisplayObject,
            x: number, y: number,
            width: number, height: number
        ): void {
            element.x = x;
            element.y = y;
            element.width = width;
            element.height = height;
        }
    }

    //==========================================================================
    // ECS Tile Layout
    //==========================================================================

    /**
     * @language en_US
     * ECSTileLayout arranges children in a grid of tiles.
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ECSTileLayout 将子项排列成网格瓦片布局。
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    export class ECSTileLayout implements ECSLayoutStrategy {

        //======================================================================
        // Properties
        //======================================================================

        useVirtualLayout: boolean = false;

        horizontalAlign: string = ECS_HORIZONTAL_ALIGN_LEFT;
        gap: number = 6;
        paddingLeft: number = 0;
        paddingRight: number = 0;

        verticalAlign: string = ECS_VERTICAL_ALIGN_TOP;
        paddingTop: number = 0;
        paddingBottom: number = 0;

        typicalWidth: number = 100;
        typicalHeight: number = 100;

        /** Tile orientation: "rows" or "columns" */
        tileOrientation: string = "rows";

        /** Requested tile width (NaN for auto) */
        tileWidth: number = NaN;

        /** Requested tile height (NaN for auto) */
        tileHeight: number = NaN;

        //======================================================================
        // Measurement
        //======================================================================

        measure(container: ECSContainer): void {
            let maxWidth = 0;
            let maxHeight = 0;

            const children = container.$children;
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (!child.visible || !this.elementIncludeInLayout(child)) continue;

                    const size = this.getElementPreferredSize(child);
                    maxWidth = Math.max(maxWidth, size.width);
                    maxHeight = Math.max(maxHeight, size.height);
                }
            }

            const tileW = isNaN(this.tileWidth) ? maxWidth : this.tileWidth;
            const tileH = isNaN(this.tileHeight) ? maxHeight : this.tileHeight;

            container.measuredWidth = this.paddingLeft + this.paddingRight;
            container.measuredHeight = this.paddingTop + this.paddingBottom;

            if (children) {
                let count = 0;
                for (let i = 0; i < children.length; i++) {
                    if (children[i].visible && this.elementIncludeInLayout(children[i])) {
                        count++;
                    }
                }

                if (count > 0) {
                    // Calculate rows and columns
                    if (this.tileOrientation === "rows") {
                        const cols = Math.max(1, Math.floor(
                            (container.explicitWidth - this.paddingLeft - this.paddingRight + this.gap) /
                            (tileW + this.gap)
                        ));
                        const rows = Math.ceil(count / cols);

                        container.measuredWidth += cols * tileW + (cols - 1) * this.gap;
                        container.measuredHeight += rows * tileH + (rows - 1) * this.gap;
                    } else {
                        const rows = Math.max(1, Math.floor(
                            (container.explicitHeight - this.paddingTop - this.paddingBottom + this.gap) /
                            (tileH + this.gap)
                        ));
                        const cols = Math.ceil(count / rows);

                        container.measuredWidth += cols * tileW + (cols - 1) * this.gap;
                        container.measuredHeight += rows * tileH + (rows - 1) * this.gap;
                    }
                }
            }
        }

        //======================================================================
        // Layout
        //======================================================================

        layout(container: ECSContainer, width: number, height: number): void {
            const children = container.$children;
            if (!children) return;

            const tileW = isNaN(this.tileWidth) ? this.typicalWidth : this.tileWidth;
            const tileH = isNaN(this.tileHeight) ? this.typicalHeight : this.tileHeight;

            // Count visible elements
            let count = 0;
            for (let i = 0; i < children.length; i++) {
                if (children[i].visible && this.elementIncludeInLayout(children[i])) {
                    count++;
                }
            }

            if (count === 0) return;

            // Calculate columns based on orientation
            let cols: number;
            let rows: number;

            if (this.tileOrientation === "rows") {
                cols = Math.max(1, Math.floor((width - this.paddingLeft - this.paddingRight + this.gap) / (tileW + this.gap)));
                rows = Math.ceil(count / cols);
            } else {
                rows = Math.max(1, Math.floor((height - this.paddingTop - this.paddingBottom + this.gap) / (tileH + this.gap)));
                cols = Math.ceil(count / rows);
            }

            // Calculate total content size
            const totalWidth = cols * tileW + (cols - 1) * this.gap;
            const totalHeight = rows * tileH + (rows - 1) * this.gap;

            // Calculate offset for alignment
            let startX = this.paddingLeft;
            let startY = this.paddingTop;

            if (this.horizontalAlign === ECS_HORIZONTAL_ALIGN_CENTER) {
                startX += (width - this.paddingLeft - this.paddingRight - totalWidth) / 2;
            } else if (this.horizontalAlign === ECS_HORIZONTAL_ALIGN_RIGHT) {
                startX += width - this.paddingRight - totalWidth;
            }

            if (this.verticalAlign === ECS_VERTICAL_ALIGN_MIDDLE) {
                startY += (height - this.paddingTop - this.paddingBottom - totalHeight) / 2;
            } else if (this.verticalAlign === ECS_VERTICAL_ALIGN_BOTTOM) {
                startY += height - this.paddingBottom - totalHeight;
            }

            // Position elements
            let index = 0;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                if (!child.visible || !this.elementIncludeInLayout(child)) continue;

                let col: number;
                let row: number;

                if (this.tileOrientation === "rows") {
                    col = index % cols;
                    row = Math.floor(index / cols);
                } else {
                    row = index % rows;
                    col = Math.floor(index / rows);
                }

                const x = startX + col * (tileW + this.gap);
                const y = startY + row * (tileH + this.gap);

                child.x = x;
                child.y = y;
                child.width = tileW;
                child.height = tileH;

                index++;
            }
        }

        //======================================================================
        // Helper Methods
        //======================================================================

        private elementIncludeInLayout(element: egret.DisplayObject): boolean {
            if ('includeInLayout' in element) {
                return (element as any).includeInLayout !== false;
            }
            return true;
        }

        private getElementPreferredSize(element: egret.DisplayObject): { width: number; height: number } {
            if ('preferredWidth' in element && 'preferredHeight' in element) {
                return {
                    width: (element as any).preferredWidth,
                    height: (element as any).preferredHeight
                };
            }
            return {
                width: element.width || this.typicalWidth,
                height: element.height || this.typicalHeight
            };
        }
    }

    //==========================================================================
    // ECS Basic Layout (absolute positioning)
    //==========================================================================

    /**
     * @language en_US
     * ECSBasicLayout arranges children according to their individual settings,
     * without any automatic positioning. Also called absolute layout.
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * ECSBasicLayout 根据子项的各自设置排列，不进行自动定位。也称为绝对布局。
     * 
     * @version eui 1.0
     * @platform Web,Native
     */
    export class ECSBasicLayout implements ECSLayoutStrategy {

        //======================================================================
        // Properties
        //======================================================================

        useVirtualLayout: boolean = false;

        horizontalAlign: string = ECS_HORIZONTAL_ALIGN_LEFT;
        gap: number = 0;
        paddingLeft: number = 0;
        paddingRight: number = 0;

        verticalAlign: string = ECS_VERTICAL_ALIGN_TOP;
        paddingTop: number = 0;
        paddingBottom: number = 0;

        typicalWidth: number = 0;
        typicalHeight: number = 0;

        //======================================================================
        // Measurement
        //======================================================================

        measure(container: ECSContainer): void {
            let maxWidth = 0;
            let maxHeight = 0;

            const children = container.$children;
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (!child.visible || !this.elementIncludeInLayout(child)) continue;

                    maxWidth = Math.max(maxWidth, child.x + child.width);
                    maxHeight = Math.max(maxHeight, child.y + child.height);
                }
            }

            container.measuredWidth = maxWidth + this.paddingLeft + this.paddingRight;
            container.measuredHeight = maxHeight + this.paddingTop + this.paddingBottom;
        }

        //======================================================================
        // Layout
        //======================================================================

        layout(container: ECSContainer, width: number, height: number): void {
            // BasicLayout doesn't automatically position children
            // They are positioned by their individual x, y, width, height properties
            // Just apply constraints if needed
        }

        //======================================================================
        // Helper Methods
        //======================================================================

        private elementIncludeInLayout(element: egret.DisplayObject): boolean {
            if ('includeInLayout' in element) {
                return (element as any).includeInLayout !== false;
            }
            return true;
        }
    }
}
