var socket = io.connect();
var ball = {};

let padState= {

  preload: function () {

  },

  create: function () {

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

  update: function () {

  }

};

//Crea scena di gioco
var game = new Phaser.Game(500, 200);
game.state.add('pad', padState);
game.state.start('pad');