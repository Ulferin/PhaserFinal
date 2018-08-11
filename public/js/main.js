/*
* mainState rappresenta lo stato di gioco vero e proprio
* */
var mainState = {

  preload: function () {

  },

  create: function () {
    var xLabel = game.add.text(game.width/2, game.height/2, "valore x: ",
      { font: '30px Press Start 2P', fill: '#ffffff' } );
    xLabel.anchor.set(0.5);
    xLabel.fontSize = config.mainMenu.size;

    var yLabel = game.add.text(game.width/2, game.height/2+50, "valore y: ",
      { font: '30px Press Start 2P', fill: '#ffffff' } );
    yLabel.anchor.set(0.5);
    yLabel.fontSize = config.mainMenu.size;

    socket.on('inclinationChange', function (arg) {
      xLabel.text = 'valore x:' + arg.x;
      yLabel.text = 'valore y:' + arg.y;
    })
  },

  update: function () {

  }

};