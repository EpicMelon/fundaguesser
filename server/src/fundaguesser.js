// fundaguesser.js handles all game logic,
//  including keeping track of the rooms
//  use the data dictionary to notify changes
//  from the top level logic

// Settings
MAX_PLAYERS = 8
DEFAULT_GUESS = 0

ROUND_TIME = 20000;
RESULT_TIME = 6000;

HOUSE_COUNT = 5; // PLACEHOLDER


// Data management
const houseProvider = require('./houseprovider.js');

// Game management
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
        this.place = 0;

        this.index = 0;
    }
}

class GameRoom {
    constructor(id) {
        this.id = id;

        this.players = [];

        // for the game
        this.inProgress = false;
        this.roundTime = ROUND_TIME;

        this.playersData = {};

        this.roundLength = 3;
        this.categories = ['amsterdam'];

        this.housesDone = []; 
        this.houseDataOfRound;

        this.currentDeadLine;
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

        // update placings
        this.setPlacings();

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

            io.to(this.players[0]).emit("updateLeader", true);
        }

        var username = this.playersData[socketId].username;

        delete this.playersData[socketId];

        // update placings
        this.setPlacings();

        // cosmetic
        io.to(this.id).emit('showMessage', username + " left!");
        io.to(this.id).emit('updatePlayerList', this.playersData);
        console.log("[Room " + this.id + "] " + username + " left");
    }

    aboutToStart() {
        this.inProgress = true;

        this.resetPoints();

        this.houseDataOfRound = houseProvider.getHouses(this.roundLength, this.categories, this.housesDone);

        // choose houses or something
        this.currentHouse = 0; // index of round
    }

    end() {
        this.inProgress = false;

        io.to(this.id).emit('endGame', this.playersData);
    }

    setPlacings() {
        for (const [key, value] of Object.entries(this.playersData)) {
            // count how many have more points
            var count = 0;
            for (const [key2, value2] of Object.entries(this.playersData)) {
                if (this.playersData[key2].points > this.playersData[key].points) {
                    count++;
                }
            }
            this.playersData[key].place = 1 + count;
        }
    }

    resetPoints() {
        for (const [key, value] of Object.entries(this.playersData)) {
            this.playersData[key].points = 0;
        }

        this.setPlacings();
    }

    resetGuesses() {
        for (const [key, value] of Object.entries(this.playersData)) {
            this.playersData[key].guess = DEFAULT_GUESS;
        }
    }

    evaluateGuesses(correct) {
        for (const [key, value] of Object.entries(this.playersData)) {
            var score = pointGraph(value.guess, correct)
            value.deltaPoints = score;
            value.points += score;

            console.log("[Room " + this.id + "] " + value.username + " now has " + value.points + " points! (" + "+" + value.deltaPoints + ")");
        }

        this.setPlacings();

        // cosmetic
        io.to(this.id).emit('updatePlayerList', this.playersData);
    }

    emitCurrentHouse(socket) {
        // temporarily remove price from house when emitting (this can be done better, temp solution)
        var price = this.houseDataOfRound[this.currentHouse].price;
        delete this.houseDataOfRound[this.currentHouse].price;

        var roundData = {house : this.houseDataOfRound[this.currentHouse],
            timer : this.currentDeadLine}

        if (socket) {
            socket.emit('startRound', roundData);
        }
        else {
            io.to(this.id).emit('startRound', roundData);
        }

        // put price back
        this.houseDataOfRound[this.currentHouse].price = price;
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
    if (data[roomId].currentHouse >= data[roomId].houseDataOfRound.length) {
        data[roomId].end();
        return;
    }
    // prepare round
    data[roomId].resetGuesses();

    data[roomId].currentDeadLine = new Date().getTime() + data[roomId].roundTime;
    data[roomId].currentTimeout = setTimeout(function() {endRound(roomId)}, data[roomId].roundTime);

    data[roomId].emitCurrentHouse(null);
}

function endRound(roomId) {
    var correctAmount = data[roomId].houseDataOfRound[data[roomId].currentHouse].price;

    data[roomId].evaluateGuesses(correctAmount);
    data[roomId].currentHouse++;

    var resultData = {playersData: data[roomId].playersData,
                        correct: correctAmount}

    io.to(roomId).emit('showResults', resultData);

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