//TODO aggiungere tasto per mutare suono

/*
* menuState rappresenta il menu di gioco in cui è possibile scegliere
* alcune delle impostazioni di gioco e utilizzarle per le partite successive
* */
let menuState = {

  create: function () {
    //Mostra nome del gioco
    var nameLabel = game.add.text(game.width/2, -50, 'Super Coin Box',
      { font: '50px Arial', fill: '#ffffff' });
    nameLabel.anchor.setTo(0.5, 0.5);
    //aggiunge animazione al label
    game.add.tween(nameLabel).to({y: 80}, 1000)
      .easing(Phaser.Easing.Bounce.Out).start();
  },

  update: function() {

  },

  startGame: function () {
    //Avvia stato di gioco
    game.state.start('main');
  }

};