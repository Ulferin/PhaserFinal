var bootState = {

  preload: function () {
    //TODO aggiungere barra di caricamento
  },

  create: function () {
    game.stage.backgroundColor = '#3399ff';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = true;

    game.stage.disableVisibilityChange = true;

    //TODO aggiungere mobile friendlyness

    game.state.start('load');
  }

};