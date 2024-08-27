import React from "react";
import ReactDOM from "react-dom/client";
import PokeDex from "./PokeDex.tsx";
import "./index.css";
import ItemDex from "./ItemDex.tsx";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-p5470s0pobgw1nir.us.auth0.com"
      clientId="KJ7oeu6ukVA1cN4gErtz6CeBjBX7UL0z"
      authorizationParams={{
        redirect_uri: window.location.origin,
        //audience: "https://dev-p5470s0pobgw1nir.us.auth0.com/api/v2/", // Optional, if you're using an API
        responseType: "token id_token",
      }}
    >
      <ItemDex />
    </Auth0Provider>
  </React.StrictMode>
);
