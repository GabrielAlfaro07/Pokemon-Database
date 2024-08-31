import React, { useState } from "react";
import { createTeam } from "../services/TeamsService"; // Adjust the import path accordingly
import { useAuth0 } from "@auth0/auth0-react"; // Assuming Auth0 for authentication

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  color?: string; // Optional color prop
}

const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  color = "bg-yelow-400", // Default color if not provided
}) => {
  const [teamName, setTeamName] = useState("");
  const { user } = useAuth0(); // Assuming Auth0 provides user info

  const handleCreateTeam = async () => {
    if (!teamName) {
      alert("Please enter a team name.");
      return;
    }
    try {
      await createTeam(user.sub, teamName); // Using user.sub as the user ID
      alert("Team created successfully!");
      onClose();
    } catch (error) {
      console.error("Error creating team:", error);
      alert("Failed to create team.");
    }
  };

  if (!isOpen) return null;

  // Determine if color is a hex code or a Tailwind class
  const buttonStyle = color.startsWith("#")
    ? { backgroundColor: color } // Inline style for hex color
    : color; // Tailwind class

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-2xl shadow-lg w-80">
        <h2 className="text-lg font-bold mb-4">Name Your Team</h2>
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded-full mb-4"
          placeholder="Enter team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded-full"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`text-white px-4 py-2 rounded-full ${
              typeof buttonStyle === "string" ? buttonStyle : ""
            }`}
            style={typeof buttonStyle === "object" ? buttonStyle : {}}
            onClick={handleCreateTeam}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
