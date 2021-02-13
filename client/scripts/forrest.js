AFRAME.registerComponent('forrest', {
  schema: {},

  init: function () {
    const el = this.el;
    const dat = this.data;

    var tree = document.createElement('a-entity');
    tree.setAttribute('proctree', '')
    document.querySelector('a-scene').appendChild(tree);

    //el.obect3D.add(treemod);
  },
});
