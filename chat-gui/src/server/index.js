const express = require("express");
const app = express();
const port = 5000;
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));

const getUsers = () => {
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userID: id,
      username: socket.username,
    });
  }
  return users;
};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("user-connected", (username) => {
    socket.username = username;
    console.log("user connected: " + username);
    socket.emit("user-connected", username);
    io.emit("messages", {
      msg: "User connected",
      username,
    });
    io.emit("users", getUsers());
  });

  socket.on("chat-message", (msg) => {
    console.log("message:", msg, " username:", socket.username);
    io.emit("messages", {
      msg: `${msg}`,
      username: socket.username || socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(port, () =>
  console.log(`Listening on port: http://localhost:${port}`)
);
