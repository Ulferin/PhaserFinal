//TODO inserire schermata iniziale

var socket = io.connect();

let padState= {

  preload: function () {
    //Carica assets
    game.load.image('upArrow', 'assets/up_arrow.png');
    game.load.image('downArrow', 'assets/down_arrow.png');
    game.load.image('speedup', 'assets/speedup_bonus.png');
  },

  create: function () {

    //Aggiunge listener per invio cambio rotazione
    this.setOrientationListener();

    //Imposta interfaccia gamepad
    game.stage.backgroundColor = '#000';
    this.addMobileButton();

    //Imposta la copertura dell'intera parte di schermo
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    //Imposta dimensione massima e minima
    game.scale.setMinMax(game.width/2, game.height/2,
      game.width*2, game.height*2);

    //Centra il gioco nello schermo
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    //Imposta colore background
    document.body.style.backgroundColor = '#000';

    //Variabili per tracciamento input
    this.moveUp = false;
    this.moveDown = false;

    //Listener doppio tap per fullscreen
    game.input.onTap.add(this.goFullScreen, this);
  },

  update: function () {
    this.movePlayer();
  },

  addMobileButton: function() {
    this.upArrow = game.add.sprite(50, game.height/2, 'upArrow');
    this.upArrow.anchor.set(0.5);
    this.upArrow.inputEnabled = true;
    this.upArrow.alpha = 0.8;
    this.upArrow.events.onInputDown.add(this.setUpTrue, this);
    this.upArrow.events.onInputUp.add(this.setUpFalse, this);

    this.downArrow = game.add.sprite(game.width - 75, game.height/2, 'downArrow');
    this.downArrow.anchor.set(0.5);
    this.downArrow.inputEnabled = true;
    this.downArrow.alpha = 0.8;
    this.downArrow.events.onInputDown.add(this.setDownTrue, this);
    this.downArrow.events.onInputUp.add(this.setDownFalse, this);

    this.speedup = game.add.sprite(game.width/2, game.height/2, 'speedup');
    this.speedup.anchor.set(0.5);
    this.speedup.inputEnabled = true;
    this.speedup.alpha = 0.8;
    this.speedup.events.onInputDown.add(this.setBonus, this);
  },

  setOrientationListener: function () {
    //Se il dispositivo supporta la lettura dei sensori
    if (window.DeviceOrientationEvent) {
      //Aggiunge listener per cambio di valori nei sensori
      window.addEventListener("deviceorientation", function(event)
      {
        //Recupera valori
        let scale = {};
        scale.Y = Math.round(event.beta);
        scale.X = Math.round(event.gamma);
        scale.Z = Math.round(event.alpha);
        //Invia evento al server
        socket.emit('input', scale);
      }, true);
    }
    else {
      alert("Il browser non supporta i sensori.");
    }
  },

  setUpTrue: function () {
    this.moveUp = true;
  },

  setUpFalse: function () {
    this.moveUp = false;
  },

  setDownTrue: function () {
    this.moveDown = true;
  },

  setDownFalse: function () {
    this.moveDown = false;
  },

  movePlayer: function () {
    //Invia segnale al server in base a tasto premuto
    if(this.moveDown)
      socket.emit('moveDown');
   else if(this.moveUp)
      socket.emit('moveUp');
    else
      socket.emit('stop');
  },

  goFullScreen: function (pointer, doubleTap) {
    if(doubleTap) {
      game.scale.startFullScreen();
    }
  },

  setBonus: function () {
    socket.emit('bonus');
  }


};

//Crea scena di gioco
var game = new Phaser.Game(800, 400);
game.state.add('pad', padState);
game.state.start('pad');