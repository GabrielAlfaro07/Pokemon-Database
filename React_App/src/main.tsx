import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import PokeDex from "./Pokedex.tsx";
import ItemDex from "./ItemDex.tsx";
import FavoritesDex from "./FavoritesDex.tsx";
import PokemonDetailsPage from "./PokemonDetailsPage";
import Sidebar from "./components/Sidebar";
import Home from "./Home"; // Uncomment if Home component is available
import "./index.css";
import { useUserData } from "./hooks/UseUserData.tsx";
import TeamsDex from "./TeamsDex.tsx";

const App = () => {
  useUserData(); // Initialize user data when the app starts

  const { isAuthenticated, isLoading } = useAuth0();

  React.useEffect(() => {
    // Handle redirection after authentication
    const lastPage = localStorage.getItem("lastPage");
    if (isAuthenticated && lastPage) {
      localStorage.removeItem("lastPage"); // Clear the stored lastPage
      window.location.replace(lastPage); // Redirect to the last page
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading ...</div>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokedex" element={<PokeDex />} />
          <Route path="/pokemon/:name" element={<PokemonDetailsPage />} />
          <Route path="/itemdex" element={<ItemDex />} />
          <Route path="/favorites" element={<FavoritesDex />} />
          <Route path="/teams" element={<TeamsDex />} />
        </Routes>
      </div>
    </div>
  );
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
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  </React.StrictMode>
);
