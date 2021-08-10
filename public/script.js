import { io } from "socket.io-client"

let form = document.getElementById("form");
        
const socket = io('http://localhost:3000');
