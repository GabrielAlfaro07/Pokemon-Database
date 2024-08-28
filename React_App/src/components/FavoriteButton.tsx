import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/FavoritesService";

interface FavoriteButtonProps {
  pokemonId: string;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ pokemonId }) => {
  const { user, isAuthenticated } = useAuth0();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      (async () => {
        const favorites = await getFavorites(user.sub);
        setIsFavorite(favorites.includes(pokemonId));
      })();
    }
  }, [user, isAuthenticated, pokemonId]);

  const toggleFavorite = async () => {
    if (!isAuthenticated || !user) return;

    if (isFavorite) {
      await removeFavorite(user.sub, pokemonId);
      setIsFavorite(false);
    } else {
      await addFavorite(user.sub, pokemonId);
      setIsFavorite(true);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`favorite-button ${isFavorite ? "is-favorite" : ""}`}
    >
      {isFavorite ? "★" : "☆"}
    </button>
  );
};

export default FavoriteButton;
