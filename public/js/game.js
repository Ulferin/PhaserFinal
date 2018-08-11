//Crea oggetto di gioco
let game = new Phaser.Game(800, 600, Phaser.AUTO);

var config = {};

//Crea socket e recupera dal server il file di configurazione
var socket = io.connect();
socket.emit('reqConfig');
socket.on('config', function (confFile) {
  config = confFile;
});

//Aggiunge stati di gioco
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('main', mainState);
game.state.add('options', optionsState);

//Avvia gioco
game.state.start('boot');