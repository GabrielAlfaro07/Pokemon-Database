import { Link, useLocation } from "react-router-dom";
import { FC } from "react";
import { IconType } from "react-icons";

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
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center space-x-4 text-white p-3 rounded-lg transition-all duration-300 
        ${isActive ? "bg-gray-700" : "hover:bg-gray-600"}`}
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
