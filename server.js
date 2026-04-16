const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = {};

io.on("connection", socket => {

  socket.on("join", data => {
    socket.name = data.user;

    users[socket.id] = data.user;

    io.emit("users", Object.values(users));
  });

  socket.on("private_message", data => {
    io.to(data.toSocket).emit("private_message", {
      from: data.from,
      text: data.text
    });
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("users", Object.values(users));
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("Golubchik DM running"));
