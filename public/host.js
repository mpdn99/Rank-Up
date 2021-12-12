"use strict";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

let user = {
  name: "admin",
};
socket.on("createRoomMessage", (message) => {
  user.room = message;
  console.log(user);
});

socket.on("joinMessage", ({ data }) => {
  console.log(data);
  renderWaitBox(data);
});
const randomID = () => {
  return `${Math.floor(Math.random() * 100000)}`;
};
const btnCreateGame = document.querySelector(".btn-createGame");
const hostCreate = document.querySelector(".host-create");
const hostTable = document.querySelector(".host-table");
btnCreateGame.addEventListener("click", (e) => {
  e.preventDefault();
  const id = randomID();
  socket.emit("createRoom", id);

  //remove host-create update screen
  hostCreate.remove();
  hostTable.style.display = "flex";
});

const playBtn = document.querySelector(".btnPlay");
const hostInv = document.querySelector("#hostInv");
const link = document.querySelector(".inv-center p");

playBtn.addEventListener("click", (e) => {
  e.preventDefault();

  //remove host-table and update host-inv
  hostTable.remove();
  hostInv.style.display = "flex";
  link.textContent = `${window.location.href.replace("host", "index")}id=${
    user.room
  }`;

  //render chatBox and userOnline
});

const waitBox = document.querySelector(".react-wait-box");
const allPlayer = document.querySelector("#hostInv h1");

const renderWaitBox = (data) => {
  waitBox.innerHTML = "";
  allPlayer.textContent = `PLAYER:${data.length}`;
  let html = "";
  data.forEach((user) => {
    html += `<div class="wait-box-content">
        <img src="./assets/img/MicrosoftTeams-image.png" alt="" />
        <p>${user.username}</p>
      </div>`;
  });
  waitBox.insertAdjacentHTML("afterbegin", html);
};

const chatContainer = document.querySelector(".chat-container");
const chatInput = document.querySelector(".chatInput");

const chatForm = document.querySelector(".send-message-form");

const renderChat = (user, message) => {
  let html = `<div class="message">
  <p>${user}:</p>
  <span>${message}</span>
</div>`;
  chatContainer.insertAdjacentHTML("beforeend", html);
};
socket.on("sendMessage", ({ user, message }) => {
  renderChat(user, message);
});
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatInput.value;
  if (!message) {
    return;
  }
  socket.emit("sendMessage", { message, room: user.room, user: user.name });
  chatInput.value = "";
});
