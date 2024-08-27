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

function capitalizeWords(name: string): string {
  return name
    .split(/[\s-]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(name.includes("-") ? "-" : " ");
}

const ItemCard = ({ item, details }: Props) => {
  // Early return if details are undefined
  if (!details) return <div>Loading details...</div>;

  return (
    <div
      className="relative bg-gray-800 rounded-xl p-4 text-left w-[200px] h-[110px] overflow-hidden transition-transform transform hover:translate-y-[-10px]"
      style={{ backgroundColor: NORMAL_TYPE_COLOR }}
    >
      {details.sprites?.default ? (
        <img
          src={details.sprites.default}
          alt={item.name}
          className="absolute bottom-2 right-2 w-[70px] h-[70px] z-[1]"
        />
      ) : (
        <img src="/no-image.png" alt="No image available" />
      )}
      <h1 className="absolute top-0 left-2 text-[1.3em] text-gray-100 font-bold z-[1]">
        {capitalizeWords(item.name)}
      </h1>
      <h2 className="absolute top-0 right-2 text-sm text-white z-[1]">
        #{details.id?.toString().padStart(4, "0")}
      </h2>
      <h2 className="absolute bottom-2 left-2 z-[1]">
        <span className="px-2 py-1 text-[0.8em] text-white rounded-full border-2 border-white text-center whitespace-nowrap">
          {capitalizeWords(details.category.name)}
        </span>
      </h2>
      <div
        className="absolute bottom-[10%] left-[55%] w-[110px] h-[110px] bg-cover bg-no-repeat opacity-60 transform rotate-45 z-0"
        style={{ backgroundImage: "url('/src/assets/pokeball-logo.png')" }}
      />
    </div>
  );
};

export default ItemCard;
