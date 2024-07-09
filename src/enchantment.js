const EnchantmentShader = {
    vertex: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragment: `
        uniform sampler2D uTexture;
        uniform vec3 ambientLightColor;
        varying vec2 vUv;

        void main() {
            vec4 texColor = texture2D(uTexture, vUv);

            // Blend ambient light color with texture color
            vec3 finalColor = texColor.rgb * ambientLightColor;

            gl_FragColor = vec4(finalColor, texColor.a);

            // Discard transparent fragments
            if (gl_FragColor.a < 0.1) discard;
        }
    `,
};

export default EnchantmentShader