/*
* mainState rappresenta lo stato di gioco vero e proprio
* */
var mainState = {

  preload: function () {

  },

  create: function () {
    //Avvia il gioco con mappa "arena1"
    this.map = game.add.tilemap('arena1');
    this.map.addTilesetImage('wall1');
    this.layer = this.map.createLayer('layer1');
    this.layer.scale.setTo(game.width/(32 * this.map.width), game.height/(32*this.map.height));
  },

  update: function () {

  }

};