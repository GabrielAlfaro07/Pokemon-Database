import React from "react";

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="flex items-center bg-white rounded-full p-1 shadow w-[50%] max-w-[400px]">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
        className="flex-grow border-none outline-none py-1 px-3 rounded-full text-gray-800 text-base placeholder:text-gray-400"
      />
      <img src="src/assets/search-icon.png" alt="Search" className="w-5 h-5" />
    </div>
  );
};

export default SearchBar;
