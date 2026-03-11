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
     * @private
     * WebGPU渲染目标
     * 管理离屏渲染纹理，对应WebGL中的framebuffer+texture
     * 同时管理depth-stencil纹理（惰性创建，仅在需要stencil mask时创建）
     */
    export class WebGPURenderTarget extends HashObject {

        /**
         * 离屏渲染纹理（非root时使用）
         */
        public texture: GPUTexture = null;

        /**
         * 纹理视图
         */
        public textureView: GPUTextureView = null;

        /**
         * depth-stencil纹理（惰性创建）
         */
        public depthStencilTexture: GPUTexture = null;

        /**
         * depth-stencil纹理视图
         */
        public depthStencilTextureView: GPUTextureView = null;

        /**
         * 渲染目标宽度
         */
        public width: number;

        /**
         * 渲染目标高度
         */
        public height: number;

        /**
         * 清除颜色
         */
        public clearColor: [number, number, number, number] = [0, 0, 0, 0];

        /**
         * 是否使用离屏纹理渲染（类似WebGL的useFrameBuffer）
         */
        public useFrameBuffer: boolean = true;

        /**
         * 是否已启用模版缓冲
         */
        private _stencilEnabled: boolean = false;

        /**
         * depth-stencil格式
         */
        public static readonly DEPTH_STENCIL_FORMAT: GPUTextureFormat = 'depth24plus-stencil8';

        constructor(width: number, height: number) {
            super();
            this._resize(width, height);
        }

        private _resize(width: number, height: number): void {
            width = Math.max(width || 1, 1);
            height = Math.max(height || 1, 1);
            this.width = width;
            this.height = height;
        }

         /**
           * 调整渲染目标大小
           */
          public resize(width: number, height: number): void {
              this._resize(width, height);
              // 销毁旧纹理 - 使用延迟销毁避免WebGPU错误
              const context = WebGPURenderContext.getInstance();
              if (this.texture) {
                  // 使用context的延迟销毁机制
                  context.deleteGPUTexture(this.texture);
                  this.texture = null;
                  this.textureView = null;
              }
              // 销毁旧depth-stencil纹理
              // 重要：depthStencil也必须使用延迟销毁机制
              if (this.depthStencilTexture) {
                  const dsTexture = this.depthStencilTexture;
                  this.depthStencilTexture = null;
                  this.depthStencilTextureView = null;
                  
                  // depthStencil纹理也使用延迟销毁
                  context.deleteGPUTexture(dsTexture);
              }
              
              // 关键修复：如果原来启用了stencil，立即创建新的匹配尺寸的depthStencil纹理
              // 不要等到enabledStencil被调用，因为那时可能已经有RenderPass在等待
              if (this._stencilEnabled) {
                  this.createDepthStencilTexture();
              }
          }

        /**
         * 激活渲染目标 —— 确保离屏纹理已创建
         */
        public activate(): void {
            if (!this.useFrameBuffer) {
                return;
            }
            if (!this.texture) {
                this.initFrameBuffer();
            }
        }

        /**
         * 创建离屏渲染纹理
         */
        public initFrameBuffer(): void {
            if (this.texture) {
                return;
            }
            const device = WebGPURenderContext.getInstance().device;
            if (!device) {
                return;
            }
            this.texture = device.createTexture({
                size: { width: this.width, height: this.height, depthOrArrayLayers: 1 },
                format: navigator.gpu.getPreferredCanvasFormat(),
                usage: GPUTextureUsage.RENDER_ATTACHMENT |
                    GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_SRC |
                    GPUTextureUsage.COPY_DST,
            });
            this.textureView = this.texture.createView();
        }

        /**
         * 获取渲染通道的颜色附件视图
         * 对于root buffer返回canvas的当前纹理视图，
         * 对于离屏buffer返回离屏纹理视图
         */
        public getTextureView(): GPUTextureView {
            if (!this.useFrameBuffer) {
                // root buffer: 返回canvas当前纹理
                return null;
            }
            this.activate();
            return this.textureView;
        }

         /**
          * 确保depthStencil纹理尺寸与RenderTarget匹配
          * 如果尺寸不匹配，销毁旧的并创建新的
          */
         public ensureDepthStencilSize(): void {
             if (this.depthStencilTexture) {
                 // 检查depthStencil的尺寸是否与renderTarget匹配
                 if (this.depthStencilTexture.width !== this.width || this.depthStencilTexture.height !== this.height) {
                     // 尺寸不匹配，销毁旧的
                     try {
                         this.depthStencilTexture.destroy();
                     } catch (e) {
                         // 忽略销毁失败
                     }
                     this.depthStencilTexture = null;
                     this.depthStencilTextureView = null;
                 }
             }
         }

         /**
          * 惰性创建depth-stencil纹理
          * 对标WebGL中framebuffer上附加的DEPTH_STENCIL renderbuffer
          * 只在首次需要stencil mask时创建
          * RenderTarget resize时会销毁旧的depthStencil纹理
          */
         public enabledStencil(): void {
             this._stencilEnabled = true;
             // 先确保尺寸匹配
             this.ensureDepthStencilSize();
             // 如果depthStencil纹理不存在（首次或resize后），创建新的
             if (!this.depthStencilTexture) {
                 this.createDepthStencilTexture();
             }
         }

        /**
         * 是否已启用stencil
         */
        public get stencilEnabled(): boolean {
            return this._stencilEnabled;
        }

        /**
         * 创建depth-stencil纹理
         */
        private createDepthStencilTexture(): void {
            if (this.depthStencilTexture) {
                return;
            }
            const device = WebGPURenderContext.getInstance().device;
            if (!device) {
                return;
            }
            this.depthStencilTexture = device.createTexture({
                size: { width: this.width, height: this.height, depthOrArrayLayers: 1 },
                format: WebGPURenderTarget.DEPTH_STENCIL_FORMAT,
                usage: GPUTextureUsage.RENDER_ATTACHMENT,
            });
            this.depthStencilTextureView = this.depthStencilTexture.createView();
        }

        /**
         * 获取depth-stencil纹理视图（可能为null，表示不需要stencil）
         */
        public getDepthStencilTextureView(): GPUTextureView {
            return this.depthStencilTextureView;
        }

        /**
         * 清空渲染目标
         */
        public clear(bind?: boolean): void {
            // WebGPU中clear通过renderPass的loadOp:'clear'实现
            // 这里仅作为标记，实际clear在beginRenderPass时执行
        }

        /**
         * 销毁渲染目标
         */
        public dispose(): void {
            if (this.texture) {
                this.texture.destroy();
                this.texture = null;
                this.textureView = null;
            }
            if (this.depthStencilTexture) {
                this.depthStencilTexture.destroy();
                this.depthStencilTexture = null;
                this.depthStencilTextureView = null;
            }
        }
    }
}
