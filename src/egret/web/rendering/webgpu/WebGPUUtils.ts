namespace egret.web {
    export class WebGPUUtils {
        private static _webgpuSupported: boolean | null = null;
        private static _checkPromise: Promise<boolean> | null = null;

        /**
         * 同步检查是否支持WebGPU
         */
        public static checkCanUseWebGPU(): boolean {
            if (!navigator.gpu) {
                this._webgpuSupported = false;
                return false;
            }
            
            // 如果已经检查过，直接返回
            if (this._webgpuSupported !== null) {
                return this._webgpuSupported;
            }

            // 首次检查时，进行异步检查但先返回true（假设支持）
            // 实际的支持情况会在初始化时被发现
            this._webgpuSupported = true;
            this.checkWebGPUSupportAsync().then(supported => {
                this._webgpuSupported = supported;
            }).catch(() => {
                this._webgpuSupported = false;
            });

            return true;
        }

        /**
         * 异步检查WebGPU支持
         */
        public static async checkWebGPUSupportAsync(): Promise<boolean> {
            if (this._checkPromise) {
                return this._checkPromise;
            }

            this._checkPromise = (async () => {
                if (!navigator.gpu) {
                    return false;
                }
                
                let device: GPUDevice = null;
                try {
                    const adapter = await navigator.gpu.requestAdapter({
                        powerPreference: 'high-performance'
                    });
                    if (!adapter) {
                        return false;
                    }

                    device = await adapter.requestDevice();
                    if (!device) {
                        return false;
                    }

                    // 检查必要的特性
                    const result = this.checkRequiredFeatures(adapter, device);
                    return result;
                } catch (e) {
                    console.warn('WebGPU support check failed:', e);
                    return false;
                } finally {
                    // 释放检测用的device，避免资源泄漏
                    if (device) {
                        device.destroy();
                    }
                }
            })();

            return this._checkPromise;
        }

        /**
         * 检查必要的WebGPU特性
         */
        private static checkRequiredFeatures(adapter: GPUAdapter, device: GPUDevice): boolean {
            // 检查基本能力
            const limits = device.limits;
            
            const requiredCapabilities = {
                maxTextureDimension2D: 2048,
                maxComputeWorkgroupSizeX: 128,
                maxComputeWorkgroupSizeY: 128,
                maxBindGroups: 4,
                maxBindingsPerBindGroup: 256
            };

            for (const [key, minValue] of Object.entries(requiredCapabilities)) {
                // 注意：这里 key in limits 检查对于继承的属性可能不够严谨，
                // 但对于 device.limits 这种常量对象通常是足够的。
                if (key in limits && (limits[key] as number) < minValue) {
                    console.warn(`Device limit ${key} (${limits[key]}) is below required value (${minValue})`);
                    return false;
                }
            }

            return true;
        }

        /**
         * 创建WebGPU渲染管线
         */
        public static async createRenderPipeline(device: GPUDevice, format: GPUTextureFormat): Promise<GPURenderPipeline> {
            const pipelineDescriptor: GPURenderPipelineDescriptor = {
                layout: 'auto', // 'auto' is a valid value for pipeline layout
                vertex: {
                    module: device.createShaderModule({
                        code: WGShaderLib.default_vert
                    }),
                    entryPoint: 'main',
                    buffers: [
                        {
                            arrayStride: 20, // float32 * 5 (position[2], uv[2], color[1])
                            attributes: [
                                {
                                    // position
                                    shaderLocation: 0,
                                    offset: 0,
                                    // *** 关键修改：使用 as GPUVertexFormat ***
                                    format: 'float32x2' as GPUVertexFormat 
                                },
                                {
                                    // uv
                                    shaderLocation: 1,
                                    offset: 8,
                                    // *** 关键修改：使用 as GPUVertexFormat ***
                                    format: 'float32x2' as GPUVertexFormat 
                                },
                                {
                                    // color
                                    shaderLocation: 2,
                                    offset: 16,
                                    // *** 关键修改：使用 as GPUVertexFormat ***
                                    format: 'unorm8x4' as GPUVertexFormat 
                                }
                            ]
                            // *** 关键修改：整个 attributes 数组也断言为 GPUVertexAttribute[] ***
                        } as GPUVertexBufferLayout // 整个 VertexBufferLayout 对象断言
                    ]
                },
                fragment: {
                    module: device.createShaderModule({
                        code: WGShaderLib.default_frag
                    }),
                    entryPoint: 'main',
                    targets: [
                        {
                            format: format, // format is already GPUTextureFormat
                            blend: {
                                color: {
                                    srcFactor: 'src-alpha' as GPUBlendFactor,
                                    dstFactor: 'one-minus-src-alpha' as GPUBlendFactor,
                                    operation: 'add' as GPUBlendOperation // *** 关键修改：使用 as GPUBlendOperation ***
                                },
                                alpha: {
                                    srcFactor: 'one' as GPUBlendFactor,
                                    dstFactor: 'one-minus-src-alpha' as GPUBlendFactor,
                                    operation: 'add' as GPUBlendOperation // *** 关键修改：使用 as GPUBlendOperation ***
                                }
                            }
                        } as GPUColorTargetState // 整个 ColorTargetState 对象断言
                    ]
                },
                primitive: {
                    topology: 'triangle-list' as GPUPrimitiveTopology, // *** 关键修改：使用 as GPUPrimitiveTopology ***
                    cullMode: 'none' as GPUCullMode, // *** 关键修改：使用 as GPUCullMode ***
                    frontFace: 'ccw' as GPUFrontFace // *** 关键修改：使用 as GPUFrontFace ***
                }
            };

            return device.createRenderPipeline(pipelineDescriptor);
        }

        /**
         * 预乘alpha到tintColor中（从WebGLUtils移植，消除对WebGL模块的依赖）
         * inspired by pixi.js
         */
        public static premultiplyTint(tint: number, alpha: number): number {
            if (alpha === 1.0) {
                return (alpha * 255 << 24) + tint;
            }
            if (alpha === 0.0) {
                return 0;
            }
            let R = ((tint >> 16) & 0xFF);
            let G = ((tint >> 8) & 0xFF);
            let B = (tint & 0xFF);
            R = ((R * alpha) + 0.5) | 0;
            G = ((G * alpha) + 0.5) | 0;
            B = ((B * alpha) + 0.5) | 0;
            return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
        }
    }
}