import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import missingIMG from "./assets/missingno.png";
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
    category: ItemCategory;
    cost: number;
    //array of flavor_text_entries
    flavor_text_entries: Array<{
        text: string,
        language: {
            name: string
        }
    }>
    effect_entries: Array<{
        effect: string,
    }>
}
function getTypeColor(type: string): string {
    const typeColorMap: { [key: string]: string } = {
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
    return typeColorMap[type.toLowerCase()] || "#BDC3C7";
  }
  
  function darkenColor(color: string): string {
    const typeDarkColorMap: { [key: string]: string } = {
        "all-mail": "#FF69B4",
        "all-machines": "#FF69B4",
        "apricorn-balls": "#FF69B4",
        "apricorn-box": "#FF69B4",
        "bad-held-items": "#FF69B4",
        "baking-only": "#FF69B4",
        "catching-bonus": "#FF69B4",
        choice: "#FF69B4",
        collectibles: "#FF69B4",
        "curry-ingredients": "#FF69B4",
        "data-cards": "#FF69B4",
        "dex-completion": "#FF69B4",
        "dynamax-crystals": "#FF69B4",
        evolution: "#FF69B4",
        "event-items": "#FF69B4",
        "effort-drop": "#FF69B4",
        "effort-training": "#FF69B4",
        flutes: "#FF69B4",
        gameplay: "#FF69B4",
        healing: "#FF69B4",
        "held-items": "#FF69B4",
        "in-a-pinch": "#FF69B4",
        jewel: "#FF69B4",
        "miracle-shooter": "#FF69B4",
        "mega-stones": "#FF69B4",
        memories: "#FF69B4",
        mulch: "#FF69B4",
        "nature-mints": "#FF69B4",
        "picky-healing": "#FF69B4",
        picnics: "#FF69B4",
        plates: "#FF69B4",
        "plot-advancement": "#FF69B4",
        revival: "#FF69B4",
        "sandwiche-ingredients": "#FF69B4",
        scarves: "#FF69B4",
        "special-balls": "#FF69B4",
        spelunking: "#FF69B4",
        "species-candies": "#FF69B4",
        "species-specific": "#FF69B4",
        "status-cures": "#FF69B4",
        "standard-balls": "#FF69B4",
        "stat-boosts": "#FF69B4",
        "tera-shard": "#FF69B4",
        training: "#FF69B4",
        "type-enhancement": "#FF69B4",
        "type-protection": "#FF69B4",
        unused: "#FF69B4",
        vitamins: "#FF69B4",
        "z-crystals": "#FF69B4",
    };
    return (
      Object.values(typeDarkColorMap).find(
        (darkColor, index) => Object.values(getTypeColor)[index] === color
      ) || "#34495e"
    );
  }
  const ItemDetailsPage = () => {
    const { name } = useParams<{ name: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const [item, setItem] = useState<Item | null>(null);
    const [details, setDetails] = useState<ItemDetails | undefined>(undefined);
    const [loaded, setLoaded] = useState(false); // Control de carga de imagen
    const [selectedSection, setSelectedSection] = useState("about");
  
    useEffect(() => {
      if (location.state) {
        const { item, details } = location.state as { item: Item; details: ItemDetails };
        setItem(item);
        setDetails(details);
      }
    }, [location.state, name, navigate]);
  
    if (!item || !details) {
      return <div>Loading item details...</div>;
    }
  
    console.log(details);
  
    // Verificar si effect_entries está definido y no está vacío
    const effectText = details.effect_entries && details.effect_entries.length > 0 
      ? details.effect_entries[0].effect 
      : "";
  
    const colorback = getTypeColor(details.category.name);
    let idtxt = details.id.toString();
    for (let i = idtxt.length; i < 4; i++) {
      idtxt = "0" + idtxt;
    }
  
    // Buscar flavor_text_entries que esté en inglés
    let flavor_text: any;
    for (let i = 0; i < details.flavor_text_entries.length; i++) {
      if (details.flavor_text_entries[i].language.name === "en") {
        flavor_text = details.flavor_text_entries[i].text;
        break;
      }
    }
  
    const renderContent = () => {
      switch (selectedSection) {
        case "about":
          return (
            <div className="justify-center items-center flex flex-col space-y-4">
              <p>Item ID: #{idtxt}</p>
              <p>Cost: {details.cost}₽</p>
              <h2>{flavor_text}</h2>
              <h2>{effectText}</h2> {/* Usar la variable segura effectText */}
            </div>
          );
      }
    };
  
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-b from-white to-gray-100 relative">
        <div className="flex justify-between items-center w-full px-4 py-6 bg-white shadow-lg">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          <div className="flex items-center space-x-4">
            <button
              className="px-2 py-1 bg-black rounded-lg"
              onClick={() => window.history.back()}
            >
              <p className="text-sm font-bold text-white">Back</p>
            </button>
          </div>
        </div>
        <div
          className="w-full h-auto flex justify-center items-center relative"
          style={{
            background: `radial-gradient(circle, ${darkenColor(colorback)} 0%, ${colorback} 100%)`,
          }}
        >
          <img
            src={details.sprites.default || missingIMG}
            alt={item.name}
            className={`w-full max-w-[200px] transition-opacity duration-1000 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
          />
        </div>
        <div className="flex w-full justify-center items-center bg-white p-2 rounded-b-lg shadow-md">
          <div className="flex space-x-4">
            <button
              className="px-2 py-1 rounded-lg text-sm font-bold text-white"
              style={{ background: getTypeColor(details.category.name) }}
              onClick={() => setSelectedSection("about")}
            >
              <p className="text-sm font-bold">About</p>
            </button>
          </div>
        </div>
        <div className="mt-4 p-6 w-full max-w-lg bg-white text-black p-4 rounded-lg shadow-lg">
          {renderContent()}
        </div>
      </div>
    );
  };

export default ItemDetailsPage;
