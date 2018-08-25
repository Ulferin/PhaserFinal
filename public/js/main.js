//TODO migliorare recupero player, palla e enemy da tilemap

/*
* mainState rappresenta lo stato di gioco vero e proprio
* */
var mainState = {

  init: function(data) {
    if(data !== undefined) {
      //game.load.tilemap('map', '', data.map, Phaser.Tilemap.TILED_JSON);
      //this.map = game.add.tilemap('map');
      //this.map.addTilesetImage('tileset');
      this.objects = game.add.group();
      this.map = data.map;
      this.layer = data.layer;
      //this.layer.resizeWorld();
      this.player = data.player;
      this.enemy = data.enemy;
      this.ball = data.ball;
      this.objects.add(this.player);
      this.objects.add(this.enemy);
      this.objects.add(this.ball);
    }
    else
      this.createMap(config.preferences.map)
  },

  preload: function () {

  },

  create: function () {

    this.emitter = game.add.emitter(game.world.centerX, game.world.centerY, 30);
    this.emitter.particleAnchor.set(0.5);
    this.emitter.gravity = 0;
    this.emitter.maxParticleSpeed = 0;
    this.emitter.minRotation = 0;
    this.emitter.maxRotation = 0;
    this.emitter.setAlpha(1, 0, 250);

    this.emitter.makeParticles('ball');
    this.emitter.start(false,300,0);
    this.emitter.on = true;

    this.deviation = {};
    this.deviation.Y = 0;
    this.deviation.X = 0;
    this.bonus = false;
    this.score1 = 0;
    this.score2 = 0;


    //Avvia il gioco con la mappa selezionata nelle opzioni
    //this.createMap(config.preferences.map);

    //Recupera oggetti da tilemap


    //crea oggetto per gestione input frecce direzionali
    //non propaga l'input al browser
    this.cursor = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture(
      [Phaser.Keyboard.UP, Phaser.Keyboard.DOWN]
    );

    //Imposta proprietà barra player

    game.physics.arcade.enable(this.player);
    this.player.checkWorldBounds = true;
    this.player.body.collideWorldBounds = true;
    this.player.body.immovable = true;


    //Recupera barra nemica e imposta proprietà

    game.physics.arcade.enable(this.enemy);
    this.enemy.checkWorldBounds = true;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.immovable = true;
    this.enemy.body.drag = true;

    //Recupera palla e imposta proprietà

    this.ball.checkWorldBounds = true;
    this.ball.collideWorldBounds = true;
    game.physics.arcade.enable(this.ball);
    this.ball.body.velocity.x = -450;
    this.ball.body.velocity.y = 0;
    this.ball.body.bounce.x = 1;
    this.ball.body.bounce.y = 1;
    this.ball.outOfBoundsKill = true;
    this.ball.events.onOutOfBounds.add(this.ballOut, this);

    //aggiunge listener per nuovo livello
    this.esc = game.input.keyboard.addKey(Phaser.KeyCode.ESC);
    this.esc.onDown.add(this.goToMenu, this);

    this.setSocket(this.player, this.deviation, this.bonus, this.ball, this);

    this.score1Label = game.add.text(game.width/2-50, game.height*0.8,
      this.score1, { font: 'Press Start 2P', fill: '#ffffff' });
    this.score1Label.anchor.set(0.5);
    this.score1Label.fontSize = 30;

    this.score2Label = game.add.text(game.width/2 + 50, game.height*0.8,
      this.score2, { font: 'Press Start 2P', fill: '#ffffff' });
    this.score2Label.anchor.set(0.5);
    this.score2Label.fontSize = 30;
  },

  update: function () {
    //Controlla collisioni con mappa
    game.physics.arcade.collide(this.player, this.ball, this.ballHitPlayer, null, this);
    game.physics.arcade.collide(this.objects, this.layer);
    game.physics.arcade.collide(this.enemy, this.ball, this.ballHitPlayer, null, this);

    this.movePlayer();
    this.moveEnemy();
    this.emitter.x = this.ball.centerX;
    this.emitter.y = this.ball.centerY;

    if(!this.ball.alive) {
      this.newGame();
    }
  },

  setSocket: function (player, deviation, bonus, ball, mainState) {
    console.log(player);
    socket.on('prova', function (data) {
      deviation.Y = data.Y;

    });

    socket.on('moveUp', function () {
      player.body.velocity.y = -300 * config.options["pad speed"][config.preferences["pad speed"]];
    });

    socket.on('moveDown', function () {
      player.body.velocity.y = 300 * config.options["pad speed"][config.preferences["pad speed"]];
    });

    socket.on('stop', function () {
      player.body.velocity.y = 0;
    });

    socket.on('bonus', function () {
      if(mainState.bonus === false) {
        mainState.bonus = true;
        mainState.ball.body.velocity.x *= 2;
        mainState.ball.body.velocity.y *= 2;
      }
      else {
        mainState.bonus = false;
        mainState.ball.body.velocity.x /= 2;
        mainState.ball.body.velocity.y /= 2;
      }
      console.log(mainState.bonus);
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
        this.enemy.body.velocity.y = -100;
      else if (this.ball.body.y === this.enemy.body.y + this.enemy.height/2)
        this.enemy.body.velocity.y = 0;
      else
        this.enemy.body.velocity.y = 100;
    }
    else
      this.enemy.body.velocity.y = 0;
  },

  newGame: function () {
    console.log(this.bonus);
    this.bonus = false;
    this.ball.reset(this.game.width/2, this.game.height/2);
    this.ball.body.velocity.x = 450;
    this.ball.body.velocity.y = 50;
  },

  createMap: function(mapNum) {
    this.map = game.add.tilemap('arena' + mapNum);
    this.map.addTilesetImage('wall' + mapNum);
    this.layer = this.map.createLayer('layer1');
    //this.layer.resizeWorld();
    this.map.setCollision(1);

    this.objects = game.add.group();
    this.map.createFromObjects('object1', 2, 'player', 0, true, false, this.objects);
    this.player = this.objects.children[0];
    this.map.createFromObjects('object1', 3, 'enemy', 0, true, false, this.objects);
    this.enemy = this.objects.children[1];
    this.map.createFromObjects('object1', 4, 'ball', 0, true, false, this.objects);
    this.ball = this.objects.children[2];
  },

  goToMenu: function () {
    //Rimuove i listener prima di passare al menu
    socket.removeListener('stop');
    socket.removeListener('moveUp');
    socket.removeListener('moveDown');
    socket.removeListener('bonus');
    game.state.start('menu');
  },

  ballOut: function () {
    console.log(this.ball.x);
    if(this.ball.x > game.width) {
      this.score1Label.text = ++this.score1;
      game.add.tween(this.score1Label).to({fontSize: 40}, 150).to({fontSize:30}, 150).start();
    }
    else {
      this.score2Label.text = ++this.score2;
      game.add.tween(this.score2Label).to({fontSize: 40}, 150).to({fontSize: 30}, 150).start();
    }
  }

};