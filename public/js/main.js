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

    socket.on('prova', function (data) {
      xLabel.text = 'valore x: ' + data.X;
      yLabel.text = 'valore y: ' + data.Y;
    })
  },

  update: function () {

  }

};