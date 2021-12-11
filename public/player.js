"use strict";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

socket.emit("join", { username: "Khiem", roomID: "10CR7" });

socket.on("joinMessage", (message) => {
  console.log(message);
});

socket.on("messageFromServer", (message) => {
  console.log(message);
});
