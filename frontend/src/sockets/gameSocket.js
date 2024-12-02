import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

socket.on("connect", () => {
  console.log("Konektovan");
});

socket.on("disconnect", () => {
  console.log("diskonektovan");
});

export default socket;
