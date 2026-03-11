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

    for (var i = -sampleRadius; i <= sampleRadius; i = i + 1) {
        uv.x = input.vTextureCoord.x + f32(i) * blurUv.x;
        uv.y = input.vTextureCoord.y + f32(i) * blurUv.y;
        color = color + textureSample(uTexture, uSampler, uv);
    }

    color = color / f32(samples);
    return color;
}
