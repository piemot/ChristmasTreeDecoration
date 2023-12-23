import { createServer } from "http";
import { DatabaseQueries } from "./lib/database";
import { Server } from "socket.io";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";

dotenv.config();

const port = 6969;
const host = "0.0.0.0";
const SQL_PATH = process.env.SQL_PATH || "/temp";

const corsOrigin = "*";

const app = express();
const http = createServer(app);
const io = new Server(http, {
  cors: {
    origin: corsOrigin,
    credentials: true,
  },
});

// saved maps get loaded in
const sqlitePath = `${SQL_PATH}/sqlite.db`;
if (!fs.existsSync(sqlitePath)) {
  fs.copyFileSync("./temp/sqlite.db", sqlitePath);
}

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

setTimeout(() => {
  console.log("Exiting");
  process.exit(0);
}, 1000 * 60 * 60 * 24);
