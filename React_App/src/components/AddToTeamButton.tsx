import { useState, useEffect } from "react";
import { getTeams, addPokemonToTeam } from "../services/TeamsService"; // Ensure this path matches your project structure
import { useAuth0 } from "@auth0/auth0-react"; // Assuming you're using Auth0 for authentication
import TeamDropdown from "./TeamDropdown"; // Import the new TeamDropdown component

interface AddToTeamButtonProps {
  pokemonId: string; // Pass the ID of the Pokémon to be added to a team
  color: string; // Pass the color for the button styling
}

const AddToTeamButton: React.FC<AddToTeamButtonProps> = ({
  pokemonId,
  color,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const { user } = useAuth0(); // Assuming you're using Auth0 for authentication

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  const fetchTeams = async () => {
    if (user && user.sub) {
      try {
        const userId = user.sub; // Auth0 user ID
        const teamsData = await getTeams(userId);
        setTeams(teamsData);
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    }
  };

  const handleAddToTeam = async (teamId: string) => {
    if (user && user.sub) {
      try {
        const userId = user.sub;
        await addPokemonToTeam(userId, teamId, pokemonId);
        alert(`Added Pokémon to team ${teamId}`);
        setDropdownOpen(false); // Close dropdown after adding
      } catch (error) {
        console.error("Failed to add Pokémon to team:", error);
      }
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className="px-2 py-1 rounded-lg"
        style={{ backgroundColor: color }}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <p className="text-sm font-bold text-white">Add to team</p>
      </button>

      <TeamDropdown
        isOpen={isDropdownOpen}
        teams={teams}
        onAddToTeam={handleAddToTeam}
        onClose={() => setDropdownOpen(false)}
        buttonColor={color} // Pass color to TeamDropdown
      />
    </div>
  );
};

export default AddToTeamButton;
