
let form = document.getElementById("form");
let button = document.getElementById("button");
let input = document.getElementById("input");
let game = null;

form.addEventListener('submit', e => {
    e.preventDefault();
    socket.emit('playerSubmit', input.value);
    button.disabled = true;
})        

let socket = io();
socket.on("connect", () => {
});

socket.on('display-connected-clients', arrayName => {
    for (let i = 0; i<2; i++) {

        let user = i == 0 ? document.getElementById("user1") : document.getElementById("user2");

        if (arrayName[i] !== undefined) {
            user.innerText = `${arrayName[i]} is connected`;
        }
        else {
            user.innerText = '';
        }
    }
});


socket.on('too-many-connected', () => {
    window.alert("there is too many players for now, please try later when a slot is available");
    button.disabled = false;
});

socket.on('decompte', () => {
    let divDecompte = document.createElement("div");
    divDecompte.style["border"] = "solid";
    divDecompte.style["width"] = "50px";
    divDecompte.style["height"] = "50px";
    divDecompte.innerText = "3";
    document.body.appendChild(divDecompte);
    let timer = function(n) {
        setTimeout( () => {
            divDecompte.innerText = (n-1).toString();
            n--;
            if (n>0) {
                timer(n);
            }
            else {
                displayGame();
            }
        },1000
        );
    }
    timer(3);
});


socket.on('displayLeftRightCards', values => {
    let leftCardDiv = game.leftCard;
    let rightCardDiv = game.rightCard;

    if (values.left !== undefined) {
        leftCardDiv.innerText = values.left;
    }

    if (values.right !== undefined) {
        rightCardDiv.innerText = values.right;
    }
});

let displayGame = function() {
    let boardgame = document.createElement("div");
    boardgame.id = "boardgame";
    boardgame.style["border"] = "solid";
    boardgame.style["width"] = "1200px";
    boardgame.style["height"] = "600px";
    document.body.appendChild(boardgame);

    let playerCardsDiv = [];
    let opponentCardsDiv = [];

    for (let i=0; i<4; i++) {
        let cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        cardDiv.style["left"] = 350+ 120*i + "px";
        cardDiv.style["top"] = "20px";

        boardgame.appendChild(cardDiv);
        playerCardsDiv.push(cardDiv);

        let opponentCardDiv = document.createElement("div");
        opponentCardDiv.classList.add("card");
        opponentCardDiv.style["left"] = 350 + 120*i + "px";
        opponentCardDiv.style["bottom"] = "20px";

        boardgame.appendChild(opponentCardDiv);
        opponentCardsDiv.push(opponentCardDiv);
    }

    let leftCard = document.createElement("div");
    leftCard.classList.add("card");
    leftCard.style["left"] = "50%";
    leftCard.style["transform"] = "translateX(-100%)";
    leftCard.style["transform"] += "translateY(-50%)";
    leftCard.style["top"] = "50%";

    let rightCard = document.createElement("div");
    rightCard.classList.add("card");
    rightCard.style["left"] = "50%";
    rightCard.style["transform"] = "translateX(100%)";
    rightCard.style["transform"] += "translateY(-50%)";
    rightCard.style["top"] = "50%";

    let nbCards = document.createElement("div");
    nbCards.classList.add("card");
    nbCards.style["left"] = "50px";
    nbCards.style["bottom"] = "10px";
    nbCards.innerText = "24";

    let nbCardsOpponent = document.createElement("div");
    nbCardsOpponent.classList.add("card");
    nbCardsOpponent.style["right"] = "50px";
    nbCardsOpponent.style["top"] = "10px";
    nbCardsOpponent.innerText = "24";


    boardgame.appendChild(leftCard);
    boardgame.appendChild(rightCard);
    boardgame.appendChild(nbCards);
    boardgame.appendChild(nbCardsOpponent);

    game = {
        playerCards: playerCardsDiv,
        opponentCards: opponentCardsDiv,
        leftCard: leftCard,
        rightCard: rightCard,
        nbCards: nbCards,
        nbCardsOpponent: nbCardsOpponent
    };

    socket.emit('boardReady');
}