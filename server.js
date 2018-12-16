const express = require("express");
const path = require("path");

const app = express();
const port = 8080;

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname + "/public/index.html"))
);

app.get("/js/tetris.js", (req, res) =>
  res.sendFile(path.join(__dirname + "/js/tetris.js"))
);

app.get("/public/index.css", (req,res) => 
  res.sendFile(path.join(__dirname + "/public/index.css"))
);

app.listen(port, () => console.log(`Up on port ${port}!`));
