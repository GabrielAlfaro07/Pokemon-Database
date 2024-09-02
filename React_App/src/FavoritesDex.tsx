import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import SearchBar from "./components/SearchBar";
import PaginationButtons from "./components/PaginationButtons";
import TypeDropdown from "./components/TypeDropdown";
import { useAuth0 } from "@auth0/auth0-react";
import { getFavorites } from "./services/FavoritesService";
import AccountButton from "./components/AccountButton";
import { useUserData } from "./hooks/UseUserData"; // Import your hook
import { useTheme } from "./ThemeContext";

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
  const isUserDataInitialized = useUserData(); // Use the hook
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
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated && user && isUserDataInitialized) {
      fetchFavorites();
    }
  }, [isAuthenticated, user, isUserDataInitialized]);

  useEffect(() => {
    updateDisplayedFavorites();
  }, [favorites, currentPage, searchQuery, selectedType]);

  useEffect(() => {
    fetchPokemonDetails();
  }, [favorites]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const favIds = await getFavorites(user!.sub); // Use user.sub here

      // Filter out the "init" document
      const filteredFavIds = favIds.filter((pokemonId) => pokemonId !== "init");

      if (!filteredFavIds || filteredFavIds.length === 0) {
        setError("No favorite Pokémon found.");
        setFavorites([]);
        setLoading(false);
        return;
      }

      const favPokemon = await Promise.all(
        filteredFavIds.map(async (pokemonId) => {
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
          } catch (error) {
            console.error("Error in fetchFavorites:", error);
            setError("Failed to fetch favorite Pokémon.");
            setFavorites([]);
          }
        })
      );

      const validFavorites = favPokemon.filter((pokemon) => pokemon !== null);

      if (validFavorites.length === 0) {
        setError("Failed to fetch details for any favorite Pokémon.");
        setFavorites([]);
      } else {
        setFavorites(validFavorites as FavoritePokemon[]);
        setTotalPages(Math.ceil(validFavorites.length / PAGE_SIZE));
      }
    } catch (error) {
      console.error("Error in fetchFavorites:", error);
      setError("Failed to fetch favorite Pokémon.");
      setFavorites([]);
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
        <header
          className={`${
            isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"
          } transition-all duration-300 text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center`}
        >
          <h1 className="text-2xl m-0">Your Favorite Pokémon</h1>
          <AccountButton />
        </header>
        <div
          className={`${
            isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"
          } transition-all duration-300 text-center p-4 rounded-2xl flex-grow overflow-auto`}
        >
          <div className="p-4">
            <h2 className="text-4xl font-bold">Favoritos</h2>
            <p className="m-4 text-lg">
              Aquí podrás encontrar a todos los Pokémon que hayas marcado como
              favoritos en la Pokédex.
            </p>
          </div>
          <p>You are not logged into any account.</p>
          <p>Please log in to view your favorite Pokémon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="FavoritesDex bg-blue-400 text-white flex flex-col min-h-screen p-4">
      <header
        className={`${
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"
        } transition-all duration-300 text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center`}
      >
        {" "}
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
      <div
        className={`${
          isDarkTheme ? "bg-gray-800" : "bg-white"
        } transition-all duration-300 text-center p-4 rounded-2xl flex-grow overflow-auto`}
      >
        <div
          className={`p-4 ${
            isDarkTheme ? "text-white" : "text-black"
          } transition-all duration-300 text-center`}
        >
          <h2 className="text-4xl font-bold">Favoritos</h2>
          <p className="m-4 text-lg">
            Aquí podrás encontrar a todos los Pokémon que hayas marcado como
            favoritos en la Pokédex.
          </p>
        </div>
        {loading ? (
          <div className="loader text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center text-gray-700 text-lg">{error}</div>
        ) : displayedFavorites.length === 0 ? (
          <div className="text-center text-gray-700 text-lg">
            No favorite Pokemon found.
          </div>
        ) : (
          <>
            <PaginationButtons
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(newPage) => setCurrentPage(newPage)}
            />
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
          </>
        )}
      </div>
    </div>
  );
};

export default FavoritesDex;
