var socket = io.connect();

let padState= {

  preload: function () {
    game.load.image('upArrow', 'assets/up_arrow.png');
    game.load.image('downArrow', 'assets/down_arrow.png');
  },

  create: function () {
    //Aggiunge listener per invio cambio rotazione
    this.setOrientationListener();

    //Imposta interfaccia gamepad
    game.stage.backgroundColor = '#000';
    this.addMobileButton();
    //Imposta la copertura dell'intera parte di schermo
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    // Set the min and max width/height of the game
    game.scale.setMinMax(game.width/2, game.height/2,
      game.width*2, game.height*2);
    //Centra il gioco nello schermo
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    // Add a blue color to the page to hide potential white borders
    document.body.style.backgroundColor = '#000';

    //Variabili per tracciamento input
    this.moveUp = false;
    this.moveDown = false;
  },

  update: function () {
    this.movePlayer();
  },

  addMobileButton: function() {
    this.upArrow = game.add.sprite(50, 50, 'upArrow');
    this.upArrow.anchor.set(0.5);
    this.upArrow.inputEnabled = true;
    this.upArrow.alpha = 0.8;
    this.upArrow.events.onInputDown.add(this.setUpTrue, this);
    this.upArrow.events.onInputUp.add(this.setUpFalse, this);

    this.downArrow = game.add.sprite(game.width - 75, 50, 'downArrow');
    this.downArrow.anchor.set(0.5);
    this.downArrow.inputEnabled = true;
    this.downArrow.alpha = 0.8;
    this.downArrow.events.onInputDown.add(this.setDownTrue, this);
    this.downArrow.events.onInputUp.add(this.setDownFalse, this);
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
      alert("Sorry, your browser doesn't support Device Orientation");
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
    if(this.moveUp)
      console.log('sopra');
    else if(this.moveDown)
      console.log('sotto');
    else
      console.log('fermo');
  }


};

//Crea scena di gioco
var game = new Phaser.Game(500, 200);
game.state.add('pad', padState);
game.state.start('pad');