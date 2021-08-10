
let form = document.getElementById("form");
form.addEventListener('submit', e => {
    e.preventDefault();
    handleConnection(e);
})        

let handleConnection = function(e) {
    let socket = io();
}