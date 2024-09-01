import React, { useState, useEffect } from "react";
import {
  getTeamsWithPokemon,
  removePokemonFromTeam,
} from "../services/TeamsService";
import { useAuth0 } from "@auth0/auth0-react";
import DeleteTeamDropdown from "./DeleteTeamDropdown";

interface DeletePokemonFromTeamButtonProps {
  pokemonId: string; // ID of the Pokémon to be deleted from teams
  color: string; // Button color
  onPokemonRemoved: () => void; // Callback to refresh the teams list
}

const DeletePokemonFromTeamButton: React.FC<
  DeletePokemonFromTeamButtonProps
> = ({ pokemonId, color, onPokemonRemoved }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const { user } = useAuth0();

  useEffect(() => {
    if (user) {
      fetchTeamsWithPokemon();
    }
  }, [user]);

  const fetchTeamsWithPokemon = async () => {
    if (user && user.sub) {
      try {
        const userId = user.sub;
        const teamsData = await getTeamsWithPokemon(userId, pokemonId);
        setTeams(teamsData);
      } catch (error) {
        console.error("Failed to fetch teams with Pokémon:", error);
      }
    }
  };

  const handleRemoveFromTeam = async (teamId: string) => {
    if (user && user.sub) {
      try {
        const userId = user.sub;
        await removePokemonFromTeam(userId, teamId, pokemonId);
        alert(`Removed Pokémon from team ${teamId}`);
        fetchTeamsWithPokemon(); // Refresh the list of teams
        setDropdownOpen(false); // Close dropdown after removal
        onPokemonRemoved(); // Refresh teams in AddToTeamButton
      } catch (error) {
        console.error("Failed to remove Pokémon from team:", error);
      }
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className="mx-2 px-2 py-1 rounded-lg"
        style={{ backgroundColor: color }}
        onClick={() => setDropdownOpen(!isDropdownOpen)}
      >
        <p className="text-sm font-bold text-white">Remove from team</p>
      </button>

      <DeleteTeamDropdown
        isOpen={isDropdownOpen}
        teams={teams}
        onRemoveFromTeam={handleRemoveFromTeam}
        onClose={() => setDropdownOpen(false)}
      />
    </div>
  );
};

export default DeletePokemonFromTeamButton;
