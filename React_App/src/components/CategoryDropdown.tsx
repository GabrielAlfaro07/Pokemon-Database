interface CategoryDropdownProps {
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
}

const categories = [
  "All-Mail",
  "All-Machines",
  "Apricorn-Balls",
  "Apricorn-Box",
  "Bad-Held-Items",
  "Baking-Only",
  "Catching-Bonus",
  "Choice",
  "Collectibles",
  "Curry-Ingredients",
  "Data-Cards",
  "Dex-Completion",
  "Dynamax-Crystals",
  "Evolution",
  "Event-Items",
  "Effort-Drop",
  "Effort-Training",
  "Flutes",
  "Gameplay",
  "Healing",
  "Held-Items",
  "In-A-Pinch",
  "Jewel",
  "Miracle-Shooter",
  "Mega-Stones",
  "Memories",
  "Mulch",
  "Nature-Mints",
  "Picky-Healing",
  "Picnics",
  "Plates",
  "Plot-Advancement",
  "Revival",
  "Sandwiche-Ingredients",
  "Scarves",
  "Special-Balls",
  "Spelunking",
  "Species-Candies",
  "Species-Specific",
  "Status-Cures",
  "Standard-Balls",
  "Stat-Boosts",
  "Tera-Shard",
  "Training",
  "Type-Enhancement",
  "Type-Protection",
  "Unused",
  "Vitamins",
  "Z-Crystals",
];

const CategoryDropdown = ({
  selectedCategory,
  onChange,
}: CategoryDropdownProps) => {
  return (
    <select
      className="bg-white text-gray-800 text-base rounded-full px-3 py-2"
      value={selectedCategory || ""}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">All categories</option>
      {categories.map((category) => (
        <option key={category} value={category.toLowerCase()}>
          {category}
        </option>
      ))}
    </select>
  );
};

export default CategoryDropdown;
