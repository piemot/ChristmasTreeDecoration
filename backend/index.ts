import { createServer } from "http";
import { DatabaseQueries } from "./lib/database";
import { Server } from "socket.io";
import express from "express";

const port = 6969;
const host = "0.0.0.0";

const corsOrigin = "*";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

function socket({ io }: { io: Server }) {
  console.log("Socket.io connected, recieving pixels");
  io.on("connection", async (socket) => {
    const database = new DatabaseQueries();
    await database.connect();

    console.log(`A user has connected: ${socket.id}`);

    socket.emit("currentgrid", await database.getAllPixels());

    socket.on("pixelsend", async (data) => {
      const { x, y, color } = data;
      await database.addPixel(x, y, color);
      io.emit("pixelupdate", data);
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
