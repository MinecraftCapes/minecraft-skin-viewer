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

        varying vec2 vUv;

        void main() {
            // --- Base texture ---
            vec2 baseUv = fract((vUv + textureOffset) * textureRepeat);
            vec2 baseSmoothUv = textureRepeat * vUv;
            vec4 baseDuv = vec4(dFdx(baseSmoothUv), dFdy(baseSmoothUv));
            vec4 baseColor = textureGrad(baseTexture, baseUv, baseDuv.xy, baseDuv.zw);

            // --- Glint texture ---
            vec2 glintRepeat = vec2(0.5, 0.5);
            vec2 glintUv = fract((vUv + glintOffset) * glintRepeat);
            vec2 glintSmoothUv = glintRepeat * vUv;
            vec4 glintDuv = vec4(dFdx(glintSmoothUv), dFdy(glintSmoothUv));
            vec4 glimmerColor = textureGrad(glimmerTexture, glintUv, glintDuv.xy, glintDuv.zw);

            // Use brightness of glint (purple on black) as our mask
            float glintLuma = dot(glimmerColor.rgb, vec3(0.299, 0.587, 0.114));

            // Kill the black background and sharpen the mask a bit
            float glintMask = smoothstep(0.15, 0.6, glintLuma);

            // A nice enchant-style purple tint
            vec3 enchantTint = normalize(glimmerColor.rgb + vec3(0.001));

            // Screen-style highlight: push base towards tinted white in glint areas
            // This keeps the item's hue but adds a bright, coloured shimmer
            vec3 highlight = baseColor.rgb + enchantTint * glintMask * (1.0 - baseColor.rgb);

            vec3 finalColor = mix(baseColor.rgb, highlight, 2.0);

            gl_FragColor = vec4(finalColor, baseColor.a);

            if (gl_FragColor.a < 0.0001) {
                discard;
            }
        }
    `,
};

export default EnchantmentShader