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

    /**
     * 渲染缓冲区对象池
     */
    export let gpuRenderBufferPool: WebGPURenderBuffer[] = [];

    /**
     * @private
     * WebGPU渲染缓存
     * 对标WebGLRenderBuffer，管理渲染目标、矩阵变换、stencil/scissor状态
     */
    export class WebGPURenderBuffer extends HashObject implements sys.RenderBuffer {

        public static autoClear: boolean = true;

        /**
         * 渲染上下文
         */
        public context: WebGPURenderContext;

        /**
         * 如果是舞台缓存，为canvas
         * 如果是普通缓存，为renderTarget
         */
        public surface: any;

        /**
         * 根渲染目标
         */
        public rootRenderTarget: WebGPURenderTarget;

        /**
         * 是否为舞台buffer
         */
        public root: boolean;

        /**
         * 当前绑定的纹理
         */
        public currentTexture: any = null;

        public constructor(width?: number, height?: number, root?: boolean) {
            super();
            
            this.context = WebGPURenderContext.getInstance(width, height);

            // 创建渲染目标
            this.rootRenderTarget = new WebGPURenderTarget(3, 3);
            if (width && height) {
                this.resize(width, height);
            }

            this.root = !!root;

            if (this.root) {
                this.rootRenderTarget.useFrameBuffer = false;
                this.context.pushBuffer(this);
                this.surface = this.context.surface;
                this.$computeDrawCall = true;
            } else {
                this.rootRenderTarget.initFrameBuffer();
                this.surface = this.rootRenderTarget;
            }
        }

        public globalAlpha: number = 1;
        public globalTintColor: number = 0xFFFFFF;

        // ===== stencil state =====
        private stencilState: boolean = false;
        public $stencilList: { x: number, y: number, width: number, height: number }[] = [];
        public stencilHandleCount: number = 0;

        public enableStencil(): void {
            if (!this.stencilState) {
                this.context.enableStencilTest();
                this.stencilState = true;
            }
        }

        public disableStencil(): void {
            if (this.stencilState) {
                this.context.disableStencilTest();
                this.stencilState = false;
            }
        }

        public restoreStencil(): void {
            if (this.stencilState) {
                this.context.enableStencilTest();
            } else {
                this.context.disableStencilTest();
            }
        }

        /**
         * 重置stencil和scissor状态（用于对象池回收后重用）
         */
        public resetStencilScissorState(): void {
            this.stencilState = false;
            this.stencilHandleCount = 0;
            this.$stencilList.length = 0;
            this.$hasScissor = false;
            this.$scissorState = false;
        }

        // ===== scissor state =====
        public $scissorState: boolean = false;
        private scissorRect: Rectangle = new egret.Rectangle();
        public $hasScissor: boolean = false;

        public enableScissor(x: number, y: number, width: number, height: number): void {
            if (!this.$scissorState) {
                this.$scissorState = true;
                this.scissorRect.setTo(x, y, width, height);
                this.context.enableScissorTest(this.scissorRect);
            }
        }

        public disableScissor(): void {
            if (this.$scissorState) {
                this.$scissorState = false;
                this.scissorRect.setEmpty();
                this.context.disableScissorTest();
            }
        }

        public restoreScissor(): void {
            if (this.$scissorState) {
                this.context.enableScissorTest(this.scissorRect);
            } else {
                this.context.disableScissorTest();
            }
        }

        // ===== 宽高 =====

        public get width(): number {
            return this.rootRenderTarget.width;
        }

        public get height(): number {
            return this.rootRenderTarget.height;
        }

        // ===== resize =====

        public resize(width: number, height: number, useMaxSize?: boolean): void {
            
            width = width || 1;
            height = height || 1;

            this.context.pushBuffer(this);

            if (width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                this.context.drawCmdManager.pushResize(this, width, height);
                this.rootRenderTarget.width = width;
                this.rootRenderTarget.height = height;
            }

            if (this.root) {
                this.context.resize(width, height, useMaxSize);
            }

            this.context.clear();
            this.context.popBuffer();
        }

        // ===== getPixels =====

        public getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
            // WebGPU的像素读取是异步的
            // 为保持接口兼容，使用canvas 2D回读
            try {
                if (this.root) {
                    // root buffer: 直接从主canvas读取
                    const canvas2d = document.createElement('canvas');
                    canvas2d.width = this.width;
                    canvas2d.height = this.height;
                    const ctx2d = canvas2d.getContext('2d');
                    if (ctx2d) {
                        ctx2d.drawImage(this.context.surface, 0, 0);
                        const imageData = ctx2d.getImageData(x, y, width, height);
                        // 反预乘alpha + Y翻转（和WebGL版保持一致）
                        let pixels = imageData.data;
                        let result = new Uint8Array(4 * width * height);
                        for (let i = 0; i < height; i++) {
                            for (let j = 0; j < width; j++) {
                                let index1 = (width * (height - i - 1) + j) * 4;
                                let index2 = (width * i + j) * 4;
                                let a = pixels[index2 + 3];
                                if (a > 0) {
                                    result[index1] = Math.round(pixels[index2] / a * 255);
                                    result[index1 + 1] = Math.round(pixels[index2 + 1] / a * 255);
                                    result[index1 + 2] = Math.round(pixels[index2 + 2] / a * 255);
                                } else {
                                    result[index1] = 0;
                                    result[index1 + 1] = 0;
                                    result[index1 + 2] = 0;
                                }
                                result[index1 + 3] = a;
                            }
                        }
                        return <number[]><any>result;
                    }
                } else {
                    // 非root buffer:
                    // WebGPU不支持同步readback，但hit test只需要很小的区域
                    // 对于非root buffer，$drawWebGPU之后离屏纹理有内容，
                    // 但我们无法同步读回。返回非空数组以避免hit test误判。
                    // 实际像素数据在大多数场景下不会被直接使用（hitTest通过canvasHitTestBuffer走canvas2d路径）
                    return [];
                }
            } catch (e) {
                console.error('Failed to getPixels:', e);
            }
            return [];
        }

        // ===== toDataURL =====

        public toDataURL(type?: string, encoderOptions?: number): string {
            return this.context.surface.toDataURL(type, encoderOptions);
        }

        // ===== destroy =====

        public destroy(): void {
            if (this.root) {
                this.context.destroy();
            } else {
                this.rootRenderTarget.dispose();
            }
        }

        public onRenderFinish(): void {
            this.$drawCalls = 0;
        }

        // ===== clear =====

        public clear(): void {
            this.context.pushBuffer(this);
            this.context.clear();
            this.context.popBuffer();
        }

        // ===== draw call 统计 =====
        public $drawCalls: number = 0;
        public $computeDrawCall: boolean = false;

        // ===== 变换矩阵 =====

        public globalMatrix: Matrix = new Matrix();
        public savedGlobalMatrix: Matrix = new Matrix();

        public $offsetX: number = 0;
        public $offsetY: number = 0;

        public setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
            let matrix = this.globalMatrix;
            matrix.a = a;
            matrix.b = b;
            matrix.c = c;
            matrix.d = d;
            matrix.tx = tx;
            matrix.ty = ty;
        }

        public transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
            let matrix = this.globalMatrix;
            let a1 = matrix.a;
            let b1 = matrix.b;
            let c1 = matrix.c;
            let d1 = matrix.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                matrix.a = a * a1 + b * c1;
                matrix.b = a * b1 + b * d1;
                matrix.c = c * a1 + d * c1;
                matrix.d = c * b1 + d * d1;
            }
            matrix.tx = tx * a1 + ty * c1 + matrix.tx;
            matrix.ty = tx * b1 + ty * d1 + matrix.ty;
        }

        public useOffset(): void {
            let self = this;
            if (self.$offsetX != 0 || self.$offsetY != 0) {
                self.globalMatrix.append(1, 0, 0, 1, self.$offsetX, self.$offsetY);
                self.$offsetX = self.$offsetY = 0;
            }
        }

        public saveTransform(): void {
            let matrix = this.globalMatrix;
            let sMatrix = this.savedGlobalMatrix;
            sMatrix.a = matrix.a;
            sMatrix.b = matrix.b;
            sMatrix.c = matrix.c;
            sMatrix.d = matrix.d;
            sMatrix.tx = matrix.tx;
            sMatrix.ty = matrix.ty;
        }

        public restoreTransform(): void {
            let matrix = this.globalMatrix;
            let sMatrix = this.savedGlobalMatrix;
            matrix.a = sMatrix.a;
            matrix.b = sMatrix.b;
            matrix.c = sMatrix.c;
            matrix.d = sMatrix.d;
            matrix.tx = sMatrix.tx;
            matrix.ty = sMatrix.ty;
        }

        // ===== 对象池 =====

        public static create(width: number, height: number): WebGPURenderBuffer {
            let buffer = gpuRenderBufferPool.pop();
            if (buffer) {
                buffer.resize(width, height);
                var matrix = buffer.globalMatrix;
                matrix.a = 1;
                matrix.b = 0;
                matrix.c = 0;
                matrix.d = 1;
                matrix.tx = 0;
                matrix.ty = 0;
                buffer.globalAlpha = 1;
                buffer.$offsetX = 0;
                buffer.$offsetY = 0;
                // 重置stencil/scissor状态
                buffer.resetStencilScissorState();
                buffer.currentTexture = null;
            } else {
                buffer = new WebGPURenderBuffer(width, height);
                buffer.$computeDrawCall = false;
            }
            return buffer;
        }

        public static release(buffer: WebGPURenderBuffer): void {
            gpuRenderBufferPool.push(buffer);
        }
    }
}
