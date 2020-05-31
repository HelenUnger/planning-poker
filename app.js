// initialize an express app and set it up
const express = require('express');
const app = express();
const io = require('socket.io')();

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

io.on('connection', function(socket) {
    socket.emit('connected', {sID: `${socket.id}`} );

    //listen for incoming connection, send them to everyone
    socket.on('nicknameSet', function(user) {
        let code = user.roomCode;
        socket.join(code);
        user.id = socket.id;
        usersList.push(user);

        io.to(code).emit('nicknameShare', {user, usersList});
    });

    // listen for incoming messages, and then send them to everyone
    socket.on('chat message', function(msg) {
        // check the message contents
        console.log('message', msg, 'socket', socket.id);

        // send a message to every connected client
        io.emit('chat message', { id: `${socket.id}`, message: msg });
    });

    socket.on('disconnect', (reason) => {
        var user = usersList.find(user => user.id == socket.id);
        var i = usersList.indexOf(user);

        if (i < 0) {
            return;
        }

        let code = user.roomCode;

        usersList.splice(i, 1);
        io.to(code).emit('userDisconnect', {user, usersList});
    });

    // //listen for user dis connect
    // socket.on('force disconnect', function(name){
    //     io.emit('userDisconnect', {message: name});
    // });
});