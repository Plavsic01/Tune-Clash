import { useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import styles from "./GuessSongInput.module.css";

const GuessSongInput = ({
  roomId,
  isGameStarted,
  isRoundStarted,
  didGuessedSong,
}) => {
  const userGuess = useRef("");
  const socket = useSocket();

  const handleSongGuess = () => {
    const songGuess = userGuess.current.value;
    socket.emit("check-song-guess", roomId, songGuess);
    userGuess.current.value = "";
  };

  return (
    <>
      {isGameStarted && isRoundStarted && !didGuessedSong && (
        <section>
          <div>
            <input
              className={styles.roundedInput}
              ref={userGuess}
              placeholder="Guess name of the song..."
            />
          </div>
          <div>
            <button onClick={handleSongGuess}>Guess Song</button>
          </div>
        </section>
      )}
    </>
  );
};

export default GuessSongInput;
