// Our files
const serverLogic = require('./serverlogic.js');

var path = require('path');

// initializing express-session middleware
var Session = require('express-session');
var SessionStore = require('session-file-store')(Session);
var session = Session({store: new SessionStore({path: __dirname+'/tmp/sessions'}), secret: 'pass', resave: true, saveUninitialized: true});

// create express app
var express = require('express');
var helmet = require("helmet");
var app = express();

app.use(express.static(path.resolve('../client/build')));

// var favicon = require('serve-favicon');
// app.use(favicon('public/images/favicon.ico'));

app.use(helmet);

app.use(session);


// Pages
app.get('/*', (req, res) => {
  // res.redirect('https://' + req.headers.host + req.url);
  res.sendFile(path.resolve('../client/build/index.html'));
});

// Attach express app to server
const fs = require('fs');
var key = fs.readFileSync(__dirname + '/fundaguesser_nl.key');
var cert = fs.readFileSync(__dirname + '/strato.csr');
var ca = fs.readFileSync(__dirname + '/rootca.crt');
var options = {
  key: key,
  cert: cert,
  ca: ca,
  rejectUnauthorized: false
};

// const http = require('http');
// const httpServer = http.createServer(app);
const https = require('https');
const httpsServer = https.createServer(options, app);

// Start server
httpsServer.listen(443);

console.log('Server started, listening on both https');

const io = require("socket.io")(httpsServer, {
  cors: {
    origin: "https://fundaguesser.nl",
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
  
  
  