/*
* bootState rappresenta lo stato iniziale del gioco, utilizzata per
* caricamento preliminare di oggetti necessari al menu e per il setup
* delle impostazioni principali valide per tutto il gioco
* */
let bootState = {

  preload: function () {
    //carica assets per barra di caricamento
    game.load.image('progressBar', 'assets/progressBar.png');

    game.load.json('config',null);
  },

  create: function () {
    //Imposta motore fisico, colore di background e barra di caricamento
    game.stage.backgroundColor = '#000000';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = true;

    game.stage.disableVisibilityChange = true;

    //TODO aggiungere mobile friendlyness

    config = game.cache.getJSON('config');

    //Avvia stato di caricamento
    game.state.start('load');
  }

};