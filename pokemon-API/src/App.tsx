import { useEffect, useState } from "react";
import "./App.css";
import PokemonCard from "./components/PokemonCard";

interface Pokemon {
  name: string;
  url: string;
}

const App = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=100") // Limite para 30 Pokémon (3 columnas x 10 filas)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => setPokemonList(data.results))
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App">
      <header>Pokedex</header>
      <div className="pokemon-grid">
        {pokemonList.map((pokemon, index) => (
          <div key={index} className="pokemon-item">
            <PokemonCard pokemon={pokemon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
