var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
let config = require('./config.json');
var device = require('express-device');
app.use(device.capture());

app.use(express.static(__dirname + '/public'));

app.get('/game', function (req, res) {
  //Invia pagina web in base a tipo di dispositivo
  if(req.device.type === 'desktop')
    res.sendFile(__dirname + '/public/index.html');
  else
    res.sendFile(__dirname + '/public/mobile.html');
});

server.listen(8080, function () {
  console.log(`Listening on ${server.address().port}`);
});

server.lastPlayerID = 0;

io.on('connection', function (socket) {
  socket.on('reqConfig', function() {
    var obj = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
    socket.emit('config', obj);
  });
  
  socket.on('modConfig', function (configFile) {
    fs.writeFile("./config.json", JSON.stringify(configFile), () => console.error);
  });
});