/*
* Server di gioco, si occupa della ricezione degli input da mobile e dell'inoltro degli
* stessi al client desktop.
* All'avvio di un nuovo client desktop fornisce il file di configurazione di gioco,
* permette la modifica persistente delle configurazioni.
* */

let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io').listen(server);
let fs = require('fs');
let config = require('./config.json');
let device = require('express-device');
app.use(device.capture());

//Crea cartella virtuale
app.use(express.static(__dirname + '/public'));

//Ultimo client desktop/mobile connesso
let desktopClient = {"connected":false, "id":0};
let phoneClient1 = {"connected":false, "id":0};
let phoneClient2 = {"connected": false, "id":0};

//Differenzia accessi da mobile e pc
app.get('/', function (req, res) {
  //Invia pagina web in base a tipo di dispositivo
  if(req.device.type === 'desktop' && !desktopClient.connected) {
    res.sendFile(__dirname + '/public/desktop.html');
    desktopClient.connected = true;
  }
  else if(req.device.type !== 'desktop' && (!phoneClient1.connected || !phoneClient2.connected)) {
    res.sendFile(__dirname + '/public/mobile.html');
  }
});

//Attende richieste su porta 8080
server.listen(process.env.PORT || 8080, function () {
  console.log(`Listening on ${server.address().port}`);
});

//Imposta azioni alla connessione di un nuovo client
io.on('connection', function (socket) {

  //Resetta id quando il client si disconnette
  socket.on('disconnect', function () {
    if(socket.id === desktopClient.id) {
      desktopClient.id = 0;
      desktopClient.connected = false;
    }
    else if(socket.id === phoneClient1.id) {
      phoneClient1.id = 0;
      phoneClient1.connected = false;
      console.log("player1 disconnected");
    }
    else {
      phoneClient2.id = 0;
      phoneClient2.connected = false;
      console.log("player2 disconnected");
    }
  });

  //Accetta connessione da mobile
  socket.on('padConnected', function () {
    if(phoneClient1.id === 0) {
      phoneClient1.id = socket.id;
      phoneClient1.connected = true;
      console.log("player1 connected");
    }
    else {
      phoneClient2.id = socket.id;
      phoneClient2.connected = true;
      console.log("player2 connected");
    }
  });
  
  //Richiesta file di configurazione
  socket.on('reqConfig', function() {
    desktopClient.id = socket.id;
    let obj = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    socket.emit('config', obj);
  });

  //Richiesta di modifica file di configurazione
  socket.on('modConfig', function (configFile) {
    fs.writeFile("./config.json", JSON.stringify(configFile), () => console.error);
  });

  //Riceve dati inclinazione e li invia al client desktop
  socket.on('input', function(data) {
    if(socket.id === phoneClient1.id)
      io.to(desktopClient.id).emit('deviation1', data);
    else
      io.to(desktopClient.id).emit('deviation2', data);
  });

  /* ----- Notifiche movimento, inoltra al client desktop ----- */
  socket.on('move', function (moveData) {
    if(socket.id === phoneClient1.id)
      io.to(desktopClient.id).emit('move1', moveData);
    else
      io.to(desktopClient.id).emit('move2', moveData)
  });
  /* --------------------------------------------------------- */

  /* ----- Notifiche attivazione/disattivazione bonus, inoltra al client desktop ----- */
  socket.on('bonus', function () {
    io.to(desktopClient.id).emit('bonus');
  });

  socket.on('bonusDown', function () {
    io.to(desktopClient.id).emit('bonus');
  });
  /* --------------------------------------------------------------------------------- */

  /* ----- Notifiche aggiornamento punteggio ----- */
  socket.on('updateScore1', function (score) {
    io.to(phoneClient1.id).emit('updateScore', score);
  });

  socket.on('updateScore2', function (score) {
    io.to(phoneClient2.id).emit('updateScore', score);
  })
  /* --------------------------------------------- */

});