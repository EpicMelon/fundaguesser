// fundaguesser.js handles all game logic,
//  including keeping track of the rooms
//  use the data dictionary to notify changes
//  from the top level logic

// Settings
MAX_PLAYERS = 8
DEFAULT_GUESS = 10000

ROUND_TIME = 5000;
RESULT_TIME = 4000;

HOUSE_COUNT = 5; // PLACEHOLDER

function pointGraph(guess, correct) {
    var percWrong = Math.abs(guess - correct) / correct * 100;
    var points = Math.max(100 - percWrong, 0);

    console.log("    \/ guessed " + guess + " correct was " + correct + " so he gets " + points);

    return points;
}

class PlayerData {
    constructor(name) {
        this.username = name;

        this.guess = DEFAULT_GUESS;
        this.points = 0;
        this.deltaPoints = 0;
        this.leader = false;
    }
}

class GameRoom {
    constructor(id) {
        this.id = id;

        this.players = [];

        // for the game
        this.inProgress = false;
        this.roundTime = ROUND_TIME;

        this.playersData = {}

        this.currentTimeout;
        this.currentHouse;

        console.log("Created room " + id);
    }

    get joinable() {
        if (this.players.length >= MAX_PLAYERS) { 
            return false;
        }
        return true;
    }

    addPlayer(socketId) {
        // make playerData
        var username = io.of("/").sockets.get(socketId).username;
        var playerData = new PlayerData(username);

        this.playersData[socketId] = playerData;

        if (this.players.length == 0) {
            this.playersData[socketId].leader = true;
        }

        // add to list
        this.players.push(socketId);

        // cosmetic
        io.to(this.id).emit('showMessage', this.playersData[socketId].username + " joined!");
        io.to(this.id).emit('updatePlayerList', this.playersData);

        console.log("[Room " + this.id + "] " + this.playersData[socketId].username + " joined");    
    }

    removePlayer(socketId) {
        // remove player
        this.players = this.players.filter(e => e !== socketId);

        if (this.players.length == 0) {
            deleteRoom(this.id);
            return;
        }

        if (this.playersData[socketId].leader) {
            this.playersData[this.players[0]].leader = true;

            var state = {started: this.inProgress, leader: true};
            io.to(this.players[0]).emit("updateGameState", state);
        }

        var username = this.playersData[socketId].username;

        delete this.playersData[socketId];

        // cosmetic
        io.to(this.id).emit('showMessage', username + " left!");
        io.to(this.id).emit('updatePlayerList', this.playersData);
        console.log("[Room " + this.id + "] " + username + " left");   
    }

    aboutToStart() {
        this.inProgress = true;

        // let everyone know the game has started
        var state = {started: true, leader: false};
        io.to(this.id).emit("updateGameState", state);

        // choose houses or something
        this.currentHouse = 0; // place holder is just an integer LOL
    }

    end() {
        this.inProgress = false;

        // send back to overview or something
        io.to(this.id).emit('done');
    }

    resetGuesses() {
        for (const [key, value] of Object.entries(this.playersData)) {
            this.playersData[socketId].guess = DEFAULT_GUESS;
        }
    }

    evaluateGuesses(correct) {
        for (const [key, value] of Object.entries(this.playersData)) {
            var score = pointGraph(value.guess, correct)
            value.deltaPoints = score;
            value.points += score;

            console.log("[Room " + this.id + "] " + value.username + " now has " + value.points + " points! (" + "+" + value.deltaPoints + ")");
        }

        // cosmetic
        io.to(this.id).emit("showScore", "scores are in bitches");
    }
}

function deleteRoom(id) {
    console.log("Removing room " + id);

    if (data[id].currentTimeout) {
        clearTimeout(data[id].currentTimeout);
    }

    delete data[id];
}

// all game data is kept in dictionary
// key = room id, value = gameRoom instance
var data = {}

// initializes environment
var io;
var init = function(the_io) {
    io = the_io;
}

// add new socket to interface
var initSocket = function(socket) {
    // Lobby leader features
    socket.on('startGame', () => startGame(socket));

    // Play interface
    socket.on('guess', (amount) => registerGuess(socket, amount));
}

function startGame(socket) {
    if (!data[socket.roomId]) {
        console.log("Error! " + socket.username + " wanted to start " + socket.roomId + " but it was not a valid room!");
        return;
    }

    if (!data[socket.roomId].playersData[socket.id].leader) {
        console.log("Error! " + socket.username + " wanted to start " + socket.roomId + " but is not the leader");
        return;
    }

    if (data[socket.roomId].inProgress) {
        console.log("Error! " + socket.username + " wanted to start " + socket.roomId + " but it already started");
        return;
    }

    data[socket.roomId].aboutToStart();

    startRound(socket.roomId);
}


function startRound(roomId) {
    data[roomId].resetGuesses();

    showHouse(roomId);
    io.to(roomId).emit('startTimer', new Date().getTime() + data[roomId].roundTime);

    data[roomId].currentTimeout = setTimeout(function() {endRound(roomId)}, data[roomId].roundTime);
}

function showHouse(roomId) {
    console.log("showing house " + data[roomId].currentHouse + " to room " + roomId);
    io.to(roomId).emit('showHouse', 'Pretend I am house #' + data[roomId].currentHouse);
}

function endRound(roomId) {
    var correctAmount = (data[roomId].currentHouse+1) * 100000; // placeholder

    data[roomId].evaluateGuesses(correctAmount);

    data[roomId].currentHouse++;

    if (data[roomId].currentHouse > HOUSE_COUNT) {
        data[roomId].end();
    }
    else {
        data[roomId].currentTimeout = setTimeout(function() {startRound(roomId)}, RESULT_TIME);
    }
}


function registerGuess(socket, amount) {
    if (!data[socket.roomId].playersData[socket.id]) {
        console.log("Error! " + socket.username + " tried to make a guess in room " + socket.roomId + " but is not registered...?");
        return;
    }

    data[socket.roomId].playersData[socket.id].guess = amount;
}


module.exports.GameRoom = GameRoom;
module.exports.data = data;

module.exports.init = init;
module.exports.initSocket = initSocket;