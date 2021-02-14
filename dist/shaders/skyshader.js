AFRAME.registerShader('sky-shader', {
  schema: {
    color: {
      type: 'color',
      is: 'uniform',
    },
    timeMsec: {
      type: 'time',
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
  varying vec2 vUv;
  uniform vec3 color;
  uniform float timeMsec;

  void main() {
    float time = timeMsec / 1000.0;
    gl_FragColor = mix(
      vec4(mod(vUv, 0.05) * 20.0, 1.0, 1.0),
      vec4(color, 1.0),
      sin(time)
    );
  }
`,
});
