////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////


namespace egret.web {
	/**
	 * WGSL着色器库
	 * 
	 * 绑定布局约定：
	 *   group(0) binding(0) = uniform buffer (projectionVector)   [VERTEX]
	 *   group(0) binding(1) = sampler                              [FRAGMENT]
	 *   group(0) binding(2) = texture_2d                           [FRAGMENT]
	 *   group(1) binding(0) = filter uniform buffer (可选)         [FRAGMENT]
	 * 
	 * 注意：实际运行时的着色器由 WebGPURenderContext 的 getXxxShaderCode() 方法生成。
	 * 本文件保留着色器字符串供参考和调试使用。
	 */
	export class WGShaderLib {

		// ===== 默认顶点着色器（从uniform读取projectionVector）=====
		public static readonly default_vert: string = `struct Uniforms {
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

		// ===== 纹理片段着色器 =====
		public static readonly texture_frag: string = `struct FragmentInput {
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

@group(0) @binding(1)
var uSampler: sampler;

@group(0) @binding(2)
var uTexture: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    // WebGPU 纹理坐标原点在左上，需要翻转 V 坐标
    let uv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);
    return textureSample(uTexture, uSampler, uv) * input.vColor;
}`;

		// ===== 纯色片段着色器（矩形/遮罩）=====
		public static readonly primitive_frag: string = `struct FragmentInput {
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    return input.vColor;
}`;

		// default_frag 和 primitive_frag 相同
		public static readonly default_frag: string = WGShaderLib.primitive_frag;

		// ===== blur片段着色器 =====
		// group(1) binding(0): BlurUniforms { blur: vec2, padding, uTextureSize: vec2, padding }
		public static readonly blur_frag: string = `struct FragmentInput {
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

    for (var i = -sampleRadius; i <= sampleRadius; i = i + 1) {
        uv.x = input.vTextureCoord.x + f32(i) * blurUv.x;
        uv.y = input.vTextureCoord.y + f32(i) * blurUv.y;
        color = color + textureSample(uTexture, uSampler, uv);
    }

    color = color / f32(samples);
    return color;
}`;

		// ===== colorTransform片段着色器 =====
		// group(1) binding(0): ColorMatrix { matrix: mat4x4, colorAdd: vec4 }
		public static readonly colorTransform_frag: string = `struct FragmentInput {
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
    var texColor = textureSample(uTexture, uSampler, input.vTextureCoord);
    if (texColor.a > 0.0) {
        texColor = vec4<f32>(texColor.rgb / texColor.a, texColor.a);
    }
    var locColor = clamp(texColor * cm.matrix + cm.colorAdd, vec4<f32>(0.0), vec4<f32>(1.0));
    return input.vColor * vec4<f32>(locColor.rgb * locColor.a, locColor.a);
}`;

		// ===== glow片段着色器 =====
		// group(1) binding(0): GlowUniforms
		public static readonly glow_frag: string = `struct FragmentInput {
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
    let px = vec2<f32>(1.0 / gu.uTextureSize.x, 1.0 / gu.uTextureSize.y);
    let linearSamplingTimes = 7.0;
    let circleSamplingTimes = 12.0;
    var ownColor = textureSample(uTexture, uSampler, input.vTextureCoord);
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
            let sampleY = input.vTextureCoord.y + curDistanceY + offsetY;
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

		// ===== ETC alpha mask 变体 =====
		// 这些着色器需要额外的 sampler/texture 绑定用于alpha mask

		public static readonly texture_etc_alphamask_frag: string = `struct FragmentInput {
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

@group(0) @binding(1)
var uSampler: sampler;

@group(0) @binding(2)
var uTexture: texture_2d<f32>;

@group(0) @binding(3)
var uSamplerAlphaMask: sampler;

@group(0) @binding(4)
var uTextureAlphaMask: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
     // WebGPU 纹理坐标原点在左上，需要翻转 V 坐标
     let uv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);
     let alpha = textureSample(uTextureAlphaMask, uSamplerAlphaMask, uv).r;
     if (alpha < 0.0039) {
         discard;
     }
     var v4Color = textureSample(uTexture, uSampler, uv);
     v4Color = vec4<f32>(v4Color.rgb * alpha, alpha);
     return v4Color * input.vColor;
}`;

		public static readonly colorTransform_frag_etc_alphamask_frag: string = `struct FragmentInput {
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

@group(0) @binding(3)
var uSamplerAlphaMask: sampler;

@group(0) @binding(4)
var uTextureAlphaMask: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
     // WebGPU 纹理坐标原点在左上，需要翻转 V 坐标
     let uv = vec2<f32>(input.vTextureCoord.x, 1.0 - input.vTextureCoord.y);
     let alpha = textureSample(uTextureAlphaMask, uSamplerAlphaMask, uv).r;
     if (alpha < 0.0039) {
         discard;
     }
     var texColor = textureSample(uTexture, uSampler, uv);
     if (texColor.a > 0.0) {
         texColor = vec4<f32>(texColor.rgb / texColor.a, texColor.a);
     }
     var v4Color = clamp(texColor * cm.matrix + cm.colorAdd, vec4<f32>(0.0), vec4<f32>(1.0));
     v4Color = vec4<f32>(v4Color.rgb * alpha, alpha);
     return v4Color * input.vColor;
}`;

	}
};
