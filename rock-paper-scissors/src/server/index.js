const { log } = require("console");
const express = require("express");
const app = express();
const port = 6600;
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const getPlayers = async (io) => {
  const players = [];
  const sockets = await io.fetchSockets();
  sockets.forEach((socket) => {
    players.push(socket.id);
  });
  return players;
};

const emitPlayers = () => {
  getPlayers(io).then((players) => {
    io.emit("players", players);
  });
};

const emitRooms = () => {
  getPlayers(io).then((players) => {
    const all = Array.from(io.sockets.adapter.rooms.keys());
    const rooms = all.filter((room) => !players.includes(room));
    io.emit("rooms", rooms);
    log("rooms", io.sockets.adapter.rooms);
  });
};

io.on("connection", (socket) => {
  log("a user connected");

  emitPlayers();
  emitRooms();

  socket.on("startGame", (room) => {
    console.log("startGame", room);
    io.to(room).emit("startGame", true);
  });

  socket.on("joinRoom", (room) => {
    const playersInRoom = io.sockets.adapter.rooms.get(room);
    if (playersInRoom && playersInRoom.size === 2) {
      socket.emit("roomFull", true);
      return;
    }
    socket.join(room);
    console.log(socket.id, "Join Room", room);

    socket.room = room;
    socket.emit("joinRoom", room);
    socket.emit("joinedRoom", true);

    emitRooms();
    if (playersInRoom) {
      log("startGame", socket.room);
      socket.emit("startGame", true);
      socket.to(room).emit("startGame", true);
    }
  });
  socket.on("move", (move) => {
    console.log("move", move);
    socket.to(socket.room).emit("move", move);
  });

  socket.on("playAgain", (playAgain) => {
    console.log("playAgain");
    io.to(socket.room).emit("playAgain", playAgain);
  });

  socket.on("playAgainRequest", (playAgainRequest) => {
    console.log("playAgainRequest");
    socket.to(socket.room).emit("playAgainRequest", playAgainRequest);
    socket.emit("waitingForOpponent", true);
  });

  socket.on("leaveRoom", (room) => {
    console.log(socket.id, "Leave Room", room);
    io.to(room).emit("startGame", false);
    socket.to(socket.room).emit("opponentDisconnected", true);
    socket.emit("joinedRoom", false);
    socket.leave(room);
    socket.room = null;
    emitRooms();
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    if (socket.room) {
      socket.leave(socket.room);
      io.to(socket.room).emit("startGame", false);
      socket.to(socket.room).emit("opponentDisconnected", true);
      socket.to(socket.room).emit("joinedRoom", true);
      socket.to(socket.room).emit("joinRoom", socket.room);
    }
  });
});

server.listen(port, () =>
  console.log(`Server running on port http://localhost:${port}`)
);
