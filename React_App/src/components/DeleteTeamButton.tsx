// components/DeleteTeamButton.tsx
import React from "react";
import { deleteTeam } from "../services/TeamsService";
import { useAuth0 } from "@auth0/auth0-react";

interface DeleteTeamButtonProps {
  teamId: string;
  onDelete: () => void;
}

const DeleteTeamButton: React.FC<DeleteTeamButtonProps> = ({
  teamId,
  onDelete,
}) => {
  const { user } = useAuth0();

  const handleDelete = async () => {
    if (user && teamId) {
      try {
        await deleteTeam(user.sub, teamId);
        alert(`Team ${teamId} deleted successfully.`);
        onDelete(); // Callback to refresh the team list or handle UI changes
      } catch (error) {
        console.error("Failed to delete team:", error);
        alert("Error: Could not delete the team.");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="delete-team-button bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
    >
      Delete Team
    </button>
  );
};

export default DeleteTeamButton;
