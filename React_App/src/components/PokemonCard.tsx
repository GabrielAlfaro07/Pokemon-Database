import { useEffect, useState } from "react";

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
};

function getTypeColor(type: string): string {
  return typeColorMap[type.toLowerCase()] || "#34495e";
}

function capitalizeWords(name: string): string {
  return name
    .split(/[\s-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(name.includes("-") ? "-" : " ");
}

const PokemonCard = (props: Props) => {
  const [infPokemon, setInfPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching data from:", props.pokemon.url);
    fetch(props.pokemon.url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
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
    : "#34495e";

  return (
    <div
      className="relative bg-gray-800 rounded-lg p-4 text-left w-[200px] h-[110px] overflow-hidden transition-transform transform hover:translate-y-[-10px]"
      style={{ backgroundColor }}
    >
      {infPokemon?.sprites.front_default ? (
        <img
          src={infPokemon.sprites.front_default}
          alt={infPokemon.name}
          className="absolute bottom-0 right-0 max-w-[100px] z-[1]"
        />
      ) : (
        <img src="/no-image.png" alt="No image available" />
      )}
      <h1 className="absolute top-0 left-2 text-[1.3em] text-gray-100 font-bold z-[1]">
        {infPokemon?.name ? capitalizeWords(infPokemon.name) : ""}
      </h1>
      <h2 className="absolute top-0 right-2 text-sm text-white z-[1]">
        #{infPokemon?.id.toString().padStart(4, "0")}
      </h2>
      <h2 className="absolute bottom-2 left-2 flex flex-col gap-1 z-[1]">
        {infPokemon?.types.map((typeInfo) => (
          <span
            key={typeInfo.type.name}
            className="px-2 py-1 text-[0.8em] text-white rounded-full border-2 border-white text-center whitespace-nowrap"
            style={{ backgroundColor: getTypeColor(typeInfo.type.name) }}
          >
            {capitalizeWords(typeInfo.type.name)}
          </span>
        ))}
      </h2>
      <div
        className="absolute bottom-[10%] left-[55%] w-[110px] h-[110px] bg-cover bg-no-repeat opacity-60 transform rotate-45 z-0"
        style={{ backgroundImage: "url('/src/assets/pokeball-logo.png')" }}
      />
    </div>
  );
};

export default PokemonCard;
