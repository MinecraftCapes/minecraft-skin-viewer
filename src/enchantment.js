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
        varying vec2 vUv;
        uniform vec2 uvOffset;
        uniform vec2 uvRepeat;

        void main() {
  	        vec2 uv = fract((vUv + uvOffset) * uvRepeat);
  	        vec2 smooth_uv = uvRepeat * vUv;
  	        vec4 duv = vec4(dFdx(smooth_uv), dFdy(smooth_uv));

            gl_FragColor = textureGrad(uTexture, uv, duv.xy, duv.zw).rgba;
        }
    `,
};

export default EnchantmentShader