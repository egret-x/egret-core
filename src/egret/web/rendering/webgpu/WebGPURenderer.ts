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

namespace egret.web {

    let blendModes = ["source-over", "lighter", "destination-out"];
    let defaultCompositeOp = "source-over";
    let BLACK_COLOR = "#000000";
    let CAPS_STYLES = { none: 'butt', square: 'square', round: 'round' };

    /**
     * @private
     * WebGPU渲染器
     * 对标WebGLRenderer，实现sys.SystemRenderer接口
     */
    export class WebGPURenderer implements sys.SystemRenderer {

        public constructor() {
        }

        public wxiOS10: boolean = false;

        private nestLevel: number = 0;

        /**
         * 渲染一个显示对象
         */
        public render(displayObject: DisplayObject, buffer: sys.RenderBuffer, matrix: Matrix, forRenderTexture?: boolean): number {
            
            let gpuBuffer: WebGPURenderBuffer = <WebGPURenderBuffer>buffer;
            
            let gpuBufferContext: WebGPURenderContext = gpuBuffer.context;
            
            this.nestLevel++;
            let root: DisplayObject = forRenderTexture ? displayObject : null;

            gpuBufferContext.pushBuffer(gpuBuffer);

            // 设置全局变换矩阵
            gpuBuffer.transform(matrix.a, matrix.b, matrix.c, matrix.d, 0, 0);
            this.drawDisplayObject(displayObject, gpuBuffer, matrix.tx, matrix.ty, true);
            gpuBufferContext.$drawWebGPU();
            let drawCall = gpuBuffer.$drawCalls;
            gpuBuffer.onRenderFinish();

            gpuBufferContext.popBuffer();
            let invert = Matrix.create();
            matrix.$invertInto(invert);
            gpuBuffer.transform(invert.a, invert.b, invert.c, invert.d, 0, 0);
            Matrix.release(invert);

            this.nestLevel--;
            if (this.nestLevel === 0) {
                // 最大缓存6个渲染缓冲
                if (gpuRenderBufferPool.length > 6) {
                    gpuRenderBufferPool.length = 6;
                }
                let length = gpuRenderBufferPool.length;
                for (let i = 0; i < length; i++) {
                    gpuRenderBufferPool[i].resize(0, 0);
                }
            }
            return drawCall;
        }

        /**
         * @private
         * 绘制一个显示对象
         */
        private drawDisplayObject(displayObject: DisplayObject, buffer: WebGPURenderBuffer, offsetX: number, offsetY: number, isStage?: boolean): number {
            let drawCalls = 0;
            let node: sys.RenderNode;
            let displayList = displayObject.$displayList;
            if (displayList && !isStage) {
                if (displayObject.$cacheDirty || displayObject.$renderDirty ||
                    displayList.$canvasScaleX != sys.DisplayList.$canvasScaleX ||
                    displayList.$canvasScaleY != sys.DisplayList.$canvasScaleY) {
                    drawCalls += displayList.drawToSurface();
                }
                node = displayList.$renderNode;
            }
            else {
                if (displayObject.$renderDirty) {
                    node = displayObject.$getRenderNode();
                }
                else {
                    node = displayObject.$renderNode;
                }
            }
            displayObject.$cacheDirty = false;
            if (node) {
                drawCalls++;
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                switch (node.type) {
                    case sys.RenderNodeType.BitmapNode:
                        this.renderBitmap(<sys.BitmapNode>node, buffer);
                        break;
                    case sys.RenderNodeType.TextNode:
                        this.renderText(<sys.TextNode>node, buffer);
                        break;
                    case sys.RenderNodeType.GraphicsNode:
                        this.renderGraphics(<sys.GraphicsNode>node, buffer);
                        break;
                    case sys.RenderNodeType.GroupNode:
                        this.renderGroup(<sys.GroupNode>node, buffer);
                        break;
                    case sys.RenderNodeType.MeshNode:
                        this.renderMesh(<sys.MeshNode>node, buffer);
                        break;
                    case sys.RenderNodeType.NormalBitmapNode:
                        this.renderNormalBitmap(<sys.NormalBitmapNode>node, buffer);
                        break;
                }
                buffer.$offsetX = 0;
                buffer.$offsetY = 0;
            }
            if (displayList && !isStage) {
                return drawCalls;
            }
            let children = displayObject.$children;
            if (children) {
                if (displayObject.sortableChildren && displayObject.$sortDirty) {
                    displayObject.sortChildren();
                }
                let length = children.length;
                for (let i = 0; i < length; i++) {
                    let child = children[i];
                    let offsetX2: number;
                    let offsetY2: number;
                    let tempAlpha: number;
                    let tempTintColor: number;
                    if (child.$alpha != 1) {
                        tempAlpha = buffer.globalAlpha;
                        buffer.globalAlpha *= child.$alpha;
                    }
                    if (child.tint !== 0xFFFFFF) {
                        tempTintColor = buffer.globalTintColor;
                        buffer.globalTintColor = child.$tintRGB;
                    }
                    let savedMatrix: Matrix;
                    if (child.$useTranslate) {
                        let m = child.$getMatrix();
                        offsetX2 = offsetX + child.$x;
                        offsetY2 = offsetY + child.$y;
                        let m2 = buffer.globalMatrix;
                        savedMatrix = Matrix.create();
                        savedMatrix.a = m2.a;
                        savedMatrix.b = m2.b;
                        savedMatrix.c = m2.c;
                        savedMatrix.d = m2.d;
                        savedMatrix.tx = m2.tx;
                        savedMatrix.ty = m2.ty;
                        buffer.transform(m.a, m.b, m.c, m.d, offsetX2, offsetY2);
                        offsetX2 = -child.$anchorOffsetX;
                        offsetY2 = -child.$anchorOffsetY;
                    }
                    else {
                        offsetX2 = offsetX + child.$x - child.$anchorOffsetX;
                        offsetY2 = offsetY + child.$y - child.$anchorOffsetY;
                    }
                    switch (child.$renderMode) {
                        case RenderMode.NONE:
                            break;
                        case RenderMode.FILTER:
                            drawCalls += this.drawWithFilter(child, buffer, offsetX2, offsetY2);
                            break;
                        case RenderMode.CLIP:
                            drawCalls += this.drawWithClip(child, buffer, offsetX2, offsetY2);
                            break;
                        case RenderMode.SCROLLRECT:
                            drawCalls += this.drawWithScrollRect(child, buffer, offsetX2, offsetY2);
                            break;
                        default:
                            drawCalls += this.drawDisplayObject(child, buffer, offsetX2, offsetY2);
                            break;
                    }
                    if (tempAlpha) {
                        buffer.globalAlpha = tempAlpha;
                    }
                    if (tempTintColor) {
                        buffer.globalTintColor = tempTintColor;
                    }
                    if (savedMatrix) {
                        let m = buffer.globalMatrix;
                        m.a = savedMatrix.a;
                        m.b = savedMatrix.b;
                        m.c = savedMatrix.c;
                        m.d = savedMatrix.d;
                        m.tx = savedMatrix.tx;
                        m.ty = savedMatrix.ty;
                        Matrix.release(savedMatrix);
                    }
                }
            }
            return drawCalls;
        }

        /**
         * @private
         * 带滤镜绘制
         */
        private drawWithFilter(displayObject: DisplayObject, buffer: WebGPURenderBuffer, offsetX: number, offsetY: number): number {
            let drawCalls = 0;
            if (displayObject.$children && displayObject.$children.length == 0 && (!displayObject.$renderNode || displayObject.$renderNode.$getRenderCount() == 0)) {
                return drawCalls;
            }
            let filters = displayObject.$filters;
            let hasBlendMode = (displayObject.$blendMode !== 0);
            let compositeOp: string;
            if (hasBlendMode) {
                compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }

            const displayBounds = displayObject.$getOriginalBounds();
            const displayBoundsX = displayBounds.x;
            const displayBoundsY = displayBounds.y;
            const displayBoundsWidth = displayBounds.width;
            const displayBoundsHeight = displayBounds.height;
            if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                return drawCalls;
            }

            // 单一colorTransform滤镜优化
            if (!displayObject.mask && filters.length == 1 && (filters[0].type == "colorTransform" || (filters[0].type === "custom" && (<CustomFilter>filters[0]).padding === 0))) {
                let childrenDrawCount = this.getRenderCount(displayObject);
                if (!displayObject.$children || childrenDrawCount == 1) {
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    buffer.context.$filter = <ColorMatrixFilter>filters[0];
                    if (displayObject.$mask) {
                        drawCalls += this.drawWithClip(displayObject, buffer, offsetX, offsetY);
                    }
                    else if (displayObject.$scrollRect || displayObject.$maskRect) {
                        drawCalls += this.drawWithScrollRect(displayObject, buffer, offsetX, offsetY);
                    }
                    else {
                        drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                    }
                    buffer.context.$filter = null;
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    return drawCalls;
                }
            }

            // 为显示对象创建一个新的buffer
            const scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
            filters.forEach((filter) => {
                if (filter instanceof GlowFilter || filter instanceof BlurFilter) {
                    filter.$uniforms.$filterScale = scale;
                    if (filter.type == 'blur') {
                        const blurFilter = filter as egret.BlurFilter;
                        blurFilter.blurXFilter.$uniforms.$filterScale = scale;
                        blurFilter.blurYFilter.$uniforms.$filterScale = scale;
                    }
                }
            });
            let displayBuffer = this.createRenderBuffer(scale * displayBoundsWidth, scale * displayBoundsHeight);
            displayBuffer.saveTransform();
            displayBuffer.transform(scale, 0, 0, scale, 0, 0);
            displayBuffer.context.pushBuffer(displayBuffer);

            if (displayObject.$mask) {
                drawCalls += this.drawWithClip(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
            }
            else if (displayObject.$scrollRect || displayObject.$maskRect) {
                drawCalls += this.drawWithScrollRect(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
            }
            else {
                drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
            }

            displayBuffer.context.popBuffer();
            displayBuffer.restoreTransform();

            if (drawCalls > 0) {
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(compositeOp);
                }
                drawCalls++;
                buffer.$offsetX = offsetX + displayBoundsX;
                buffer.$offsetY = offsetY + displayBoundsY;
                let savedMatrix = Matrix.create();
                let curMatrix = buffer.globalMatrix;
                savedMatrix.a = curMatrix.a;
                savedMatrix.b = curMatrix.b;
                savedMatrix.c = curMatrix.c;
                savedMatrix.d = curMatrix.d;
                savedMatrix.tx = curMatrix.tx;
                savedMatrix.ty = curMatrix.ty;
                buffer.useOffset();
                buffer.context.drawTargetWidthFilters(filters, displayBuffer);
                curMatrix.a = savedMatrix.a;
                curMatrix.b = savedMatrix.b;
                curMatrix.c = savedMatrix.c;
                curMatrix.d = savedMatrix.d;
                curMatrix.tx = savedMatrix.tx;
                curMatrix.ty = savedMatrix.ty;
                Matrix.release(savedMatrix);
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
            }
            gpuRenderBufferPool.push(displayBuffer);
            return drawCalls;
        }

        private getRenderCount(displayObject: DisplayObject): number {
            let drawCount = 0;
            const node = displayObject.$getRenderNode();
            if (node) {
                drawCount += node.$getRenderCount();
            }
            if (displayObject.$children) {
                for (const child of displayObject.$children) {
                    const filters = child.$filters;
                    if (filters && filters.length > 0) {
                        return 2;
                    }
                    else if (child.$children) {
                        drawCount += this.getRenderCount(child);
                    }
                    else {
                        const node = child.$getRenderNode();
                        if (node) {
                            drawCount += node.$getRenderCount();
                        }
                    }
                }
            }
            return drawCount;
        }

        /**
         * @private
         * 带clip遮罩绘制
         */
        private drawWithClip(displayObject: DisplayObject, buffer: WebGPURenderBuffer, offsetX: number, offsetY: number): number {
            let drawCalls = 0;
            let hasBlendMode = (displayObject.$blendMode !== 0);
            let compositeOp: string;
            if (hasBlendMode) {
                compositeOp = blendModes[displayObject.$blendMode];
                if (!compositeOp) {
                    compositeOp = defaultCompositeOp;
                }
            }

            let scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            let mask = displayObject.$mask;
            if (mask) {
                let maskRenderMatrix = mask.$getMatrix();
                if ((maskRenderMatrix.a == 0 && maskRenderMatrix.b == 0) || (maskRenderMatrix.c == 0 && maskRenderMatrix.d == 0)) {
                    return drawCalls;
                }
            }

            if (!mask && (!displayObject.$children || displayObject.$children.length == 0)) {
                if (scrollRect) {
                    buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                }
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(compositeOp);
                }
                drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
                if (hasBlendMode) {
                    buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                }
                if (scrollRect) {
                    buffer.context.popMask();
                }
                return drawCalls;
            }
            else {
                let displayBounds = displayObject.$getOriginalBounds();
                const displayBoundsX = displayBounds.x;
                const displayBoundsY = displayBounds.y;
                const displayBoundsWidth = displayBounds.width;
                const displayBoundsHeight = displayBounds.height;
                if (displayBoundsWidth <= 0 || displayBoundsHeight <= 0) {
                    return drawCalls;
                }
                let displayBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                displayBuffer.context.pushBuffer(displayBuffer);
                drawCalls += this.drawDisplayObject(displayObject, displayBuffer, -displayBoundsX, -displayBoundsY);
                if (mask) {
                    let maskBuffer = this.createRenderBuffer(displayBoundsWidth, displayBoundsHeight);
                    maskBuffer.context.pushBuffer(maskBuffer);
                    let maskMatrix = Matrix.create();
                    maskMatrix.copyFrom(mask.$getConcatenatedMatrix());
                    mask.$getConcatenatedMatrixAt(displayObject, maskMatrix);
                    maskMatrix.translate(-displayBoundsX, -displayBoundsY);
                    maskBuffer.setTransform(maskMatrix.a, maskMatrix.b, maskMatrix.c, maskMatrix.d, maskMatrix.tx, maskMatrix.ty);
                    Matrix.release(maskMatrix);
                    drawCalls += this.drawDisplayObject(mask, maskBuffer, 0, 0);
                    maskBuffer.context.popBuffer();
                    displayBuffer.context.setGlobalCompositeOperation("destination-in");
                    displayBuffer.setTransform(1, 0, 0, -1, 0, maskBuffer.height);
                    let maskBufferWidth = maskBuffer.rootRenderTarget.width;
                    let maskBufferHeight = maskBuffer.rootRenderTarget.height;
                    displayBuffer.context.drawTexture(maskBuffer.rootRenderTarget.texture, 0, 0, maskBufferWidth, maskBufferHeight,
                        0, 0, maskBufferWidth, maskBufferHeight, maskBufferWidth, maskBufferHeight);
                    displayBuffer.setTransform(1, 0, 0, 1, 0, 0);
                    displayBuffer.context.setGlobalCompositeOperation("source-over");
                    maskBuffer.setTransform(1, 0, 0, 1, 0, 0);
                    gpuRenderBufferPool.push(maskBuffer);
                }

                displayBuffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                displayBuffer.context.popBuffer();

                if (drawCalls > 0) {
                    drawCalls++;
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(compositeOp);
                    }
                    if (scrollRect) {
                        buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
                    }
                    let savedMatrix = Matrix.create();
                    let curMatrix = buffer.globalMatrix;
                    savedMatrix.a = curMatrix.a;
                    savedMatrix.b = curMatrix.b;
                    savedMatrix.c = curMatrix.c;
                    savedMatrix.d = curMatrix.d;
                    savedMatrix.tx = curMatrix.tx;
                    savedMatrix.ty = curMatrix.ty;
                    curMatrix.append(1, 0, 0, -1, offsetX + displayBoundsX, offsetY + displayBoundsY + displayBuffer.height);
                    let displayBufferWidth = displayBuffer.rootRenderTarget.width;
                    let displayBufferHeight = displayBuffer.rootRenderTarget.height;
                    buffer.context.drawTexture(displayBuffer.rootRenderTarget.texture, 0, 0, displayBufferWidth, displayBufferHeight,
                        0, 0, displayBufferWidth, displayBufferHeight, displayBufferWidth, displayBufferHeight);
                    if (scrollRect) {
                        buffer.context.popMask();
                    }
                    if (hasBlendMode) {
                        buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
                    }
                    let matrix = buffer.globalMatrix;
                    matrix.a = savedMatrix.a;
                    matrix.b = savedMatrix.b;
                    matrix.c = savedMatrix.c;
                    matrix.d = savedMatrix.d;
                    matrix.tx = savedMatrix.tx;
                    matrix.ty = savedMatrix.ty;
                    Matrix.release(savedMatrix);
                }
                gpuRenderBufferPool.push(displayBuffer);
                return drawCalls;
            }
        }

        /**
         * @private
         * 带scrollRect绘制
         */
        private drawWithScrollRect(displayObject: DisplayObject, buffer: WebGPURenderBuffer, offsetX: number, offsetY: number): number {
            let drawCalls = 0;
            let scrollRect = displayObject.$scrollRect ? displayObject.$scrollRect : displayObject.$maskRect;
            if (scrollRect.isEmpty()) {
                return drawCalls;
            }
            if (displayObject.$scrollRect) {
                offsetX -= scrollRect.x;
                offsetY -= scrollRect.y;
            }
            let m = buffer.globalMatrix;
            let context = buffer.context;
            let scissor = false;
            if (buffer.$hasScissor || m.b != 0 || m.c != 0) {
                buffer.context.pushMask(scrollRect.x + offsetX, scrollRect.y + offsetY, scrollRect.width, scrollRect.height);
            } else {
                let a = m.a;
                let d = m.d;
                let tx = m.tx;
                let ty = m.ty;
                let x = scrollRect.x + offsetX;
                let y = scrollRect.y + offsetY;
                let xMax = x + scrollRect.width;
                let yMax = y + scrollRect.height;
                let minX: number, minY: number, maxX: number, maxY: number;
                if (a == 1.0 && d == 1.0) {
                    minX = x + tx;
                    minY = y + ty;
                    maxX = xMax + tx;
                    maxY = yMax + ty;
                }
                else {
                    let x0 = a * x + tx;
                    let y0 = d * y + ty;
                    let x1 = a * xMax + tx;
                    let y1 = d * y + ty;
                    let x2 = a * xMax + tx;
                    let y2 = d * yMax + ty;
                    let x3 = a * x + tx;
                    let y3 = d * yMax + ty;

                    let tmp = 0;
                    if (x0 > x1) { tmp = x0; x0 = x1; x1 = tmp; }
                    if (x2 > x3) { tmp = x2; x2 = x3; x3 = tmp; }
                    minX = (x0 < x2 ? x0 : x2);
                    maxX = (x1 > x3 ? x1 : x3);

                    if (y0 > y1) { tmp = y0; y0 = y1; y1 = tmp; }
                    if (y2 > y3) { tmp = y2; y2 = y3; y3 = tmp; }
                    minY = (y0 < y2 ? y0 : y2);
                    maxY = (y1 > y3 ? y1 : y3);
                }
                context.enableScissor(minX, -maxY + buffer.height, maxX - minX, maxY - minY);
                scissor = true;
            }
            drawCalls += this.drawDisplayObject(displayObject, buffer, offsetX, offsetY);
            if (scissor) {
                context.disableScissor();
            } else {
                context.popMask();
            }
            return drawCalls;
        }

        /**
         * 将一个RenderNode对象绘制到渲染缓冲
         */
        public drawNodeToBuffer(node: sys.RenderNode, buffer: sys.RenderBuffer, matrix: Matrix, forHitTest?: boolean): void {
            let gpuBuffer: WebGPURenderBuffer = <WebGPURenderBuffer>buffer;
            gpuBuffer.context.pushBuffer(gpuBuffer);
            gpuBuffer.setTransform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
            this.renderNode(node, gpuBuffer, 0, 0, forHitTest);
            gpuBuffer.context.$drawWebGPU();
            gpuBuffer.onRenderFinish();
            gpuBuffer.context.popBuffer();
        }

        /**
         * @private
         */
        private renderNode(node: sys.RenderNode, buffer: WebGPURenderBuffer, offsetX: number, offsetY: number, forHitTest?: boolean): void {
            buffer.$offsetX = offsetX;
            buffer.$offsetY = offsetY;
            switch (node.type) {
                case sys.RenderNodeType.BitmapNode:
                    this.renderBitmap(<sys.BitmapNode>node, buffer);
                    break;
                case sys.RenderNodeType.TextNode:
                    this.renderText(<sys.TextNode>node, buffer);
                    break;
                case sys.RenderNodeType.GraphicsNode:
                    this.renderGraphics(<sys.GraphicsNode>node, buffer, forHitTest);
                    break;
                case sys.RenderNodeType.GroupNode:
                    this.renderGroup(<sys.GroupNode>node, buffer);
                    break;
                case sys.RenderNodeType.MeshNode:
                    this.renderMesh(<sys.MeshNode>node, buffer);
                    break;
                case sys.RenderNodeType.NormalBitmapNode:
                    this.renderNormalBitmap(<sys.NormalBitmapNode>node, buffer);
                    break;
            }
        }

        /**
         * @private
         */
        private renderNormalBitmap(node: sys.NormalBitmapNode, buffer: WebGPURenderBuffer): void {
            let image = node.image;
            if (!image) {
                return;
            }
            buffer.context.drawImage(image, node.sourceX, node.sourceY, node.sourceW, node.sourceH,
                node.drawX, node.drawY, node.drawW, node.drawH, node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
        }

        /**
         * @private
         */
        private renderBitmap(node: sys.BitmapNode, buffer: WebGPURenderBuffer): void {
            let image = node.image;
            if (!image) {
                return;
            }
            let data = node.drawData;
            let length = data.length;
            let pos = 0;
            let m = node.matrix;
            let blendMode = node.blendMode;
            let alpha = node.alpha;
            let savedMatrix: Matrix;
            let offsetX: number;
            let offsetY: number;
            if (m) {
                savedMatrix = Matrix.create();
                let curMatrix = buffer.globalMatrix;
                savedMatrix.a = curMatrix.a;
                savedMatrix.b = curMatrix.b;
                savedMatrix.c = curMatrix.c;
                savedMatrix.d = curMatrix.d;
                savedMatrix.tx = curMatrix.tx;
                savedMatrix.ty = curMatrix.ty;
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            if (blendMode) {
                buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
            }
            let originAlpha: number;
            if (alpha == alpha) {
                originAlpha = buffer.globalAlpha;
                buffer.globalAlpha *= alpha;
            }
            if (node.filter) {
                buffer.context.$filter = node.filter;
                while (pos < length) {
                    buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++],
                        data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                }
                buffer.context.$filter = null;
            }
            else {
                while (pos < length) {
                    buffer.context.drawImage(image, data[pos++], data[pos++], data[pos++], data[pos++],
                        data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.rotated, node.smoothing);
                }
            }
            if (blendMode) {
                buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
            }
            if (alpha == alpha) {
                buffer.globalAlpha = originAlpha;
            }
            if (m) {
                let matrix = buffer.globalMatrix;
                matrix.a = savedMatrix.a;
                matrix.b = savedMatrix.b;
                matrix.c = savedMatrix.c;
                matrix.d = savedMatrix.d;
                matrix.tx = savedMatrix.tx;
                matrix.ty = savedMatrix.ty;
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                Matrix.release(savedMatrix);
            }
        }

        /**
         * @private
         */
        private renderMesh(node: sys.MeshNode, buffer: WebGPURenderBuffer): void {
            let image = node.image;
            let data = node.drawData;
            let length = data.length;
            let pos = 0;
            let m = node.matrix;
            let blendMode = node.blendMode;
            let alpha = node.alpha;
            let savedMatrix: Matrix;
            let offsetX: number;
            let offsetY: number;
            if (m) {
                savedMatrix = Matrix.create();
                let curMatrix = buffer.globalMatrix;
                savedMatrix.a = curMatrix.a;
                savedMatrix.b = curMatrix.b;
                savedMatrix.c = curMatrix.c;
                savedMatrix.d = curMatrix.d;
                savedMatrix.tx = curMatrix.tx;
                savedMatrix.ty = curMatrix.ty;
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }
            if (blendMode) {
                buffer.context.setGlobalCompositeOperation(blendModes[blendMode]);
            }
            let originAlpha: number;
            if (alpha == alpha) {
                originAlpha = buffer.globalAlpha;
                buffer.globalAlpha *= alpha;
            }
            if (node.filter) {
                buffer.context.$filter = node.filter;
                while (pos < length) {
                    buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++],
                        data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                }
                buffer.context.$filter = null;
            }
            else {
                while (pos < length) {
                    buffer.context.drawMesh(image, data[pos++], data[pos++], data[pos++], data[pos++],
                        data[pos++], data[pos++], data[pos++], data[pos++], node.imageWidth, node.imageHeight, node.uvs, node.vertices, node.indices, node.bounds, node.rotated, node.smoothing);
                }
            }
            if (blendMode) {
                buffer.context.setGlobalCompositeOperation(defaultCompositeOp);
            }
            if (alpha == alpha) {
                buffer.globalAlpha = originAlpha;
            }
            if (m) {
                let matrix = buffer.globalMatrix;
                matrix.a = savedMatrix.a;
                matrix.b = savedMatrix.b;
                matrix.c = savedMatrix.c;
                matrix.d = savedMatrix.d;
                matrix.tx = savedMatrix.tx;
                matrix.ty = savedMatrix.ty;
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                Matrix.release(savedMatrix);
            }
        }

        private canvasRenderer: CanvasRenderer;
        private canvasRenderBuffer: CanvasRenderBuffer;

        /**
         * @private
         * 渲染文本节点（通过Canvas2D渲染后上传为纹理）
         */
        private renderText(node: sys.TextNode, buffer: WebGPURenderBuffer): void {
            let width = node.width - node.x;
            let height = node.height - node.y;
            if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                return;
            }
            let canvasScaleX = sys.DisplayList.$canvasScaleX;
            let canvasScaleY = sys.DisplayList.$canvasScaleY;
            let maxTextureSize = buffer.context.$maxTextureSize;
            if (width * canvasScaleX > maxTextureSize) {
                canvasScaleX *= maxTextureSize / (width * canvasScaleX);
            }
            if (height * canvasScaleY > maxTextureSize) {
                canvasScaleY *= maxTextureSize / (height * canvasScaleY);
            }
            width *= canvasScaleX;
            height *= canvasScaleY;
            let x = node.x * canvasScaleX;
            let y = node.y * canvasScaleY;
            if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                node.$canvasScaleX = canvasScaleX;
                node.$canvasScaleY = canvasScaleY;
                node.dirtyRender = true;
            }

            if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                this.canvasRenderer = new CanvasRenderer();
                this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
            }
            else if (node.dirtyRender) {
                this.canvasRenderBuffer.resize(width, height);
            }

            if (!this.canvasRenderBuffer.context) {
                return;
            }

            if (canvasScaleX != 1 || canvasScaleY != 1) {
                this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
            }

            if (x || y) {
                if (node.dirtyRender) {
                    this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, -x, -y);
                }
                buffer.transform(1, 0, 0, 1, x / canvasScaleX, y / canvasScaleY);
            }
            else if (canvasScaleX != 1 || canvasScaleY != 1) {
                this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
            }

            if (node.dirtyRender) {
                let surface = this.canvasRenderBuffer.surface;
                this.canvasRenderer.renderText(node, this.canvasRenderBuffer.context);
                // 创建或更新GPU纹理
                let texture = node.$texture as GPUTexture;
                if (!texture) {
                    texture = buffer.context.createTexture(<BitmapData><any>surface);
                    node.$texture = texture;
                } else {
                    texture = buffer.context.updateTexture(texture, <BitmapData><any>surface);
                    node.$texture = texture;
                }
                node.$textureWidth = surface.width;
                node.$textureHeight = surface.height;
            }

             let textureWidth = node.$textureWidth;
             let textureHeight = node.$textureHeight;
             
             // 使用drawImage来渲染文本纹理，让其处理render target的坐标翻转
             // 创建一个临时BitmapData对象来包装纹理
             let tempBitmapData = { source: null } as any;
             tempBitmapData["gpuTexture"] = node.$texture as GPUTexture;
             buffer.context.drawImage(tempBitmapData, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight, false);

             if (x || y) {
                 if (node.dirtyRender) {
                     this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
                 }
                 buffer.transform(1, 0, 0, 1, -x / canvasScaleX, -y / canvasScaleY);
             }
             node.dirtyRender = false;
        }

        /**
         * @private
         * 渲染Graphics节点（通过Canvas2D渲染后上传为纹理）
         */
        private renderGraphics(node: sys.GraphicsNode, buffer: WebGPURenderBuffer, forHitTest?: boolean): void {
            let width = node.width;
            let height = node.height;
            if (width <= 0 || height <= 0 || !width || !height || node.drawData.length == 0) {
                return;
            }
            let canvasScaleX = sys.DisplayList.$canvasScaleX;
            let canvasScaleY = sys.DisplayList.$canvasScaleY;
            if (width * canvasScaleX < 1 || height * canvasScaleY < 1) {
                canvasScaleX = canvasScaleY = 1;
            }
            if (node.$canvasScaleX != canvasScaleX || node.$canvasScaleY != canvasScaleY) {
                node.$canvasScaleX = canvasScaleX;
                node.$canvasScaleY = canvasScaleY;
                node.dirtyRender = true;
            }
            width = width * canvasScaleX;
            height = height * canvasScaleY;
            var width2 = Math.ceil(width);
            var height2 = Math.ceil(height);
            canvasScaleX *= width2 / width;
            canvasScaleY *= height2 / height;
            width = width2;
            height = height2;

            if (!this.canvasRenderBuffer || !this.canvasRenderBuffer.context) {
                this.canvasRenderer = new CanvasRenderer();
                this.canvasRenderBuffer = new CanvasRenderBuffer(width, height);
            }
            else if (node.dirtyRender) {
                this.canvasRenderBuffer.resize(width, height);
            }

            if (!this.canvasRenderBuffer.context) {
                return;
            }
            if (canvasScaleX != 1 || canvasScaleY != 1) {
                this.canvasRenderBuffer.context.setTransform(canvasScaleX, 0, 0, canvasScaleY, 0, 0);
            }
            if (node.x || node.y) {
                if (node.dirtyRender || forHitTest) {
                    this.canvasRenderBuffer.context.translate(-node.x, -node.y);
                }
                buffer.transform(1, 0, 0, 1, node.x, node.y);
            }
             let surface = this.canvasRenderBuffer.surface;
             if (forHitTest) {
                 this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context, true);
                 let texture = buffer.context.createTexture(<BitmapData><any>surface);
                 
                 // 使用drawImage来渲染Graphics纹理，让其处理render target的坐标翻转
                 let tempBitmapData = { source: null } as any;
                 tempBitmapData["gpuTexture"] = texture;
                 buffer.context.drawImage(tempBitmapData, 0, 0, width, height, 0, 0, width, height, surface.width, surface.height, false);
             } else {
                 if (node.dirtyRender) {
                     this.canvasRenderer.renderGraphics(node, this.canvasRenderBuffer.context);
                     let texture = node.$texture as GPUTexture;
                     if (!texture) {
                         texture = buffer.context.createTexture(<BitmapData><any>surface);
                         node.$texture = texture;
                     } else {
                         texture = buffer.context.updateTexture(texture, <BitmapData><any>surface);
                         node.$texture = texture;
                     }
                     node.$textureWidth = surface.width;
                     node.$textureHeight = surface.height;
                 }
                 let textureWidth = node.$textureWidth;
                 let textureHeight = node.$textureHeight;
                 
                 // 使用drawImage来渲染Graphics纹理，让其处理render target的坐标翻转
                 let tempBitmapData = { source: null } as any;
                 tempBitmapData["gpuTexture"] = node.$texture as GPUTexture;
                 buffer.context.drawImage(tempBitmapData, 0, 0, textureWidth, textureHeight, 0, 0, textureWidth / canvasScaleX, textureHeight / canvasScaleY, textureWidth, textureHeight, false);
             }

            if (node.x || node.y) {
                if (node.dirtyRender || forHitTest) {
                    this.canvasRenderBuffer.context.translate(node.x, node.y);
                }
                buffer.transform(1, 0, 0, 1, -node.x, -node.y);
            }
            if (!forHitTest) {
                node.dirtyRender = false;
            }
        }

        private renderGroup(groupNode: sys.GroupNode, buffer: WebGPURenderBuffer): void {
            let m = groupNode.matrix;
            let savedMatrix: Matrix;
            let offsetX: number;
            let offsetY: number;
            if (m) {
                savedMatrix = Matrix.create();
                let curMatrix = buffer.globalMatrix;
                savedMatrix.a = curMatrix.a;
                savedMatrix.b = curMatrix.b;
                savedMatrix.c = curMatrix.c;
                savedMatrix.d = curMatrix.d;
                savedMatrix.tx = curMatrix.tx;
                savedMatrix.ty = curMatrix.ty;
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);
            }

            let children = groupNode.drawData;
            let length = children.length;
            for (let i = 0; i < length; i++) {
                let node: sys.RenderNode = children[i];
                this.renderNode(node, buffer, buffer.$offsetX, buffer.$offsetY);
            }
            if (m) {
                let matrix = buffer.globalMatrix;
                matrix.a = savedMatrix.a;
                matrix.b = savedMatrix.b;
                matrix.c = savedMatrix.c;
                matrix.d = savedMatrix.d;
                matrix.tx = savedMatrix.tx;
                matrix.ty = savedMatrix.ty;
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                Matrix.release(savedMatrix);
            }
        }

        /**
         * @private
         */
        private createRenderBuffer(width: number, height: number): WebGPURenderBuffer {
            let buffer = gpuRenderBufferPool.pop();
            if (buffer) {
                buffer.resize(width, height);
                buffer.setTransform(1, 0, 0, 1, 0, 0);
            }
            else {
                buffer = new WebGPURenderBuffer(width, height);
                buffer.$computeDrawCall = false;
            }
            return buffer;
        }

        public renderClear(): void {
            const renderContext = WebGPURenderContext.getInstance();
            renderContext.$beforeRender();
        }
    }
}
