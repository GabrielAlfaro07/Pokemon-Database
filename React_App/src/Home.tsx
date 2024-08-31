import { useState } from "react";
import AccountButton from "./components/AccountButton";
import GenerationView from "./components/GenerationView";

function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState<string | null>(
    null
  );

  const handleGenerationClick = (generation: string) => {
    setSelectedGeneration(generation);
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

      {!selectedGeneration ? (
        <div className="p-5 text-center text-white">
          <h2 className="text-2xl font-bold">Bienvenido a PokeWiki</h2>
          <p className="mt-4">
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
            <div className="flex justify-center space-x-4 mt-4">
              <button
                className="bg-white text-gray-800 px-5 py-2 rounded-lg transition-all duration-300 hover:bg-red-500 hover:text-white"
                onClick={() => handleGenerationClick("Kanto")}
              >
                Kanto
              </button>
              <button
                className="bg-white text-gray-800 px-5 py-2 rounded-lg transition-all duration-300 hover:bg-red-500 hover:text-white"
                onClick={() => handleGenerationClick("Johto")}
              >
                Johto
              </button>
              <button
                className="bg-white text-gray-800 px-5 py-2 rounded-lg transition-all duration-300 hover:bg-red-500 hover:text-white"
                onClick={() => handleGenerationClick("Hoenn")}
              >
                Hoenn
              </button>
            </div>
          </div>

          <div className="mt-8 bg-black bg-opacity-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold">¿Sabías Que?</h3>
            <p className="mt-2">
              ¿Sabías que Arcanine fue originalmente planeado para ser un
              Pokémon legendario?
            </p>
          </div>
        </div>
      ) : (
        <GenerationView generation={selectedGeneration} goBack={goBack} />
      )}
    </div>
  );
}

export default Home;
