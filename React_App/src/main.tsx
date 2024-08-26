import React from "react";
import ReactDOM from "react-dom/client";
import Pokedex from "./Pokedex.tsx";
import "./index.css";
import ItemDex from "./ItemDex.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Pokedex />
  </React.StrictMode>
);
