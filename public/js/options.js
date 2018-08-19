//Configurazione corrente
let currConf = null;

let optionsState = {

  create: function () {
    //effettua copia oggetto configurazione
    currConf = JSON.parse(JSON.stringify(config));

    //Recupera impostazioni e relativi valori
    let optlist = Object.keys(config.options);
    let valuelist = Object.values(config.options);

    //Crea lista di impostazioni modificabili
    for(let i=0; i<optlist.length; i++) {
      let label = game.add.text(game.width/2, game.height/2.5 + i*50,
        optlist[i] + ': ' + valuelist[i][config.preferences[optlist[i]]], { font: 'Press Start 2P', fill: '#ffffff' });
      label.anchor.setTo(0.5, 0.5);
      label.fontSize = config.mainMenu.size;
      label.inputEnabled = true;
      label.optType = optlist[i];
      label.values = valuelist[i];
      label.currentValue = config.preferences[optlist[i]];

      //Aggiunge listener a testo
      label.events.onInputOver.add(this.selectedText, this, 0, label);
      label.events.onInputOut.add(this.inputOutText, this, 0, label);
      label.events.onInputDown.add(this.selected);
    }

    //Label per salvataggio impostazioni
    var saveLabel = game.add.text(game.width/2-80, game.height*0.8, "Save",
      { font: 'Press Start 2P', fill: '#ffffff' });
    saveLabel.anchor.setTo(0.5,0.5);
    saveLabel.fontSize = config.mainMenu.size;
    saveLabel.inputEnabled = true;

    saveLabel.events.onInputOver.add(this.selectedText, this, 0, saveLabel);
    saveLabel.events.onInputOut.add(this.inputOutText, this, 0, saveLabel);
    saveLabel.events.onInputDown.add(this.saveConfig);

    //Label per scartare impostazioni
    var exitLabel = game.add.text(game.width/2+80, game.height*0.8, "Discard",
      { font: 'Press Start 2P', fill: '#ffffff' });
    exitLabel.anchor.setTo(0.5,0.5);
    exitLabel.fontSize = config.mainMenu.size;
    exitLabel.inputEnabled = true;

    exitLabel.events.onInputOver.add(this.selectedText, this, 0, exitLabel);
    exitLabel.events.onInputOut.add(this.inputOutText, this, 0, exitLabel);
    exitLabel.events.onInputDown.add(this.discardConfig);

  },

  //Funzione per animazione selezione
  selectedText: function (text) {
    game.add.tween(text).to({fontSize: config.mainMenu.size + 3}, 50).start();
    text.tint = 0xf4f142;
  },

  //Funzione per animazione deselezione
  inputOutText: function (text) {
    game.add.tween(text).to({fontSize: config.mainMenu.size}, 50).start();
    text.tint = 0xffffff;
  },

  //Funzione per cambio configurazione
  selected: function (opt) {
    opt.text = opt.optType + ": " + opt.values[(++opt.currentValue)%opt.values.length];
    currConf.preferences[opt.optType] = (opt.currentValue)%opt.values.length;
  },

  //Funzione per salvataggio configurazioni
  saveConfig: function () {
    config = currConf;
    socket.emit('modConfig', config);
    game.state.start('menu');
  },

  //Funzione per scartare configurazioni
  discardConfig: function () {
    game.state.start('menu');
  }

};