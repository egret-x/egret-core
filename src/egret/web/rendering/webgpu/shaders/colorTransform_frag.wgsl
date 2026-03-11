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
    var texColor = textureSample(uTexture, uSampler, input.vTextureCoord);
    if (texColor.a > 0.0) {
        texColor = vec4<f32>(texColor.rgb / texColor.a, texColor.a);
    }
    var locColor = clamp(texColor * cm.matrix + cm.colorAdd, vec4<f32>(0.0), vec4<f32>(1.0));
    return input.vColor * vec4<f32>(locColor.rgb * locColor.a, locColor.a);
}
