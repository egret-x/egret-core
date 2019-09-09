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

    export class AdvancedRenderCommand {

        private static readonly advancedRenderCommandStack: AdvancedRenderCommand[] = [];
        private static readonly advancedRenderCommandPool: AdvancedRenderCommand[] = [];

        public displayObject: DisplayObject;
        public buffer: egret.web.WebGLRenderBuffer;
        public offsetX: number;
        public offsetY: number;

        private constructor(displayObject: DisplayObject, buffer: egret.web.WebGLRenderBuffer, offsetX: number, offsetY: number) {
            this.displayObject = displayObject;
            this.buffer = buffer;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
        }

        public clear() {
            this.displayObject = null;
            this.buffer = null;
            this.offsetX = 0;
            this.offsetY = 0;
        }

        public static create(displayObject: DisplayObject, buffer: egret.web.WebGLRenderBuffer, offsetX: number, offsetY: number): AdvancedRenderCommand {
            const cmd = AdvancedRenderCommand.advancedRenderCommandPool.pop()
                || new AdvancedRenderCommand(displayObject, buffer, offsetX, offsetY);
            return cmd;
        }

        public static release(cmd: AdvancedRenderCommand): void {
            AdvancedRenderCommand.advancedRenderCommandPool.push(cmd);
        }

        public static pushCommand(cmd: AdvancedRenderCommand): void {
            AdvancedRenderCommand.advancedRenderCommandStack.push(cmd);
        }

        public static popCommand(): AdvancedRenderCommand {
            return AdvancedRenderCommand.advancedRenderCommandStack.pop();
        }
    }
}