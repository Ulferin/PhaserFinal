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

    //Avvia il gioco con la mappa selezionata nelle opzioni
    this.createMap(config.preferences.map);

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

    //aggiunge listener per nuovo livello
    this.esc = game.input.keyboard.addKey(Phaser.KeyCode.ESC);
    this.esc.onDown.add(this.goToMenu, this);
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

    socket.on('moveUp', function () {
      player.body.velocity.y = -300;
    });

    socket.on('moveDown', function () {
      player.body.velocity.y = 300;
    });

    socket.on('stop', function () {
      player.body.velocity.y = 0;
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
    else{}
      //this.player.body.velocity.y = 0;
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
  },

  createMap: function(mapNum) {
    this.map = game.add.tilemap('arena' + mapNum);
    this.map.addTilesetImage('wall' + mapNum);
    this.layer = this.map.createLayer('layer1');
    this.layer.resizeWorld();
    this.map.setCollision(1);
  },

  goToMenu: function () {
    //Rimuove i listener prima di passare al menu
    socket.removeListener('stop');
    socket.removeListener('moveUp');
    socket.removeListener('moveDown');
    game.state.start('menu');
  }

};