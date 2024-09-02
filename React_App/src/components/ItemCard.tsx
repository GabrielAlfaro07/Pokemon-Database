import { useNavigate } from "react-router-dom";
interface Item {
  name: string;
  url: string;
}

interface ItemCategory {
  category: {
    name: string;
    url: string;
  };
}

interface ItemDetails {
  id: number;
  sprites: {
    default: string;
  };
  category: ItemCategory; // Updated to include category
}

type Props = {
  item: Item;
  details: ItemDetails | undefined;
};

const NORMAL_TYPE_COLOR = "#A8A878";

// Define category colors
const categoryColorMap: { [key: string]: string } = {
  "all-mail": "#FFB6C1",
  "all-machines": "#FFC0CB",
  "apricorn-balls": "#FF69B4",
  "apricorn-box": "#FF1493",
  "bad-held-items": "#FF4500",
  "baking-only": "#FFD700",
  "catching-bonus": "#FF8C00",
  choice: "#FF6347",
  collectibles: "#FF4500",
  "curry-ingredients": "#F08080",
  "data-cards": "#F5DEB3",
  "dex-completion": "#D2B48C",
  "dynamax-crystals": "#DAA520",
  evolution: "#B8860B",
  "event-items": "#FFA07A",
  "effort-drop": "#FF6347",
  "effort-training": "#FF7F50",
  flutes: "#FFD700",
  gameplay: "#8B4513", // Changed from #F5F5DC
  healing: "#90EE90",
  "held-items": "#98FB98",
  "in-a-pinch": "#00FA9A",
  jewel: "#FF1493",
  "miracle-shooter": "#D8BFD8",
  "mega-stones": "#D3D3D3",
  memories: "#B8860B", // Changed from #F0E68C
  mulch: "#B0C4DE",
  "nature-mints": "#32CD32",
  "picky-healing": "#2E8B57",
  picnics: "#20B2AA",
  plates: "#DAA520",
  "plot-advancement": "#B0E0E6",
  revival: "#A9A9A9",
  "sandwiche-ingredients": "#F4A460",
  scarves: "#D8BFD8",
  "special-balls": "#FF00FF",
  spelunking: "#8A2BE2",
  "species-candies": "#BA55D3",
  "species-specific": "#6A5ACD",
  "status-cures": "#87CEEB",
  "standard-balls": "#FF4500",
  "stat-boosts": "#CD5C5C",
  "tera-shard": "#B0E57C",
  training: "#20B2AA",
  "type-enhancement": "#00FA9A",
  "type-protection": "#48D1CC",
  unused: "#A9A9A9",
  vitamins: "#00FF00",
  "z-crystals": "#DAA520",
};

function getCategoryColor(category: string): string {
  return categoryColorMap[category] || NORMAL_TYPE_COLOR;
}

function capitalizeWords(name: string): string {
  return name
    .split(/[\s-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(name.includes("-") ? "-" : " ");
}

const ItemCard = ({ item, details }: Props) => {
  const navigate = useNavigate();
  const handleItemClick = () => {
    //enviar los props a la ruta /item/:name
    if (details) {
      navigate(`/item/${item.name}`, { state: { item, details } });
    } else {
      console.error("Details are not available for the selected item.");
    }
  };
  if (!details) {
    return <div>Loading details...</div>;
  }
  const categoryColor = getCategoryColor(details.category.name);

  return (
    <div
      onClick={() => handleItemClick()}
      className="relative bg-gray-800 rounded-xl p-4 text-left w-[200px] h-[110px] overflow-hidden transition-transform transform hover:translate-y-[-10px]"
      style={{ backgroundColor: categoryColor }}
    >
      {details.sprites?.default ? (
        <img
          src={details.sprites.default}
          alt={item.name}
          className="absolute bottom-2 right-2 w-[70px] h-[70px] z-[1]"
        />
      ) : (
        <img
          src="/src/assets/missingno.png"
          alt="No image available"
          className="absolute bottom-4 right-4 opacity-70 w-[60px] h-[60px] z-[1]"
        />
      )}
      <h1 className="absolute top-0 left-2 text-[1.3em] text-gray-100 font-bold z-[1]">
        {capitalizeWords(item.name)}
      </h1>
      <h2 className="absolute top-0 right-2 text-sm text-white z-[1]">
        #{details.id?.toString().padStart(4, "0")}
      </h2>
      <h2 className="absolute bottom-2 left-2 z-[1]">
        <span
          className="px-2 py-1 text-[0.8em] text-white rounded-full border-2 border-white text-center whitespace-nowrap"
          style={{ backgroundColor: categoryColor }}
        >
          {capitalizeWords(details.category.name)}
        </span>
      </h2>
      <div
        className="absolute bottom-[0%] left-[50%] w-[130px] h-[130px] bg-cover bg-no-repeat opacity-60 transform z-0"
        style={{ backgroundImage: "url('/src/assets/item-logo.png')" }}
      />
    </div>
  );
};

export default ItemCard;
