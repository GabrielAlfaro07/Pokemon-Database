import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import openPokeball from "./assets/open-pokeball.png";
import closePokeball from "./assets/closed-pokeball.png";
import midClosedPokeball from "./assets/mid-closed-pokeball.png";
interface Pokemon {
  name: string;
  url: string;
}
interface PokemonEvolutionChain {
  url: string;
}
interface evolution_details {
  min_level: number;
}
interface species {
  name: string;
}
interface evolves_to {
  evolution_details: {
    min_level: number;
  };
  species: {
    name: string;
  };
  evolves_to: evolves_to;
}
interface chain {
  evolves_to: //ME QUEDE EN ESTA PARTE HACIENDO LA
  evolves_to; //EXTRACCION DE LAS EVOLUCIONES
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

  //seccion para el about
  height: number;
  weight: number;
  id: number;
  base_experience: number;
  //seccion para el base-stats array de stats
  stats: {
    base_stat: number;
    effort: number; //el effort es el esfuerzo que se necesita para subir un punto en el stat
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
  const [animationStage, setAnimationStage] = useState(0); // 0: open, 1: mid-close, 2: close
  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>; // Tipo adecuado para el temporizador en el navegador

    if (isAnimating) {
      if (isOpening) {
        // Animación de apertura
        timer = setTimeout(() => {
          setAnimationStage(0); // Completa la apertura
          setIsAnimating(false); // Termina la animación
          setIsOpening(false);
        }, 500);
      } else if (isClosing) {
        // Animación de cierre
        timer = setTimeout(() => {
          setAnimationStage(2); // Completa el cierre
          setIsAnimating(false); // Termina la animación
          setIsClosing(false);
        }, 500);
      } else if (animationStage === 1) {
        // Animación intermedia
        timer = setTimeout(() => {
          if (isOpening) {
            setAnimationStage(0); // Completa la apertura
          } else if (isClosing) {
            setAnimationStage(2); // Completa el cierre
          }
          setIsAnimating(false); // Termina la animación
        }, 500);
      }
    }

    return () => clearTimeout(timer);
  }, [isAnimating, isOpening, isClosing, animationStage]);

  const handleClick = () => {
    if (!isAnimating) {
      setIsAnimating(true);

      if (animationStage === 0) {
        // Si la Poké Ball está abierta, iniciar animación de cierre
        setAnimationStage(1);
        setIsClosing(true);
      } else if (animationStage === 2) {
        // Si la Poké Ball está cerrada, iniciar animación de apertura
        setAnimationStage(1);
        setIsOpening(true);
      } else if (animationStage === 1) {
        // Si está en medio, determinar la acción
        if (isOpening) {
          setAnimationStage(0); // Completa la apertura
        } else if (isClosing) {
          setAnimationStage(2); // Completa el cierre
        }
        setIsAnimating(false); // Termina la animación
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
      style={{
        width: "30px",
        height: "30px",
        left: "5%",
        top: "70%",
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: 4,
        cursor: "pointer",
      }}
      onClick={handleClick}
    />
  );
}
function getTypeColor(type: string): string {
  const typeColorMap: { [key: string]: string } = {
    fire: "#F5A75A", // Color más claro para fuego
    water: "#7EB2F0", // Color más claro para agua
    grass: "#9AD8A5", // Color más claro para planta
    electric: "#F9E4A3", // Color más claro para eléctrico
    ice: "#B2E2E2", // Color más claro para hielo
    fighting: "#D76B6B", // Color más claro para lucha
    poison: "#B57BCE", // Color más claro para veneno
    ground: "#F2D7A0", // Color más claro para tierra
    flying: "#C1A3F0", // Color más claro para volador
    psychic: "#F9A4A9", // Color más claro para psíquico
    bug: "#C2D76B", // Color más claro para bicho
    rock: "#D4B48F", // Color más claro para roca
    ghost: "#9E9AC7", // Color más claro para fantasma
    dragon: "#9A6CF8", // Color más claro para dragón
    dark: "#9E8C6E", // Color más claro para oscuro
    steel: "#D3D3E1", // Color más claro para acero
    fairy: "#F4BCC6", // Color más claro para hada
    normal: "#B5B5A0", // Color más claro para normal
  };
  return typeColorMap[type.toLowerCase()] || "#BDC3C7"; // Color por defecto
}
//oscurecer un poco el primer color del tipo del pokemon
function darkenColor(color: string): string {
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
  for (let key in typeColorMap) {
    if (color === typeColorMap[key]) {
      return typeDarkColorMap[key];
    }
  }
  return "#34495e";
}
function soundEffect(sound: string) {
  const audio = new Audio(sound);
  audio.play();
}
interface StatBarProps {
  value: number; // El valor final al que debe llegar la barra
}

const PokemonDetailsPage = () => {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();
  const { pokemon } = location.state as { pokemon: Pokemon };
  const { details } = location.state as { details: PokemonDetails };
  const colorback = getTypeColor(details.types[0].type.name);
  const name = chancheInitialToMayus(pokemon.name);
  const [selectedSection, setSelectedSection] = useState("about");

  // Encuentra el valor máximo de stat
  const maxStatValue = Math.max(...details.stats.map((stat) => stat.base_stat));

  const StatBar: React.FC<StatBarProps> = ({ value }) => {
    const [currentValue, setCurrentValue] = useState(0);

    useEffect(() => {
      const increment = value / 100; // Ajusta este valor según la velocidad que desees
      const interval = setInterval(() => {
        setCurrentValue((prev) => {
          if (prev >= value) {
            clearInterval(interval);
            return value;
          }
          return prev + increment;
        });
      }, 10); // Ajusta este valor para controlar la frecuencia de actualización

      return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
    }, [value]);

    return (
      <div className=" bg-gray-200 rounded">
        <div
          className="h-2 rounded"
          style={{
            width: `${(currentValue / maxStatValue) * 100}%`, // Calcular el ancho basado en el valor máximo
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
          <h2
            style={{
              fontWeight: "bold",
              position: "absolute",
              left: "88%",
              transform: "translate(-50%, -50%)",
            }}
            className="text-greed h-6 rounded"
          >
            {stat.base_stat}
          </h2>
          <h2
            style={{
              fontSize: "13px",
              fontWeight: "bold",
              width: "200%",
              position: "absolute",
              left: "3%",
            }}
            className="text-black h-100 rounded"
          >
            {chancheInitialToMayus(stat.stat.name)}
          </h2>
        </div>

        <div className="w-3/4">
          <StatBar value={stat.base_stat} />
        </div>
      </div>
    ));
  };

  //fetch data con la url de details
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
  //obtener el sonido de data
  const sound = details.cries.latest;
  //hacer que suene la primera vez que se carga la página unicamente
  if (!loaded) {
    soundEffect(sound);
  }
  console.log(data);
  const renderContent = () => {
    switch (selectedSection) {
      case "about":
        let height = details.height;
        let weight = details.weight;
        let id = details.id;
        let base_experience = details.base_experience;
        height = height / 10;
        weight = weight / 10;
        let idtxt = id.toString();
        for (let i = idtxt.length; i < 4; i++) {
          idtxt = "0" + idtxt;
        }
        let bs = base_experience.toString();
        //agregar al final un XP
        bs = bs + " XP";
        let shinySprite = details.sprites.front_shiny;

        return (
          <div style={{ color: "black", fontSize: "12px", zIndex: 1 }}>
            <div
              //hacer que el texto cambie en bucle entre colores
              style={{
                color: "black",
                fontSize: "20px",
                fontWeight: "bold",
                zIndex: 1,
                position: "absolute",
                top: "85%",
                left: "75%",
                width: "40%",
                transform: "translate(-50%, -50%)",
                animation: "color-change 5s infinite",
              }}
            >
              Shiny Version
            </div>
            <img
              className={`transition-opacity duration-1000 ease-in-out ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              src={shinySprite}
              alt={pokemon.name}
              style={{
                width: "170px",
                height: "170px",
                left: "70%",
                top: "55%",
                position: "absolute",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            />
            <h2
              style={{
                fontWeight: "bold",
                position: "absolute",
                top: "25%",
                left: "10%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Pokemon Id
              <p
                style={{
                  fontWeight: "bold",
                  position: "absolute",
                  top: "60%",
                  left: "177%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {"#" + idtxt}
              </p>
            </h2>
            <h2
              style={{
                fontWeight: "bold",
                position: "absolute",
                top: "42%",
                left: "6%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Height
              <p
                style={{
                  fontWeight: "bold",
                  position: "absolute",
                  top: "60%",
                  left: "305%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {height + "m"}
              </p>
            </h2>
            <h2
              style={{
                fontWeight: "bold",
                position: "absolute",
                top: "57%",
                left: "6%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Weight
              <p
                style={{
                  fontWeight: "bold",
                  position: "absolute",
                  top: "60%",
                  left: "302%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {weight + "kg"}
              </p>
            </h2>
            <h2
              style={{
                width: "40%",
                fontWeight: "bold",
                position: "absolute",
                top: "74%",
                left: "21%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Base Experience
              <p
                style={{
                  fontWeight: "bold",
                  position: "absolute",
                  top: "60%",
                  left: "85%",
                  transform: "translate(-50%, -50%)",
                  width: "40%",
                }}
              >
                {bs}
              </p>
            </h2>
          </div>
        );
      case "base-stats":
        return (
          <div
            style={{
              color: "black",
              fontSize: "15px",
              padding: "20px",
              zIndex: 1,
              backgroundColor: "white",
              borderRadius: "10px",
            }}
          >
            {renderBaseStats()}
          </div>
        );
      case "evolution":
        function fetchEvolutionChain(url: string) {
          return fetch(url).then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch evolution chain");
            }
            return response.json();
          });
        }

      case "moves":
        return null;
      default:
        return null;
    }
  };

  return (
    <div onLoad={() => setLoaded(true)}>
      <img
        src="https://www.wallpaperflare.com/static/905/635/699/pok%C3%A9mon-video-games-retro-games-pokemon-wallpaper.jpg"
        //poner la imagen como fondo total de la página
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 0,
          opacity: 0.8,
          //iluminacion de la imagen
          filter: "brightness(40%)",
          //hacer borrosa la imagen
          backdropFilter: "blur(1px)",
        }}
        alt="background"
      />
      <button
        className="sound-button"
        style={{
          width: "150px",
          height: "150px",
          left: "60%",
          top: "35%",
          position: "absolute",
          transform: "translate(-50%, -50%)",
          zIndex: 1,
        }}
        onClick={() => soundEffect(sound)}
      ></button>
      <div
        className=" backdrop-blur-lg bg-opacity-50  rounded-lg"
        style={{
          width: "400px",
          height: "100%",
          left: "50%",
          top: "36.7%",
          position: "absolute",
          transform: "translate(-50%, -50%)",
          backgroundColor: darkenColor(colorback),
          borderRadius: "60px",
        }}
      >
        <DisplayPokeball />
        <img
          className={`transition-opacity duration-1000 ease-in-out ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          src={details.sprites.front_default}
          alt={pokemon.name}
          style={{
            width: "250px",
            height: "250px",
            left: "69%",
            top: "50%",
            position: "absolute",
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        />
        <h1
          style={{
            textAlign: "left",
            fontSize: "20px",
            color: "white",
            width: "100%",
            position: "absolute",
            top: "26%",
            left: "55%",
            transform: "translate(-50%, -50%)",
            fontWeight: "bold",
          }}
        >
          {name}
        </h1>
        <ul
          style={{
            fontSize: "20px",
            color: "black",
            width: "100%",
            position: "absolute",
            top: "30%",
            left: "5%",
          }}
        >
          {details.types.map((typeInfo) => (
            <li
              className="text-[0.8em] text-white rounded-full p-2 m-1 inline-block"
              style={{
                backgroundColor: getTypeColor(typeInfo.type.name),
                borderRadius: "10px",
              }}
              key={typeInfo.type.name}
            >
              {chancheInitialToMayus(typeInfo.type.name)}
            </li>
          ))}
        </ul>
        <div
          style={{
            width: "400px",
            height: "310px",
            position: "absolute",
            top: "65%",
            left: "0%",
            zIndex: 1,
            backgroundColor: "White",
            borderRadius: "20px",
          }}
        >
          <button
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: selectedSection === "about" ? colorback : "black",
              width: "10%",
              position: "absolute",
              top: "10%",
              left: "22%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
            }}
            onClick={() => setSelectedSection("about")}
          >
            About
          </button>
          <button
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: selectedSection === "base-stats" ? colorback : "black",
              width: "15%",
              position: "absolute",
              top: "10%",
              left: "43%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
            }}
            onClick={() => setSelectedSection("base-stats")}
          >
            Base Stats
          </button>
          <button
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: selectedSection === "evolution" ? colorback : "black",
              width: "10%",
              position: "absolute",
              top: "10%",
              left: "65%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
            }}
            onClick={() => setSelectedSection("evolution")}
          >
            Evolution
          </button>
          <button
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: selectedSection === "moves" ? colorback : "black",
              width: "10%",
              position: "absolute",
              top: "10%",
              left: "90%",
              transform: "translate(-50%, -50%)",
              fontWeight: "bold",
            }}
            onClick={() => setSelectedSection("moves")}
          >
            Moves
          </button>
          <div
            className="content"
            style={{
              marginTop: "20px",
              padding: "10px",
              backgroundColor: "white",
              borderRadius: "10px",
              color: "black",
            }}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailsPage;
