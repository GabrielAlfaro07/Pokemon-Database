import { useEffect, useState } from "react";
import PokemonCard from "./components/PokemonCard";
import SearchBar from "./components/SearchBar";
import PaginationButtons from "./components/PaginationButtons"; // Import the updated component

interface Pokemon {
  name: string;
  url: string;
}

const PAGE_SIZE = 100; // Number of Pokémon per page

const App = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]); // Store all fetched Pokémon
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchPokemonPage(currentPage);
  }, [currentPage, allPokemon]);

  const fetchInitialData = () => {
    setLoading(true);
    setError(null);

    fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000") // Large limit to fetch all Pokémon
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAllPokemon(data.results);
        setTotalPages(Math.ceil(data.count / PAGE_SIZE));
        setLoading(false); // Data is loaded
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  const fetchPokemonPage = (page: number) => {
    if (allPokemon.length === 0) return; // Don't fetch if no Pokémon data available

    // Calculate offset based on the current page
    const offset = page * PAGE_SIZE;

    // Set pokemonList based on the current page
    const start = offset;
    const end = start + PAGE_SIZE;
    const paginatedPokemon = allPokemon.slice(start, end);
    setPokemonList(paginatedPokemon);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

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
          onPageChange={handlePageChange}
        />
        {pokemonList.length === 0 ? (
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
