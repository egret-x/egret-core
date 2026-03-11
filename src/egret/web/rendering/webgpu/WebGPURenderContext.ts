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
     * WebGPU上下文对象，提供简单的绘图接口
     * 对标WebGLRenderContext —— 共用单例，管理绘制命令、纹理、管线、顶点缓冲
     */
    export class WebGPURenderContext {

        // ===== 单例 =====
        private static instance: WebGPURenderContext;
        public static getInstance(width?: number, height?: number): WebGPURenderContext {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new WebGPURenderContext(width, height);
            return this.instance;
        }

        // ===== GPU 核心对象 =====
        public device: GPUDevice = null;
        public canvasContext: GPUCanvasContext = null;
        public preferredFormat: GPUTextureFormat = 'bgra8unorm';
        public surface: HTMLCanvasElement;
        public contextLost: boolean = false;

        // ===== 绘制管理 =====
        public drawCmdManager: WebGPUDrawCmdManager;
        private vao: WebGPUVertexArrayObject;

        // ===== 缓冲区栈 =====
        public $bufferStack: WebGPURenderBuffer[];
        private currentBuffer: WebGPURenderBuffer;
        public activatedBuffer: WebGPURenderBuffer;

        // ===== 投影 =====
        public projectionX: number = NaN;
        public projectionY: number = NaN;
        public $maxTextureSize: number = 4096;

        // ===== GPU缓冲 =====
        private vertexGPUBuffer: GPUBuffer = null;
        private indexGPUBuffer: GPUBuffer = null;
        private uniformBuffer: GPUBuffer = null;

        // ===== 滤镜专用uniform缓冲 =====
        private filterUniformBuffer: GPUBuffer = null;
        private static readonly FILTER_UNIFORM_SIZE = 512; // 足够容纳最大的filter uniform数据

        // ===== 管线与着色器 =====
        private pipelineCache: { [key: string]: GPURenderPipeline } = {};
        private shaderModuleCache: { [key: string]: GPUShaderModule } = {};
        private samplerCache: { [key: string]: GPUSampler } = {};
        private bindGroupLayoutCache: { [key: string]: GPUBindGroupLayout } = {};
        private pipelineLayoutCache: { [key: string]: GPUPipelineLayout } = {};

        // ===== 纹理管理 =====
        private textureViewCache: Map<GPUTexture, GPUTextureView> = new Map();
        public _defaultEmptyTexture: GPUTexture = null;
        private _defaultEmptyTextureView: GPUTextureView = null;

        // ===== BindGroup缓存（减少每帧GC压力）=====
        private _primitiveBindGroup: GPUBindGroup = null;
        private _textureBindGroupCache: Map<string, GPUBindGroup> = new Map();
        private _bindGroupCacheFrameId: number = 0;
        private _currentFrameId: number = 0;

        // ===== 混合模式映射 =====
        public static blendModesForGPU: { [key: string]: GPUBlendState } = null;

        // ===== 当前滤镜 =====
        public $filter: ColorMatrixFilter = null;

        // ===== 当前混合模式 =====
        private currentBlendMode: string = "source-over";

        // ===== 初始化状态 =====
        public _initialized: boolean = false;
        private _initPromise: Promise<void> = null;

        public constructor(width?: number, height?: number) {
            this.surface = egret.sys.mainCanvas(width, height);
            this.$bufferStack = [];
            this.drawCmdManager = new WebGPUDrawCmdManager();
            this.vao = new WebGPUVertexArrayObject();

            this.setGlobalCompositeOperation("source-over");

            // 启动异步初始化
            this._initPromise = this.initWebGPU();
        }

        // ===================== 初始化 =====================

        private async initWebGPU(): Promise<void> {
            try {
                if (!navigator.gpu) {
                    throw new Error('WebGPU not supported');
                }

                const adapter = await navigator.gpu.requestAdapter({
                    powerPreference: 'high-performance'
                });
                if (!adapter) {
                    throw new Error('No appropriate WebGPU adapter found');
                }

                this.device = await adapter.requestDevice();
                if (!this.device) {
                    throw new Error('Failed to create WebGPU device');
                }

                // 设备丢失处理
                this.device.lost.then((info) => {
                    console.error('WebGPU device lost:', info.message, 'reason:', info.reason);
                    this.contextLost = true;
                    this._initialized = false;
                    // 如果不是主动销毁，尝试恢复
                    if (info.reason !== 'destroyed') {
                        console.log('Attempting WebGPU device recovery...');
                        this._initPromise = this.initWebGPU();
                    }
                });

                // 获取canvas上下文
                this.canvasContext = this.surface.getContext('webgpu') as GPUCanvasContext;
                this.preferredFormat = navigator.gpu.getPreferredCanvasFormat();
                this.canvasContext.configure({
                    device: this.device,
                    format: this.preferredFormat,
                    alphaMode: 'premultiplied',
                });

                this.$maxTextureSize = this.device.limits.maxTextureDimension2D || 4096;

                // 创建GPU缓冲
                this.createGPUBuffers();
                // 创建着色器模块
                this.createShaderModules();
                // 创建采样器
                this.createSamplers();
                // 创建管线布局
                this.createBindGroupLayouts();
                // 创建默认管线（含stencil变体）
                this.createDefaultPipelines();
                // 创建滤镜管线
                this.createFilterPipelines();
                // 创建默认空纹理
                this.createDefaultEmptyTexture();

                this._initialized = true;
                
            } catch (e) {
                console.error('WebGPU initialization failed:', e);
                this.contextLost = true;
            }
        }

        /**
         * 确保初始化完成
         */
        public async ensureInitialized(): Promise<boolean> {
            if (this._initialized) return true;
            if (this._initPromise) {
                await this._initPromise;
            }
            return this._initialized;
        }

        // ===================== GPU 缓冲创建 =====================

        private createGPUBuffers(): void {
            const maxVertBytes = 2048 * 4 * 5 * 4; // maxQuads * 4verts * 5floats * 4bytes
            this.vertexGPUBuffer = this.device.createBuffer({
                size: maxVertBytes,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
            });

            const maxIndexBytes = 2048 * 6 * 2; // maxQuads * 6indices * 2bytes(uint16)
            this.indexGPUBuffer = this.device.createBuffer({
                size: maxIndexBytes,
                usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
            });

            // uniform buffer: projectionVector(2 floats) + padding，对齐到256字节
            this.uniformBuffer = this.device.createBuffer({
                size: 256,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            // 滤镜专用uniform buffer
            this.filterUniformBuffer = this.device.createBuffer({
                size: WebGPURenderContext.FILTER_UNIFORM_SIZE,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
        }

        // ===================== 着色器 =====================

        private createShaderModules(): void {
            this.shaderModuleCache['default_vert'] = this.device.createShaderModule({
                code: this.getVertexShaderCode()
            });
            this.shaderModuleCache['texture_frag'] = this.device.createShaderModule({
                code: this.getTextureFragShaderCode()
            });
            this.shaderModuleCache['primitive_frag'] = this.device.createShaderModule({
                code: this.getPrimitiveFragShaderCode()
            });
            this.shaderModuleCache['colorTransform_frag'] = this.device.createShaderModule({
                code: this.getColorTransformFragShaderCode()
            });
            this.shaderModuleCache['blur_frag'] = this.device.createShaderModule({
                code: this.getBlurFragShaderCode()
            });
            this.shaderModuleCache['glow_frag'] = this.device.createShaderModule({
                code: this.getGlowFragShaderCode()
            });
            // ETC alpha mask着色器
            this.shaderModuleCache['texture_etc_alphamask_frag'] = this.device.createShaderModule({
                code: WGShaderLib.texture_etc_alphamask_frag
            });
            this.shaderModuleCache['colorTransform_etc_alphamask_frag'] = this.device.createShaderModule({
                code: WGShaderLib.colorTransform_frag_etc_alphamask_frag
            });
        }

        /**
         * 顶点着色器：从uniform读取projectionVector
         */
        private getVertexShaderCode(): string {
            return `
struct Uniforms {
    projectionVector: vec2<f32>,
};

@group(0) @binding(0)
var<uniform> u: Uniforms;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

@vertex
fn main(
    @location(0) aVertexPosition: vec2<f32>,
    @location(1) aTextureCoord: vec2<f32>,
    @location(2) aColor: vec4<f32>,
) -> VertexOutput {
    var output: VertexOutput;
    let center = vec2<f32>(-1.0, 1.0);
    output.position = vec4<f32>((aVertexPosition / u.projectionVector) + center, 0.0, 1.0);
    output.vTextureCoord = aTextureCoord;
    output.vColor = aColor;
    return output;
}`;
        }

        /**
         * 纹理片段着色器
         */
        private getTextureFragShaderCode(): string {
            return WGShaderLib.texture_frag;
        }

        /**
         * 纯色片段着色器（用于矩形/遮罩）
         */
        private getPrimitiveFragShaderCode(): string {
            return `
struct FragmentInput {
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    return input.vColor;
}`;
        }

        /**
         * colorTransform片段着色器
         * group(0): binding(0)=uniform(projectionVector), binding(1)=sampler, binding(2)=texture
         * group(1): binding(0)=uniform(ColorMatrix: mat4x4+vec4)
         */
        private getColorTransformFragShaderCode(): string {
            return `
struct FragmentInput {
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

struct ColorMatrix {
    matrix: mat4x4<f32>,
    colorAdd: vec4<f32>,
};

@group(1) @binding(0)
var<uniform> cm: ColorMatrix;

@group(0) @binding(1)
var uSampler: sampler;

@group(0) @binding(2)
var uTexture: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
     // WebGPU 纹理坐标 Y 需要翻转
     let uv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);
     var texColor = textureSample(uTexture, uSampler, uv);
     if (texColor.a > 0.0) {
         texColor = vec4<f32>(texColor.rgb / texColor.a, texColor.a);
     }
     var locColor = clamp(texColor * cm.matrix + cm.colorAdd, vec4<f32>(0.0), vec4<f32>(1.0));
     return input.vColor * vec4<f32>(locColor.rgb * locColor.a, locColor.a);
}`;
        }

        /**
         * blur片段着色器
         * group(1): binding(0)=uniform(blur: vec2, padding, uTextureSize: vec2, padding)
         */
        private getBlurFragShaderCode(): string {
            return `
struct FragmentInput {
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

struct BlurUniforms {
    blur: vec2<f32>,
    padding: vec2<f32>,
    uTextureSize: vec2<f32>,
    padding2: vec2<f32>,
};

@group(1) @binding(0)
var<uniform> bu: BlurUniforms;

@group(0) @binding(1)
var uSampler: sampler;

@group(0) @binding(2)
var uTexture: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
     let sampleRadius = 5;
     let samples = sampleRadius * 2 + 1;
     var blurUv = bu.blur / bu.uTextureSize;
     var color = vec4<f32>(0.0, 0.0, 0.0, 0.0);
     var uv = vec2<f32>(0.0, 0.0);
     blurUv = blurUv / f32(sampleRadius);
     // WebGPU 纹理坐标 Y 需要翻转
     let baseY = 1.0 - input.vTextureCoord.y;
 
     for (var i = -sampleRadius; i <= sampleRadius; i = i + 1) {
         uv.x = input.vTextureCoord.x + f32(i) * blurUv.x;
         uv.y = baseY + f32(i) * blurUv.y;
         color = color + textureSample(uTexture, uSampler, uv);
     }
 
     color = color / f32(samples);
     return color;
}`;
        }

        /**
         * glow片段着色器
         * group(1): binding(0)=uniform(GlowUniforms)
         */
        private getGlowFragShaderCode(): string {
            return `
struct FragmentInput {
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

struct GlowUniforms {
    dist: f32,
    angle: f32,
    padding0: vec2<f32>,
    color: vec4<f32>,
    alpha: f32,
    blurX: f32,
    blurY: f32,
    strength: f32,
    inner: f32,
    knockout: f32,
    hideObject: f32,
    padding1: f32,
    uTextureSize: vec2<f32>,
    padding2: vec2<f32>,
};

@group(1) @binding(0)
var<uniform> gu: GlowUniforms;

@group(0) @binding(1)
var uSampler: sampler;

@group(0) @binding(2)
var uTexture: texture_2d<f32>;

fn random(scale: vec2<f32>, fragCoord: vec2<f32>) -> f32 {
    return fract(sin(dot(fragCoord, scale)) * 43758.5453);
}

@fragment
fn main(input: FragmentInput, @builtin(position) fragCoord: vec4<f32>) -> @location(0) vec4<f32> {
     // WebGPU 纹理坐标 Y 需要翻转
     let baseUv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);
     
     let px = vec2<f32>(1.0 / gu.uTextureSize.x, 1.0 / gu.uTextureSize.y);
     let linearSamplingTimes = 7.0;
     let circleSamplingTimes = 12.0;
     var ownColor = textureSample(uTexture, uSampler, baseUv);
     var curColor: vec4<f32>;
     var totalAlpha = 0.0;
     var maxTotalAlpha = 0.0;
     var curDistanceX = 0.0;
     var curDistanceY = 0.0;
     var offsetX = gu.dist * cos(gu.angle) * px.x;
     var offsetY = gu.dist * sin(gu.angle) * px.y;
 
     let PI = 3.14159265358979323846264;
     var cosAngle: f32;
     var sinAngle: f32;
     var offset = PI * 2.0 / circleSamplingTimes * random(vec2<f32>(12.9898, 78.233), fragCoord.xy);
     var stepX = gu.blurX * px.x / linearSamplingTimes;
     var stepY = gu.blurY * px.y / linearSamplingTimes;
 
     var a = 0.0;
     loop {
         if (a > PI * 2.0) {
             break;
         }
         cosAngle = cos(a + offset);
         sinAngle = sin(a + offset);
         for (var i = 1.0; i <= linearSamplingTimes; i = i + 1.0) {
             curDistanceX = i * stepX * cosAngle;
             curDistanceY = i * stepY * sinAngle;
             let sampleX = input.vTextureCoord.x + curDistanceX - offsetX;
             let sampleY = baseUv.y + curDistanceY + offsetY;
             let sampleCoord = clamp(vec2<f32>(sampleX, sampleY), vec2<f32>(0.0, 0.0), vec2<f32>(1.0, 1.0));
             curColor = textureSample(uTexture, uSampler, sampleCoord);
            let inBounds = f32(sampleX >= 0.0 && sampleY <= 1.0);
            totalAlpha = totalAlpha + (linearSamplingTimes - i) * curColor.a * inBounds;
            maxTotalAlpha = maxTotalAlpha + (linearSamplingTimes - i);
        }
        a = a + PI * 2.0 / circleSamplingTimes;
    }

    ownColor.a = max(ownColor.a, 0.0001);
    ownColor = vec4<f32>(ownColor.rgb / ownColor.a, ownColor.a);

    let outerGlowAlpha = (totalAlpha / maxTotalAlpha) * gu.strength * gu.alpha * (1.0 - gu.inner) * max(min(gu.hideObject, gu.knockout), 1.0 - ownColor.a);
    let innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * gu.strength * gu.alpha * gu.inner * ownColor.a;

    ownColor.a = max(ownColor.a * gu.knockout * (1.0 - gu.hideObject), 0.0001);
    let mix1 = mix(ownColor.rgb, gu.color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));
    let mix2 = mix(mix1, gu.color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));
    let resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.0);
    return vec4<f32>(mix2 * resultAlpha, resultAlpha);
}`;
        }

        // ===================== 采样器 =====================

        private createSamplers(): void {
            this.samplerCache['linear'] = this.device.createSampler({
                magFilter: 'linear',
                minFilter: 'linear',
                addressModeU: 'clamp-to-edge',
                addressModeV: 'clamp-to-edge',
            });
            this.samplerCache['nearest'] = this.device.createSampler({
                magFilter: 'nearest',
                minFilter: 'nearest',
                addressModeU: 'clamp-to-edge',
                addressModeV: 'clamp-to-edge',
            });
        }

        // ===================== BindGroup布局 =====================

        private createBindGroupLayouts(): void {
            // group(0) texture管线布局：uniform + sampler + texture
            this.bindGroupLayoutCache['texture'] = this.device.createBindGroupLayout({
                entries: [
                    { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' as const } },
                    { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' as const } },
                    { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' as const } },
                ]
            });
            // group(0) primitive管线布局：仅uniform
            this.bindGroupLayoutCache['primitive'] = this.device.createBindGroupLayout({
                entries: [
                    { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' as const } },
                ]
            });
            // group(1) filter uniform布局：单一uniform buffer（用于colorTransform/blur/glow）
            this.bindGroupLayoutCache['filter'] = this.device.createBindGroupLayout({
                entries: [
                    { binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: { type: 'uniform' as const } },
                ]
            });
            // group(0) ETC alpha mask纹理布局：uniform + sampler + texture + alphaMaskSampler + alphaMaskTexture
            this.bindGroupLayoutCache['texture_etc_alpha'] = this.device.createBindGroupLayout({
                entries: [
                    { binding: 0, visibility: GPUShaderStage.VERTEX, buffer: { type: 'uniform' as const } },
                    { binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' as const } },
                    { binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' as const } },
                    { binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: { type: 'filtering' as const } },
                    { binding: 4, visibility: GPUShaderStage.FRAGMENT, texture: { sampleType: 'float' as const } },
                ]
            });

            this.pipelineLayoutCache['texture'] = this.device.createPipelineLayout({
                bindGroupLayouts: [this.bindGroupLayoutCache['texture']]
            });
            this.pipelineLayoutCache['primitive'] = this.device.createPipelineLayout({
                bindGroupLayouts: [this.bindGroupLayoutCache['primitive']]
            });
            // filter管线布局 = group(0)=texture + group(1)=filter
            this.pipelineLayoutCache['filter'] = this.device.createPipelineLayout({
                bindGroupLayouts: [this.bindGroupLayoutCache['texture'], this.bindGroupLayoutCache['filter']]
            });
            // ETC alpha mask管线布局
            this.pipelineLayoutCache['texture_etc_alpha'] = this.device.createPipelineLayout({
                bindGroupLayouts: [this.bindGroupLayoutCache['texture_etc_alpha']]
            });
            // ETC alpha mask + filter
            this.pipelineLayoutCache['filter_etc_alpha'] = this.device.createPipelineLayout({
                bindGroupLayouts: [this.bindGroupLayoutCache['texture_etc_alpha'], this.bindGroupLayoutCache['filter']]
            });
        }

        // ===================== 顶点缓冲布局 =====================

        private readonly vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 20, // 5 * 4bytes
            attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x2' as const },   // position
                { shaderLocation: 1, offset: 8, format: 'float32x2' as const },   // uv
                { shaderLocation: 2, offset: 16, format: 'unorm8x4' as const },   // color (RGBA packed)
            ]
        };

        // ===================== depthStencil描述 =====================

        private readonly depthStencilState: GPUDepthStencilState = {
            format: 'depth24plus-stencil8',
            depthWriteEnabled: false,
            depthCompare: 'always',
            stencilFront: {
                compare: 'always',
                failOp: 'keep',
                depthFailOp: 'keep',
                passOp: 'keep',
            },
            stencilBack: {
                compare: 'always',
                failOp: 'keep',
                depthFailOp: 'keep',
                passOp: 'keep',
            },
        };

        // ===================== 默认管线 =====================

        private createDefaultPipelines(): void {
            // 为每种blend模式创建texture/primitive管线（不带stencil）
            for (const blendName in WebGPURenderContext.blendModesForGPU) {
                const blendState = WebGPURenderContext.blendModesForGPU[blendName];
                this.pipelineCache['texture_' + blendName] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['texture'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['texture_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: blendState }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                });

                this.pipelineCache['primitive_' + blendName] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['primitive'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['primitive_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: blendState }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                });

                // ===== 带stencil的管线变体 =====
                // texture + stencil (stencilCompare=equal, stencilOp=keep)
                this.pipelineCache['texture_stencil_' + blendName] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['texture'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['texture_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: blendState }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                    depthStencil: {
                        format: 'depth24plus-stencil8',
                        depthWriteEnabled: false,
                        depthCompare: 'always',
                        stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                        stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                    },
                });

                // primitive + stencil
                this.pipelineCache['primitive_stencil_' + blendName] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['primitive'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache['primitive_frag'],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: blendState }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                    depthStencil: {
                        format: 'depth24plus-stencil8',
                        depthWriteEnabled: false,
                        depthCompare: 'always',
                        stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                        stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                    },
                });
            }

            // ===== stencil push管线：写stencil(incr), 不写color =====
            this.pipelineCache['stencil_push'] = this.device.createRenderPipeline({
                layout: this.pipelineLayoutCache['primitive'],
                vertex: {
                    module: this.shaderModuleCache['default_vert'],
                    entryPoint: 'main',
                    buffers: [this.vertexBufferLayout],
                },
                fragment: {
                    module: this.shaderModuleCache['primitive_frag'],
                    entryPoint: 'main',
                    targets: [{ format: this.preferredFormat, writeMask: 0 }],  // colorMask全关
                },
                primitive: { topology: 'triangle-list', cullMode: 'none' },
                depthStencil: {
                    format: 'depth24plus-stencil8',
                    depthWriteEnabled: false,
                    depthCompare: 'always',
                    stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'increment-clamp' },
                    stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'increment-clamp' },
                },
            });

            // ===== stencil pop管线：写stencil(decr), 不写color =====
            this.pipelineCache['stencil_pop'] = this.device.createRenderPipeline({
                layout: this.pipelineLayoutCache['primitive'],
                vertex: {
                    module: this.shaderModuleCache['default_vert'],
                    entryPoint: 'main',
                    buffers: [this.vertexBufferLayout],
                },
                fragment: {
                    module: this.shaderModuleCache['primitive_frag'],
                    entryPoint: 'main',
                    targets: [{ format: this.preferredFormat, writeMask: 0 }],  // colorMask全关
                },
                primitive: { topology: 'triangle-list', cullMode: 'none' },
                depthStencil: {
                    format: 'depth24plus-stencil8',
                    depthWriteEnabled: false,
                    depthCompare: 'always',
                    stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'decrement-clamp' },
                    stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'decrement-clamp' },
                },
            });

            // ===== ETC alpha mask管线 =====
            const defaultBlendETC = WebGPURenderContext.blendModesForGPU["source-over"];
            this.pipelineCache['texture_etc_alpha_source-over'] = this.device.createRenderPipeline({
                layout: this.pipelineLayoutCache['texture_etc_alpha'],
                vertex: {
                    module: this.shaderModuleCache['default_vert'],
                    entryPoint: 'main',
                    buffers: [this.vertexBufferLayout],
                },
                fragment: {
                    module: this.shaderModuleCache['texture_etc_alphamask_frag'],
                    entryPoint: 'main',
                    targets: [{ format: this.preferredFormat, blend: defaultBlendETC }],
                },
                primitive: { topology: 'triangle-list', cullMode: 'none' },
            });
            // ETC alpha mask + colorTransform filter
            this.pipelineCache['filter_colorTransform_etc_alpha'] = this.device.createRenderPipeline({
                layout: this.pipelineLayoutCache['filter_etc_alpha'],
                vertex: {
                    module: this.shaderModuleCache['default_vert'],
                    entryPoint: 'main',
                    buffers: [this.vertexBufferLayout],
                },
                fragment: {
                    module: this.shaderModuleCache['colorTransform_etc_alphamask_frag'],
                    entryPoint: 'main',
                    targets: [{ format: this.preferredFormat, blend: defaultBlendETC }],
                },
                primitive: { topology: 'triangle-list', cullMode: 'none' },
            });
        }

        // ===================== 滤镜管线 =====================

        private createFilterPipelines(): void {
            const defaultBlend = WebGPURenderContext.blendModesForGPU["source-over"];
            const filterShaders = ['colorTransform_frag', 'blur_frag', 'glow_frag'];

            for (const shaderName of filterShaders) {
                const pipelineKey = 'filter_' + shaderName;
                this.pipelineCache[pipelineKey] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['filter'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache[shaderName],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: defaultBlend }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                });

                // stencil变体
                this.pipelineCache[pipelineKey + '_stencil'] = this.device.createRenderPipeline({
                    layout: this.pipelineLayoutCache['filter'],
                    vertex: {
                        module: this.shaderModuleCache['default_vert'],
                        entryPoint: 'main',
                        buffers: [this.vertexBufferLayout],
                    },
                    fragment: {
                        module: this.shaderModuleCache[shaderName],
                        entryPoint: 'main',
                        targets: [{ format: this.preferredFormat, blend: defaultBlend }],
                    },
                    primitive: { topology: 'triangle-list', cullMode: 'none' },
                    depthStencil: {
                        format: 'depth24plus-stencil8',
                        depthWriteEnabled: false,
                        depthCompare: 'always',
                        stencilFront: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                        stencilBack: { compare: 'equal', failOp: 'keep', depthFailOp: 'keep', passOp: 'keep' },
                    },
                });
            }
        }

        public getTexturePipeline(blendMode: string, useStencil: boolean = false): GPURenderPipeline {
            let key = useStencil ? 'texture_stencil_' + blendMode : 'texture_' + blendMode;
            return this.pipelineCache[key] || this.pipelineCache[useStencil ? 'texture_stencil_source-over' : 'texture_source-over'];
        }

        public getPrimitivePipeline(blendMode: string, useStencil: boolean = false): GPURenderPipeline {
            let key = useStencil ? 'primitive_stencil_' + blendMode : 'primitive_' + blendMode;
            return this.pipelineCache[key] || this.pipelineCache[useStencil ? 'primitive_stencil_source-over' : 'primitive_source-over'];
        }

        /**
         * 根据filter类型获取对应的pipeline
         */
        public getFilterPipeline(filter: Filter, useStencil: boolean = false): GPURenderPipeline {
            let shaderName: string;
            if (filter.type === "colorTransform") {
                shaderName = 'colorTransform_frag';
            } else if (filter.type === "blurX" || filter.type === "blurY") {
                shaderName = 'blur_frag';
            } else if (filter.type === "glow") {
                shaderName = 'glow_frag';
            } else {
                // custom or unknown: fall back to texture pipeline
                return this.getTexturePipeline("source-over", useStencil);
            }
            let key = 'filter_' + shaderName + (useStencil ? '_stencil' : '');
            return this.pipelineCache[key];
        }

        /**
         * 填充filter uniform buffer并返回对应的bind group
         */
        private createFilterBindGroup(filter: Filter, textureWidth: number, textureHeight: number): GPUBindGroup {
            const uniformData = this.buildFilterUniformData(filter, textureWidth, textureHeight);
            if (!uniformData) return null;

            this.device.queue.writeBuffer(this.filterUniformBuffer, 0, uniformData);

            return this.device.createBindGroup({
                layout: this.bindGroupLayoutCache['filter'],
                entries: [
                    { binding: 0, resource: { buffer: this.filterUniformBuffer, size: uniformData.byteLength } },
                ]
            });
        }

        /**
         * 构建filter uniform数据
         */
        private buildFilterUniformData(filter: Filter, textureWidth: number, textureHeight: number): Float32Array {
            const filterScale = filter.$uniforms.$filterScale || 1;

            if (filter.type === "colorTransform") {
                // ColorMatrix: mat4x4(16 floats) + colorAdd(4 floats) = 80 bytes
                const data = new Float32Array(20);
                const matrix = filter.$uniforms.matrix;
                const colorAdd = filter.$uniforms.colorAdd;
                if (matrix) {
                    for (let i = 0; i < 16; i++) {
                        data[i] = matrix[i];
                    }
                }
                if (colorAdd) {
                    data[16] = colorAdd[0];
                    data[17] = colorAdd[1];
                    data[18] = colorAdd[2];
                    data[19] = colorAdd[3];
                }
                return data;
            } else if (filter.type === "blurX" || filter.type === "blurY") {
                // BlurUniforms: blur(2) + padding(2) + uTextureSize(2) + padding(2) = 32 bytes
                const data = new Float32Array(8);
                const blur = filter.$uniforms.blur;
                if (blur) {
                    data[0] = (blur.x !== undefined ? blur.x : 0) * filterScale;
                    data[1] = (blur.y !== undefined ? blur.y : 0) * filterScale;
                }
                data[4] = textureWidth;
                data[5] = textureHeight;
                return data;
            } else if (filter.type === "glow") {
                // GlowUniforms: dist(1) + angle(1) + padding(2) + color(4) + alpha(1) + blurX(1) + blurY(1) + strength(1) + inner(1) + knockout(1) + hideObject(1) + padding(1) + uTextureSize(2) + padding(2) = 64 bytes
                const data = new Float32Array(16);
                const u = filter.$uniforms;
                data[0] = (u.dist || 0) * filterScale;
                data[1] = u.angle || 0;
                // data[2], data[3] = padding
                if (u.color) {
                    data[4] = u.color[0] || 0;
                    data[5] = u.color[1] || 0;
                    data[6] = u.color[2] || 0;
                    data[7] = u.color[3] || 0;
                }
                data[8] = u.alpha !== undefined ? u.alpha : 1;
                data[9] = (u.blurX || 0) * filterScale;
                data[10] = (u.blurY || 0) * filterScale;
                data[11] = u.strength || 0;
                data[12] = u.inner || 0;
                data[13] = u.knockout || 0;
                data[14] = u.hideObject || 0;
                // data[15] = padding
                // We need a second vec4 for uTextureSize + padding
                // But we only have 16 floats (64 bytes). Let's extend to 20 floats (80 bytes)
                // Actually the struct needs uTextureSize at offset 48+. Let me recalculate.
                // The WGSL struct:
                //   dist: f32           [0]
                //   angle: f32          [4]
                //   padding0: vec2<f32> [8]
                //   color: vec4<f32>    [16]
                //   alpha: f32          [32]
                //   blurX: f32          [36]
                //   blurY: f32          [40]
                //   strength: f32       [44]
                //   inner: f32          [48]
                //   knockout: f32       [52]
                //   hideObject: f32     [56]
                //   padding1: f32       [60]
                //   uTextureSize: vec2  [64]
                //   padding2: vec2      [72]
                // Total = 80 bytes = 20 floats
                return this.buildGlowUniformData(filter, textureWidth, textureHeight, filterScale);
            }
            return null;
        }

        private buildGlowUniformData(filter: Filter, textureWidth: number, textureHeight: number, filterScale: number): Float32Array {
            const data = new Float32Array(20); // 80 bytes
            const u = filter.$uniforms;
            data[0] = (u.dist || 0) * filterScale;    // dist
            data[1] = u.angle || 0;                     // angle
            // data[2], data[3] = padding0
            data[4] = u.color ? (u.color[0] || 0) : 0;  // color.r
            data[5] = u.color ? (u.color[1] || 0) : 0;  // color.g
            data[6] = u.color ? (u.color[2] || 0) : 0;  // color.b
            data[7] = u.color ? (u.color[3] || 0) : 0;  // color.a
            data[8] = u.alpha !== undefined ? u.alpha : 1;  // alpha
            data[9] = (u.blurX || 0) * filterScale;   // blurX
            data[10] = (u.blurY || 0) * filterScale;  // blurY
            data[11] = u.strength || 0;                  // strength
            data[12] = u.inner || 0;                     // inner
            data[13] = u.knockout || 0;                  // knockout
            data[14] = u.hideObject || 0;                // hideObject
            data[15] = 0;                                // padding1
            data[16] = textureWidth;                     // uTextureSize.x
            data[17] = textureHeight;                    // uTextureSize.y
            data[18] = 0;                                // padding2.x
            data[19] = 0;                                // padding2.y
            return data;
        }

        // ===================== 默认空纹理 =====================

        private createDefaultEmptyTexture(): void {
            const size = 16;
            this._defaultEmptyTexture = this.device.createTexture({
                size: { width: size, height: size },
                format: this.preferredFormat,
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            });
            this._defaultEmptyTextureView = this._defaultEmptyTexture.createView();

            const canvas = egret.sys.createCanvas(size, size);
            const ctx = egret.sys.getContext2d(canvas);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            const imageData = ctx.getImageData(0, 0, size, size);
            this.device.queue.writeTexture(
                { texture: this._defaultEmptyTexture },
                imageData.data.buffer,
                { bytesPerRow: size * 4, rowsPerImage: size },
                { width: size, height: size }
            );
        }

        public get defaultEmptyTexture(): GPUTexture { return this._defaultEmptyTexture; }
        public get defaultEmptyTextureView(): GPUTextureView { return this._defaultEmptyTextureView; }

        // ===================== BindGroup 缓存 =====================

        /**
         * 获取或创建primitive bind group（仅包含uniform buffer，每帧不变）
         */
        private getPrimitiveBindGroup(): GPUBindGroup {
            if (!this._primitiveBindGroup) {
                this._primitiveBindGroup = this.device.createBindGroup({
                    layout: this.bindGroupLayoutCache['primitive'],
                    entries: [
                        { binding: 0, resource: { buffer: this.uniformBuffer } },
                    ]
                });
            }
            return this._primitiveBindGroup;
        }

        /**
         * 投影参数变化时使primitive bind group失效
         */
        private invalidatePrimitiveBindGroup(): void {
            this._primitiveBindGroup = null;
        }

        /**
         * 获取纹理bind group（按纹理+采样器组合缓存）
         */
        private getTextureBindGroup(texture: GPUTexture, smoothing: boolean): GPUBindGroup {
            // 每帧开始时清空缓存（因为投影uniform可能变化）
            if (this._bindGroupCacheFrameId !== this._currentFrameId) {
                this._textureBindGroupCache.clear();
                this._bindGroupCacheFrameId = this._currentFrameId;
            }

            // 用纹理的label/id + smoothing 作为缓存key
            // GPUTexture没有稳定id，用对象引用做Map key更高效
            let sampler = smoothing !== false ?
                this.samplerCache['linear'] : this.samplerCache['nearest'];
            let textureView = this.getTextureView(texture);
            // 简单hash: 使用纹理的引用+smoothing
            let key = (smoothing !== false ? 'L' : 'N') + '_' + textureView.label;
            // 由于label可能为空，改用纹理+采样器方式
            // 考虑到性能，对于高频调用的场景直接创建即可，
            // 但对于连续相同纹理的批次合并，DrawCmdManager已经处理了

            let bindGroup = this.device.createBindGroup({
                layout: this.bindGroupLayoutCache['texture'],
                entries: [
                    { binding: 0, resource: { buffer: this.uniformBuffer } },
                    { binding: 1, resource: sampler },
                    { binding: 2, resource: textureView },
                ]
            });
            return bindGroup;
        }

        // ===================== Buffer 栈管理 =====================

        public pushBuffer(buffer: WebGPURenderBuffer): void {
            
            this.$bufferStack.push(buffer);
            if (buffer != this.currentBuffer) {
                
                this.drawCmdManager.pushActivateBuffer(buffer);
            }
            this.currentBuffer = buffer;
        }

        public popBuffer(): void {
            if (this.$bufferStack.length <= 1) {
                return;
            }
            let buffer = this.$bufferStack.pop();
            let lastBuffer = this.$bufferStack[this.$bufferStack.length - 1];
            if (buffer != lastBuffer) {
                this.drawCmdManager.pushActivateBuffer(lastBuffer);
            }
            this.currentBuffer = lastBuffer;
        }

        // ===================== 渲染尺寸 =====================

        public onResize(width?: number, height?: number): void {
            width = width || this.surface.width;
            height = height || this.surface.height;
            
            this.projectionX = width / 2;
            this.projectionY = -height / 2;
        }

        public resize(width: number, height: number, useMaxSize?: boolean): void {
            egret.sys.resizeContext(this, width, height, useMaxSize);
        }

        public destroy(): void {
            this.surface.width = this.surface.height = 0;
            // 释放GPU资源
            if (this.vertexGPUBuffer) {
                this.vertexGPUBuffer.destroy();
                this.vertexGPUBuffer = null;
            }
            if (this.indexGPUBuffer) {
                this.indexGPUBuffer.destroy();
                this.indexGPUBuffer = null;
            }
            if (this.uniformBuffer) {
                this.uniformBuffer.destroy();
                this.uniformBuffer = null;
            }
            if (this.filterUniformBuffer) {
                this.filterUniformBuffer.destroy();
                this.filterUniformBuffer = null;
            }
            if (this._defaultEmptyTexture) {
                this._defaultEmptyTexture.destroy();
                this._defaultEmptyTexture = null;
                this._defaultEmptyTextureView = null;
            }
            this.textureViewCache.clear();
            this._textureBindGroupCache.clear();
            this._primitiveBindGroup = null;
            this._initialized = false;
            if (this.device) {
                this.device.destroy();
                this.device = null;
            }
        }

        // ===================== 绘图指令 =====================

        public setGlobalCompositeOperation(value: string): void {
            this.drawCmdManager.pushSetBlend(value);
        }

        public drawImage(image: BitmapData,
            sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
            destX: number, destY: number, destWidth: number, destHeight: number,
            imageSourceWidth: number, imageSourceHeight: number, rotated: boolean, smoothing?: boolean): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !image || !buffer) {
                return;
            }

            let gpuTexture: GPUTexture;
            let offsetX: number;
            let offsetY: number;
            let needRestoreTransform = false;
            
            if (image["gpuTexture"]) {
                // render target 纹理：需要坐标翻转
                gpuTexture = image["gpuTexture"];
                buffer.saveTransform();
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
                needRestoreTransform = true;
            } else if (!image.source && !image["gpuTexture"]) {
                return;
            } else {
                // 普通图片纹理：getGPUTexture会处理加载
                gpuTexture = this.getGPUTexture(image);
            }

            if (!gpuTexture) {
                return;
            }

            this.drawTexture(gpuTexture,
                sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight,
                imageSourceWidth, imageSourceHeight,
                undefined, undefined, undefined, undefined, rotated, smoothing);

            if (needRestoreTransform) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                buffer.restoreTransform();
            }
        }

        public drawMesh(image: BitmapData,
            sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
            destX: number, destY: number, destWidth: number, destHeight: number,
            imageSourceWidth: number, imageSourceHeight: number,
            meshUVs: number[], meshVertices: number[], meshIndices: number[], bounds: Rectangle, rotated: boolean, smoothing: boolean): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !image || !buffer) {
                return;
            }

            let gpuTexture: GPUTexture;
            let offsetX: number;
            let offsetY: number;
            let needRestoreTransform = false;
            
            if (image["gpuTexture"]) {
                // render target 纹理：需要坐标翻转
                gpuTexture = image["gpuTexture"];
                buffer.saveTransform();
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);
                needRestoreTransform = true;
            } else if (!image.source && !image["gpuTexture"]) {
                return;
            } else {
                // 普通图片纹理：getGPUTexture会处理加载
                gpuTexture = this.getGPUTexture(image);
            }

            if (!gpuTexture) {
                return;
            }

            this.drawTexture(gpuTexture,
                sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight,
                imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing);

            if (needRestoreTransform) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                buffer.restoreTransform();
            }
        }

        public drawTexture(texture: GPUTexture,
            sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
            destX: number, destY: number, destWidth: number, destHeight: number,
            textureWidth: number, textureHeight: number,
            meshUVs?: number[], meshVertices?: number[], meshIndices?: number[], bounds?: Rectangle, rotated?: boolean, smoothing?: boolean): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !texture || !buffer) {
                return;
            }

            if (meshVertices && meshIndices) {
                if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                    this.$drawWebGPU();
                }
            } else {
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGPU();
                }
            }

            if (meshUVs) {
                this.vao.changeToMeshIndices();
            }

            let count = meshIndices ? meshIndices.length / 3 : 2;
            this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, textureWidth, textureHeight);
            buffer.currentTexture = texture;
            this.vao.cacheArrays(buffer, sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight, textureWidth, textureHeight,
                meshUVs, meshVertices, meshIndices, rotated);
        }

        public drawRect(x: number, y: number, width: number, height: number): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !buffer) {
                return;
            }
            if (this.vao.reachMaxSize()) {
                this.$drawWebGPU();
            }
            this.drawCmdManager.pushDrawRect();
            buffer.currentTexture = null;
            this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
        }

        public pushMask(x: number, y: number, width: number, height: number): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !buffer) {
                return;
            }
            buffer.$stencilList.push({ x, y, width, height });
            if (this.vao.reachMaxSize()) {
                this.$drawWebGPU();
            }
            this.drawCmdManager.pushPushMask();
            buffer.currentTexture = null;
            this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
        }

        public popMask(): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !buffer) {
                return;
            }
            let mask = buffer.$stencilList.pop();
            if (this.vao.reachMaxSize()) {
                this.$drawWebGPU();
            }
            this.drawCmdManager.pushPopMask();
            buffer.currentTexture = null;
            this.vao.cacheArrays(buffer, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
        }

        public clear(): void {
            this.drawCmdManager.pushClearColor();
        }

        public clearRect(x: number, y: number, width: number, height: number): void {
            if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                let buffer = this.currentBuffer;
                if (buffer.$hasScissor) {
                    this.setGlobalCompositeOperation("destination-out");
                    this.drawRect(x, y, width, height);
                    this.setGlobalCompositeOperation("source-over");
                } else {
                    let m = buffer.globalMatrix;
                    if (m.b == 0 && m.c == 0) {
                        x = x * m.a + m.tx;
                        y = y * m.d + m.ty;
                        width = width * m.a;
                        height = height * m.d;
                        this.enableScissor(x, -y - height + buffer.height, width, height);
                        this.clear();
                        this.disableScissor();
                    } else {
                        this.setGlobalCompositeOperation("destination-out");
                        this.drawRect(x, y, width, height);
                        this.setGlobalCompositeOperation("source-over");
                    }
                }
            } else {
                this.clear();
            }
        }

        public $scissorState: boolean = false;

        public enableScissor(x: number, y: number, width: number, height: number): void {
            let buffer = this.currentBuffer;
            this.drawCmdManager.pushEnableScissor(x, y, width, height);
            buffer.$hasScissor = true;
        }

        public disableScissor(): void {
            let buffer = this.currentBuffer;
            this.drawCmdManager.pushDisableScissor();
            buffer.$hasScissor = false;
        }

        public enableStencilTest(): void { }
        public disableStencilTest(): void { }
        public enableScissorTest(rect: egret.Rectangle): void { }
        public disableScissorTest(): void { }

        public getPixels(x: number, y: number, width: number, height: number, pixels: Uint8Array): void {
            // WebGPU中像素读取是异步的，同步接口保持API兼容
        }

        // ===================== 纹理管理 =====================

         public createTexture(bitmapData: BitmapData | HTMLCanvasElement): GPUTexture {
             if (!this.device) return null;
 
             let source: HTMLImageElement | HTMLCanvasElement;
             let width: number, height: number;
 
             if (bitmapData instanceof HTMLCanvasElement) {
                 source = bitmapData;
                 width = bitmapData.width;
                 height = bitmapData.height;
             } else {
                 source = bitmapData.source;
                 width = bitmapData.width;
                 height = bitmapData.height;
             }
 
             if (!source || width <= 0 || height <= 0) return null;
 
             const texture = this.device.createTexture({
                 size: { width, height },
                 format: this.preferredFormat,
                 usage: GPUTextureUsage.TEXTURE_BINDING |
                     GPUTextureUsage.COPY_DST |
                     GPUTextureUsage.RENDER_ATTACHMENT,
             });
 
             // 标记纹理为预乘alpha，与WebGL行为保持一致
             texture[UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
 
             // HTMLImageElement 和 HTMLCanvasElement 都需要确保已加载
             if (source instanceof HTMLCanvasElement) {
                 this.device.queue.copyExternalImageToTexture(
                     { source: source },
                     { texture: texture, premultipliedAlpha: true },
                     { width, height }
                 );
             } else if (source instanceof HTMLImageElement) {
                 // 对于 HTMLImageElement，必须等待图片完全加载
                 if (source.complete && source.naturalWidth > 0 && source.naturalHeight > 0) {
                     // 图片已加载
                     this.device.queue.copyExternalImageToTexture(
                         { source: source },
                         { texture: texture, premultipliedAlpha: true },
                         { width, height }
                     );
                 } else {
                     // 图片还在加载，等待加载完成
                     const onLoadHandler = () => {
                         this.device.queue.copyExternalImageToTexture(
                             { source: source },
                             { texture: texture, premultipliedAlpha: true },
                             { width, height }
                         );
                         source.removeEventListener('load', onLoadHandler);
                     };
                     source.addEventListener('load', onLoadHandler);
                 }
             }
 
             return texture;
         }

        public updateTexture(texture: GPUTexture, bitmapData: BitmapData | HTMLCanvasElement): GPUTexture {
            if (!this.device || !texture) return texture;

            let source: HTMLImageElement | HTMLCanvasElement;
            let width: number, height: number;

            if (bitmapData instanceof HTMLCanvasElement) {
                source = bitmapData;
                width = bitmapData.width;
                height = bitmapData.height;
            } else {
                source = (bitmapData as BitmapData).source;
                width = (bitmapData as BitmapData).width;
                height = (bitmapData as BitmapData).height;
            }

            if (!source) return texture;

            // 检查纹理尺寸是否匹配，不匹配则需要重新创建
            if (texture.width !== width || texture.height !== height) {
                this.deleteGPUTexture(texture);
                texture = this.createTexture(bitmapData);
                return texture;
            }

            if (source instanceof HTMLCanvasElement) {
                this.device.queue.copyExternalImageToTexture(
                    { source: source },
                    { texture: texture, premultipliedAlpha: true },
                    { width, height }
                );
            } else if (source instanceof HTMLImageElement) {
                this.device.queue.copyExternalImageToTexture(
                    { source: source },
                    { texture: texture, premultipliedAlpha: true },
                    { width, height }
                );
            }
            return texture;
        }

        public getGPUTexture(bitmapData: BitmapData): GPUTexture {
            if (!bitmapData) return null;

            if (!bitmapData["gpuTexture"]) {
                if (bitmapData.format == "image" && !bitmapData.hasCompressed2d()) {
                    bitmapData["gpuTexture"] = this.createTexture(bitmapData);
                }
                if (bitmapData.$deleteSource && bitmapData["gpuTexture"]) {
                    if (bitmapData.source) {
                        bitmapData.source.src = '';
                        bitmapData.source = null;
                    }
                }
                if (bitmapData["gpuTexture"]) {
                    bitmapData["gpuTexture"]["smoothing"] = true;
                }
            }
            return bitmapData["gpuTexture"];
        }

        public getTextureView(texture: GPUTexture): GPUTextureView {
            if (!texture) return this.defaultEmptyTextureView;
            let view = this.textureViewCache.get(texture);
            if (!view) {
                view = texture.createView();
                this.textureViewCache.set(texture, view);
            }
            return view;
        }

        public getWebGLTexture(bitmapData: BitmapData): GPUTexture {
            return this.getGPUTexture(bitmapData);
        }

        /**
         * 释放GPU纹理及其缓存的纹理视图
         */
        public deleteGPUTexture(texture: GPUTexture): void {
            if (!texture) return;
            this.textureViewCache.delete(texture);
            try {
                texture.destroy();
            } catch (e) {
                // 纹理可能已被销毁
            }
        }

        // ===================== 核心绘制执行 =====================

        /**
         * 判断当前activated buffer是否需要stencil（有stencilHandleCount>0）
         */
        private get useStencil(): boolean {
            return this.activatedBuffer && this.activatedBuffer.stencilHandleCount > 0;
        }

        /**
         * 获取当前buffer的rootRenderTarget（用于获取depth-stencil）
         */
        private getCurrentRenderTarget(): WebGPURenderTarget {
            if (this.activatedBuffer) {
                return this.activatedBuffer.rootRenderTarget;
            }
            return null;
        }

        /**
         * 开始一个新的render pass
         * 根据是否需要stencil来决定是否附加depthStencil attachment
         */
        private beginRenderPass(commandEncoder: GPUCommandEncoder, colorView: GPUTextureView,
            loadOp: GPULoadOp, clearStencil: boolean = false): GPURenderPassEncoder {
            let depthStencilAttachment: GPURenderPassDepthStencilAttachment = undefined;
            let renderTarget = this.getCurrentRenderTarget();

            if (renderTarget && renderTarget.stencilEnabled) {
                let dsView = renderTarget.getDepthStencilTextureView();
                if (dsView) {
                    depthStencilAttachment = {
                        view: dsView,
                        depthLoadOp: 'load',
                        depthStoreOp: 'store',
                        stencilLoadOp: clearStencil ? 'clear' : 'load',
                        stencilStoreOp: 'store',
                        stencilClearValue: 0,
                    };
                }
            }

            const renderPassDescriptor: GPURenderPassDescriptor = {
                colorAttachments: [{
                    view: colorView,
                    loadOp: loadOp,
                    storeOp: 'store' as const,
                    clearValue: { r: 0, g: 0, b: 0, a: 0 }, // 黑色不透明，方便调试
                    // clearValue: { r: 1, g: 1, b: 1, a: 1 }, // 白色不透明，方便调试
                }],
            };
            if (depthStencilAttachment) {
                renderPassDescriptor.depthStencilAttachment = depthStencilAttachment;
            }

            const pass = commandEncoder.beginRenderPass(renderPassDescriptor);
            
            pass.setVertexBuffer(0, this.vertexGPUBuffer);
            pass.setIndexBuffer(this.indexGPUBuffer, 'uint16');
            return pass;
        }

        public $drawWebGPU(): void {
            if (this.drawCmdManager.drawDataLen == 0 || this.contextLost || !this._initialized) {
                return;
            }

            // 确保第一个命令是 ACT_BUFFER
            if (this.drawCmdManager.drawDataLen > 0) {
                let firstData = this.drawCmdManager.drawData[0];
                if (firstData.type !== GPU_DRAWABLE_TYPE.ACT_BUFFER) {
                    // 在最前面插入 ACT_BUFFER
                    let newData: any = {};
                    newData.type = GPU_DRAWABLE_TYPE.ACT_BUFFER;
                    newData.buffer = this.activatedBuffer || this.currentBuffer;
                    let bufferWidth = newData.buffer.rootRenderTarget.width;
                    let bufferHeight = newData.buffer.rootRenderTarget.height;
                    newData.width = bufferWidth;
                    newData.height = bufferHeight;
                    
                    // 向后移动所有元素
                    for (let i = this.drawCmdManager.drawDataLen; i > 0; i--) {
                        this.drawCmdManager.drawData[i] = this.drawCmdManager.drawData[i - 1];
                    }
                    this.drawCmdManager.drawData[0] = newData;
                    this.drawCmdManager.drawDataLen++;
                }
            }

            this._currentFrameId++;

            const vertices = this.vao.getVertices();
            if (vertices.byteLength > 0) {
                this.device.queue.writeBuffer(this.vertexGPUBuffer, 0, vertices.buffer, vertices.byteOffset, vertices.byteLength);
            }

            if (this.vao.isMesh()) {
                const meshIndices = this.vao.getMeshIndices();
                this.device.queue.writeBuffer(this.indexGPUBuffer, 0, meshIndices.buffer, meshIndices.byteOffset, meshIndices.byteLength);
            } else {
                const indices = this.vao.getIndices();
                this.device.queue.writeBuffer(this.indexGPUBuffer, 0, indices.buffer, indices.byteOffset, indices.byteLength);
            }

            let length = this.drawCmdManager.drawDataLen;
            let offset = 0;

            // 使用单一commandEncoder减少submit次数
            let commandEncoder: GPUCommandEncoder = this.device.createCommandEncoder();
            let renderPassEncoder: GPURenderPassEncoder = null;
            let currentTargetView: GPUTextureView = null;
            // 缓存本帧的canvas纹理视图，避免重复创建
            let canvasTextureView: GPUTextureView = null;
            // 缓存每个render target的primitive bind group
            let currentPrimitiveBindGroup: GPUBindGroup = null;
            // 缓存投影写入状态，避免重复writeBuffer
            let lastProjectionX: number = NaN;
            let lastProjectionY: number = NaN;

            
            for (let i = 0; i < length; i++) {
                let data = this.drawCmdManager.drawData[i];
                

                switch (data.type) {
                    case GPU_DRAWABLE_TYPE.ACT_BUFFER: {
                        // 使用 buffer 的实时尺寸，而不是保存的旧值
                        let bufferWidth = data.buffer.rootRenderTarget.width;
                        let bufferHeight = data.buffer.rootRenderTarget.height;
                        // 结束前一个render pass（不submit，保持在同一commandEncoder）
                        if (renderPassEncoder) {
                            renderPassEncoder.end();
                            // 不在此处submit，让所有命令在同一encoder中批量执行
                            // 但需要新的encoder因为WebGPU规定一个encoder只能finish一次
                            this.device.queue.submit([commandEncoder.finish()]);
                            commandEncoder = this.device.createCommandEncoder();
                        }
                        this.activatedBuffer = data.buffer;

                        let targetView: GPUTextureView;
                        if (data.buffer.root) {
                            // 使用缓存的canvas纹理视图，每帧只创建一次
                            if (!canvasTextureView) {
                                canvasTextureView = this.canvasContext.getCurrentTexture().createView();
                            }
                            targetView = canvasTextureView;
                        } else {
                            data.buffer.rootRenderTarget.activate();
                            targetView = data.buffer.rootRenderTarget.getTextureView();
                        }
                        currentTargetView = targetView;

                        this.onResize(bufferWidth, bufferHeight);
                        // 仅在投影参数变化时写入uniform buffer
                        if (lastProjectionX !== this.projectionX || lastProjectionY !== this.projectionY) {
                            lastProjectionX = this.projectionX;
                            lastProjectionY = this.projectionY;
                            this.device.queue.writeBuffer(this.uniformBuffer, 0,
                                new Float32Array([this.projectionX, this.projectionY]));
                            // 投影变化时需要重建primitive bind group
                            currentPrimitiveBindGroup = null;
                            this.invalidatePrimitiveBindGroup();
                        }

                        renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'load');

                        data.buffer.restoreStencil();
                        data.buffer.restoreScissor();
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.TEXTURE: {
                        if (!renderPassEncoder || !data.texture) {
                            break;
                        }

                        let filter = data.filter;
                        let stencil = this.useStencil;

                        if (filter && (filter.type === "colorTransform" || filter.type === "blurX" ||
                            filter.type === "blurY" || filter.type === "glow")) {
                            // 使用filter-specific pipeline
                            let pipeline = this.getFilterPipeline(filter, stencil);
                            renderPassEncoder.setPipeline(pipeline);

                            // group(0): texture bind group
                            let textureView = this.getTextureView(data.texture);
                            let sampler = data.texture["smoothing"] === false ?
                                this.samplerCache['nearest'] : this.samplerCache['linear'];

                            let textureBindGroup = this.device.createBindGroup({
                                layout: this.bindGroupLayoutCache['texture'],
                                entries: [
                                    { binding: 0, resource: { buffer: this.uniformBuffer } },
                                    { binding: 1, resource: sampler },
                                    { binding: 2, resource: textureView },
                                ]
                            });
                            renderPassEncoder.setBindGroup(0, textureBindGroup);

                            // group(1): filter uniform bind group
                            let filterBindGroup = this.createFilterBindGroup(filter, data.textureWidth || 1, data.textureHeight || 1);
                            if (filterBindGroup) {
                                renderPassEncoder.setBindGroup(1, filterBindGroup);
                            }

                            if (stencil) {
                                renderPassEncoder.setStencilReference(this.activatedBuffer.stencilHandleCount);
                            }
                        } else {
                            // 标准纹理管线
                            let pipeline = this.getTexturePipeline(this.currentBlendMode, stencil);
                            renderPassEncoder.setPipeline(pipeline);

                            let textureView = this.getTextureView(data.texture);
                            let sampler = data.texture["smoothing"] === false ?
                                this.samplerCache['nearest'] : this.samplerCache['linear'];

                            let bindGroup = this.device.createBindGroup({
                                layout: this.bindGroupLayoutCache['texture'],
                                entries: [
                                    { binding: 0, resource: { buffer: this.uniformBuffer } },
                                    { binding: 1, resource: sampler },
                                    { binding: 2, resource: textureView },
                                ]
                            });
                            renderPassEncoder.setBindGroup(0, bindGroup);

                            if (stencil) {
                                renderPassEncoder.setStencilReference(this.activatedBuffer.stencilHandleCount);
                            }
                        }

                        let indexCount = data.count * 3;
                        renderPassEncoder.drawIndexed(indexCount, 1, offset);
                        offset += indexCount;

                        if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                            this.activatedBuffer.$drawCalls++;
                        }
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.RECT: {
                        
                        if (!renderPassEncoder) break;

                        let stencil = this.useStencil;
                        let pipeline = this.getPrimitivePipeline(this.currentBlendMode, stencil);
                        renderPassEncoder.setPipeline(pipeline);

                        // 使用缓存的primitive bind group
                        if (!currentPrimitiveBindGroup) {
                            currentPrimitiveBindGroup = this.getPrimitiveBindGroup();
                        }
                        renderPassEncoder.setBindGroup(0, currentPrimitiveBindGroup);

                        if (stencil) {
                            renderPassEncoder.setStencilReference(this.activatedBuffer.stencilHandleCount);
                        }

                        let indexCount = data.count * 3;
                        renderPassEncoder.drawIndexed(indexCount, 1, offset);
                        offset += indexCount;

                        if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                            this.activatedBuffer.$drawCalls++;
                        }
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.PUSH_MASK: {
                        if (!renderPassEncoder || !this.activatedBuffer) {
                            offset += data.count * 3;
                            break;
                        }

                        let buffer = this.activatedBuffer;
                        let renderTarget = buffer.rootRenderTarget;

                        // 惰性创建depth-stencil纹理
                        renderTarget.enabledStencil();

                        if (buffer.stencilHandleCount == 0) {
                            // 首次push mask：需要重启render pass以附加depth-stencil
                            renderPassEncoder.end();
                            this.device.queue.submit([commandEncoder.finish()]);
                            commandEncoder = this.device.createCommandEncoder();
                            renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'load', true);
                        }

                        let level = buffer.stencilHandleCount;
                        buffer.stencilHandleCount++;

                        // 画mask几何：stencil INCR，不写颜色
                        let pushPipeline = this.pipelineCache['stencil_push'];
                        renderPassEncoder.setPipeline(pushPipeline);
                        renderPassEncoder.setStencilReference(level);

                        if (!currentPrimitiveBindGroup) {
                            currentPrimitiveBindGroup = this.getPrimitiveBindGroup();
                        }
                        renderPassEncoder.setBindGroup(0, currentPrimitiveBindGroup);

                        let indexCount = data.count * 3;
                        renderPassEncoder.drawIndexed(indexCount, 1, offset);
                        offset += indexCount;
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.POP_MASK: {
                        if (!renderPassEncoder || !this.activatedBuffer) {
                            offset += data.count * 3;
                            break;
                        }

                        let buffer = this.activatedBuffer;
                        buffer.stencilHandleCount--;

                        if (buffer.stencilHandleCount == 0) {
                            // 所有mask已弹出：重启render pass，不附加depth-stencil
                            let indexCount = data.count * 3;
                            offset += indexCount;

                            renderPassEncoder.end();
                            this.device.queue.submit([commandEncoder.finish()]);
                            commandEncoder = this.device.createCommandEncoder();
                            renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'load');
                        } else {
                            let level = buffer.stencilHandleCount;

                            // 画mask几何：stencil DECR，不写颜色
                            let popPipeline = this.pipelineCache['stencil_pop'];
                            renderPassEncoder.setPipeline(popPipeline);
                            renderPassEncoder.setStencilReference(level + 1);

                            if (!currentPrimitiveBindGroup) {
                                currentPrimitiveBindGroup = this.getPrimitiveBindGroup();
                            }
                            renderPassEncoder.setBindGroup(0, currentPrimitiveBindGroup);

                        let indexCount = data.count * 3;
                        
                        renderPassEncoder.drawIndexed(indexCount, 1, offset);
                            offset += indexCount;
                        }
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.BLEND: {
                        this.currentBlendMode = data.value;
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.RESIZE_TARGET: {
                        data.buffer.rootRenderTarget.resize(data.width, data.height);
                        this.onResize(data.width, data.height);
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.CLEAR_COLOR: {
                        if (this.activatedBuffer && currentTargetView) {
                            if (renderPassEncoder) {
                                renderPassEncoder.end();
                            }
                            renderPassEncoder = this.beginRenderPass(commandEncoder, currentTargetView, 'clear');
                        }
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.ENABLE_SCISSOR: {
                        if (renderPassEncoder) {
                            let x = Math.max(0, Math.floor(data.x));
                            let y = Math.max(0, Math.floor(data.y));
                            let w = Math.max(1, Math.ceil(data.width));
                            let h = Math.max(1, Math.ceil(data.height));
                            renderPassEncoder.setScissorRect(x, y, w, h);
                        }
                        if (this.activatedBuffer) {
                            this.activatedBuffer.$hasScissor = true;
                        }
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.DISABLE_SCISSOR: {
                        if (renderPassEncoder && this.activatedBuffer) {
                            renderPassEncoder.setScissorRect(0, 0,
                                this.activatedBuffer.rootRenderTarget.width,
                                this.activatedBuffer.rootRenderTarget.height);
                        }
                        if (this.activatedBuffer) {
                            this.activatedBuffer.$hasScissor = false;
                        }
                        break;
                    }
                    case GPU_DRAWABLE_TYPE.SMOOTHING: {
                        break;
                    }
                }
            }

            if (renderPassEncoder) {
                renderPassEncoder.end();
            }
            
            this.device.queue.submit([commandEncoder.finish()]);

            this.drawCmdManager.clear();
            this.vao.clear();
        }

        // ===================== 滤镜支持 =====================

        public drawTargetWidthFilters(filters: Filter[], input: WebGPURenderBuffer): void {
            let originInput = input,
                filtersLen: number = filters.length,
                output: WebGPURenderBuffer;

            if (filtersLen > 1) {
                for (let i = 0; i < filtersLen - 1; i++) {
                    let filter = filters[i];
                    let width: number = input.rootRenderTarget.width;
                    let height: number = input.rootRenderTarget.height;
                    output = WebGPURenderBuffer.create(width, height);
                    const scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                    output.setTransform(scale, 0, 0, scale, 0, 0);
                    output.globalAlpha = 1;
                    this.drawToRenderTarget(filter, input, output);
                    if (input != originInput) {
                        WebGPURenderBuffer.release(input);
                    }
                    input = output;
                }
            }

            let filter = filters[filtersLen - 1];
            this.drawToRenderTarget(filter, input, this.currentBuffer);

            if (input != originInput) {
                WebGPURenderBuffer.release(input);
            }
        }

        private drawToRenderTarget(filter: Filter, input: WebGPURenderBuffer, output: WebGPURenderBuffer): void {
            if (this.contextLost) {
                return;
            }

            if (this.vao.reachMaxSize()) {
                this.$drawWebGPU();
            }

            this.pushBuffer(output);

            let originInput = input,
                temp: WebGPURenderBuffer,
                width: number = input.rootRenderTarget.width,
                height: number = input.rootRenderTarget.height;

            if (filter.type == "blur") {
                let blurXFilter = (<BlurFilter>filter).blurXFilter;
                let blurYFilter = (<BlurFilter>filter).blurYFilter;

                if (blurXFilter.blurX != 0 && blurYFilter.blurY != 0) {
                    temp = WebGPURenderBuffer.create(width, height);
                    const scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
                    temp.setTransform(1, 0, 0, 1, 0, 0);
                    temp.transform(scale, 0, 0, scale, 0, 0);
                    temp.globalAlpha = 1;
                    this.drawToRenderTarget((<BlurFilter>filter).blurXFilter, input, temp);
                    if (input != originInput) {
                        WebGPURenderBuffer.release(input);
                    }
                    input = temp;
                    filter = blurYFilter;
                } else {
                    filter = blurXFilter.blurX === 0 ? blurYFilter : blurXFilter;
                }
            }

            output.saveTransform();
            const scale = Math.max(egret.sys.DisplayList.$canvasScaleFactor, 2);
            output.transform(1 / scale, 0, 0, 1 / scale, 0, 0);
            output.transform(1, 0, 0, -1, 0, height);
            output.currentTexture = input.rootRenderTarget.texture as any;
            this.vao.cacheArrays(output, 0, 0, width, height, 0, 0, width, height, width, height);
            output.restoreTransform();
            this.drawCmdManager.pushDrawTexture(input.rootRenderTarget.texture, 2, filter, width, height);

            if (input != originInput) {
                WebGPURenderBuffer.release(input);
            }

            this.popBuffer();
        }

        // ===================== $beforeRender =====================

        public $beforeRender(): void {
            this.currentBlendMode = "source-over";
        }

        // ===================== 静态初始化 =====================

        public static initBlendMode(): void {
            WebGPURenderContext.blendModesForGPU = {};

            WebGPURenderContext.blendModesForGPU["source-over"] = {
                color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' }
            };
            WebGPURenderContext.blendModesForGPU["lighter"] = {
                color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
                alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' }
            };
            WebGPURenderContext.blendModesForGPU["lighter-in"] = {
                color: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                alpha: { srcFactor: 'src-alpha', dstFactor: 'one-minus-src-alpha', operation: 'add' }
            };
            WebGPURenderContext.blendModesForGPU["destination-out"] = {
                color: { srcFactor: 'zero', dstFactor: 'one-minus-src-alpha', operation: 'add' },
                alpha: { srcFactor: 'zero', dstFactor: 'one-minus-src-alpha', operation: 'add' }
            };
            WebGPURenderContext.blendModesForGPU["destination-in"] = {
                color: { srcFactor: 'zero', dstFactor: 'src-alpha', operation: 'add' },
                alpha: { srcFactor: 'zero', dstFactor: 'src-alpha', operation: 'add' }
            };
        }
    }

    WebGPURenderContext.initBlendMode();
}
