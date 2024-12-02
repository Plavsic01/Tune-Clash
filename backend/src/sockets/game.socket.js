const rooms = {};
const roomIntervals = {};

export default (io) => {
  io.on("connection", (socket) => {
    // CREATE ROOM
    socket.on("create-room", (roomId, username, callback) => {
      const room = rooms[roomId];
      socket.username = username;

      if (room) {
        return callback({ error: "Room already exists!" });
      }

      const roomInfo = {
        users: [socket.username],
        createdBy: socket.username,
        songs: [
          "tuge mi dovoljno",
          "covek bez adrese",
          "nikad kao bane",
          "pa dobro gde si ti",
          "gde sam ti ja",
          "crno zlato",
        ],
        curentlyPlaying: "",
        playedSongs: [],
        currentRound: 0,
        maxRounds: 1,
        playerScores: {
          [socket.username]: 0,
        },
      };

      rooms[roomId] = roomInfo;
      socket.join(roomId);

      return callback({ data: "Room successfully created!" });
    });

    // JOIN ROOM
    socket.on("join-room", (roomId, username, callback) => {
      const room = rooms[roomId];

      if (!room) {
        return callback({ error: "Room does not exist!" });
      }

      if (room.users.length == 2) {
        return callback({ error: "Room already has 2 players!" });
      }

      socket.username = username;
      room.playerScores[socket.username] = 0;

      socket.join(roomId);
      socket.to(roomId).emit("player-joined", { playerId: socket.username });
      room.users.push(socket.username);

      return callback({
        data: "Successfully joined room: " + roomId,
      });
    });

    socket.on("start-game", (roomId) => {
      const room = rooms[roomId];
      if (room.users.length === 2) {
        io.to(roomId).emit("game-start", {
          gameStarted: true,
          players: room.playerScores,
        });
        startCountdown(io, roomId);
      }
    });

    // CHECK IF USER GUESS MATCHES SONG NAME
    socket.on("check-song-guess", (roomId, userGuess) => {
      const room = rooms[roomId];
      if (room.curentlyPlaying === userGuess) {
        room.playerScores[socket.username] += 1;
        socket.emit(
          "correct-guess",
          `Bravo ${socket.username} pogodio/la si!`,
          { [socket.username]: room.playerScores[socket.username] }
        );
        socket
          .to(roomId)
          .emit("player-guessed", `${socket.username} je pogodio/la pesmu!`, {
            [socket.username]: room.playerScores[socket.username],
          });
      } else {
        socket.emit("wrong-guess", "Nisi pogodio! Probaj ponovo.");
      }
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];
        const index = room.users.indexOf(socket.username);

        if (index !== -1) {
          room.users.splice(index, 1);
          console.log(`Removed ${socket.username} from room: ${roomId}`);
        }

        // Ako je soba prazna
        if (room.users.length === 0) {
          // Očisti intervale povezane s tom sobom
          if (roomIntervals[roomId]) {
            roomIntervals[roomId].forEach((intervalId) =>
              clearInterval(intervalId)
            );
            delete roomIntervals[roomId];
          }

          // Obrisi sobu
          delete rooms[roomId];
          console.log(`Room ${roomId} removed as it's empty`);
        }
      }
    });
  });
};

//

const getRandomSong = (room) => {
  return room.songs[Math.floor(Math.random() * room.songs.length)];
};

const playNextSong = (room) => {
  let randomSong = getRandomSong(room);
  while (room.playedSongs.includes(randomSong)) {
    randomSong = getRandomSong(room);
  }

  return randomSong;
};

const startCountdown = (io, roomId) => {
  let countdown = 3;
  const countdownInterval = setInterval(() => {
    io.to(roomId).emit("countdown", countdown);
    if (countdown <= 0) {
      startRound(io, roomId);
      clearInterval(countdownInterval);
    }
    countdown--;
  }, 1000);

  roomIntervals[roomId] = roomIntervals[roomId] || [];
  roomIntervals[roomId].push(countdownInterval);
};

const startRound = (io, roomId) => {
  // if song exists
  let countdown = 10;
  const room = rooms[roomId];
  console.log(room);
  const roundNumber = (room.currentRound += 1);
  const song = playNextSong(room);
  room.curentlyPlaying = song;
  room.playedSongs.push(song);

  const roundInterval = setInterval(() => {
    countdown--;
    io.to(roomId).emit("round-timer", countdown);

    if (countdown <= 0) {
      clearInterval(roundInterval);
      if (room.maxRounds > roundNumber) {
        nextRound(io, roomId);
      } else {
        // end
        checkForWinner(io, roomId);
      }
    }
  }, 1000);

  roomIntervals[roomId] = roomIntervals[roomId] || [];
  roomIntervals[roomId].push(roundInterval);

  io.to(roomId).emit("round-start", {
    songUrl: `${song}.mp3`,
    timer: countdown,
  });
};

const checkForWinner = (io, roomId) => {
  const playerScores = rooms[roomId].playerScores;
  const scores = Object.values(playerScores);
  if (scores[0] === scores[1]) {
    nextRound(io, roomId);
  } else {
    io.to(roomId).emit("game-over", {
      winner:
        scores[0] > scores[1] ? rooms[roomId].users[0] : rooms[roomId].users[1],
    });
  }
};

const nextRound = (io, roomId) => {
  startCountdown(io, roomId);
};
