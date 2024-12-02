const songs = {};

export const loadSong = (songUrl) => {
  if (!songs[songUrl]) {
    songs[songUrl] = new Audio(`http://localhost:4000/audio/${songUrl}`);
    // songs[songUrl].addEventListener("ended", () => {
    //   console.log("Pesma je završila!");
    //   songs[songUrl].play();
    // });
  }
  return songs[songUrl];
};

export const playSong = (songUrl) => {
  const song = loadSong(songUrl);
  song.play();
};
