
let form = document.getElementById("form");
let button = document.getElementById("button");
let input = document.getElementById("input");

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


let displayGame = function() {
    let boardgame = document.createElement("div");
    boardgame.style["border"] = "solid";
    boardgame.style["width"] = "1200px";
    boardgame.style["height"] = "600px";
    document.body.appendChild(boardgame);
}