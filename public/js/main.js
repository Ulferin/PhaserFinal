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
    this.map.setCollision(1);

    //Recupera oggetti da tilemap
    this.objects = game.add.group();
    this.map.createFromObjects('object1', 2, 'player', 0, true, false, this.objects);

    //crea oggetto per gestione input frecce direzionali
    //non propaga l'input al browser
    this.cursor = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture(
      [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN]
    );

    //Imposta proprietà barra player
    this.player = this.objects.children[0];
    game.physics.arcade.enable(this.player);
    this.player.checkWorldBounds = true;
    this.player.body.collideWorldBounds = true;


    this.enemy = this.map.createFromObjects('object1', 3, 'enemy');
  },

  update: function () {
    //Controlla collisioni con mappa
    game.physics.arcade.collide(this.player, this.layer);

    //y axis movement
    if (this.cursor.up.isDown)
      this.player.body.velocity.y = -300;
    else if (this.cursor.down.isDown)
      this.player.body.velocity.y = 300;
    else
      this.player.body.velocity.y = 0;
  }

};