import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";

import { playSong } from "../../utils/socket";
import GuessSongInput from "../guessSongInput/GuessSongInput";
import Scoreboard from "../scoreboard/Scoreboard";
import styles from "./Game.module.css";
const Game = (props) => {
  const socket = useSocket();

  const [isPlayerConnected, setIsPlayerConnected] = useState(false);
  const [status, setStatus] = useState(false);
  const [countdown, setCountdown] = useState(); // this is countdown before the round starts
  const [roundTimer, setRoundTimer] = useState(); // timer of round
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isRoundStarted, setIsRoundStarted] = useState(false);
  const [didGuessedSong, setDidGuessSong] = useState(false);
  const [players, setPlayers] = useState({});
  const [winner, setWinner] = useState("");

  useEffect(() => {
    if (!isPlayerConnected && props.isHost) {
      setStatus("Waiting for one more player...");
    }

    socket.on("game-start", gameStartEvent);
    socket.on("player-joined", playerJoinedEvent);
    socket.on("correct-guess", correctGuessEvent);
    socket.on("player-guessed", playerGuessedEvent);
    socket.on("wrong-guess", wrongGuessEvent);
    socket.on("countdown", countdownEvent);
    socket.on("round-start", roundStartEvent);
    socket.on("round-timer", roundTimerEvent);
    socket.on("game-over", gameOverEvent);

    return () => {
      socket.off("game-start");
      socket.off("player-joined");
      socket.off("correct-guess");
      socket.off("player-guessed");
      socket.off("wrong-guess");
      socket.off("round-start");
      socket.off("round-timer");
      socket.off("countdown");
    };
  }, [socket]);

  const gameStartEvent = ({ gameStarted, players }) => {
    setIsGameStarted(gameStarted);
    setPlayers(players);
  };

  const playerJoinedEvent = (data) => {
    setStatus("New player joined room: " + data.playerId);
    setIsPlayerConnected(true);
    socket.emit("start-game", props.roomId);
  };

  const roundStartEvent = ({ songUrl, timer }) => {
    setDidGuessSong(false);
    setIsRoundStarted(true);
    setRoundTimer(timer);
    playSong(songUrl);
  };

  const roundTimerEvent = (remainingTime) => {
    setRoundTimer(remainingTime);
  };

  const countdownEvent = (remainingTime) => {
    setStatus("");
    setIsRoundStarted(false);
    setCountdown(remainingTime);
  };

  const gameOverEvent = ({ winner }) => {
    setWinner(winner);
  };

  const correctGuessEvent = (message, score) => {
    setStatus(message);
    setDidGuessSong(true);
    setPlayers((prevPlayers) => {
      return { ...prevPlayers, ...score };
    });
  };

  const playerGuessedEvent = (message, score) => {
    setStatus(message);
    setPlayers((prevPlayers) => {
      return { ...prevPlayers, ...score };
    });
  };

  const wrongGuessEvent = (message) => {
    setStatus(message);
  };

  return (
    <>
      {!isRoundStarted && isGameStarted && !winner && <h1>{countdown}</h1>}

      {isRoundStarted && !winner && <h2>{roundTimer}</h2>}

      {!winner && (
        <GuessSongInput
          roomId={props.roomId}
          isGameStarted={isGameStarted}
          isRoundStarted={isRoundStarted}
          didGuessedSong={didGuessedSong}
        />
      )}

      <Scoreboard isGameStarted={isGameStarted} players={players} />

      {!winner && (
        <div className={styles.status}>
          <h2>{status}</h2>
        </div>
      )}

      <div className={styles.winner}>
        {winner && <h1>Pobednik je: {winner}</h1>}
      </div>
    </>
  );
};

export default Game;
