import styles from "./Scoreboard.module.css";

const Scoreboard = (props) => {
  return (
    <div className={styles.container}>
      {props.isGameStarted &&
        Object.entries(props.players).map(([key, value]) => {
          return (
            <div key={key}>
              <h2>
                {key}: {value}
              </h2>
            </div>
          );
        })}
    </div>
  );
};

export default Scoreboard;
