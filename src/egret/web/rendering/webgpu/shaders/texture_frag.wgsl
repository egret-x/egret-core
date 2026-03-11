struct FragmentInput {
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

@group(0) @binding(1)
var uSampler: sampler;

@group(0) @binding(2)
var uTexture: texture_2d<f32>;

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    return textureSample(uTexture, uSampler, input.vTextureCoord) * input.vColor;
}
