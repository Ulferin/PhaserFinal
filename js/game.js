//Crea oggetto di gioco
let game = new Phaser.Game(800, 600, Phaser.AUTO);

var config = {};

//Aggiunge stati di gioco
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.add('options', optionsState);

//Avvia gioco
game.state.start('boot');