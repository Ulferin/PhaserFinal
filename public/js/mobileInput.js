var socket = io.connect();
var ball = {};

let padState= {

  preload: function () {

  },

  create: function () {
    console.log('create');

    if (window.DeviceOrientationEvent) {

      window.addEventListener("deviceorientation", function(event)
      {
        let scale = {};
        scale.Y = Math.round(event.beta);
        scale.X = Math.round(event.gamma);
        scale.Z = Math.round(event.alpha);
        socket.emit('input', scale);
      }, true);



    } else {
      alert("Sorry, your browser doesn't support Device Orientation");
    }

  },

  update: function () {

  }

};

var game = new Phaser.Game(500, 200);
game.state.add('pad', padState);
game.state.start('pad');