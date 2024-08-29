import React from "react";
import ReactDOM from "react-dom/client";
import PokeDex from "./PokeDex.tsx";
import "./index.css";
import ItemDex from "./ItemDex.tsx";
import FavoritesDex from "./FavoritesDex.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { useUserData } from "./hooks/UseUserData.tsx";

const App = () => {
  useUserData(); // Initialize user data when the app starts
  return <ItemDex />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-p5470s0pobgw1nir.us.auth0.com"
      clientId="KJ7oeu6ukVA1cN4gErtz6CeBjBX7UL0z"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
