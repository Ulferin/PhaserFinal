//TODO migliorare recupero player, palla e enemy da tilemap

/*
* mainState rappresenta lo stato di gioco
* */
var mainState = {

  init: function(data) {
    //Se non è definita una mappa custom
    // recupera quella indicata nella configurazione attuale
    if(data !== undefined) {
      this.objects = game.add.group();
      this.map = data.map;
      this.layer = data.layer;
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

  create: function () {

    //Limite punteggio
    this.scoreLimit = config.options["score limit"][config.preferences["score limit"]];

    //Crea emitter per scia palla
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

    //Deviation rappresenta l'inclinazione del client mobile
    this.deviation = {};
    this.deviation.Y1 = 0;
    this.deviation.Y2 = 0;

    //Indica se il bonus è attivo o meno
    this.bonus = false;

    //Punteggio player1/player2
    this.score1 = 0;
    this.score2 = 0;

    //Crea oggetto per gestione input frecce direzionali
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


    //Imposta proprietà barra nemica
    game.physics.arcade.enable(this.enemy);
    this.enemy.checkWorldBounds = true;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.immovable = true;
    this.enemy.body.drag = true;

    //Imposta proprietà palla
    this.ball.checkWorldBounds = true;
    this.ball.collideWorldBounds = true;
    game.physics.arcade.enable(this.ball);
    this.ball.body.velocity.x = -450;
    this.ball.body.velocity.y = 0;
    this.ball.body.bounce.x = 1;
    this.ball.body.bounce.y = 1;
    this.ball.events.onOutOfBounds.add(this.ballOut, this);

    //aggiunge listener per nuovo livello
    this.esc = game.input.keyboard.addKey(Phaser.KeyCode.ESC);
    this.esc.onDown.add(this.goToMenu, this);

    //Setta callback socket
    this.setSocket(this);

    //Crea label per la visualizzazione del punteggio
    this.score1Label = game.add.text(game.width/2-50, game.height*0.8,
      this.score1, { font: 'Press Start 2P', fill: '#ffffff' });
    this.score1Label.anchor.set(0.5);
    this.score1Label.fontSize = 30;

    this.score2Label = game.add.text(game.width/2 + 50, game.height*0.8,
      this.score2, { font: 'Press Start 2P', fill: '#ffffff' });
    this.score2Label.anchor.set(0.5);
    this.score2Label.fontSize = 30;

    //TODO fare in modo che al raggiungimento di un punteggio blocca gioco
  },

  update: function () {
    //Controlla collisioni con mappa
    game.physics.arcade.collide(this.player, this.ball, this.ballHitPlayer, null, this);
    game.physics.arcade.collide(this.objects, this.layer);
    game.physics.arcade.collide(this.enemy, this.ball, this.ballHitPlayer, null, this);

    //Aggiorna posizione emitter per scia
    this.emitter.x = this.ball.centerX;
    this.emitter.y = this.ball.centerY;
  },

  setSocket: function (mainState) {
    //Imposta deviazione pallina
    socket.on('deviation1', function (data) {
      mainState.deviation.Y1 = data.Y;
    });

    socket.on("deviation2", function (data) {
      mainState.deviation.Y2 = data.Y;
    });

    /* ----- Imposta movimento player in base ad evento ricevuto ----- */
    socket.on('moveUp1', function () {
      mainState.player.body.velocity.y = -300 * config.options["pad speed"][config.preferences["pad speed"]];
    });

    socket.on('moveDown1', function () {
      mainState.player.body.velocity.y = 300 * config.options["pad speed"][config.preferences["pad speed"]];
    });

    socket.on('stop1', function () {
      mainState.player.body.velocity.y = 0;
    });
    /* --------------------------------------------------------------- */

    /* ----- Imposta movimento enemy in base ad evento ricevuto ----- */
    socket.on('moveUp2', function () {
      mainState.enemy.body.velocity.y = -300 * config.options["pad speed"][config.preferences["pad speed"]];
    });

    socket.on('moveDown2', function () {
      mainState.enemy.body.velocity.y = 300 * config.options["pad speed"][config.preferences["pad speed"]];
    });

    socket.on('stop2', function () {
      mainState.enemy.body.velocity.y = 0;
    });
    /* --------------------------------------------------------------- */

    //Attiva o disattiva bonus
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
    });
  },
  
  ballHitPlayer: function (player, ball) {
    //Decide direzione pallina in base ad inclinazione ricevuta dal server
    if(player.key === "player")
      this.ball.body.velocity.y = (5 * this.deviation.Y1);
    else
      this.ball.body.velocity.y = (5 * this.deviation.Y2);
  },

  newGame: function () {
    this.bonus = false;
    this.ball.reset(this.game.width/2, this.game.height/2);
    this.ball.body.velocity.x = 450;
    this.ball.body.velocity.y = 50;
  },

  createMap: function(mapNum) {
    //Crea mappa in base a configurazione corrente
    this.map = game.add.tilemap('arena' + mapNum);
    this.map.addTilesetImage('wall' + mapNum);
    this.layer = this.map.createLayer('layer1');
    this.map.setCollision(1);

    //Recupera oggetti mappa
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
    //Assegna punto in base alla direzione di uscita della pallina
    if(this.ball.x > game.width) {
      this.score1Label.text = ++this.score1;
      game.add.tween(this.score1Label).to({fontSize: 40}, 150).to({fontSize:30}, 150).start();
    }
    else {
      this.score2Label.text = ++this.score2;
      game.add.tween(this.score2Label).to({fontSize: 40}, 150).to({fontSize: 30}, 150).start();
    }

    //Se è stato raggiunto il limite di punteggio mostra schermata gameover, altrimenti riposiziona pallina
    if(!(this.scoreLimit === 0) && (this.score1 === this.scoreLimit || this.score2 === this.scoreLimit)) {
      let bmd = game.add.bitmapData(1, 1);
      bmd.fill(0, 0, 0);
      let semiTransparentOverlay = game.add.sprite(0, 0, bmd);
      semiTransparentOverlay.scale.setTo(game.width, game.height);
      semiTransparentOverlay.alpha = 0;
      game.add.tween(semiTransparentOverlay).to({alpha:0.5}, 250, Phaser.Easing.Quadratic.In, true);

      this.gameOverLabel = game.add.text(game.width/2, game.height/2, "Game Over",
        { font: '1px Press Start 2P', fill: '#ffffff' });
      this.gameOverLabel.anchor.setTo(0.5, 0.5);
      this.escLabel = game.add.text(game.width/2, this.gameOverLabel.y + 40, "Press ESC to exit.",
        { font: '1px Press Start 2P', fill: '#ffffff' });
      this.escLabel.anchor.setTo(0.5, 0.5);
      game.add.tween(this.gameOverLabel).to({fontSize: 30}, 500, Phaser.Easing.Elastic.Out, true);
      game.add.tween(this.escLabel).to({fontSize: 15}, 500, Phaser.Easing.Elastic.Out, true);

      this.ball.kill();
    }
    else {
      //Resetta posizione pallina quando esce dal bordo
      this.newGame();
    }
  }

};