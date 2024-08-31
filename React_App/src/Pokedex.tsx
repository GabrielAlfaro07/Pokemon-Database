import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import SearchBar from "./components/SearchBar";
import PaginationButtons from "./components/PaginationButtons";
import TypeDropdown from "./components/TypeDropdown";
import AccountButton from "./components/AccountButton";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

interface PokemonDetails {
  id: number;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
}

const PAGE_SIZE = 100;

const PokeDex = () => {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<Pokemon[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<{
    [name: string]: PokemonDetails;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    updateDisplayedPokemon();
  }, [currentPage, searchQuery, allPokemon, selectedType]);

  useEffect(() => {
    fetchPokemonDetails();
  }, [allPokemon]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?offset=0&limit=100000"
      );
      if (!response.ok) throw new Error("Failed to fetch Pokémon data.");
      const data = await response.json();
      setAllPokemon(data.results);
      setTotalPages(Math.ceil(data.count / PAGE_SIZE));
    } catch (error) {
      setError(error.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonDetails = async () => {
    for (const pokemon of allPokemon) {
      if (!pokemonDetails[pokemon.name]) {
        try {
          const response = await fetch(pokemon.url);
          if (!response.ok)
            throw new Error(`Failed to fetch details for ${pokemon.name}`);
          const data: PokemonDetails = await response.json();
          setPokemonDetails((prevDetails) => ({
            ...prevDetails,
            [pokemon.name]: data,
          }));
        } catch (error) {
          console.error(
            `Error fetching details for ${pokemon.name}: ${error.message}`
          );
          setPokemonDetails((prevDetails) => ({
            ...prevDetails,
            [pokemon.name]: {
              id: -1,
              sprites: { front_default: "" },
              types: [{ type: { name: "Unknown", url: "#" } }],
            },
          }));
        }
      }
    }
  };

  const updateDisplayedPokemon = () => {
    const filteredPokemon = allPokemon.filter((pokemon) => {
      const matchesSearch = pokemon.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType
        ? pokemonDetails[pokemon.name]?.types.some(
            (typeInfo) => typeInfo.type.name === selectedType
          )
        : true;

      return matchesSearch && matchesType;
    });

    setTotalPages(Math.ceil(filteredPokemon.length / PAGE_SIZE));

    const offset = currentPage * PAGE_SIZE;
    const paginatedPokemon = filteredPokemon.slice(offset, offset + PAGE_SIZE);
    setDisplayedPokemon(paginatedPokemon);
  };

  const handleSearch = (query: string) => {
    if (query !== "") {
      if (!isSearching) {
        setPreviousPage(currentPage);
        setCurrentPage(0);
      }
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setCurrentPage(previousPage);
    }
    setSearchQuery(query);
  };

  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
    setCurrentPage(0);
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="PokeDex bg-red-400 text-white flex flex-col min-h-screen p-4">
      <header className="bg-gray-700 text-white text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center">
        <h1 className="text-2xl m-0">PokéDex</h1>
        <div className="flex items-center space-x-4">
          <TypeDropdown
            selectedType={selectedType}
            onChange={handleTypeChange}
          />
          <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
          <AccountButton />
        </div>
      </header>
      <div className="bg-white p-4 rounded-2xl flex-grow overflow-auto">
        <div className="p-4 text-black text-center">
          <h2 className="text-4xl font-bold">PokéDex</h2>
          <p className="mt-4 text-lg">
            La PokéDex es una enciclopedia virtual de alta tecnología que
            contiene información sobre todos los Pokémon.
          </p>
          <p className="mb-4 text-lg">
            Aquí puedes buscar información sobre el Pokemón que desees.
          </p>
        </div>
        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
        {displayedPokemon.length === 0 ? (
          <div>No Pokémon found</div>
        ) : (
          <div className="pokemon-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5">
            {displayedPokemon.map((pokemon, index) => {
              const details = pokemonDetails[pokemon.name];
              return (
                <div key={index} className="pokemon-item flex justify-center">
                  {details && details.id !== -1 ? (
                    <PokemonCard pokemon={pokemon} details={details} />
                  ) : (
                    <div className="bg-gray-200 text-gray-500 p-4 rounded-xl">
                      <p>Details not available for {pokemon.name}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PokeDex;
