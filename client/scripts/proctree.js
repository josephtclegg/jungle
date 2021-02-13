AFRAME.registerComponent('jungle', {
  schema: {
    width: {type: 'number'},  // width of jungle
    height: {type: 'number'}, // height of jungle
    step: {type: 'number'},   // space between trees
    roam: {type: 'number'},   // amount of freedom for random displacement
  },

  init: function () {
    const el = this.el;
    const dat = this.data;

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
/*	fragmentShader: `
          precision mediump float;
          varying vec2 vUv;
          uniform vec3 color;

          void main() {
            //vec4 col1   = vec4(0.99, 0.97, 0.01, 1.0);
            //vec4 col2  = vec4(0.01, 0.99, 0.99, 1.0);
            //vec4 col3 = vec4(1.0, 0.0, 0.0, 1.0);
            //vec4 col1 = vec4(3.0/255.0, 252.0/255.0, 157.0/255.0, 1.0); //pretty green
            vec4 col1 = vec4(1.0, 0.8, 0.0, 1.0);
            vec4 col2 = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 col3 = vec4(1.0, 1.0, 1.0, 1.0);
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
*/	fragmentShader: `
          precision mediump float;
          varying vec2 vUv;
          uniform vec3 color;

          void main() {
            float w = 17.0;
            float h = 17.0;
            float thick = 0.4;
            vec4 pgreen  = vec4(3.0/255.0, 252.0/255.0, 157.0/255.0, 1.0);
            vec4 gyellow = vec4(1.0, 0.9, 0.0, 1.0); // gros!!
            vec4 white   = vec4(1.0, 1.0, 1.0, 1.0);
            vec4 prim = white;
            vec4 seco = pgreen;
            float co1 = mod(gl_FragCoord.x, w);
            float co2 = mod(gl_FragCoord.y, h);
            float no1 = 6.28*co1/w;
            float no2 = co2/h;
            no2 = no2-0.5;
            no2 = no2*3.0;

            if(sin(no1) < no2+thick && sin(no1) > no2-thick){
              gl_FragColor = prim;
            } else if(cos(no1+1.0) < no2+thick && cos(no1+1.0) > no2-thick) {
              gl_FragColor = prim;
            } else {
              gl_FragColor = seco;
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
	var scene = new THREE.Group();
	scene.add(planmesh);
	scene.rotateZ(Math.PI/4);
	return scene;
      }
      
      function lTree(scale){
	const minscale = 0.1;
	const w = 1;
	const h = 7	
	var scene = new THREE.Group();
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


    function jungle(el, dat){
      const step = dat.step;
      const roam = dat.roam;
      var h = el.getAttribute('height');
      var w = el.getAttribute('width');

      if(!step){
        step = 1;
      }
      if(!roam){
        roam = 1;
      }
      if(!h){
        h = dat.height;
      }
      if(!w){
        w = dat.width;
      }
      if(!h){
        h = 0;
      }
      if(!w){
        w = 0;
      }
      h = parseInt(h);
      w = parseInt(w);

      for(var i = 0; i < (w+1); i+=step){
        for(var j = 0; j < (h+1); j+=step){
          var tree = rawtree(1.0);
          var woff = Math.random()/2*roam;
          var hoff = Math.random()/2*roam;
          if(Math.random() < 0.5){
            woff = woff*-1;
          }
          if(Math.random() < 0.5){
            hoff = hoff*-1;
          }
          tree.position.set(i-(w/2)-woff, j-(h/2)-woff, 0);
          el.object3D.add(tree);
        }
      }
      console.log('octopus');
    }
    jungle(el, dat);
//    el.object3D.add(rawtree(1.0));
  }
});
