import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { getTeams } from "./services/TeamsService";
import TeamCard from "./components/TeamCard";
import AccountButton from "./components/AccountButton";
import { useUserData } from "./hooks/UseUserData";

interface Team {
  id: string;
  pokemon: { id: string; pokemonId: string }[];
}

const TeamsDex = () => {
  const { user, isAuthenticated } = useAuth0();
  const isUserDataInitialized = useUserData();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user && isUserDataInitialized) {
      fetchTeams();
    }
  }, [isAuthenticated, user, isUserDataInitialized]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const userTeams = await getTeams(user!.sub); // Fetch the user's teams

      // Filter out the "init" document
      const validTeams = userTeams.filter((team) => team.id !== "init");

      if (!validTeams || validTeams.length === 0) {
        setError("No teams found.");
        setTeams([]);
      } else {
        setTeams(validTeams);
      }
    } catch (error) {
      console.error("Error in fetchTeams:", error);
      setError("Failed to fetch teams.");
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="TeamsDex bg-yellow-400 text-white flex flex-col min-h-screen p-4">
        <header className="bg-gray-700 text-white text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center">
          <h1 className="text-2xl m-0">Your Pokémon Teams</h1>
          <AccountButton />
        </header>
        <div className="bg-white text-gray-700 p-4 rounded-2xl flex-grow overflow-auto text-center text-lg">
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
            {teams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsDex;
