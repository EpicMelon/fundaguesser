// Set up
var io;

// Parse questions
var fs = require('fs');
var data = fs.readFileSync('src/houses.json', 'utf8');
var houses = JSON.parse(data);
var answers = JSON.parse(fs.readFileSync('src/answers.json', 'utf8'))

// CONFIG
var roundTime = 5000.0;
var resultTime = 5000.0;

// Data
var game_rooms = {};

class GameRoom {
  constructor(id, leader) {
    this.room_id = id;
    this.leader = leader;

    this.players = [];

    // for the game
    this.guesses = {};
    this.points = {};
  }

  get joinable() {
    if (this.players.length >= MAX_PLAYERS) { 
      return false;
    }
    //  return false
    return true;
  }

  addPlayer(socketId) {
    this.players.push(socketId);
    guesses[socketId] = 0;
    points[socketId] = 0;
  }

  removePlayer(socketId) {
    this.players = this.players.filter(e => e !== socketId);

    if (this.players.length == 0) {
      deleteRoom();
      return;
    }

    delete guesses[socketId];
    delete points[socketId];

    if (this.leader == socketId) {
      this.leader = players[0];
    }
  }
}

var init = function(the_io) {
    io = the_io;
    console.log("Set up game.");
}
  
var initSocket = function (socket) {
  socket.on('start game', () => startGame(socket));

  socket.on('guess', (amount) => registerGuess(socket, amount));
}

function registerGuess(socket, amount) {
  if (guesses[socket.room_id]) {
    guesses[socket.room_id][socket.id] = amount;
  }
}

function startGame(socket) {
  guesses[socket.room_id] = {}

  startRound(socket.room_id, 0);
}

function startRound(room, index) {
  showHouse(room, index);

  setTimeout(function() {endRound(room, index)}, roundTime);
  io.to(room).emit('start timer', new Date().getTime() + roundTime);
}

function endRound(room, index) {
  var correct = parseFloat(answers[index].Amount);

  console.log("entire: " + answers + " ind " + answers[index] + " parsed: " + correct);

  var points = {}; 
  for (const [key, value] of Object.entries(guesses[room])) {
    var alias = io.of("/").sockets.get(key).username;

    var dist = Math.abs(correct - value);

    var score = 100 - Math.min(dist / correct, 100);
    points[key] = score;
  }

  var results = {correct : correct, guesses : guesses[room], points : points}
  io.to(room).emit('show result', results);

  // start next round
  if (houses[index+1]) {
    setTimeout(function() {startRound(room, index+1)}, resultTime);
  }
  else {
    io.to(room).emit('finish quiz');
  }
}

function showHouse(room, index) {
  console.log("Showing House " + index);

  houseData = houses[index];
  io.to(room).emit('show house', houseData);
}

module.exports.init = init;
module.exports.initSocket = initSocket;