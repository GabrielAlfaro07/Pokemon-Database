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
  if (!details) return <div>Loading details...</div>;

  const { sprites, attributes, id } = details;

  return (
    <div
      className="relative bg-gray-800 rounded-xl p-4 text-left w-[200px] h-[110px] overflow-hidden transition-transform transform hover:translate-y-[-10px]"
      style={{ backgroundColor: NORMAL_TYPE_COLOR }}
    >
      <img
        src={sprites.default || "/no-image.png"}
        alt={item.name}
        className="absolute bottom-0 right-0 max-w-[100px] z-[1]"
      />
      <h1 className="absolute top-0 left-2 text-[1.3em] text-gray-100 font-bold z-[1]">
        {capitalizeWords(item.name)}
      </h1>
      <h2 className="absolute top-0 right-2 text-sm text-white z-[1]">
        #{id.toString().padStart(4, "0")}
      </h2>
      <h2 className="absolute bottom-2 left-2 flex flex-col gap-1 z-[1]">
        {attributes.map((attrInfo) => (
          <span
            key={attrInfo.attribute.name}
            className="px-2 py-1 text-[0.8em] text-white rounded-full border-2 border-white text-center whitespace-nowrap"
          >
            {capitalizeWords(attrInfo.attribute.name)}
          </span>
        ))}
      </h2>
      <div
        className="absolute bottom-[10%] left-[55%] w-[110px] h-[110px] bg-cover bg-no-repeat opacity-60 transform rotate-45 z-0"
        style={{ backgroundImage: "url('/src/assets/pokeball-logo.png')" }}
      />
    </div>
  );
};

export default ItemCard;
