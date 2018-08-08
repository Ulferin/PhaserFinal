//Crea oggetto di gioco
let game = new Phaser.Game(800, 600, Phaser.AUTO);

//Aggiunge stati di gioco
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);

//Avvia gioco
game.state.start('boot');