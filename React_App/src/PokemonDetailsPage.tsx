import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import openPokeball from "./assets/open-pokeball.png";
import closePokeball from "./assets/closed-pokeball.png";
import midClosedPokeball from "./assets/mid-closed-pokeball.png";
interface Move {
  move: {
    name: string;
    url: string;
  };

}
interface MoveDetails {
  pp: number;
  type: string;
}
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
  moves: Move[];
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
      <div
        className="h-3 w-full rounded"
        style={{
          width: `${(currentValue / maxStatValue) * 100}%`,
          backgroundColor: colorback,
        }}
      />
    );
  };
  
  const renderBaseStats = () => {
    return details.stats.map((stat) => (
      <div key={stat.stat.name} className="flex mb-2 space-x-20">
        {/* Primer div: nombre del stat */}
        <div className="w-40">
          <h2 className="text-xs font-bold text-left">
            {chancheInitialToMayus(stat.stat.name)}
          </h2>
        </div>
  
        {/* Segundo div: barra de stat */}
        <div className="w-full">
          <StatBar value={stat.base_stat} />
        </div>
  
        {/* Tercer div: número del stat */}
        <div className="w-1/4 text-right">
          <h2 className="text-gray-700 font-bold">{stat.base_stat}</h2>
        </div>
      </div>
    ));
  };

  const MovesDisplay: React.FC = () => {
    const [currentMoves, setCurrentMoves] = useState<Move[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [moveDetails, setMoveDetails] = useState<MoveDetails[]>([]);
  
    useEffect(() => {
      const moves = details.moves; // Obtener todos los movimientos
  
      // Función para obtener detalles de cada movimiento
      const fetchMoveDetails = async () => {
        const detailsPromises = moves.map(async (move) => {
          const response = await fetch(move.move.url);
          const data = await response.json();
          return {
            pp: data.pp,
            type: data.type.name,
          };
        });
  
        const fetchedDetails = await Promise.all(detailsPromises);
        setMoveDetails(fetchedDetails);
      };
  
      fetchMoveDetails(); // Llamar la función para obtener los detalles
    }, [details.moves]);
  
    useEffect(() => {
      const intervalId = setInterval(() => {
        const nextIndex = (currentIndex + 8) % details.moves.length; // Avanzar de 8 en 8
        setCurrentIndex(nextIndex); // Actualizar el índice
        setCurrentMoves(details.moves.slice(nextIndex, nextIndex + 8)); // Obtener los próximos 8 movimientos
      }, 2000); // Cambiar cada 2 segundos
  
      return () => clearInterval(intervalId); // Limpiar intervalo al desmontar
    }, [currentIndex, details.moves]);
  
    return (
      <div className="flex flex-col items-center justify-center transition-all duration-900 ease-in-out h-full w-full">
        {Array.from({ length: 2 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex space-x-2 mb-2">
            {currentMoves.slice(rowIndex * 4, rowIndex * 4 + 4).map((move, index) => {
              const moveDetail = moveDetails[currentIndex + rowIndex * 4 + index];
              const colorClass = getTypeColor(moveDetail?.type);
              return (
                <div
                  key={move.move.name}
                  className={`flex flex-col items-center justify-center p-2 text-white font-bold`}
                  style={{
                    backgroundColor: colorClass,
                    borderRadius: "0.7rem",
                    width: "120px", // Ajusta el ancho fijo
                    height: "60px", // Ajusta el alto fijo
                  }}
                >
                  <p className="text-sm text-center">{chancheInitialToMayus(move.move.name)}</p>
                  {moveDetail && <p className="text-xs">PP: {moveDetail.pp}</p>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
  const sound = details.cries.latest;

  if (!loaded) {
    soundEffect(sound);
  }

  const renderContent = () => {
    const [loading, setloading] = useState(false);
    switch (selectedSection) {
      case "about":
        const shinySprite = details.sprites.front_shiny
        let idtxt = details.id.toString();
        for (let i = idtxt.length; i < 4; i++) {
          idtxt = "0" + idtxt;
        }
        return (
          <div className="flex space-x-20 font-bold">
            <div className="flex flex-col items-left space-y-3">
              <p className="flex-1">Height: {details.height / 10} M</p>
              <p className="flex-1">Weight: {details.weight / 10} kg</p>
              <p className="flex-1">ID: {"#"+idtxt}</p>
              <p className="flex-1">Base Experience: {details.base_experience}XP</p>
            </div>
            <div className=" items-right space-x-10">
                <h2 className="font-bold text-lg -translate-x-2/7">
                  Shiny Version:
                </h2>
              <img
                className={`-translate-x-1/4  w-full max-w-[100px] transition-opacity duration-1000 ${loading ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setloading(true)}
                src={shinySprite}
                alt={pokemon.name}
              />
            </div>
          </div>
        );
      case "baseStats":
        return (
          <div className="flex flex-col items-center justify-center">
            {renderBaseStats()}
          </div>
        );
      case "moves":
        return <MovesDisplay />;
    }
  };          
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100 relative">
      <div className="flex justify-between items-center w-full px-4 py-6 bg-white shadow-lg static">
        <h1 className="text-2xl font-bold">{name}</h1>
        <div
        style={{ display: "flex", gap: "0.5rem" }}
        >
          <button
            className="px-2 py-1 bg-black rounded-lg -translate-x-10"
            onClick={() => window.history.back()}
          >
            <p className="text-sm font-bold text-white">Back</p>
          </button>
          <button
            className="px-2 py-1 rounded-lg -translate-x-10"
            style={{ backgroundColor: colorback }}
          >
            <p className="text-sm font-bold text-white">Add to team</p>
          </button>
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
        className="w-full h-auto flex justify-center items-center relative"
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
