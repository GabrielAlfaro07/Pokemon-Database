import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getFavorites } from "../services/FavoritesService";
import PokemonCard from "./PokemonCard"; // Assuming you have a PokemonCard component

const FavoritesList = () => {
  const { user, isAuthenticated } = useAuth0();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated && user) {
      (async () => {
        const favs = await getFavorites(user.sub);
        setFavorites(favs);
      })();
    }
  }, [user, isAuthenticated]);

  return (
    <div className="favorites-list">
      <h2>Your Favorite Pokémon</h2>
      {favorites.length === 0 ? (
        <p>You have no favorite Pokémon.</p>
      ) : (
        <div className="pokemon-grid">
          {favorites.map((pokemonId) => (
            <PokemonCard key={pokemonId} pokemonId={pokemonId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesList;
