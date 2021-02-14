AFRAME.registerShader('sunset-shader', {
  schema: {
    timeMsec: {
      type: 'time',
      is: 'uniform',
    },
    color1: {
      type: 'color',
      is: 'uniform',
    },
    color2: {
      type: 'color',
      is: 'uniform',
    },
  },

  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,

  fragmentShader: `
    #ifdef GL_ES
    precision mediump float;
    #endif

    varying vec2 vUv;
    uniform float timeMsec;
    uniform vec3 color1;
    uniform vec3 color2;

    void main(){
      vec2 position = vUv;
      float y = pow(position.y, 1.2);
      vec3 disc = vec3(y);
      vec3 skycol = vec3(0.0);

      skycol = mix(color1, color2, disc);
      gl_FragColor = vec4(skycol, 1.0);
    }
`,
});
