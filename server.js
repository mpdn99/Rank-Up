const express = require("express");
const { createServer } = require("http");
const { emit } = require("process");
const { Server } = require("socket.io");

const app = express();

app.use(express.static(`${__dirname}/public`));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

let room = [{ author: "121dwere32", roomName: "9988", users: [] }];
let process = [{ room: "10CR7", questions: [], questionNumber: 0, score: [] }];

io.on("connection", (socket) => {
  //Host
  socket.on("createRoom", (roomNameReq) => {
    //check room name

    const checkRoomName = room.filter(
      (rname) => rname["roomName"] === roomNameReq
    );

    if (checkRoomName.length > 0) {
      socket.emit("createRoomMessage", "This id was already used");
    } else {
      //create a new room
      socket.join(roomNameReq);
      const newRoom = { author: socket.id, roomName: roomNameReq, users: [] };
      room.push(newRoom);
      socket.emit("createRoomMessage", roomNameReq);
      console.log(room);
    }

    //create questions

    //When host disconnects, all room was created would be deleted
    socket.on("disconnect", () => {
      room = room.filter((room) => room.author !== socket.id);
    });
  });

  //Test send notice from server
  socket.on("sendNotice", (message) => {
    io.in("10CR7").emit("messageFromServer", message);
  });

  //Player
  socket.on("join", ({ username, roomID }) => {
    const checkRoomID = room.findIndex((room) => room["roomName"] == roomID);

    if (checkRoomID > -1) {
      const roomName = room[checkRoomID].roomName;
      socket.join(roomName);
      //add user to room

      room[checkRoomID]["users"].push({ username, id: socket.id });

      io.in(roomName).emit("joinMessage", {
        room: room[checkRoomID].roomName,
        data: room[checkRoomID].users,
      });
    } else {
      socket.emit("joinMessage", { data: "Invalid room ID" });
    }
  });

  socket.on("sendMessage", ({ message, room, user }) => {
    io.in(room).emit("sendMessage", { user, message });
  });
});

httpServer.listen(3000);
