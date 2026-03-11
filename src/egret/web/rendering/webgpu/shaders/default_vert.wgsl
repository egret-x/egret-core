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
}
