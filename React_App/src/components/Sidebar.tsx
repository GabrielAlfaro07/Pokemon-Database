import { useState } from "react";
import {
  FaHome,
  FaList,
  FaHeart,
  FaBoxes,
  FaUserFriends,
} from "react-icons/fa";
import SidebarLink from "./SidebarLinks"; // Adjust the import path as needed

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`flex ${
        isOpen ? "w-64" : "w-16"
      } bg-gray-800 h-auto p-5 pt-8 transition-width duration-300 ease-in-out`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className="flex flex-col space-y-10">
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
    </div>
  );
};

export default Sidebar;
