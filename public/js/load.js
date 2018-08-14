/*
* loadState è utilizzato per il caricamento degli assets utilizzati
* nel gioco. Riduce il carico di lavoro agli stati che hanno bisogno
* di essere reattivi.
* */
let loadState = {

  preload: function () {
    //Imposta testo e barra di caricamento
    let loadingLabel = game.add.text(game.width/2, 150, 'loading...',
      {font: '20px Press Start 2P', fill: '#ffffff'});
    loadingLabel.anchor.set(0.5);

    let progressBar = game.add.sprite(game.width/2, 200, 'progressBar');
    progressBar.anchor.set(0.5);
    game.load.setPreloadSprite(progressBar);

    //TODO caricamento assets gioco
    //game.load.image('star', 'assets/star.png');
    game.load.image('wall1', 'assets/wall1.png');
    game.load.tilemap('arena1', 'assets/arena1.json', null, Phaser.Tilemap.TILED_JSON);
  },

  create: function () {
    //Avvio stato di menu
    game.state.start('menu');
  }

};