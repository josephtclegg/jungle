AFRAME.registerComponent('proctree', {
  schema: {
    
  },

  init: function () {
    const el = this.el;
    const dat = this.data;

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

    function leafNode(scale){
      const w = 1;
      const h = 1;
      const plangeom = new THREE.PlaneGeometry(w, h).rotateX(Math.PI/2).translate(0.0, 0.0, h/2*scale);
      const planmesh = new THREE.Mesh(plangeom, mats[randInt(7)]);
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
    
    el.object3D.add(lTree(2.0));
  }
});
