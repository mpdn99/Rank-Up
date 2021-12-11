"use strict";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

socket.emit("createRoom", "10CR7");

socket.on("createRoomMessage", (message) => {
  console.log(message);
});

const button = document.querySelector("button");
button.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("sendNotice", "Message from Host");
});

socket.on("messageFromServer", (message) => {
  console.log(message);
});
