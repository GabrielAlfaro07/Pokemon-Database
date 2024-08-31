import { useState, useEffect } from "react";
import AccountButton from "./components/AccountButton";
import GenerationView from "./components/GenerationView";
import PokemonCard from "./components/PokemonCard";
import { changeInitialToMayus } from "./components/ChangeInitialToMayus";

function Home() {
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(
    null
  );
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [randomPokemon, setRandomPokemon] = useState<any>(null);
  const [pokemonDetails, setPokemonDetails] = useState<any>(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/region")
      .then((response) => response.json())
      .then((data) => {
        setRegions(data.results);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching regions", error);
        setLoading(false);
      });
  }, []);

  const fetchRandomPokemon = async () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );
      const data = await response.json();
      setRandomPokemon({
        name: data.name,
        url: `https://pokeapi.co/api/v2/pokemon/${randomId}`,
      });
      setPokemonDetails(data);
    } catch (error) {
      console.error("Error fetching random Pokemon:", error);
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
    const intervalId = setInterval(() => {
      fetchRandomPokemon();
    }, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleGenerationClick = (regionName: string) => {
    setSelectedGeneration(regionName);
  };

  const goBack = () => {
    setSelectedGeneration(null);
  };

  return (
    <div className="min-h-screen bg-red-500 font-poppins p-4">
      <header
        className={`bg-gray-700 text-white text-xl p-4 rounded-full mb-4 flex justify-between items-center`}
      >
        <h1 className="text-2xl m-0">PokeWiki</h1>
        <AccountButton />
      </header>

      {/* Contenedor con fondo blanco y bordes redondeados */}
      <div className="bg-white rounded-2xl p-6 text-black">
        {!selectedGeneration ? (
          <div className="text-center">
            <h2 className="text-4xl font-bold">Bienvenido a PokeWiki</h2>
            <p className="mt-4 text-lg">
              Aquí puedes encontrar información sobre tus Pokémon favoritos
            </p>
            <p>Explora el mundo de los Pokémon y sus asombrosas habilidades</p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold">Últimas Noticias</h3>
              <p className="mt-2">Nueva expansión: La Corona de Paldea</p>
              <p>Pokémon GO celebra su aniversario</p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold">Explora las Regiones</h3>
              {loading ? (
                <p>Cargando regiones...</p>
              ) : (
                <div className="flex justify-center space-x-4 mt-4">
                  {regions.map((region) => (
                    <button
                      key={region.name}
                      className="bg-gray-200 text-gray-800 px-5 py-2 rounded-full transition-all duration-300 hover:bg-red-500 hover:text-white"
                      onClick={() => handleGenerationClick(region.name)}
                    >
                      {changeInitialToMayus(region.name)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 bg-gray-200 p-4 rounded-2xl">
              <h3 className="text-xl font-semibold">¿Sabías Que?</h3>
              <p className="mt-2">
                ¿Sabías que Arcanine fue originalmente planeado para ser un
                Pokémon legendario?
              </p>
            </div>

            <div className="absolute top-40 right-0 mr-10">
              {randomPokemon && pokemonDetails && (
                <PokemonCard pokemon={randomPokemon} details={pokemonDetails} />
              )}
            </div>
          </div>
        ) : (
          <GenerationView generation={selectedGeneration} goBack={goBack} />
        )}
      </div>
    </div>
  );
}

export default Home;
