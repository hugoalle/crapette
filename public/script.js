
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
    for (let i = 0; i<arrayName.length; i++) {
        let user = i == 0 ? document.getElementById("user1") : document.getElementById("user2");
        user.innerText = `${arrayName[i]} is connected`;
    }
});


socket.on('too-many-connected', () => {
    window.alert("there is too many players for now, please try later when a slot is available");
    button.disabled = false;
});
