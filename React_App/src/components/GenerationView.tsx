import React, { useEffect, useState } from "react";
import Kanto_Map from "../assets/kanto-map.png";
import Johto_Map from "../assets/johto-map.png";
import Hoenn_Map from "../assets/hoenn-map.png";

interface GenerationViewProps {
  generation: string;
  goBack: () => void;
}

const API_URLS: { [key: string]: string } = {
  Kanto: "https://pokeapi.co/api/v2/region/1/",
  Johto: "https://pokeapi.co/api/v2/region/2/",
  Hoenn: "https://pokeapi.co/api/v2/region/3/",
};

const GenerationView: React.FC<GenerationViewProps> = ({
  generation,
  goBack,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (generation) {
      fetch(API_URLS[generation])
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Error fetching data");
          setLoading(false);
        });
    }
  }, [generation]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Lógica para mostrar la imagen correspondiente
  const renderMapImage = () => {
    switch (generation) {
      case "Kanto":

        return <img src={Kanto_Map} alt="Mapa de Kanto" className="w-full h-auto" />;
      case "Johto":
        return <img src={Johto_Map} alt="Mapa de Johto" className="w-full h-auto" />;
      case "Hoenn":
        return <img src={Hoenn_Map} alt="Mapa de Hoenn" className="w-full h-auto" />;
      default:
        return null;
    }
  };

  return (
    <div className="m-0 p-6 bg-gray-300 rounded-2xl shadow-md">
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md mb-5 text-lg hover:bg-gray-500 transition duration-300 focus:outline-none"
        onClick={goBack}
      >
        Back
      </button>
      <h2 className="text-xl font-bold">Information about {generation}</h2>

      {/* Renderizar la imagen del mapa */}
      <div className="mt-4">
        {renderMapImage()}
      </div>

      <div>
        <h3 className="mt-4 font-semibold">Locations in {generation}:</h3>
        <ul className="list-disc list-inside">
          {data.locations.map((location: any, index: number) => (
            <li key={index}>{location.name}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Main Generation:</h3>
        <p>{data.main_generation.name}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Pokedexes:</h3>
        <ul className="list-disc list-inside">
          {data.pokedexes.map((pokedex: any, index: number) => (
            <li key={index}>{pokedex.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GenerationView;
