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
     * WebGPU绘制命令类型
     */
    export const enum GPU_DRAWABLE_TYPE {
        TEXTURE,
        RECT,
        PUSH_MASK,
        POP_MASK,
        BLEND,
        RESIZE_TARGET,
        CLEAR_COLOR,
        ACT_BUFFER,
        ENABLE_SCISSOR,
        DISABLE_SCISSOR,
        SMOOTHING
    }

    /**
     * WebGPU绘制数据接口
     */
    export interface IGPUDrawData {
        type: number;
        count: number;
        texture: GPUTexture;
        filter: Filter;
        value: string;
        buffer: WebGPURenderBuffer;
        width: number;
        height: number;
        textureWidth: number;
        textureHeight: number;
        smoothing: boolean;
        x: number;
        y: number;
    }

    /**
     * @private
     * WebGPU绘制指令管理器
     * 与WebGLDrawCmdManager功能一致：维护drawData数组，支持批次合并
     */
    export class WebGPUDrawCmdManager {

        /**
         * 用于缓存绘制命令的数组
         */
        public readonly drawData: IGPUDrawData[] = [];

        public drawDataLen: number = 0;

        public constructor() {
        }

        /**
         * 压入绘制矩形指令
         */
        public pushDrawRect(): void {
            if (this.drawDataLen == 0 || this.drawData[this.drawDataLen - 1].type != GPU_DRAWABLE_TYPE.RECT) {
                let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
                data.type = GPU_DRAWABLE_TYPE.RECT;
                data.count = 0;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            }
            this.drawData[this.drawDataLen - 1].count += 2;
        }

        /**
         * 压入绘制texture指令
         */
        public pushDrawTexture(texture: any, count: number = 2, filter?: any, textureWidth?: number, textureHeight?: number): void {
            if (filter) {
                // 有滤镜的情况下不合并绘制
                let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
                data.type = GPU_DRAWABLE_TYPE.TEXTURE;
                data.texture = texture;
                data.filter = filter;
                data.count = count;
                data.textureWidth = textureWidth;
                data.textureHeight = textureHeight;
                this.drawData[this.drawDataLen] = data;
                this.drawDataLen++;
            } else {
                if (this.drawDataLen == 0 ||
                    this.drawData[this.drawDataLen - 1].type != GPU_DRAWABLE_TYPE.TEXTURE ||
                    texture != this.drawData[this.drawDataLen - 1].texture ||
                    this.drawData[this.drawDataLen - 1].filter) {
                    let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
                    data.type = GPU_DRAWABLE_TYPE.TEXTURE;
                    data.texture = texture;
                    data.count = 0;
                    this.drawData[this.drawDataLen] = data;
                    this.drawDataLen++;
                }
                this.drawData[this.drawDataLen - 1].count += count;
            }
        }

        /**
         * 压入smoothing变更指令
         */
        public pushChangeSmoothing(texture: any, smoothing: boolean): void {
            texture["smoothing"] = smoothing;
            let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
            data.type = GPU_DRAWABLE_TYPE.SMOOTHING;
            data.texture = texture;
            data.smoothing = smoothing;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * 压入pushMask指令
         */
        public pushPushMask(count: number = 1): void {
            let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
            data.type = GPU_DRAWABLE_TYPE.PUSH_MASK;
            data.count = count * 2;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * 压入popMask指令
         */
        public pushPopMask(count: number = 1): void {
            let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
            data.type = GPU_DRAWABLE_TYPE.POP_MASK;
            data.count = count * 2;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * 压入混色指令
         * 优化：从尾部向前搜索，跳过冗余blend命令（不使用splice避免O(n)位移）
         */
        public pushSetBlend(value: string): void {
            let len = this.drawDataLen;
            // 从尾部向前查找：如果在遇到绘制指令之前发现了相同的blend指令，则跳过
            for (let i = len - 1; i >= 0; i--) {
                let data = this.drawData[i];
                if (!data) continue;
                if (data.type == GPU_DRAWABLE_TYPE.TEXTURE || data.type == GPU_DRAWABLE_TYPE.RECT ||
                    data.type == GPU_DRAWABLE_TYPE.PUSH_MASK || data.type == GPU_DRAWABLE_TYPE.POP_MASK) {
                    break; // 遇到绘制指令，需要新的blend
                }
                if (data.type == GPU_DRAWABLE_TYPE.BLEND) {
                    if (data.value == value) {
                        return; // 已经是相同blend模式，跳过
                    }
                    // 不同blend模式但没有绘制指令间隔，直接覆盖
                    data.value = value;
                    return;
                }
            }
            let _data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
            _data.type = GPU_DRAWABLE_TYPE.BLEND;
            _data.value = value;
            this.drawData[this.drawDataLen] = _data;
            this.drawDataLen++;
        }

        /**
         * 压入resize render target命令
         */
        public pushResize(buffer: WebGPURenderBuffer, width: number, height: number): void {
            let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
            data.type = GPU_DRAWABLE_TYPE.RESIZE_TARGET;
            data.buffer = buffer;
            data.width = width;
            data.height = height;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * 压入clear color命令
         */
        public pushClearColor(): void {
            let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
            data.type = GPU_DRAWABLE_TYPE.CLEAR_COLOR;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * 压入激活buffer命令
         * 优化：从尾部向前搜索，覆盖冗余ACT_BUFFER命令（不使用splice避免O(n)位移）
         */
        public pushActivateBuffer(buffer: WebGPURenderBuffer): void {
            
            let len = this.drawDataLen;
            // 从尾部向前查找：如果在遇到绘制指令之前发现了ACT_BUFFER，直接覆盖
            for (let i = len - 1; i >= 0; i--) {
                let data = this.drawData[i];
                if (!data) continue;
                if (data.type != GPU_DRAWABLE_TYPE.BLEND && data.type != GPU_DRAWABLE_TYPE.ACT_BUFFER) {
                    break; // 遇到绘制指令或其他指令，需要新的ACT_BUFFER
                }
                if (data.type == GPU_DRAWABLE_TYPE.ACT_BUFFER) {
                    // 没有绘制指令间隔，直接覆盖
                    data.buffer = buffer;
                    data.width = buffer.rootRenderTarget.width;
                    data.height = buffer.rootRenderTarget.height;
                    return;
                }
            }
            let _data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
            _data.type = GPU_DRAWABLE_TYPE.ACT_BUFFER;
            _data.buffer = buffer;
            _data.width = buffer.rootRenderTarget.width;
            _data.height = buffer.rootRenderTarget.height;
            this.drawData[this.drawDataLen] = _data;
            this.drawDataLen++;
        }

        /**
         * 压入enable scissor命令
         */
        public pushEnableScissor(x: number, y: number, width: number, height: number): void {
            let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
            data.type = GPU_DRAWABLE_TYPE.ENABLE_SCISSOR;
            data.x = x;
            data.y = y;
            data.width = width;
            data.height = height;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * 压入disable scissor命令
         */
        public pushDisableScissor(): void {
            let data = this.drawData[this.drawDataLen] || <IGPUDrawData>{};
            data.type = GPU_DRAWABLE_TYPE.DISABLE_SCISSOR;
            this.drawData[this.drawDataLen] = data;
            this.drawDataLen++;
        }

        /**
         * 清空命令数组
         */
        public clear(): void {
            for (let i = 0; i < this.drawDataLen; i++) {
                let data = this.drawData[i];
                data.type = 0;
                data.count = 0;
                data.texture = null;
                data.filter = null;
                data.value = "";
                data.buffer = null;
                data.width = 0;
                data.height = 0;
                data.textureWidth = 0;
                data.textureHeight = 0;
                data.smoothing = false;
                data.x = 0;
                data.y = 0;
            }
            this.drawDataLen = 0;
        }
    }
}
