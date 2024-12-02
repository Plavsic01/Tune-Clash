import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: "./backend/.env" });
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/audio", express.static(path.join(__dirname, "audio")));
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

console.log(__dirname);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode`);
  console.log(`Listening on port:${PORT}`);
});
