struct FragmentInput {
    @location(0) vTextureCoord: vec2<f32>,
    @location(1) vColor: vec4<f32>,
};

@fragment
fn main(input: FragmentInput) -> @location(0) vec4<f32> {
    return input.vColor;
}
