import { Link, useLocation } from "react-router-dom";
import { FC } from "react";
import { IconType } from "react-icons";
import { useTheme } from "../ThemeContext";

interface SidebarLinkProps {
  to: string;
  icon: IconType;
  label: string;
  isOpen: boolean;
}

const SidebarLink: FC<SidebarLinkProps> = ({
  to,
  icon: Icon,
  label,
  isOpen,
}) => {
  const { isDarkTheme } = useTheme();
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-4 ${
        isDarkTheme ? "text-white" : "text-black"
      } transition-all duration-300 p-3 rounded-lg 
        ${
          isActive
            ? "bg-gray-600 text-white"
            : "hover:bg-gray-500 hover:text-white"
        }`}
    >
      <Icon size={24} />
      <span
        className={`transition-opacity duration-300 
          ${isOpen ? "opacity-100 ml-4" : "opacity-0 ml-0"}`}
      >
        {label}
      </span>
    </Link>
  );
};

export default SidebarLink;
