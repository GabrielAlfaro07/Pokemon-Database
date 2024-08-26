import { useState, useEffect } from "react";
import ItemCard from "./components/ItemCard";
import SearchBar from "./components/SearchBar";
import PaginationButtons from "./components/PaginationButtons";
import AttributeDropdown from "./components/AttributeDropdown";

interface Item {
  name: string;
  url: string;
}

interface ItemAttribute {
  attribute: {
    name: string;
    url: string;
  };
}

interface ItemDetails {
  id: number;
  sprites: {
    default: string;
  };
  attributes: ItemAttribute[];
}

const PAGE_SIZE = 100;

const ItemDex = () => {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [itemDetails, setItemDetails] = useState<{
    [name: string]: ItemDetails | undefined;
  }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousPage, setPreviousPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    updateDisplayedItems();
  }, [currentPage, searchQuery, allItems, selectedAttribute, itemDetails]);

  useEffect(() => {
    fetchItemDetails();
  }, [displayedItems]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/item?offset=0&limit=100000"
      );
      const data = await response.json();
      setAllItems(data.results);
      setTotalPages(Math.ceil(data.count / PAGE_SIZE));
    } catch (error) {
      setError("Failed to fetch items data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchItemDetails = async () => {
    const itemsToFetch = displayedItems.filter(
      (item) => !itemDetails[item.name]
    );

    for (const item of itemsToFetch) {
      try {
        const response = await fetch(item.url);
        const data: ItemDetails = await response.json();
        setItemDetails((prevDetails) => ({
          ...prevDetails,
          [item.name]: data,
        }));
      } catch (error) {
        console.error(`Failed to fetch details for ${item.name}`);
      }
    }
  };

  const updateDisplayedItems = () => {
    const filteredItems = allItems.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesAttribute = selectedAttribute
        ? itemDetails[item.name]?.attributes.some(
            (attrInfo) => attrInfo.attribute.name === selectedAttribute
          )
        : true;

      return matchesSearch && matchesAttribute;
    });

    setTotalPages(Math.ceil(filteredItems.length / PAGE_SIZE));

    const offset = currentPage * PAGE_SIZE;
    const paginatedItems = filteredItems.slice(offset, offset + PAGE_SIZE);
    setDisplayedItems(paginatedItems);
  };

  const handleSearch = (query: string) => {
    if (query !== "") {
      if (!isSearching) {
        setPreviousPage(currentPage);
        setCurrentPage(0); // Start search from page 1
      }
      setIsSearching(true);
    } else {
      setIsSearching(false);
      setCurrentPage(previousPage); // Return to previous page after clearing search
    }
    setSearchQuery(query);
  };

  const handleAttributeChange = (attribute: string | null) => {
    setSelectedAttribute(attribute);
    setCurrentPage(0); // Reset to page 1 when a new attribute is selected
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ItemDex bg-red-400 text-white flex flex-col min-h-screen p-4">
      <header className="bg-gray-700 text-white text-center text-xl p-4 rounded-full mb-4 flex justify-between items-center">
        <h1 className="text-2xl m-0">ItemDex</h1>
        <div className="flex items-center space-x-4">
          <AttributeDropdown
            selectedAttribute={selectedAttribute}
            onChange={handleAttributeChange}
          />
          <SearchBar searchQuery={searchQuery} setSearchQuery={handleSearch} />
        </div>
      </header>
      <div className="bg-white p-4 rounded-2xl flex-grow overflow-auto">
        <PaginationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(newPage) => setCurrentPage(newPage)}
        />
        {displayedItems.length === 0 ? (
          <div>No items found</div>
        ) : (
          <div className="item-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 p-5">
            {displayedItems.map((item) => (
              <div key={item.name} className="item-item flex justify-center">
                {itemDetails[item.name] ? (
                  <ItemCard item={item} details={itemDetails[item.name]} />
                ) : (
                  <div>Loading details...</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDex;
