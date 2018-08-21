//TODO aggiungere tasto per mutare suono

/*
* menuState rappresenta il menu di gioco in cui è possibile scegliere
* alcune delle impostazioni di gioco e utilizzarle per le partite successive
* */
let menuState = {

  create: function () {

    this.createMap(config.preferences.map);
    this.layer.alpha = 0.5;
    game.add.tween(this.layer).to({alpha:0.30}, 2000).to({alpha:0.5}, 2000).loop().start();

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
    startLabel.events.onInputOver.add(this.selectedText);
    startLabel.events.onInputOut.add(this.inputOutText);
    startLabel.events.onInputDown.add(this.startGame);

    var optionsLabel = game.add.text(game.width/2, startLabel.y + startLabel.height*2,
      config.mainMenu.options, { font: 'Press Start 2P', fill: '#ffffff' });
    optionsLabel.anchor.set(0.5);
    optionsLabel.fontSize = config.mainMenu.size;
    optionsLabel.inputEnabled = true;
    optionsLabel.events.onInputOver.add(this.selectedText);
    optionsLabel.events.onInputOut.add(this.inputOutText);
    optionsLabel.events.onInputDown.add(this.openOptions);

    var editLabel = game.add.text(game.width/2, optionsLabel.y + optionsLabel.height*2,
      config.mainMenu.edit, { font: 'Press Start 2P', fill: '#ffffff'});
    editLabel.anchor.set(0.5);
    editLabel.fontSize = config.mainMenu.size;
    editLabel.inputEnabled = true;
    editLabel.events.onInputOver.add(this.selectedText);
    editLabel.events.onInputOut.add(this.inputOutText);
    editLabel.events.onInputDown.add(this.openEditor);
  },

  //Aggiunge animazione per testo selezionato
  selectedText: function(text) {
    game.add.tween(text).to({fontSize: config.mainMenu.size + 3}, 50).start();
    text.tint = 0xf4f142;
  },

  //Aggiunge animazione per testo deselezionato
  inputOutText: function(text) {
    game.add.tween(text).to({fontSize: config.mainMenu.size}, 50).start();
    text.tint = 0xffffff;
  },

  //Passa allo stato opzioni
  openOptions: function() {
    game.state.start('options');
  },

  //Avvia gioco
  startGame: function () {
    //Avvia stato di gioco
    game.state.start('main');
  },

  openEditor: function() {
    game.state.start('editor');
  },

  createMap: function (mapNum) {
    this.map = game.add.tilemap('arena' + mapNum);
    this.map.addTilesetImage('wall' + mapNum);
    this.layer = this.map.createLayer('layer1');
    this.layer.resizeWorld();
    this.layer.alpha = 0.5;
  }
};