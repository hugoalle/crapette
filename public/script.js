
let form = document.getElementById("form");
let button = document.getElementById("button");
let input = document.getElementById("input");

form.addEventListener('submit', e => {
    e.preventDefault();
    handleConnection(e);
    button.disabled = true;
})        

let handleConnection = function(e) {
    let socket = io();
    socket.on("connect", () => {
        socket.emit("new-connection", input.value);
    })

    socket.on('display-connected-client', arrayName => {
        for (let i = 0; i<arrayName.length; i++) {
            let user = i == 0 ? document.getElementById("user1") : document.getElementById("user2");
            user.innerText = `${arrayName[i]} is connected`;
        }   
    });

    socket.on('too-many-connected', () => {
        window.alert("there is too many players for now, please try later when a slot is available");
    });

}