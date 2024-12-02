import { io } from "socket.io-client";
const API_URL = import.meta.env.PRODUCTION_BACKEND_URL;

const socket = io(API_URL);

socket.on("connect", () => {
  console.log("Konektovan");
});

socket.on("disconnect", () => {
  console.log("diskonektovan");
});

export default socket;
