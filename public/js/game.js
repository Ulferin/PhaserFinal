//Crea oggetto di gioco
let game = new Phaser.Game(800, 608, Phaser.AUTO);

//Oggetto ultima configurazione salvata
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
game.state.add('editor', editorState);

//Avvia gioco
game.state.start('boot');