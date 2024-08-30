import React, { useEffect, useState } from "react";

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

  return (
    <div className="m-0 p-6 bg-gray-300 rounded-2xl shadow-md">
      <button
        className="bg-red-500 text-white px-4 py-2 rounded-md mb-5 text-lg hover:bg-gray-500 transition duration-300 focus:outline-none"
        onClick={goBack}
      >
        Back
      </button>
      <h2 className="text-xl font-bold">Información de {generation}</h2>

      <div>
        <h3 className="mt-4 font-semibold">Localizaciones en {generation}:</h3>
        <ul className="list-disc list-inside">
          {data.locations.map((location: any, index: number) => (
            <li key={index}>{location.name}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Generación Principal:</h3>
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
