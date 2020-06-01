// initialize an express app and set it up
const express = require('express');
const app = express();
const io = require('socket.io')();

const _ = require('lodash');

// some config stuff
const port = process.env.PORT || 3000;

// tell our app to use the public folder for static files
app.use(express.static('public'));

// instantiate the route
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/loggedout', (req, res, next) => {
    res.sendFile(__dirname + '/views/loggedout.html');
});

// create server variable for socket.io to use
const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// plug in the chat app package
io.attach(server, {
    pingTimeout: 60000,
});

var usersList = [];
var roomCode = null;

var game = {
    ticketId: null,
    inProgress: false,
    activePlayers: [],
    allScores: [],
}

io.on('connection', function(socket) {
    socket.emit('connected', {sID: `${socket.id}`} );

    //listen for incoming connection, send them to everyone
    socket.on('nicknameSet', function(user, returnVal) {
        var foundUser = usersList.find(userItem => userItem.name == user.name);
        var i = usersList.indexOf(foundUser);

        if (i != -1) {
            returnVal(true);
            return;
        }

        returnVal(false);

        roomCode = user.roomCode;
        socket.join(roomCode);

        user.id = socket.id;
        usersList.push(user);

        io.in(roomCode).emit('nicknameShare', {user, usersList, game});
    });

    // listen for incoming ready, with active players.
    socket.on('ready', function(data) {
        game = {
            ticketId: data.ticketId,
            inProgress: true,
            activePlayers: data.activePlayers,
            allScores: [],
        }
        // send a activePlayers to every connected client save to local js
        io.in(roomCode).emit('setReady', game);
    });

    // listen for incoming submitted scores,
    socket.on('submitScore', function(score) {
        if (! game.inProgress) {
            return;
        }

        game.allScores.push(score);
        // send a score to every connected client (check in their local js)
        io.in(roomCode).emit('shareScore', game);
    });

    // listen for incoming showScores
    socket.on('showScores', function(showScores) {
        // send a score to every connected client (check in their local js)
        io.in(roomCode).emit('showScores', showScores);
    });

    // listen for incoming clear values.
    socket.on('resetGame', function(data) {
        game = {
            ticketId: null,
            inProgress: false,
            activePlayers: [],
            allScores: [],
        }
        // send a activePlayers to every connected client save to local js
        io.in(roomCode).emit('resetGame');
    });

    // // listen for incoming messages, and then send them to everyone
    // socket.on('chat message', function(msg) {
    //     // check the message contents
    //     console.log('message', msg, 'socket', socket.id);

    //     // send a message to every connected client
    //     io.emit('chat message', { id: `${socket.id}`, message: msg });
    // });

    socket.on('disconnect', (reason) => {
        var user = usersList.find(user => user.id == socket.id);
        var i = usersList.indexOf(user);

        if (i < 0) {
            return;
        }

        usersList.splice(i, 1);
        io.to(roomCode).emit('userDisconnect', {user, usersList});
    });
});