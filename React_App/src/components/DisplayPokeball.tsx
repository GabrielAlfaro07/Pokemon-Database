import { useEffect, useState } from "react";
import openPokeball from "../assets/open-pokeball.png";
import closePokeball from "../assets/closed-pokeball.png";
import midClosedPokeball from "../assets/mid-closed-pokeball.png";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../services/FavoritesService"; // Adjust the import path as needed

interface DisplayPokeballProps {
  pokemonId: string;
  userId: string;
}

const DisplayPokeball: React.FC<DisplayPokeballProps> = ({
  pokemonId,
  userId,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const favorites = await getFavorites(userId);
        setIsFavorite(favorites.includes(pokemonId));
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [pokemonId, userId]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAnimating) {
      if (isOpening) {
        timer = setTimeout(() => {
          setAnimationStage(0);
          setIsAnimating(false);
          setIsOpening(false);
        }, 250);
      } else if (isClosing) {
        timer = setTimeout(() => {
          setAnimationStage(2);
          setIsAnimating(false);
          setIsClosing(false);
        }, 250);
      } else if (animationStage === 1) {
        timer = setTimeout(() => {
          if (isOpening) {
            setAnimationStage(0);
          } else if (isClosing) {
            setAnimationStage(2);
          }
          setIsAnimating(false);
        }, 250);
      }
    }

    return () => clearTimeout(timer);
  }, [isAnimating, isOpening, isClosing, animationStage]);

  const handleClick = async () => {
    if (!isAnimating) {
      setIsAnimating(true);

      if (animationStage === 0) {
        setAnimationStage(1);
        setIsClosing(true);
        try {
          await addFavorite(userId, pokemonId);
          setIsFavorite(true);
        } catch (error) {
          console.error("Error adding favorite:", error);
        }
      } else if (animationStage === 2) {
        setAnimationStage(1);
        setIsOpening(true);
        try {
          await removeFavorite(userId, pokemonId);
          setIsFavorite(false);
        } catch (error) {
          console.error("Error removing favorite:", error);
        }
      } else if (animationStage === 1) {
        if (isOpening) {
          setAnimationStage(0);
          try {
            await removeFavorite(userId, pokemonId);
            setIsFavorite(false);
          } catch (error) {
            console.error("Error removing favorite:", error);
          }
        } else if (isClosing) {
          setAnimationStage(2);
          try {
            await addFavorite(userId, pokemonId);
            setIsFavorite(true);
          } catch (error) {
            console.error("Error adding favorite:", error);
          }
        }
        setIsAnimating(false);
      }
    }
  };

  let pokeballImage;
  if (isFavorite) {
    pokeballImage = closePokeball;
  } else {
    pokeballImage = openPokeball;
  }

  // Add logic to show the mid-closed image during animation
  if (animationStage === 1) {
    pokeballImage = midClosedPokeball;
  }

  return (
    <img
      src={pokeballImage}
      alt="pokeball"
      className="w-8 h-8 transform -translate-x-1/2 -translate-y-1/8 z-10 cursor-pointer"
      onClick={handleClick}
    />
  );
};

export default DisplayPokeball;
