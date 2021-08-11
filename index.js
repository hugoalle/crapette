const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let players = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('a user connected with id : ' + socket.id);

    io.to(socket.id).emit('display-connected-clients', players.map(u => u.name));

    socket.on("playerSubmit", (name) => {
        handleNewPlayer(socket, name);
    });

    socket.on('disconnect', function() {
        console.log("socket with id " + socket.id + " disconnected");

        //get the player that disconnected, with socket object
        let n = null;
        for (let i=0; i<players.length; i++) {
            let player = players[i];
            if (player.socket == socket) {
                n = i;
            }
        }
        //remove it from players array
        players.splice(n, 1);
        //redisplay connected clients
        io.emit('display-connected-clients', players.map(u => u.name));
    })

})

let handleNewPlayer = function(socket, name) {

    if (players.length === 2) {
        socket.emit('too-many-connected');
    }
    else {
        players.push({socket: socket, name: name });
        io.emit('display-connected-clients', players.map(u => u.name));
    }

    if (players.length == 2) {

        //we put the 2 players in the same room
        players.forEach(v => {
            v.socket.join("room1");
        });
        //we launch the countdown, on these client's page
        io.to('room1').emit('decompte');

        //in 5 sec, if the two players are still connected, we launch the game
        setTimeout(function() {
            if (players.length == 2) {
                //launchGame(players[0], players[1]);
            }
        },3000)
    }
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});