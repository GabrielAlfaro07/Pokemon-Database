import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import openPokeball from "./assets/open-pokeball.png";
import closePokeball from "./assets/closed-pokeball.png";
import midClosedPokeball from "./assets/mid-closed-pokeball.png";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  sprites: {
    front_default: string;
    front_shiny: string;
  };
  types: PokemonType[];
  cries: {
    latest: string;
    legacy: string;
  };
  height: number;
  weight: number;
  id: number;
  base_experience: number;
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

function chancheInitialToMayus(name: string): string {
  return name
    .split(/[\s-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(name.includes("-") ? "-" : " ");
}

function DisplayPokeball() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStage, setAnimationStage] = useState(0);
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isAnimating) {
      if (isOpening) {
        timer = setTimeout(() => {
          setAnimationStage(0);
          setIsAnimating(false);
          setIsOpening(false);
        }, 500);
      } else if (isClosing) {
        timer = setTimeout(() => {
          setAnimationStage(2);
          setIsAnimating(false);
          setIsClosing(false);
        }, 500);
      } else if (animationStage === 1) {
        timer = setTimeout(() => {
          if (isOpening) {
            setAnimationStage(0);
          } else if (isClosing) {
            setAnimationStage(2);
          }
          setIsAnimating(false);
        }, 500);
      }
    }

    return () => clearTimeout(timer);
  }, [isAnimating, isOpening, isClosing, animationStage]);

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);

      if (animationStage === 0) {
        setAnimationStage(1);
        setIsClosing(true);
      } else if (animationStage === 2) {
        setAnimationStage(1);
        setIsOpening(true);
      } else if (animationStage === 1) {
        if (isOpening) {
          setAnimationStage(0);
        } else if (isClosing) {
          setAnimationStage(2);
        }
        setIsAnimating(false);
      }
    }
  };

  let pokeballImage;
  switch (animationStage) {
    case 1:
      pokeballImage = midClosedPokeball;
      break;
    case 2:
      pokeballImage = closePokeball;
      break;
    default:
      pokeballImage = openPokeball;
  }

  return (
    <img
      src={pokeballImage}
      alt="pokeball"
      className="w-8 h-8 transform -translate-x-1/2 -translate-y-1/8 z-10 cursor-pointer"
      onClick={handleClick}
    />
  );
}

function getTypeColor(type: string): string {
  const typeColorMap: { [key: string]: string } = {
    fire: "#F5A75A",
    water: "#7EB2F0",
    grass: "#9AD8A5",
    electric: "#F9E4A3",
    ice: "#B2E2E2",
    fighting: "#D76B6B",
    poison: "#B57BCE",
    ground: "#F2D7A0",
    flying: "#C1A3F0",
    psychic: "#F9A4A9",
    bug: "#C2D76B",
    rock: "#D4B48F",
    ghost: "#9E9AC7",
    dragon: "#9A6CF8",
    dark: "#9E8C6E",
    steel: "#D3D3E1",
    fairy: "#F4BCC6",
    normal: "#B5B5A0",
  };
  return typeColorMap[type.toLowerCase()] || "#BDC3C7";
}

function darkenColor(color: string): string {
  const typeDarkColorMap: { [key: string]: string } = {
    fire: "#F03000",
    water: "#3860E0",
    grass: "#48A830",
    electric: "#D8B000",
    ice: "#78C0C0",
    fighting: "#A00000",
    poison: "#802080",
    ground: "#C0A848",
    flying: "#7050C0",
    psychic: "#D80060",
    bug: "#A89820",
    rock: "#A88800",
    ghost: "#504068",
    dragon: "#5020D0",
    dark: "#503830",
    steel: "#9090A0",
    fairy: "#C06080",
    normal: "#A0A878",
  };
  return Object.values(typeDarkColorMap).find(
    (darkColor, index) => Object.values(getTypeColor)[index] === color
  ) || "#34495e";
}

function soundEffect(sound: string) {
  const audio = new Audio(sound);
  audio.play();
}

interface StatBarProps {
  value: number;
}

const PokemonDetailsPage = () => {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const { pokemon } = location.state as { pokemon: Pokemon };
  const { details } = location.state as { details: PokemonDetails };
  const colorback = getTypeColor(details.types[0].type.name);
  const name = chancheInitialToMayus(pokemon.name);
  const [selectedSection, setSelectedSection] = useState("about");

  const maxStatValue = Math.max(...details.stats.map((stat) => stat.base_stat));

  const StatBar: React.FC<StatBarProps> = ({ value }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
      const increment = value / 100;
      const interval = setInterval(() => {
        setCurrentValue((prev) => {
          if (prev >= value) {
            clearInterval(interval);
            return value;
          }
          return prev + increment;
        });
      }, 10);

      return () => clearInterval(interval);
    }, [value]);

    return (
      <div className="w-full bg-gray-200 rounded">
        <div
          className="h-2 rounded"
          style={{
            width: `${(currentValue / maxStatValue) * 100}%`,
            backgroundColor: colorback,
          }}
        />
      </div>
    );
  };

  const renderBaseStats = () => {
    return details.stats.map((stat) => (
      <div key={stat.stat.name} className="flex items-center mb-2">
        <div className="w-1/4 h-7">
          <h2 className="text-gray-700 font-bold text-center">
            {stat.base_stat}
          </h2>
          <h2 className="text-xs font-bold text-left">
            {chancheInitialToMayus(stat.stat.name)}
          </h2>
        </div>
        <div className="w-3/4">
          <StatBar value={stat.base_stat} />
        </div>
      </div>
    ));
  };

  const fetchPokemonDetails = async () => {
    try {
      const response = await fetch(pokemon.url);
      if (!response.ok)
        throw new Error(`Failed to fetch details for ${pokemon.name}`);
      const data: PokemonDetails = await response.json();
      return data;
    } catch (error) {
      console.error(error.message);
    }
  };

  let data = fetchPokemonDetails();
  const sound = details.cries.latest;

  if (!loaded) {
    soundEffect(sound);
  }

  const renderContent = () => {
    switch (selectedSection) {
      case "about":
        const shinySprite = details.sprites.front_shiny
        return (
          <div className="flex flex-col items-center justify-center space-y-2">
            <p
            className="translate-x-1/4"
            >Height: {details.height / 10} m</p>
            <p>Weight: {details.weight / 10} kg</p>
            <p>ID: {details.id}</p>
            <p>Base Experience: {details.base_experience}</p>
            <img
              className={"transition-opacity duration-1000 ease-in-out" + (loaded ? "opacity-100" : "opacity-0")
              }
              src={shinySprite}
              alt={pokemon.name}
            />
          </div>
        );
      case "baseStats":
        return (
          <div className="flex flex-col items-center justify-center">
            {renderBaseStats()}
          </div>
        );
      case "moves":
        return (
          <div className="flex flex-col items-center justify-center space-y-2">
            <h2 className="font-bold text-lg">Moves:</h2>
            <ul className="flex flex-wrap justify-center">
              {details.stats.map((move, index) => (
                <li
                  key={index}
                  className="m-1 bg-blue-200 p-2 rounded hover:bg-blue-400 cursor-pointer"
                >
                  {move.stat.name}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return <div>Select a section</div>;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100">
      <div className="flex justify-between items-center w-full px-4 py-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold">{name}</h1>
        <div
        style={{ display: "flex", gap: "0.5rem" }}
        >
          <DisplayPokeball />
          {details.types.map((type) => (
            <div
              key={type.type.name}
              className="px-2 py-1 bg-gray-200 rounded-lg"
              style={{ backgroundColor: getTypeColor(type.type.name) }}
            >
              <p className="text-sm font-bold text-white">
                {chancheInitialToMayus(type.type.name)}
              </p>
            </div>
          ))} 
        </div>
      </div>
      <div
        className="w-full h-72 flex justify-center items-center relative"
        style={{
          background: `radial-gradient(circle, ${darkenColor(
            colorback
          )} 0%, ${colorback} 100%)`,
        }}
      >
        <img
          src={details.sprites.front_default}
          alt={pokemon.name}
          className={`w-full max-w-[200px] transition-opacity duration-1000 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="flex w-full justify-center items-center bg-white p-2 rounded-b-lg shadow-md">
        {["about", "baseStats", "moves"].map((section) => (
          <button
            key={section}
            className={`mx-2 py-1 px-3 ${
              selectedSection === section ? "font-bold text-white" : ""
            }`}
            style={{
              backgroundColor:
                selectedSection === section ? darkenColor(colorback) : "white",
            }}
            onClick={() => setSelectedSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-4 p-6 w-full max-w-lg bg-white rounded shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default PokemonDetailsPage;
