//TODO aggiungere tasto per mutare suono

let distance = 300;
let speed = 2;
let star;
let texture;

let max = 300;
let xx = [];
let yy = [];
let zz = [];

/*
* menuState rappresenta il menu di gioco in cui è possibile scegliere
* alcune delle impostazioni di gioco e utilizzarle per le partite successive
* */
let menuState = {

  create: function () {

    /*//Crea sprite per stelle e texture
    star = game.add.sprite(0, 0, 'star');
    star.alpha = 0.5;
    texture = game.add.renderTexture(game.width, game.height, 'texture');
    game.add.sprite(0, 0, texture);

    for (var i = 0; i < max; i++) {
      xx[i] = Math.floor(Math.random() * 800) - 400;
      yy[i] = Math.floor(Math.random() * 600) - 300;
      zz[i] = Math.floor(Math.random() * 1700) - 100;
    }*/

    //Mostra nome del gioco
    var nameLabel = game.add.text(game.width/2, -50, config.mainMenu.name,
      { font: '30px Press Start 2P', fill: '#ffffff' });
    nameLabel.anchor.setTo(0.5, 0.5);
    //aggiunge animazione al label
    game.add.tween(nameLabel).to({y: 80}, 1000)
      .easing(Phaser.Easing.Bounce.Out).start();

    //Aggiunge scelte al menu
    var startLabel = game.add.text(game.width/2, game.height*0.8,
      config.mainMenu.start, { font: 'Press Start 2P', fill: '#ffffff' });
    startLabel.anchor.set(0.5);
    startLabel.fontSize = config.mainMenu.size;
    startLabel.inputEnabled = true;
    startLabel.events.onInputOver.add(this.selectedText, this, 0, startLabel);
    startLabel.events.onInputOut.add(this.inputOutText, this, 0, startLabel);
    startLabel.events.onInputDown.add(this.startGame);

    var optionsLabel = game.add.text(game.width/2, startLabel.y + startLabel.height*2,
      config.mainMenu.options, { font: 'Press Start 2P', fill: '#ffffff' });
    optionsLabel.anchor.set(0.5);
    optionsLabel.fontSize = config.mainMenu.size;
    optionsLabel.inputEnabled = true;
    optionsLabel.events.onInputOver.add(this.selectedText, this, 0, startLabel);
    optionsLabel.events.onInputOut.add(this.inputOutText, this, 0, startLabel);
    optionsLabel.events.onInputDown.add(this.openOptions);

    socket.on('prova', function (data) {
      nameLabel.x += data.X;
      nameLabel.y += data.Y;
    })
  },

  update: function() {
    /*texture.clear();

    for (var i = 0; i < max; i++) {
      var perspective = distance / (distance - zz[i]);
      var x = game.world.centerX + xx[i] * perspective;
      var y = game.world.centerY + yy[i] * perspective;

      zz[i] += speed;

      if (zz[i] > 300)
      {
        zz[i] -= 600;
      }

      texture.renderXY(star, x, y);
    }*/
  },

  selectedText: function(text) {
    game.add.tween(text).to({fontSize: config.mainMenu.size + 3}, 50).start();
    text.tint = 0xf4f142;
  },

  inputOutText: function(text) {
    game.add.tween(text).to({fontSize: config.mainMenu.size}, 50).start();
    text.tint = 0xffffff;
  },

  openOptions: function() {
    game.state.start('options');
  },

  startGame: function () {
    //Avvia stato di gioco
    game.state.start('main');
  }
};