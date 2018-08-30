//TODO inserire schermata iniziale

var socket = io.connect();

let padState= {

  preload: function () {
    //Carica assets
    game.load.image('upArrow', 'assets/up_arrow.png');
    game.load.image('downArrow', 'assets/down_arrow.png');
    game.load.image('speedup', 'assets/speedup_bonus.png');
    this.load.atlas('generic', 'assets/generic-joystick.png', 'assets/generic-joystick.json');
  },

  create: function () {

    //Comunica al server la connesione
    socket.emit('padConnected');

    //Valore attuale rotazione
    this.moveData = {
      "y": 0
    };

    //Listener cambio rotazione dispositivo
    game.scale.onOrientationChange.add(this.orientationChange, this);
    this.orientationChange();

    //Aggiunge listener per invio valore rotazione
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

    //Listener doppio tap per fullscreen
    game.input.onTap.add(this.goFullScreen, this);

    //Crea label per la visualizzazione del punteggio
    var scoreLabel = game.add.text(game.width/2, game.height*0.8, 'score: 0'
      , { font: 'Press Start 2P', fill: '#ffffff' });
    scoreLabel.anchor.set(0.5);
    scoreLabel.fontSize = 20;

    //Aggiorna punteggio
    socket.on('updateScore', function (score) {
      scoreLabel.text = 'score: ' + score;
    });
  },

  update: function () {
    this.movePlayer();
  },

  //Costruisce interfaccia
  addMobileButton: function() {
    //Carica plugin VirtualJoystick
    this.pad = game.plugins.add(Phaser.VirtualJoystick);

    //Setup stick direzionale
    this.stick = this.pad.addStick(0, 0, 200, 'generic');
    this.stick.showOnTouch = true;
    this.stick.scale = 0.8;
    this.stick.motionLock = Phaser.VirtualJoystick.VERTICAL;

    //Aggiunge pulsante per bonus
    this.speedup = game.add.sprite(game.width * 0.8, game.height/2, 'speedup');
    this.speedup.anchor.set(0.5);
    this.speedup.inputEnabled = true;
    this.speedup.alpha = 0.8;
    this.speedup.events.onInputDown.add(this.setBonus, this);
  },

  //Invia valore rotazione dispositivo
  setOrientationListener: function () {
    //Se il dispositivo supporta la lettura dei sensori
    if (window.DeviceOrientationEvent) {
      //Aggiunge listener per cambio di valori nei sensori
      window.addEventListener("deviceorientation", function(event)
      {
        //Recupera valori
        let scale = {};
        scale.Y = Math.round(event.beta);
        //Invia evento al server
        socket.emit('input', scale);
      }, true);
    }
    else {
      alert("Il browser non supporta i sensori.");
    }
  },

  //Invia valore movimento
  movePlayer: function () {
    //Invia segnale al server in base a direzione pad
    this.moveData.y = this.stick.forceY;
    socket.emit('move', this.moveData);

  },

  //Passa a fullscreen
  goFullScreen: function (pointer, doubleTap) {
    if(doubleTap) {
      game.scale.startFullScreen();
    }
  },

  //Invia attivazione/disattivazione bonus
  setBonus: function () {
    socket.emit('bonus');
  },

  //Cambia visualizzazione in base ad orientamento dispositivo
  orientationChange: function() {
    if (game.scale.isPortrait) {
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    else {
      game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    }
  }


};

//Crea scena di gioco
var game = new Phaser.Game(800, 400);
game.state.add('pad', padState);
game.state.start('pad');