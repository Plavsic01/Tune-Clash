import React, { createContext, useState, useContext } from "react";
import { playSong } from "../utils/socket";

const SongContext = createContext();

export const useSong = () => useContext(SongContext);

export const SongProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songUrl, setSongUrl] = useState("");

  // game over stop music

  return (
    <SongContext.Provider
      value={{
        isPlaying,
        setIsPlaying,
        songUrl,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};
