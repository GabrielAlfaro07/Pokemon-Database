import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getTeamsPokemon } from "./services/TeamsService";
import TeamCard from "./components/TeamCard";
import AccountButton from "./components/AccountButton";
import { useUserData } from "./hooks/UseUserData";
import CreateTeamButton from "./components/CreateTeamButton";
import PokemonCard from "./components/PokemonCard";

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

  if (!isAuthenticated) {
    return (
      <div className="TeamsDex bg-yellow-400 text-white flex flex-col min-h-screen p-4">
        <header className="bg-gray-700 text-white text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center">
          <h1 className="text-2xl m-0">Your Pokémon Teams</h1>
          <AccountButton />
        </header>
        <div className="bg-white text-gray-700 p-4 rounded-2xl flex-grow overflow-auto text-center text-lg">
          <div className="p-4 text-black text-center">
            <h2 className="text-4xl font-bold">Equipos</h2>
            <p className="m-4 text-lg">
              Aquí podrás encontrar a todos los Equipos que hayas creado, así
              como los Pokémon que hay en ellos.
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
      <header className="bg-gray-700 text-white text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center">
        <h1 className="text-2xl m-0">Your Pokémon Teams</h1>
        <AccountButton />
      </header>
      <div className="bg-white p-4 rounded-2xl flex-grow overflow-auto">
        <div className="p-4 text-black text-center">
          <h2 className="text-4xl font-bold">Equipos</h2>
          <p className="m-4 text-lg">
            Aquí podrás encontrar a todos los Equipos que hayas creado, así como
            los Pokémon que hay en ellos.
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
              <div
                key={teamId}
                className="team-container bg-gray-300 p-4 mb-4 rounded-2xl"
              >
                <h2 className="team-id text-white text-2xl font-bold mb-4">
                  {teamId}
                </h2>
                <div className="pokemon-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
                  {pokemonList.map(({ pokemonId }) => {
                    const pokemon = pokemonDetails[pokemonId];
                    return pokemon ? (
                      <div className="pokemon-item flex justify-center">
                        <PokemonCard
                          key={pokemonId}
                          pokemon={{
                            name: pokemon.name,
                            url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
                          }}
                          details={pokemon}
                        />
                      </div>
                    ) : (
                      <div
                        key={pokemonId}
                        className="pokemon-card bg-gray-200 p-4 rounded-lg"
                      >
                        <p>Loading Pokémon details...</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center mt-4">
          <CreateTeamButton />
        </div>
      </div>
    </div>
  );
};

export default TeamsDex;
