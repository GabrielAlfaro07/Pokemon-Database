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
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
}

type Props = {
  pokemon: Pokemon;
  details: PokemonDetails | undefined;
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

const PokemonCard = ({ pokemon, details }: Props) => {
  if (!details) return <div>Loading details...</div>;

  const backgroundColor = details?.types?.[0]
    ? getTypeColor(details.types[0].type.name)
    : "#34495e";

  return (
    <div
      className="relative bg-gray-800 rounded-xl p-4 text-left w-[200px] h-[110px] overflow-hidden transition-transform transform hover:translate-y-[-10px]"
      style={{ backgroundColor }}
    >
      {details?.sprites.front_default ? (
        <img
          src={details.sprites.front_default}
          alt={pokemon.name}
          className="absolute bottom-0 right-0 max-w-[100px] z-[1]"
        />
      ) : (
        <img src="/no-image.png" alt="No image available" />
      )}
      <h1 className="absolute top-0 left-2 text-[1.3em] text-gray-100 font-bold z-[1]">
        {capitalizeWords(pokemon.name)}
      </h1>
      <h2 className="absolute top-0 right-2 text-sm text-white z-[1]">
        #{details?.id.toString().padStart(4, "0")}
      </h2>
      <h2 className="absolute bottom-2 left-2 flex flex-col gap-1 z-[1]">
        {details?.types.map((typeInfo) => (
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
