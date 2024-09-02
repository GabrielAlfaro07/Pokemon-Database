import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DisplayPokeball from "./components/DisplayPokeball";
import { changeInitialToMayus } from "./components/ChangeInitialToMayus";
import { getTypeColor, darkenColor } from "./components/TypeColor";
import { soundEffect } from "./components/Sound";
import AddToTeamButton from "./components/AddToTeamButton"; // Import the new component
import DeletePokemonFromTeamButton from "./components/DeletePokemonFromTeamButton"; // Import the new component
import { useAuth0 } from "@auth0/auth0-react";
import { useTheme } from "./ThemeContext";
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

interface StatBarProps {
  value: number;
}

const PokemonDetailsPage = () => {
  const { user } = useAuth0(); // Add this line to access Auth0 user data
  const userId = user?.sub; // Get the user ID (sub)
  const [loaded, setLoaded] = useState(false);
  const location = useLocation(); // Inicializa el hook useLocation
  const { pokemon } = location.state as { pokemon: Pokemon }; // Obtiene el objeto pokemon del estado de la ubicación
  const { details } = location.state as { details: PokemonDetails };
  const colorback = getTypeColor(details.types[0].type.name);
  const name = changeInitialToMayus(pokemon.name);
  const [selectedSection, setSelectedSection] = useState("about");
  const { isDarkTheme } = useTheme();
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
            {changeInitialToMayus(stat.stat.name)}
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
            {currentMoves
              .slice(rowIndex * 4, rowIndex * 4 + 4)
              .map((move, index) => {
                const moveDetail =
                  moveDetails[currentIndex + rowIndex * 4 + index];
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
                    <p className="text-sm text-center">
                      {changeInitialToMayus(move.move.name)}
                    </p>
                    {moveDetail && (
                      <p className="text-xs">PP: {moveDetail.pp}</p>
                    )}
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
        const shinySprite = details.sprites.front_shiny;
        let idtxt = details.id.toString();
        for (let i = idtxt.length; i < 4; i++) {
          idtxt = "0" + idtxt;
        }
        return (
          <div className="flex space-x-20 font-bold">
            <div className="flex flex-col items-left space-y-3">
              <p className="flex-1">Height: {details.height / 10} M</p>
              <p className="flex-1">Weight: {details.weight / 10} kg</p>
              <p className="flex-1">ID: {"#" + idtxt}</p>
              <p className="flex-1">
                Base Experience: {details.base_experience}XP
              </p>
            </div>
            <div className=" items-right space-x-10">
              <h2 className="font-bold text-lg -translate-x-2/7">
                Shiny Version:
              </h2>
              <img
                className={`-translate-x-1/4  w-full max-w-[100px] transition-opacity duration-1000 ${
                  loading ? "opacity-100" : "opacity-0"
                }`}
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
    <div className={`${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"} flex flex-col justify-center items-center min-h-screen`}>
      <div className={`${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"} flex justify-between items-center w-full px-4 py-6 shadow-lg`}>
        <h1 className="text-2xl font-bold">{name}</h1>
        <div className="flex items-center space-x-4">
          <button
            className={`${isDarkTheme ? "bg-white text-black" : "bg-gray-800 text-white"} px-2 py-1 bg-black rounded-lg`}
            onClick={() => window.history.back()}
          >
            <p className="text-sm font-bold">Back</p>
          </button>
          <AddToTeamButton
            pokemonId={details.id.toString()}
            color={colorback}
          />
          <DisplayPokeball pokemonId={details.id.toString()} userId={userId} />
          {details.types.map((type) => (
            <div
              key={type.type.name}
              className="px-2 py-1 rounded-lg"
              style={{ backgroundColor: getTypeColor(type.type.name) }}
            >
              <p className="text-sm font-bold ">
                {changeInitialToMayus(type.type.name)}
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
      <div className={`${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"} flex w-full justify-center items-center p-2 rounded-b-lg shadow-md`}>
        {["about", "baseStats", "moves"].map((section) => (
          <button
            key={section}
            className={`mx-2 py-1 px-3 ${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"} rounded-lg`}
            style={{
              backgroundColor:
                selectedSection === section
                  ? colorback
                  : isDarkTheme
                  ? "gray"
                  : "white",
            }}
            onClick={() => setSelectedSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </div>
      <div className={`${isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"} mt-4 p-6 w-full max-w-lg rounded shadow-lg`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default PokemonDetailsPage;
