console.log('octopus');

function rawtree(scl) {
    const mgreen  = new THREE.MeshBasicMaterial( {color: 0x03fc8c, side: THREE.DoubleSide} );
    const mred    = new THREE.MeshBasicMaterial( {color: 0xfc3903, side: THREE.DoubleSide} );
    const morange = new THREE.MeshBasicMaterial( {color: 0xfcad03, side: THREE.DoubleSide} );
    const myellow = new THREE.MeshBasicMaterial( {color: 0xf4fc03, side: THREE.DoubleSide} );
    const mblue   = new THREE.MeshBasicMaterial( {color: 0x03f8fc, side: THREE.DoubleSide} );
    const mindigo = new THREE.MeshBasicMaterial( {color: 0x6b03fc, side: THREE.DoubleSide} );
    const mviolet = new THREE.MeshBasicMaterial( {color: 0xf003fc, side: THREE.DoubleSide} );
    const mats = [mgreen, mred, morange, myellow, mblue, mindigo, mviolet];
    const mwhite  = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    const mblack  = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );

    function randInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }


    const gmaterial = new THREE.ShaderMaterial( {
      uniforms: {
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
`,
      fragmentShader: `
        precision mediump float;
        varying vec2 vUv;
        uniform vec3 color;

        void main() {
        vec4 col1   = vec4(0.99, 0.97, 0.01, 1.0);
        vec4 col2  = vec4(0.01, 0.99, 0.99, 1.0);
        vec4 col3 = vec4(1.0, 0.0, 0.0, 1.0);
  
        float interp = mod(gl_FragCoord.x, 3.0);
        interp = interp/3.0;

        float rgb1 = mod(gl_FragCoord.x, 6.0);
        float rgb2 = mod(gl_FragCoord.y, 6.0);

        if(rgb1 <= 2.0 && rgb2 <= 2.0){
          gl_FragColor = col3;
        } else if(rgb1 <= 4.0 && rgb2 <= 4.0){
          gl_FragColor = col2;
        } else {
          gl_FragColor = col1;
        }
      }
`,
      side: THREE.DoubleSide,
    });

    function leafNode(scale){
      const w = 2;
      const h = 2;
      const plangeom = new THREE.PlaneGeometry(w, h).rotateX(Math.PI/2).translate(0.0, 0.0, h/2*scale);
      const planmesh = new THREE.Mesh(plangeom, gmaterial);
      var scene = new THREE.Scene();
      scene.add(planmesh);
      scene.rotateZ(Math.PI/4);
      return scene;
    }

    function lTree(scale){
      const minscale = 0.1;
      const w = 1;
      const h = 7

      var scene = new THREE.Scene();
      const plangeom = new THREE.PlaneGeometry(w, h).scale(scale, scale, scale).rotateX(Math.PI/2).translate(0.0, 0.0, h/2*scale);
      const planmesh = new THREE.Mesh(plangeom, mblack);

      scene.add(planmesh);
      scene.rotateZ(Math.PI/4);
      
      if(scale < minscale){
	return leafNode(scale);
      }

      var randy = randInt(5)+3;
      var rbranch = lTree(scale - (scale/4.0));
      rbranch.translateZ(h*scale);
      rbranch.rotateY(Math.PI/randy);
      scene.add(rbranch);

      randy = randInt(5)+3;
      var lbranch = lTree(scale - (scale/4.0));
      lbranch.translateZ(h*scale);
      lbranch.rotateY(-Math.PI/randy);
      scene.add(lbranch);
      
      return scene;
    }
    
  return lTree(scl);
}

export default rawtree;
