const EnchantmentShader = {
    vertex: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * (modelViewMatrix * vec4(position, 1.0));
        }
    `,
    fragment: `
        uniform sampler2D baseTexture;
        uniform sampler2D glimmerTexture;
        uniform vec2 textureOffset;
        uniform vec2 textureRepeat;
        uniform vec2 glintOffset;
        uniform vec2 glintRepeat;
        uniform float glimmerOpacity;

        varying vec2 vUv;

        void main() {
            // Calculate UV coordinates for the base texture
            vec2 baseUv = fract((vUv + textureOffset) * textureRepeat);
            vec2 baseSmoothUv = textureRepeat * vUv;
            vec4 baseDuv = vec4(dFdx(baseSmoothUv), dFdy(baseSmoothUv));

            // Sample the base texture
            vec4 baseColor = textureGrad(baseTexture, baseUv, baseDuv.xy, baseDuv.zw);

            // Calculate UV coordinates for the glimmer texture
            vec2 glintUv = fract((vUv + glintOffset) * glintRepeat);
            vec2 glintSmoothUv = glintRepeat * vUv;
            vec4 glintDuv = vec4(dFdx(glintSmoothUv), dFdy(glintSmoothUv));

            // Sample the glimmer texture and remove the black background
            vec4 glimmerColor = textureGrad(glimmerTexture, glintUv, glintDuv.xy, glintDuv.zw);
            if (glimmerColor.r < 0.1 && glimmerColor.g < 0.1 && glimmerColor.b < 0.1) {
                glimmerColor = vec4(0.0);
            }

            // Apply the glimmer effect with the specified opacity
            vec4 finalGlimmerColor = glimmerColor * glimmerOpacity;

            // Preserve the base texture's alpha and overlay the glimmer effect
            vec3 finalColor = baseColor.rgb + finalGlimmerColor.rgb * finalGlimmerColor.a;
            gl_FragColor = vec4(finalColor, baseColor.a);
        }
    `,
};

export default EnchantmentShader