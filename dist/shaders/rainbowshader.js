AFRAME.registerShader('rainbow-shader', {
  schema: {
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

  #define TWO_PI 6.28318530718

  varying vec2 vUv;
  uniform float timeMsec;
  uniform vec2 u_resolution;

  vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    vec2 st = vUv;
    vec3 color = vec3(0.0);
    vec2 toCenter = vec2(0.5)-st;
    float angle = atan(toCenter.y,toCenter.x);
    float radius = length(toCenter)*2.0;
    color = hsb2rgb(vec3((angle/TWO_PI)+0.5,radius,1.0));
    gl_FragColor = vec4(color, 1.0);
  }
`
});
