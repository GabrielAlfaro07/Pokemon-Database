import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Profile from "./Profile";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { useTheme } from "../ThemeContext";

const AccountButton = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated } = useAuth0();
  const { isDarkTheme } = useTheme();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return isAuthenticated ? (
    <div className="relative">
      <button
        className="text-base bg-blue-500 rounded-full px-4 py-2"
        onClick={toggleDropdown}
      >
        Account
      </button>
      {isDropdownOpen && (
        <div
          className={`absolute right-0 mt-2 p-4 ${
            isDarkTheme ? "bg-gray-600 text-white" : "bg-gray-300 text-black"
          } transition-all duration-300 rounded-2xl shadow-lg z-10`}
        >
          <Profile />
          <LogoutButton />
        </div>
      )}
    </div>
  ) : (
    <LoginButton />
  );
};

export default AccountButton;
