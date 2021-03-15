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
const server = require('http').createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// create new socket.io app
var ios = require('socket.io-express-session');
io.use(ios(session)); // session support

// initialize server
serverLogic.init(io);

io.on('connection', (socket) => {
  console.log(socket.id + " connected!");
  serverLogic.initSocket(socket);
});

// start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log('listening on *:' + PORT);
});