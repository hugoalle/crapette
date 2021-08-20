const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let players = [];
let nbPlayersReady = 0;

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
    });

    socket.on('boardReady', function() {
        nbPlayersReady++;
        if (nbPlayersReady == 2) {
            launchGame(players[0], players[1]);
        }
    });

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
    }
}

server.listen(3000, () => {
    console.log('listening on *:3000');
});

let launchGame = function(p1, p2) {

    let remainingCards = [
        1,1,1,1,
        2,2,2,2,
        3,3,3,3,
        4,4,4,4,
        5,5,5,5,
        6,6,6,6,
        7,7,7,7,
        8,8,8,8,
        9,9,9,9,
        10,10,10,10,
        11,11,11,11,
        12,12,12,12,
        13,13,13,13
    ];

    //melange le tableau 
    let currentIndex = remainingCards.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = remainingCards[currentIndex];
        remainingCards[currentIndex] = remainingCards[randomIndex];
        remainingCards[randomIndex] = temporaryValue;
    }

    let firstLeftCard = remainingCards.pop();
    let firstRightCard = remainingCards.pop();

    let cardsP1 = remainingCards.slice(0,25);
    let cardsP1Revealed = [cardsP1.pop(), cardsP1.pop(), cardsP1.pop(), cardsP1.pop()];
    let cardsP2 = remainingCards.slice(25,50);
    let cardsP2Revealed = [cardsP2.pop(), cardsP2.pop(), cardsP2.pop(), cardsP2.pop()];
    
    io.to('room1').emit(
        'displayLeftRightCards', 
        {left: firstLeftCard, right: firstRightCard}
    );

    p1.socket.emit("display-revealedCards", {myCards: cardsP1Revealed, opponentCards: cardsP2Revealed});
    p2.socket.emit("display-revealedCards", {myCards: cardsP2Revealed, opponentCards: cardsP1Revealed});
}