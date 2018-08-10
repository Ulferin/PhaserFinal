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
    //Se esiste una versione aggiornata del file di configurazione, lo recupera
    configs = JSON.parse(localStorage.getItem('options'));
    if(configs) config = configs;

    //Crea sprite per stelle e texture
    star = game.add.sprite(0, 0, 'star');
    star.alpha = 0.5;
    texture = game.add.renderTexture(game.width, game.height, 'texture');
    game.add.sprite(0, 0, texture);

    for (var i = 0; i < max; i++) {
      xx[i] = Math.floor(Math.random() * 800) - 400;
      yy[i] = Math.floor(Math.random() * 600) - 300;
      zz[i] = Math.floor(Math.random() * 1700) - 100;
    }

    //Mostra nome del gioco
    var nameLabel = game.add.text(game.width/2, -50, config.text.name,
      { font: '30px Press Start 2P', fill: '#ffffff' });
    nameLabel.anchor.setTo(0.5, 0.5);
    //aggiunge animazione al label
    game.add.tween(nameLabel).to({y: 80}, 1000)
      .easing(Phaser.Easing.Bounce.Out).start();

    //Aggiunge scelte al menu
    var startLabel = game.add.text(game.width/2, game.height-150,
      config.text.start, { font: 'Press Start 2P', fill: '#ffffff' });
    startLabel.anchor.set(0.5);
    startLabel.fontSize = config.text.size;
    startLabel.inputEnabled = true;
    startLabel.events.onInputOver.add(this.selectedText, this, 0, startLabel);
    startLabel.events.onInputOut.add(this.inputOutText, this, 0, startLabel);
    startLabel.events.onInputDown.add(this.startGame);

    var optionsLabel = game.add.text(game.width/2, game.height-100,
      config.text.options, { font: 'Press Start 2P', fill: '#ffffff' });
    optionsLabel.anchor.set(0.5);
    optionsLabel.fontSize = config.text.size;
    optionsLabel.inputEnabled = true;
    optionsLabel.events.onInputOver.add(this.selectedText, this, 0, startLabel);
    optionsLabel.events.onInputOut.add(this.inputOutText, this, 0, startLabel);
    optionsLabel.events.onInputDown.add(this.openOptions);
    //TODO implementare opzioni

    //probabilmente inutile
    /*var exitLabel = game.add.text(game.width/2, game.height-50,
      exit, { font: '15px Press Start 2P', fill: '#ffffff' });
    exitLabel.anchor.set(0.5);
    exitLabel.inputEnabled = true;
    exitLabel.events.onInputDown.add(this.exitGame);*/

  },

  update: function() {
    texture.clear();

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
    }
  },

  selectedText: function(text) {
    game.add.tween(text).to({fontSize: config.text.size + 3}, 50).start();
    text.tint = 0xf4f142;
  },

  inputOutText: function(text) {
    game.add.tween(text).to({fontSize: config.text.size}, 50).start();
    text.tint = 0xffffff;
  },

  openOptions: function() {
    config.text.size = 15;
    console.log(config.text.size);
    localStorage.setItem('options', JSON.stringify(config));
  },

  startGame: function () {
    //Avvia stato di gioco
    game.state.start('main');
  }
};