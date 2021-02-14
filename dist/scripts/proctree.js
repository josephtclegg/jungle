import rawtree from './rawtree.js';

console.log('000000000000000');

AFRAME.registerComponent('proctree', {
  schema: {
    
  },

  init: function () {
    const el = this.el;
    const dat = this.data;
    console.log('initd a proctree');
    el.object3D.add(rawtree(1.0));
  }
});
