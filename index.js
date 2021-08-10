const express = require('express');
let ejs = require('ejs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set("view engine", 'ejs');

let users = [];

app.get('/', (req, res) => {
    res.render('index', {users: users.map(u => u.name)});
  });

app.use(express.static('public'))

io.on('connection', (socket) => {
    console.log('a user connected with id : ' + socket.id);

    socket.on("new-connection", (name) => {
        handleNewConnection(socket, name);
    })
});

let handleNewConnection = function(socket, name) {
    if (users.length >= 2) {
        socket.emit('too-many-connected');
    }
    else {
        users.push({socket: socket, name: name });
        io.emit('display-connected-client', users.map(u => u.name));
      
        //send html to the client after countdown
    }
}  
server.listen(3000, () => {
    console.log('listening on *:3000');
});