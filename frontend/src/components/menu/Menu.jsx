import { useState } from "react";
import { useSocket } from "../../context/SocketContext";
import Game from "../game/Game";
import styles from "./Menu.module.css";

const Menu = () => {
  const socket = useSocket();
  const [isHost, setIsHost] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const createRoom = () => {
    if (!roomId) return;
    socket.emit("create-room", roomId, username, (response) => {
      console.log(response);
      if (response.data) {
        setIsConnected(true);
        setIsHost(true);
      }
    });
  };

  const joinRoom = () => {
    if (!roomId) return;
    socket.emit("join-room", roomId, username, (response) => {
      console.log(response);
      if (response.data) {
        setIsConnected(true);
        setIsHost(false);
      }
    });
  };

  return (
    <>
      {!isConnected && (
        <section className={styles.section}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter Username"
            className={styles.input}
          />
          <input
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID"
            className={styles.input}
          />
          <button onClick={joinRoom} className={styles.button}>
            Join Room
          </button>
          <button onClick={createRoom} className={styles.button}>
            Create Room
          </button>
        </section>
      )}
      {isConnected && <Game roomId={roomId} isHost={isHost} />}
    </>
  );
};

export default Menu;
