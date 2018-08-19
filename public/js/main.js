//TODO migliorare recupero player, palla e enemy da tilemap

/*
* mainState rappresenta lo stato di gioco vero e proprio
* */
var mainState = {

  preload: function () {

  },

  create: function () {
    this.deviation = {};
    this.deviation.Y = 1;
    this.deviation.X = 1;

    //Avvia il gioco con mappa "arena1"
    this.map = game.add.tilemap('arena1');
    this.map.addTilesetImage('wall1');
    this.layer = this.map.createLayer('layer1');
    //this.layer.scale.setTo(game.width/(32 * this.map.width), game.height/(32*this.map.height));
    this.map.setCollision(1);
    console.log(this.map);

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
    this.player.body.immovable = true;
    this.setSocket(this.player, this.deviation);

    //Recupera barra nemica e imposta proprietà
    this.map.createFromObjects('object1', 3, 'enemy', 0, true, false, this.objects);
    this.enemy = this.objects.children[1];
    game.physics.arcade.enable(this.enemy);
    this.enemy.checkWorldBounds = true;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.immovable = true;
    this.enemy.body.drag = true;

    //Recupera palla e imposta proprietà
    this.map.createFromObjects('object1', 4, 'ball', 0, true, false, this.objects);
    this.ball = this.objects.children[2];
    this.ball.checkWorldBounds = true;
    this.ball.collideWorldBounds = true;
    game.physics.arcade.enable(this.ball);
    this.ball.body.velocity.x = -350;
    this.ball.body.velocity.y = 0;
    this.ball.body.bounce.x = 1;
    this.ball.body.bounce.y = 1;
    this.ball.outOfBoundsKill = true;
  },

  update: function () {
    //Controlla collisioni con mappa
    game.physics.arcade.collide(this.player, this.ball, this.ballHitPlayer, null, this);
    game.physics.arcade.collide(this.objects, this.layer);
    game.physics.arcade.collide(this.enemy, this.ball, this.ballHitPlayer, null, this);

    this.movePlayer();
    this.moveEnemy();

    if(!this.ball.alive)
      this.newGame();
  },

  setSocket: function (player, deviation) {
    console.log(player);
    socket.on('prova', function (data) {
      deviation.Y = data.Y;

    });
  },
  
  ballHitPlayer: function () {

    //Decide direzione pallina in base ad inclinazione calcolata
    this.ball.body.velocity.y = (5 * this.deviation.Y);
  },
  
  movePlayer: function () {
    //y axis movement
    if (this.cursor.up.isDown)
      this.player.body.velocity.y = -300;
    else if (this.cursor.down.isDown)
      this.player.body.velocity.y = 300;
    else
      this.player.body.velocity.y = 0;
  },
  
  moveEnemy: function () {

    //Il giocatore avversario per ora si muove come se seguisse la pallina
    if(this.ball.body.x > this.game.width/2) {
      if(this.ball.body.y < this.enemy.body.y + this.enemy.height/2)
        this.enemy.body.velocity.y = -300;
      else if (this.ball.body.y === this.enemy.body.y + this.enemy.height/2)
        this.enemy.body.velocity.y = 0;
      else
        this.enemy.body.velocity.y = 300;
    }
    else
      this.enemy.body.velocity.y = 0;
  },

  newGame: function () {
    this.ball.reset(this.game.width/2, this.game.height/2);
    this.ball.body.velocity.x = 350;
    this.ball.body.velocity.y = 50;
  }

};