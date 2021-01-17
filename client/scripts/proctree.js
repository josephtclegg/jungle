AFRAME.registerComponent('proctree', {
  schema: {
    
  },

  init: function () {
    const el = this.el;
    const dat = this.data;
    
    //var plang = new THREE.PlaneGeometry(1, 5).rotateX(Math.PI/2).translate(0.0, 0.0, 2.5);
    const mgreen  = new THREE.MeshBasicMaterial( {color: 0x03fc8c, side: THREE.DoubleSide} );
    const mred    = new THREE.MeshBasicMaterial( {color: 0xfc3903, side: THREE.DoubleSide} );
    const morange = new THREE.MeshBasicMaterial( {color: 0xfcad03, side: THREE.DoubleSide} );
    const myellow = new THREE.MeshBasicMaterial( {color: 0xf4fc03, side: THREE.DoubleSide} );
    const mblue   = new THREE.MeshBasicMaterial( {color: 0x03f8fc, side: THREE.DoubleSide} );
    const mindigo = new THREE.MeshBasicMaterial( {color: 0x6b03fc, side: THREE.DoubleSide} );
    const mviolet = new THREE.MeshBasicMaterial( {color: 0xf003fc, side: THREE.DoubleSide} );
    const mats = [mgreen, mred, morange, myellow, mblue, mindigo, mviolet];
    //const planey = new THREE.Mesh(plang, material);
    //var pscene = new THREE.Scene().add(planey);

    function randInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    function lTree(scale){
      const w = 1;
      const h = 4;
      var scene = new THREE.Scene();
      var plangeom = new THREE.PlaneGeometry(w, h).scale(scale, scale, scale).rotateX(Math.PI/2).translate(0.0, 0.0, h/2*scale);
      var planmesh = new THREE.Mesh(plangeom, mats[randInt(7)]);
      scene.add(planmesh);
      //scene.rotateZ(Math.PI/4);
      if(scale < 0.25){
        return scene;
      }
      
      var rbranch = lTree(scale - (scale/4.0));
      rbranch.translateZ(h*scale);
      rbranch.rotateY(Math.PI/4);
      scene.add(rbranch);

      var lbranch = lTree(scale - (scale/4.0));
      lbranch.translateZ(h*scale);
      lbranch.rotateY(-Math.PI/4);
      scene.add(lbranch);
      
      return scene;
    }
    
    el.object3D.add(lTree(1.0));
  }
});
