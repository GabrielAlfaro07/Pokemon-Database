import React from "react";
import CreateTeamButton from "./CreateTeamButton"; // Adjust the import path accordingly

interface TeamDropdownProps {
  isOpen: boolean;
  teams: any[];
  onAddToTeam: (teamId: string) => void;
  onClose: () => void;
  buttonColor: string; // Add buttonColor prop
}

const TeamDropdown: React.FC<TeamDropdownProps> = ({
  isOpen,
  teams,
  onAddToTeam,
  onClose,
  buttonColor, // Destructure buttonColor
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute z-10 mt-2 w-48 bg-white border rounded-xl shadow-lg">
      {teams.length > 0 ? (
        <>
          {teams.map((team) => (
            <button
              key={team.id}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
              onClick={() => {
                onAddToTeam(team.id);
                onClose();
              }}
            >
              {team.id}
            </button>
          ))}
          <div className="mt-2 flex justify-center">
            <CreateTeamButton color={buttonColor} /> {/* Pass color prop */}
          </div>
        </>
      ) : (
        <>
          <p className="px-4 py-2 text-gray-500">No teams available</p>
          <div className="mt-2 flex justify-center">
            <CreateTeamButton color={buttonColor} /> {/* Pass color prop */}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamDropdown;