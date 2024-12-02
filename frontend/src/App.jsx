import "./App.css";
import { SocketProvider } from "./context/SocketContext";
import { SongProvider } from "./context/SongContext";
import Menu from "./components/menu/Menu";
import { useEffect, useState } from "react";

function App() {
  return (
    <>
      <SocketProvider>
        <SongProvider>
          <Menu />
        </SongProvider>
      </SocketProvider>
    </>
  );
}

export default App;
