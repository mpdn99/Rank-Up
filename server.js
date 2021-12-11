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

let room = [{ author: "121dwere32", roomName: "9988" }];

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
      const newRoom = { author: socket.id, roomName: roomNameReq };
      room.push(newRoom);
      socket.emit("createRoomMessage", roomNameReq);
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
    const checkRoomID = room.filter((room) => room["roomName"] === roomID);

    if (checkRoomID.length > 0) {
      const roomID = checkRoomID[0].roomName;
      socket.join(roomID);
      socket.emit("joinMessage", `connect to room id:${roomID} `);
    } else {
      socket.emit("joinMessage", "Invalid room ID");
    }
    // console.log(
    //   `${username} has came with id: ${socket.id} and the room is :${roomID}`
    // );
  });
});

httpServer.listen(3000);
