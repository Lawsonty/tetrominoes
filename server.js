const express = require("express");
const path = require("path");
const socket = require("socket.io");

const app = express();
const port = 8080;

app.get("/", (req, res) =>
res.sendFile(path.join(__dirname + "/public/index.html"))
);

app.get("/js/tetris.js", (req, res) =>
res.sendFile(path.join(__dirname + "/js/tetris.js"))
);

app.get("/js/multi.js", (req, res) =>
res.sendFile(path.join(__dirname + "/js/multi.js"))
);

app.get("/public/index.css", (req,res) => 
res.sendFile(path.join(__dirname + "/public/index.css"))
);

var io = socket(app.listen(port, () => console.log(`Up on port ${port}!`)));

io.on('connection', function(socket) {
  console.log(`Socket connection made by ${socket.id}`);
});