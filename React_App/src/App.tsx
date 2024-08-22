import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import SearchBar from "./components/SearchBar";
import PaginationButtons from "./components/PaginationButtons";

interface Pokemon {
  name: string;
  url: string;
}

const PAGE_SIZE = 100;

const App = () => {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    updateDisplayedPokemon();
  }, [currentPage, searchQuery, allPokemon]);

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

  const updateDisplayedPokemon = () => {
    const filteredPokemon = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setTotalPages(Math.ceil(filteredPokemon.length / PAGE_SIZE));

    const offset = currentPage * PAGE_SIZE;
    const paginatedPokemon = filteredPokemon.slice(offset, offset + PAGE_SIZE);
    setDisplayedPokemon(paginatedPokemon);
  };

  const handleSearch = (query: string) => {
    if (query !== "") {
      if (!isSearching) {
        setPreviousPage(currentPage);
        setCurrentPage(0); // Start search from page 1
      }
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setCurrentPage(previousPage); // Return to previous page after clearing search
    }
    setSearchQuery(query);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="App bg-red-400 text-white flex flex-col min-h-screen p-4">
      <header className="bg-gray-700 text-white text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center">
        <h1 className="text-2xl m-0">Pokedex</h1>
        <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </header>
      <div className="bg-white p-4 rounded-2xl flex-grow overflow-auto">
        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
        {displayedPokemon.length === 0 ? (
          <div>No Pokémon found</div>
        ) : (
          <div className="pokemon-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5">
            {displayedPokemon.map((pokemon, index) => (
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
