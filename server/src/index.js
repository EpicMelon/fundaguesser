// Our files
const serverLogic = require('./serverlogic.js');

var path = require('path');

// initializing express-session middleware
var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({store: new SessionStore({path: __dirname+'/tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});

// create express app
var express = require('express');
var app = express();

app.use(express.static(path.resolve('../client/build')));

// var favicon = require('serve-favicon');
// app.use(favicon('public/images/favicon.ico'));

app.use(session);

// Pages
app.get('/*', (req, res) => {
  res.sendFile(path.resolve('../client/build/index.html'));
});

// Attach express app to server

var server;
var PORT = process.env.PORT || 443;

const USE_HTTPS = false;

if (USE_HTTPS) {
  const fs = require('fs');
  var key = fs.readFileSync(__dirname + '/selfsigned.key');
  var cert = fs.readFileSync(__dirname + '/selfsigned.crt');
  var options = {
    key: key,
    cert: cert
  };
  
  server = require('https').createServer(options, app);
  PORT = 443;
}
else {
  server = require('http').createServer(app);
  PORT = 80;
}

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// create new socket.io app
var ios = require('socket.io-express-session');
const e = require('express');
io.use(ios(session)); // session support

// initialize server
serverLogic.init(io);

io.on('connection', (socket) => {
  console.log(socket.id + " connected!");
  serverLogic.initSocket(socket);
});

// start server
server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});