import { useEffect, useState } from "react";
import styles from "./PokemonCard.module.css"; // Import styles as a module

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
}

type Props = {
  pokemon: Pokemon;
};

const typeColorMap: { [key: string]: string } = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  normal: "#A8A878",
  // Add more types if needed
};

function getTypeColor(type: string): string {
  return typeColorMap[type.toLowerCase()] || "#34495e"; // Default to the card's original color if type is not found
}

function capitalizeWords(name: string): string {
  return name
    .split(/[\s-]/) // Split by spaces or dashes
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(name.includes("-") ? "-" : " "); // Join with a dash if the original string had a dash, otherwise with a space
}

const PokemonCard = (props: Props) => {
  const [infPokemon, setInfPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching data from:", props.pokemon.url); // Log the URL
    fetch(props.pokemon.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        // Ensure the response is JSON
        if (
          !response.headers.get("content-type")?.includes("application/json")
        ) {
          throw new Error("Response is not JSON");
        }
        return response.json();
      })
      .then((data) => setInfPokemon(data))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [props.pokemon.url]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div>Error: {error}</div>;

  const backgroundColor = infPokemon?.types?.[0]
    ? getTypeColor(infPokemon.types[0].type.name)
    : "#34495e"; // Default color

  return (
    <div
      className={styles["pokemon-card"]}
      style={{ backgroundColor }} // Apply the background color here
    >
      {infPokemon?.sprites.front_default ? (
        <img
          src={infPokemon.sprites.front_default}
          alt={infPokemon.name}
          className={styles["pokemon-image"]}
        />
      ) : (
        <img src="/no-image.png" alt="No image available" />
      )}
      <h1 className={styles["pokemon-name"]}>
        {infPokemon?.name ? capitalizeWords(infPokemon.name) : ""}
      </h1>
      <h2 className={styles["pokemon-id"]}>
        #{infPokemon?.id.toString().padStart(4, "0")}
      </h2>
      <h2 className={styles["pokemon-types"]}>
        {infPokemon?.types.map((typeInfo) => (
          <span
            key={typeInfo.type.name}
            className={styles["pokemon-type"]}
            style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
          >
            {capitalizeWords(typeInfo.type.name)}
          </span>
        ))}
      </h2>
    </div>
  );
};

export default PokemonCard;
