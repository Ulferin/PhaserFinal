/*
* loadState è utilizzato per il caricamento degli assets utilizzati
* nel gioco. Riduce il carico di lavoro agli stati che hanno bisogno
* di essere reattivi.
* */
let loadState = {

  preload: function () {
    //Imposta testo caricamento
    this.loadingLabel = game.add.text(game.width/2, 150, 'loading...',
      {font: '20px Press Start 2P', fill: '#ffffff'});
    this.loadingLabel.anchor.set(0.5);

    //Setta barra di caricamento
    this.progressBar = game.add.sprite(game.width/2, 200, 'progressBar');
    this.progressBar.anchor.set(0.5);
    game.load.setPreloadSprite(this.progressBar);

    //Carica elementi di gioco
    game.load.image('wall0', 'assets/wall0.png');
    game.load.image('wall1', 'assets/wall1.png');
    game.load.image('tileset', 'assets/maptileset.png');
    game.load.image('player', 'assets/player.png');
    game.load.image('enemy', 'assets/enemy.png');
    game.load.image('ball', 'assets/ball.png');
    game.load.tilemap('arena0', 'assets/arena0.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tilemap('arena1', 'assets/arena1.json', null, Phaser.Tilemap.TILED_JSON);

  },

  create: function () {
    //Avvio stato di menu
    game.state.start('menu');
  }

};