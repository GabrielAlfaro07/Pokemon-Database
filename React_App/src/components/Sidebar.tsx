import { useState, useEffect } from "react";
import {
  FaHome,
  FaList,
  FaHeart,
  FaBoxes,
  FaUserFriends,
} from "react-icons/fa";
import SidebarLink from "./SidebarLinks"; // Adjust the import path as needed
import ThemeToggleButton from "./ThemeToggleButton"; // Import the new component
import { useTheme } from "../ThemeContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkTheme } = useTheme();

  // Apply the theme to the document body
  useEffect(() => {
    document.body.classList.toggle("dark", isDarkTheme);
  }, [isDarkTheme]);

  return (
    <div
      className={`flex ${isOpen ? "w-60" : "w-16"} ${
        isDarkTheme ? "bg-gray-800 text-white" : "bg-white text-black"
      } transition-all h-auto p-2 pt-8 transition-width duration-300 ease-in-out`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex flex-col space-y-4">
        <SidebarLink to="/" icon={FaHome} label="Home" isOpen={isOpen} />
        <SidebarLink
          to="/pokedex"
          icon={FaList}
          label="PokéDex"
          isOpen={isOpen}
        />
        <SidebarLink
          to="/itemdex"
          icon={FaBoxes}
          label="ItemDex"
          isOpen={isOpen}
        />
        <SidebarLink
          to="/favorites"
          icon={FaHeart}
          label="Favorites"
          isOpen={isOpen}
        />
        <SidebarLink
          to="/teams"
          icon={FaUserFriends}
          label="Teams"
          isOpen={isOpen}
        />
      </div>
      <div className="absolute bottom-3 left-3">
        <ThemeToggleButton />
      </div>
    </div>
  );
};

export default Sidebar;
