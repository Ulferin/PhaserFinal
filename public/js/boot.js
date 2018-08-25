/*
* bootState rappresenta lo stato iniziale del gioco, utilizzato per
* caricamento preliminare di oggetti necessari al menu e per il setup
* delle impostazioni principali valide per tutto il gioco
* */
let bootState = {

  preload: function () {
    //carica assets per barra di caricamento
    game.load.image('progressBar', 'assets/progressBar.png');
  },

  create: function () {

    //Imposta background pagina html
    document.body.style.backgroundColor = "#0a0a0a";

    //Imposta motore fisico, colore di background e barra di caricamento
    game.stage.backgroundColor = '#000000';
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.renderer.renderSession.roundPixels = true;
    game.stage.disableVisibilityChange = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    //Imposta dimensione minima e massima
    game.scale.maxWidth = 800;
    game.scale.maxHeight = 608;

    //Allinea finestra di gioco al centro dello schermo
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    //TODO aggiungere mobile friendlyness

    //Avvia stato di caricamento
    game.state.start('load');
  }

};