const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let users = {};

io.on("connection", socket => {

  socket.on("join", data => {
    socket.room = data.room;
    socket.name = data.user;

    socket.join(data.room);

    if(!users[data.room]) users[data.room] = [];
    users[data.room].push(data.user);

    io.to(data.room).emit("users", users[data.room]);
  });

  socket.on("message", data => {
    io.to(data.room).emit("message", data);
  });

  socket.on("disconnect", () => {
    if(socket.room && users[socket.room]){
      users[socket.room] = users[socket.room].filter(u => u !== socket.name);
      io.to(socket.room).emit("users", users[socket.room]);
    }
  });

});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log("Golubchik PRO running"));
