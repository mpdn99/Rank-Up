import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();
let user = {};

let search = location.search.substring(1);
const search1 = JSON.parse(
  '{"' + search.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
  function (key, value) {
    return key === "" ? value : decodeURIComponent(value);
  }
);
const roomID = document.querySelector(".roomID");
roomID.textContent = search1.id || "";

const renderUserLobby = (data) => {
  if (user.id) {
    //Create lobby
    const reactWaitBox = document.querySelector(".react-wait-box");
    reactWaitBox.innerHTML = "";
    let template = "";
    data.forEach((user) => {
      template += `<div class="wait-box-content">
        <img src="./assets/img/MicrosoftTeams-image.png" alt="" />
        <p>${user.username}</p>
      </div>`;
    });
    reactWaitBox.insertAdjacentHTML("afterbegin", template);
  }
};
socket.on("joinMessage", ({ room, data }) => {
  if (data === "Invalid room ID") {
    roomID.textContent = data;
  } else {
    if (user.id) {
      renderUserLobby(data);
    } else {
      user.id = socket.id;
      user.room = room;

      //Move to next Tab
      rankUp.remove();
      table.remove();
      reactionLogin.style.display = "flex";
      renderUserLobby(data);
    }
  }
});

const chatInput = document.querySelector(".chatInput");
const chatForm = document.querySelector(".send-message-form");

socket.on("messageFromServer", (message) => {
  console.log(message);
});

const chatContainer = document.querySelector(".chat-container");
const renderChat = (user, message) => {
  let html = `<div class="message">
  <p>${user}:</p>
  <span>${message}</span>
</div>`;
  chatContainer.insertAdjacentHTML("beforeend", html);
};
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = chatInput.value;
  if (!message) {
    return;
  }
  socket.emit("sendMessage", { message, room: user.room, user: user.name });
  chatInput.value = "";
});
socket.on("sendMessage", ({ user, message }) => {
  renderChat(user, message);
});

const body = document.querySelector("#background-main");
const joinBtn = document.querySelector(".btn-join");
const inputJoin = document.querySelector(".inputJoin");
const rankUp = document.querySelector(".rank-up");
const table = document.querySelector(".table");
const reactionLogin = document.querySelector("#reaction-login");

joinBtn.addEventListener("click", (e) => {
  user.name = inputJoin.value;
  socket.emit("join", { username: inputJoin.value, roomID: search1.id });
});
