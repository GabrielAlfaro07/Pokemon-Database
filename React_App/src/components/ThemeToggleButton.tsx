import { FC } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "../ThemeContext";

const ThemeToggleButton: FC = () => {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center justify-center p-2 rounded-full transition-all duration-300 ${
        isDarkTheme ? "bg-gray-700" : "bg-gray-400"
      }`}
    >
      {isDarkTheme ? (
        <FaMoon size={24} className="text-yellow-400" />
      ) : (
        <FaSun size={24} className="text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
