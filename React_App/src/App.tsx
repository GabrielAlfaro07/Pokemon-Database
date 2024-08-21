import { useEffect, useState } from "react";
import "./App.css";
import PokemonCard from "./components/PokemonCard";
import SearchBar from "./components/SearchBar";

interface Pokemon {
  name: string;
  url: string;
}

const App = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
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

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <header>
        <div>
          <h1>Pokedex</h1>
        </div>
        <div>
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
      </header>
      <div className="pokemon-grid">
        {filteredPokemonList.map((pokemon, index) => (
          <div key={index} className="pokemon-item">
            <PokemonCard pokemon={pokemon} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
