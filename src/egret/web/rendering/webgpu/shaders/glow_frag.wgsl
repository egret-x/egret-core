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
}
