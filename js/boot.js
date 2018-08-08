/*
* bootState rappresenta lo stato iniziale del gioco, utilizzata per
* caricamento preliminare di oggetti necessari al menu e per il setup
* delle impostazioni principali valide per tutto il gioco
* */
var bootState = {

  preload: function () {
    //TODO aggiungere barra di caricamento
  },

  create: function () {
    //Imposta motore fisico, colore di background e barra di caricamento
    game.stage.backgroundColor = '#3399ff';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = true;

    game.stage.disableVisibilityChange = true;

    //TODO aggiungere mobile friendlyness

    //Avvia stato di caricamento
    game.state.start('load');
  }

};