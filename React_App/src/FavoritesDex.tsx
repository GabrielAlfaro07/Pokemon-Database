import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import SearchBar from "./components/SearchBar";
import PaginationButtons from "./components/PaginationButtons";
import TypeDropdown from "./components/TypeDropdown";
import { useAuth0 } from "@auth0/auth0-react";
import { getFavorites } from "./services/FavoritesService";
import AccountButton from "./components/AccountButton";

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
}

interface FavoritePokemon {
  id: string;
  name: string;
  url: string;
}

const PAGE_SIZE = 10;

const FavoritesDex = () => {
  const { user, isAuthenticated } = useAuth0();
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);
  const [displayedFavorites, setDisplayedFavorites] = useState<
    FavoritePokemon[]
  >([]);
  const [pokemonDetails, setPokemonDetails] = useState<{
    [name: string]: PokemonDetails;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Auth0 User ID:", user.sub); // Add this line
      fetchFavorites();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    updateDisplayedFavorites();
  }, [favorites, currentPage, searchQuery, selectedType]);

  useEffect(() => {
    fetchPokemonDetails();
  }, [favorites]);

  const fetchFavorites = async () => {
    setLoading(true);
    console.log("Authenticated user ID:", user!.sub);
    try {
      const favIds = await getFavorites(user!.sub);
      if (!favIds || favIds.length === 0) {
        setError("No favorite Pokémon found.");
        return;
      }

      const favPokemon = await Promise.all(
        favIds.map(async (pokemonId) => {
          try {
            const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
            );
            if (!response.ok)
              throw new Error(`Failed to fetch details for ${pokemonId}`);
            const data: PokemonDetails = await response.json();
            return {
              id: pokemonId,
              name: data.name,
              url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
            };
          } catch (fetchError) {
            console.error(fetchError.message);
            // Return null for failed fetches
            return null;
          }
        })
      );

      const validFavorites = favPokemon.filter((pokemon) => pokemon !== null);

      if (validFavorites.length === 0) {
        setError("Failed to fetch details for all favorite Pokémon.");
        return;
      }

      setFavorites(validFavorites as FavoritePokemon[]);
      setTotalPages(Math.ceil(validFavorites.length / PAGE_SIZE));
    } catch (error) {
      console.error("Error in fetchFavorites:", error);
      setError("Failed to fetch favorite Pokémon.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonDetails = async () => {
    for (const { name, url } of favorites) {
      if (!pokemonDetails[name]) {
        try {
          const response = await fetch(url);
          if (!response.ok)
            throw new Error(`Failed to fetch details for ${name}`);
          const data: PokemonDetails = await response.json();
          setPokemonDetails((prevDetails) => ({
            ...prevDetails,
            [name]: data,
          }));
        } catch (error) {
          console.error(error.message);
        }
      }
    }
  };

  const updateDisplayedFavorites = () => {
    const filteredFavorites = favorites.filter(({ name }) => {
      const matchesSearch = name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType
        ? pokemonDetails[name]?.types.some(
            (typeInfo) => typeInfo.type.name === selectedType
          )
        : true;
      return matchesSearch && matchesType;
    });

    setTotalPages(Math.ceil(filteredFavorites.length / PAGE_SIZE));

    const offset = currentPage * PAGE_SIZE;
    const paginatedFavorites = filteredFavorites.slice(
      offset,
      offset + PAGE_SIZE
    );
    setDisplayedFavorites(paginatedFavorites);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0);
  };

  const handleTypeChange = (type: string | null) => {
    setSelectedType(type);
    setCurrentPage(0);
  };

  if (!isAuthenticated) {
    return (
      <div className="FavoritesDex bg-blue-400 text-white flex flex-col min-h-screen p-4">
        <header className="bg-gray-700 text-white text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center">
          <h1 className="text-2xl m-0">Your Favorite Pokémon</h1>
          <AccountButton />
        </header>
        <div className="bg-white p-4 rounded-2xl flex-grow overflow-auto">
          <p>Please log in to view your favorite Pokémon.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="FavoritesDex bg-blue-400 text-white flex flex-col min-h-screen p-4">
      <header className="bg-gray-700 text-white text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center">
        <h1 className="text-2xl m-0">Your Favorite Pokémon</h1>
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
        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
        {displayedFavorites.length === 0 ? (
          <div>No favorite Pokémon found</div>
        ) : (
          <div className="pokemon-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5">
            {displayedFavorites.map(({ id, name }, index) => (
              <div key={index} className="pokemon-item flex justify-center">
                <PokemonCard
                  pokemon={{
                    name,
                    url: `https://pokeapi.co/api/v2/pokemon/${id}`,
                  }}
                  details={pokemonDetails[name]}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesDex;
