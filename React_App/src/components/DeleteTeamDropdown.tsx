// components/DeleteTeamDropdown.tsx
import React from "react";

interface DeleteTeamDropdownProps {
  isOpen: boolean;
  teams: { teamId: string }[];
  onRemoveFromTeam: (teamId: string) => void;
  onClose: () => void;
}

const DeleteTeamDropdown: React.FC<DeleteTeamDropdownProps> = ({
  isOpen,
  teams,
  onRemoveFromTeam,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-10 mt-2 w-48 bg-white border rounded-xl shadow-lg">
      {teams.length > 0 ? (
        teams.map((team) => (
          <button
            key={team.teamId}
            className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
            onClick={() => {
              onRemoveFromTeam(team.teamId);
              onClose();
            }}
          >
            {team.teamId}
          </button>
        ))
      ) : (
        <p className="px-4 py-2 text-gray-500">No teams available</p>
      )}
    </div>
  );
};

export default DeleteTeamDropdown;
