import React from "react";
import styles from "./SearchBar.module.css";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className={styles["search-bar"]}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        className={styles["search-input"]}
      />
      <img
        src="src/assets/search-icon.png" // Update with the correct path to your image
        alt="Search"
        className={styles["search-icon"]}
      />
    </div>
  );
};

export default SearchBar;
