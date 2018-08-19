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

//Differenzia accessi da mobile e pc
app.get('/game', function (req, res) {
  //Invia pagina web in base a tipo di dispositivo
  if(req.device.type === 'desktop')
    res.sendFile(__dirname + '/public/index.html');
  else
    res.sendFile(__dirname + '/public/mobile.html');
});

//Attende richieste su porta 8080
server.listen(8080, function () {
  console.log(`Listening on ${server.address().port}`);
});

//TODO cambiare nome variabile
var lastPlayerID = 0;

io.on('connection', function (socket) {
  socket.on('reqConfig', function() {
    //TODO attenzione perchè in questo modo si controlla sempre l'ultima finestra aperta sul gioco
    lastPlayerID = socket.id;
    var obj = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    socket.emit('config', obj);
  });
  
  socket.on('modConfig', function (configFile) {
    fs.writeFile("./config.json", JSON.stringify(configFile), () => console.error);
  });

  socket.on('input', function(data) {
    //TODO cambiare nome evento emesso
    io.to(lastPlayerID).emit('prova', data);
  });
});