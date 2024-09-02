import React, { useState } from "react";
import CreateTeamModal from "./CreateTeamModal"; // Adjust the import path accordingly

interface CreateTeamButtonProps {
  color?: string; // Optional color prop
  onTeamCreated: () => void; // Add this prop
}

const CreateTeamButton: React.FC<CreateTeamButtonProps> = ({
  color = "bg-yellow-400", // Default to Tailwind CSS class
  onTeamCreated, // Destructure this prop
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className={`text-white px-4 py-2 rounded-full ${
          color.startsWith("#") ? "" : color
        }`}
        style={color.startsWith("#") ? { backgroundColor: color } : {}}
        onClick={handleOpenModal}
      >
        Create New Team
      </button>

      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        color={color}
        onTeamCreated={onTeamCreated}
      />
    </>
  );
};

export default CreateTeamButton;
