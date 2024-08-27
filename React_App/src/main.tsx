import React from "react";
import ReactDOM from "react-dom/client";
import PokeDex from "./PokeDex.tsx";
import "./index.css";
import ItemDex from "./ItemDex.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ItemDex />
  </React.StrictMode>
);
