// server.js handles all the top level logic
//  connecting, creating rooms, disconnecting, etc.
//  the actual game (and data!) is in game
const game = require('./fundaguesser.js');

// SETTINGS
var lobbyIdDigits = 2;

// initializes environment
var io;
var init = function(the_io) {
    io = the_io;
    game.init(the_io);
}

// add new socket to interface
var initSocket = function(socket) {
    // Default values
    socket.username = "Nieuwe Speler";
    socket.roomId = "lobby";

    // Room Logic
    socket.on('createRoom', () => createRoom(socket));
    socket.on('checkIfAllowed', (id) => checkIfAllowed(socket, id));
    socket.on('requestJoinRoom', (id) => requestJoinRoom(socket, id));

    socket.on('disconnect', () => disconnect(socket));
    socket.on('leaveRoom', () => leaveRoom(socket));

    // Global Features
    socket.on('sendMessage', (msg) => sendMessage(socket, msg));
    socket.on('setUsername', (username) => setUsername(socket, username));

    socket.on('myGameDataRequest', () => myGameDataRequest(socket));

    game.initSocket(socket);
}

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function nextId(id) {
    for (var i = id.length - 1; i >= 0; i--) {
        if (id[i] == '9') {
            id = setCharAt(id, i, '0');
            continue;
        }
        else {
            id = setCharAt(id, i, (parseInt(id[i]) + 1).toString());
            return id;
        }
    }
    return id;
}

function newFreeLobbyId() {
    // Lobby is string of random digits
    var id = '';
    for (var i = 0; i < lobbyIdDigits; i++) {
        id += Math.floor(10 * Math.random());
    }

    var beginId = (' ' + id).slice(1);
    while (game.data[id]) {
        id = nextId(id);

        // prevent infinite loop because that's very very scary
        if (id == beginId) {
            console.log("All rooms are taken or the code is messed up");
            break;
        }
    }

    return id;
}

function createRoom(socket) {
    // check if all lobbies are taken
    if (Object.keys(game.data).length >= 10 ** 4 - 1) {
        socket.emit('error', "There are too many lobbies right now! Try again at another time.");
        console.log("[ERROR] ALL LOBBIES ARE FULL LOL");
        return;
    }

    // check if socket is not in lobby
    if (socket.roomId != "lobby") {
        socket.emit('error', "You are already in a game! Can't make a new one");
        console.log(socket.id + " tried to create a game but he is already in game: " + socket.roomId);
        return;
    }

    // find new lobby id
    var id = newFreeLobbyId();

    // create room
    game.data[id] = new game.GameRoom(id);

    // make the user join the room
    joinRoom(socket, id);

    // send user to the room
    socket.emit("createRoomConfirmed", id);
}

function checkIfAllowed(socket, id) {
    // check if user already in that room
    if (socket.roomId == id) {
        return true;
    }

    // check if user not already in a room
    if (socket.roomId != "lobby") {
        socket.emit('error', "You are already in a room");
        console.log(socket.username + " tried to join room " + id + " but he already in room " + socket.roomId);
        return false;
    }

    // check if room exists
    if (!game.data[id]) {
        socket.emit('error', "The game in that room is over! Join or make a new one");
        console.log(socket.username + " tried to join room " + id + " but it didn't exist.");
        return false;
    }

    // check if room has space
    if (!game.data[id].joinable) {
        socket.emit('error', "Sorry! The room is full");
        console.log(socket.username + " tried to join room " + id + " but it was full.");
        return false;
    }

    return true;
}

function requestJoinRoom(socket, id) {
    if (!checkIfAllowed(socket, id)) {
        return;
    }

    // add user to room if he is not already in it
    if (socket.roomId != id) {
        joinRoom(socket, id);
    }

    // confirm to user
    socket.emit("confirmedJoinRoom", id);
}

function joinRoom(socket, id) {
    // connect socket to room
    socket.join(id);
    socket.roomId = id;
    game.data[id].addPlayer(socket.id);
}

function disconnect(socket) {
    // leave the room if not in lobby
    if (socket.roomId != "lobby") {
        leaveRoom(socket, socket.username);
    }
    
    console.log(socket.id + " disconnected!");
}

function leaveRoom(socket) {
    // check if in a room
    if (!game.data[socket.roomId]) {
        console.log(socket.username + " tried to leave room " + socket.roomId + " but it didn't exist!");
    }
    else {
        game.data[socket.roomId].removePlayer(socket.id);
    }

    if (socket.roomId != "lobby") {
        socket.leave(socket.roomId);
        socket.roomId = "lobby";
    }
}


function sendMessage(socket, msg) {
    io.to(socket.roomId).emit('showMessage', socket.username + ": " + msg);
    console.log("[Room " + socket.roomId + "] " + socket.username + ": " + msg);
}

function setUsername(socket, username) {
    io.to(socket.roomId).emit('showMessage', socket.username + " heet nu " + username);
    console.log("[Room " + socket.roomId + "] " + "Changing username " + socket.username + " to " + username);

    socket.username = username;

    if (game.data[socket.roomId]) {
        game.data[socket.roomId].playersData[socket.id].username = username;
        socket.emit('updatePlayerList', game.data[socket.roomId].playersData);
    }
}

function myGameDataRequest(socket) {
    if (game.data[socket.roomId]) {
        socket.emit('updatePlayerList', game.data[socket.roomId].playersData);
    }
}


// To implement this server structure
//  call init at runtime
//  call initSocket when a socket connects
module.exports.init = init;
module.exports.initSocket = initSocket;