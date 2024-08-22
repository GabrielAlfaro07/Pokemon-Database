import React, { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import SearchBar from "./components/SearchBar";
import PaginationButtons from "./components/PaginationButtons";

const PAGE_SIZE = 100;

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [allPokemon, setAllPokemon] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPokemonPage(currentPage);
  }, [currentPage, allPokemon]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000"
      );
      const data = await response.json();
      setAllPokemon(data.results);
      setTotalPages(Math.ceil(data.count / PAGE_SIZE));
    } catch (error) {
      setError("Failed to fetch Pokémon data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonPage = (page) => {
    if (!allPokemon.length) return;
    const offset = page * PAGE_SIZE;
    const paginatedPokemon = allPokemon.slice(offset, offset + PAGE_SIZE);
    setPokemonList(paginatedPokemon);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App bg-red-400 text-white flex flex-col min-h-screen p-4">
      <header className="bg-gray-700 text-white text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center">
        <h1 className="text-2xl m-0">Pokedex</h1>
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </header>
      <div className="bg-white p-4 rounded-2xl flex-grow overflow-auto">
        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
        {filteredPokemonList.length === 0 ? (
          <div>No Pokémon found</div>
        ) : (
          <div className="pokemon-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5">
            {filteredPokemonList.map((pokemon, index) => (
              <div key={index} className="pokemon-item flex justify-center">
                <PokemonCard pokemon={pokemon} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
