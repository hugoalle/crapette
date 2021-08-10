const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('a user connected with id : ' + socket.id);

    io.to(socket.id).emit('display-connected-clients', users.map(u => u.name));

    socket.on("playerSubmit", (name) => {
        handleNewPlayer(socket, name);
    });

})

let handleNewPlayer = function(socket, name) {

    if (users.length === 2) {
        socket.emit('too-many-connected');
    }
    else {
        users.push({socket: socket, name: name });
        io.emit('display-connected-clients', users.map(u => u.name));
    }
}


server.listen(3000, () => {
    console.log('listening on *:3000');
});