import { Server } from "socket.io";
import express from "express";
import { createServer } from "node:http";
import gameSocket from "../sockets/game.socket.js";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

gameSocket(io);

export { app, server, io };
