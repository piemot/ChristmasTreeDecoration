import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import fs from "fs";

let pixels = fs.readFile("./pixels.json", "utf8", function (err, data) {
  if (err) {
    console.log(err);
    return {};
  } else {
    pixels = JSON.parse(data);
    return pixels;
  }
});

const port = 7000;
const host = "localhost";
const corsOrigin = "*";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

function socket({ io }) {
  console.log("Socket.io connected, recieving pixels");

  io.on("connection", (socket) => {
    console.log(`A user has connected: ${socket.id}`);

    socket.emit("currentgrid", pixels);

    socket.on("pixelsend", (data) => {
      // console.log("pixelsend", data);
      const { x, y, color } = data;
      pixels[JSON.stringify({ x, y })] = color;
      io.emit("pixelupdate", data);
      fs.writeFile("pixels.json", JSON.stringify(pixels), function (err) {
        if (err) {
          console.log(err);
        }
      });
    });
  });
}

app.get("/", (req, res) => {
  res.send("Hello World! v2");
});

http.listen(port, host, () => {
  console.log(`Server v2 listening on http://${host}:${port}/`);
  socket({ io });
});
