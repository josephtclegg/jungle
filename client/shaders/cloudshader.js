AFRAME.registerShader('cloud-shader', {
  schema: {
    cloudcolr: {
      type: 'color',
      is: 'uniform',
    },
    skycolr: {
      type: 'color',
      is: 'uniform',
    },
    timescale: {
      type: 'float',
      is: 'uniform',
    },
    iGlobalTime: {
      type: 'time',
      is: 'uniform',
    },
  },

  vertexShader: `
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform vec3 cloudcolr;
    uniform vec3 skycolr;
    uniform float timescale;
    uniform float iGlobalTime;
    // azure -> vec4(3.0/255.0, 107.0/255.0, 208.0/255.0, 1.0)
    const float HOW_CLOUDY = 0.4;
    const float SHADOW_THRESHOLD = 0.2;
    const float SHADOW = 0.03;
    const float SUBSURFACE = 0.5;
    const float WIND_DIRECTION = 5.0;
    const float SCALE = 0.6;
    const mat2 RM = mat2(cos(WIND_DIRECTION), -sin(WIND_DIRECTION), sin(WIND_DIRECTION),
                         cos(WIND_DIRECTION));

    float hash(float n){
      return fract(sin(n)*758.5453);
    }

    float noise(in vec3 x){
      vec3 p = floor(x);
      vec3 f = fract(x);
      float n = p.x + p.y*57.0 + p.z*800.0;
      float res = mix(mix(mix(hash(n+0.0),hash(n+1.0),f.x),mix(hash(n+57.0),hash(n+58.0),f.x),f.y),
                      mix(mix(hash(n+800.0),hash(n+801.0),f.x),mix(hash(n+857.0),hash(n+858.0),
                      f.x),f.y),f.z);
      return res;
    }

    float fbm(vec3 p){
      float f = 0.0;
      f += 0.50000*noise(p); p = p*2.02;
      f -= 0.25000*noise(p); p = p*2.03;
      f += 0.12500*noise(p); p = p*3.01;
      f += 0.06250*noise(p); p = p*3.04;
      f += 0.01250*noise(p); p = p*4.01;
      f += 0.01250*noise(p); p = p*4.04;
      f -= 0.00125*noise(p);
      return f/0.984375;
    }

    float cloud(vec3 p){
      p -= fbm(vec3(p.x,p.y,0.0)*0.5)*1.25;
      float a = min((fbm(p*3.0)*2.2-1.1),0.0);
      return a*a;
    }

    float shadow = 1.0;

    float clouds(vec2 p){
      float ic = cloud(vec3(p*2.0, iGlobalTime*0.01 * timescale)) / HOW_CLOUDY;
      float init = smoothstep(0.1, 1.0, ic) * 10.0;
      shadow = smoothstep(0.0, SHADOW_THRESHOLD, ic) * SHADOW + (1.0 - SHADOW);
      init = (init * cloud(vec3(p*6.0, iGlobalTime*0.01 * timescale)) * ic);
      init = (init * (cloud(vec3(p*11.0, iGlobalTime*0.01 * timescale))*0.5 + 0.4) * init);
      return min(1.0, init);
    }

    float cloudslowres(vec2 p){
      float ic = 1.0 - cloud(vec3(p*2.0, iGlobalTime*0.01 * timescale)) / HOW_CLOUDY;
      float init = smoothstep(0.1, 1.0, ic) * 1.0;
      return min(5.0, init);
    }

    vec2 ratio = vec2(1.0, 1.0);

    vec3 getresult(){
      vec2 surfacePosition = vUv;
      vec2 position = RM*(surfacePosition);
      float c = clouds(position);
      shadow = min(1.0, shadow * 0.2 * SUBSURFACE);
      return pow(mix(vec3(shadow), skycolr, c), vec3(1.0/0.4));
    }

    void main(void){
      gl_FragColor = getresult().xyzz;
    }
  `,
});
