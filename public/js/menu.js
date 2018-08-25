/*
* menuState rappresenta il menu di gioco in cui è possibile scegliere
* alcune delle impostazioni di gioco e utilizzarle per le partite successive
* inviando le modifiche al server.
* */
let menuState = {

  create: function () {

    //Imposta mappa di sfondo con animazione
    this.createMap(config.preferences.map);
    this.layer.alpha = 0.5;
    game.add.tween(this.layer).to({alpha:0.30}, 2000).to({alpha:0.5}, 2000).loop().start();

    //Mostra nome del gioco
    this.nameLabel = game.add.text(game.width/2, -50, config.mainMenu.name,
      { font: '30px Press Start 2P', fill: '#ffffff' });
    this.nameLabel.anchor.setTo(0.5, 0.5);
    //aggiunge animazione al label
    game.add.tween(this.nameLabel).to({y: 80}, 1000)
      .easing(Phaser.Easing.Bounce.Out).start();

    /* ----- Costruzione scelte menu ----- */
    this.startLabel = game.add.text(game.width/2, game.height*0.8,
      config.mainMenu.start, { font: 'Press Start 2P', fill: '#ffffff' });
    this.startLabel.anchor.set(0.5);
    this.startLabel.fontSize = config.mainMenu.size;
    this.startLabel.inputEnabled = true;
    this.startLabel.events.onInputOver.add(this.selectedText);
    this.startLabel.events.onInputOut.add(this.inputOutText);
    this.startLabel.events.onInputDown.add(this.startGame);

    this.optionsLabel = game.add.text(game.width/2, this.startLabel.y + this.startLabel.height*2,
      config.mainMenu.options, { font: 'Press Start 2P', fill: '#ffffff' });
    this.optionsLabel.anchor.set(0.5);
    this.optionsLabel.fontSize = config.mainMenu.size;
    this.optionsLabel.inputEnabled = true;
    this.optionsLabel.events.onInputOver.add(this.selectedText);
    this.optionsLabel.events.onInputOut.add(this.inputOutText);
    this.optionsLabel.events.onInputDown.add(this.openOptions);

    this.editLabel = game.add.text(game.width/2, this.optionsLabel.y + this.optionsLabel.height*2,
      config.mainMenu.edit, { font: 'Press Start 2P', fill: '#ffffff'});
    this.editLabel.anchor.set(0.5);
    this.editLabel.fontSize = config.mainMenu.size;
    this.editLabel.inputEnabled = true;
    this.editLabel.events.onInputOver.add(this.selectedText);
    this.editLabel.events.onInputOut.add(this.inputOutText);
    this.editLabel.events.onInputDown.add(this.openEditor);
    /* ----------------------------------- */
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
    game.state.start('main');
  },

  openEditor: function() {
    game.state.start('editor');
  },

  //Crea mappa di sfondo in base a configurazione attuale
  createMap: function (mapNum) {
    this.map = game.add.tilemap('arena' + mapNum);
    this.map.addTilesetImage('wall' + mapNum);
    this.layer = this.map.createLayer('layer1');
    this.layer.resizeWorld();
    this.layer.alpha = 0.5;
  }
};