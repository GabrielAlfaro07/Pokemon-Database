import { useState, useEffect } from "react";
import { getTeams, addPokemonToTeam } from "../services/TeamsService";
import { useAuth0 } from "@auth0/auth0-react";
import TeamDropdown from "./TeamDropdown";
import DeletePokemonFromTeamButton from "./DeletePokemonFromTeamButton";

interface AddToTeamButtonProps {
  pokemonId: string;
  color: string;
}

const AddToTeamButton: React.FC<AddToTeamButtonProps> = ({
  pokemonId,
  color,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const { user } = useAuth0();

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    if (user && user.sub) {
      try {
        const teamsData = await getTeams(user.sub);
        setTeams(teamsData);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    }
  };

  const handleAddToTeam = async (
    teamId: string,
    refreshTeamsWithPokemon: () => void
  ) => {
    if (user && user.sub) {
      try {
        await addPokemonToTeam(user.sub, teamId, pokemonId);
        alert(`Added Pokémon to team ${teamId}`);
        fetchTeams(); // Refresh teams list after adding Pokémon
        setDropdownOpen(false); // Close dropdown after adding
        refreshTeamsWithPokemon(); // Refresh the list of teams with the Pokémon
      } catch (error) {
        console.error("Failed to add Pokémon to team:", error);
      }
    }
  };

  const handleTeamCreated = () => {
    fetchTeams(); // Refresh the teams list
  };

  return (
    <div className="relative inline-block">
      <button
        className="mx-2 px-2 py-1 rounded-lg"
        style={{ backgroundColor: color }}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <p className="text-sm font-bold text-white">Add to team</p>
      </button>

      <TeamDropdown
        isOpen={isDropdownOpen}
        teams={teams}
        onAddToTeam={(teamId) => handleAddToTeam(teamId, fetchTeams)}
        onClose={() => setDropdownOpen(false)}
        buttonColor={color}
        onTeamCreated={handleTeamCreated}
      />

      <DeletePokemonFromTeamButton
        pokemonId={pokemonId}
        color={color}
        onPokemonRemoved={fetchTeams} // Refresh the teams list on removal
      />
    </div>
  );
};

export default AddToTeamButton;
