/*
* bootState rappresenta lo stato iniziale del gioco, utilizzata per
* caricamento preliminare di oggetti necessari al menu e per il setup
* delle impostazioni principali valide per tutto il gioco
* */
let bootState = {

  preload: function () {
    //carica assets per barra di caricamento
    game.load.image('progressBar', 'assets/progressBar.png');

  },

  create: function () {

    //Imposta motore fisico, colore di background e barra di caricamento
    game.stage.backgroundColor = '#000000';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = true;
    game.stage.disableVisibilityChange = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //Imposta dimensione minima e massima
    game.scale.minWidth =  480;
    game.scale.minHeight = 260;
    game.scale.maxWidth = 640;
    game.scale.maxHeight = 480;

    //TODO controllare cosa fa
    game.scale.forceOrientation(true);
    game.scale.pageAlignHorizontally = true;

    //TODO aggiungere mobile friendlyness

    //Avvia stato di caricamento
    game.state.start('load');
  }

};