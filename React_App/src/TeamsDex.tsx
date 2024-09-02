// TeamsDex.tsx
import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getTeamsPokemon } from "./services/TeamsService";
import TeamCard from "./components/TeamCard";
import AccountButton from "./components/AccountButton";
import { useUserData } from "./hooks/UseUserData";
import CreateTeamButton from "./components/CreateTeamButton";
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

interface TeamWithPokemon {
  teamId: string;
  pokemonList: {
    id: string;
    pokemonId: string;
  }[];
}

const TeamsDex = () => {
  const { user, isAuthenticated } = useAuth0();
  const isUserDataInitialized = useUserData();
  const [teams, setTeams] = useState<TeamWithPokemon[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<{
    [pokemonId: string]: PokemonDetails;
  }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isDarkTheme } = useTheme();

  useEffect(() => {
    if (isAuthenticated && user && isUserDataInitialized) {
      fetchTeamsWithPokemon();
    }
  }, [isAuthenticated, user, isUserDataInitialized]);

  const fetchTeamsWithPokemon = async () => {
    setLoading(true);
    try {
      const teamsWithPokemon = await getTeamsPokemon(user!.sub);

      if (!teamsWithPokemon || teamsWithPokemon.length === 0) {
        setError("No teams found.");
        setTeams([]);
      } else {
        setTeams(teamsWithPokemon);
        fetchPokemonDetails(teamsWithPokemon);
      }
    } catch (error) {
      console.error("Error in fetchTeamsWithPokemon:", error);
      setError("Failed to fetch teams with Pokémon.");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPokemonDetails = async (teams: TeamWithPokemon[]) => {
    const pokemonDetailsMap: { [pokemonId: string]: PokemonDetails } = {};

    for (const team of teams) {
      for (const pokemon of team.pokemonList) {
        const pokemonId = pokemon.pokemonId;
        if (!pokemonDetailsMap[pokemonId]) {
          try {
            const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
            );
            if (!response.ok)
              throw new Error(`Failed to fetch details for ${pokemonId}`);
            const data: PokemonDetails = await response.json();
            pokemonDetailsMap[pokemonId] = data;
          } catch (error) {
            console.error(error);
          }
        }
      }
    }

    setPokemonDetails(pokemonDetailsMap);
  };

  const handleTeamCreated = () => {
    fetchTeamsWithPokemon(); // Refresh the teams list
  };

  if (!isAuthenticated) {
    return (
      <div className="TeamsDex bg-yellow-400 text-white flex flex-col min-h-screen p-4">
        <header
          className={`${
            isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"
          } transition-all duration-300 text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center`}
        >
          <h1 className="text-2xl m-0">Your Pokémon Teams</h1>
          <AccountButton />
        </header>
        <div
          className={`${
            isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"
          } transition-all duration-300 text-center p-4 rounded-2xl flex-grow overflow-auto`}
        >
          <div className="p-4 text-center">
            <h2 className="text-4xl font-bold">Equipos</h2>
            <p className="mt-4 text-lg">
              Aquí podrás encontrar a todos los Equipos que hayas creado, así
              como los Pokémon que hay en ellos.
            </p>
            <p className="mb-4 text-lg">
              Los equipos tienen un máximo de seis Pokémon.
            </p>
          </div>
          <p>You are not logged into any account.</p>
          <p>Please log in to view your Pokémon teams.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="TeamsDex bg-yellow-400 text-white flex flex-col min-h-screen p-4">
      <header
        className={`${
          isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"
        } transition-all duration-300 text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center`}
      >
        {" "}
        <h1 className="text-2xl m-0">Your Pokémon Teams</h1>
        <AccountButton />
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
          <h2 className="text-4xl font-bold">Equipos</h2>
          <p className="mt-4 text-lg">
            Aquí podrás encontrar a todos los Equipos que hayas creado, así como
            los Pokémon que hay en ellos.
          </p>
          <p className="mb-4 text-lg">
            Los equipos tienen un máximo de seis Pokémon.
          </p>
        </div>
        {loading ? (
          <div className="loader text-lg">Loading...</div>
        ) : error ? (
          <div className="text-center text-gray-700 text-lg">{error}</div>
        ) : teams.length === 0 ? (
          <div className="text-center text-gray-700 text-lg">
            No teams found.
          </div>
        ) : (
          <div className="team-grid grid grid-cols-1 gap-5">
            {teams.map(({ teamId, pokemonList }) => (
              <TeamCard
                key={teamId}
                teamId={teamId}
                pokemonList={pokemonList}
                pokemonDetails={pokemonDetails}
                onTeamDeleted={fetchTeamsWithPokemon} // Refresh the list after deletion
              />
            ))}
          </div>
        )}
        <div className="flex justify-center mt-4">
          <CreateTeamButton onTeamCreated={handleTeamCreated} />
        </div>
      </div>
    </div>
  );
};

export default TeamsDex;
