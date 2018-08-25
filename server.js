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
var desktopClient = {"connected":false, "id":0};
var phoneClient = {"connected":false};

//Differenzia accessi da mobile e pc
app.get('/', function (req, res) {
  //Invia pagina web in base a tipo di dispositivo
  if(req.device.type === 'desktop' && !desktopClient.connected) {
    res.sendFile(__dirname + '/public/desktop.html');
    desktopClient.connected = true;
  }
  else if(req.device.type !== 'desktop' && !phoneClient.connected) {
    res.sendFile(__dirname + '/public/mobile.html');
    phoneClient.connected = true;
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
    else {
      phoneClient.connected = false;
    }
  });

  //Richiesta file di configurazione
  socket.on('reqConfig', function() {
    desktopClient.id = socket.id;
    var obj = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    socket.emit('config', obj);
  });

  //Richiesta di modifica file di configurazione
  socket.on('modConfig', function (configFile) {
    fs.writeFile("./config.json", JSON.stringify(configFile), () => console.error);
  });

  //Riceve dati inclinazione e li invia al client desktop
  socket.on('input', function(data) {
    io.to(desktopClient.id).emit('deviation', data);
  });

  /* ----- Notifiche movimento, inoltra al client desktop ----- */
  socket.on('moveUp', function () {
    io.to(desktopClient.id).emit('moveUp');
  });

  socket.on('moveDown', function () {
    io.to(desktopClient.id).emit('moveDown');
  });

  socket.on('stop', function () {
    io.to(desktopClient.id).emit('stop');
  });
  /* --------------------------------------------------------- */

  /* ----- Notifiche attivazione/disattivazione bonus, inoltra al client desktop ----- */
  socket.on('bonus', function () {
    io.to(desktopClient.id).emit('bonus');
  });

  socket.on('bonusDown', function () {
    io.to(desktopClient.id).emit('bonus');
  })
  /* --------------------------------------------------------------------------------- */

});