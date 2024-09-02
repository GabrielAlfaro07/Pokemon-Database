interface TypeDropdownProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
}

const types = [
  "Normal",
  "Fire",
  "Water",
  "Electric",
  "Grass",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
];

const TypeDropdown = ({ selectedType, onChange }: TypeDropdownProps) => {
  return (
    <select
      className="bg-white text-gray-800 text-base rounded-full px-3 py-2 shadow-lg"
      value={selectedType || ""}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">All Types</option>
      {types.map((type) => (
        <option key={type} value={type.toLowerCase()}>
          {type}
        </option>
      ))}
    </select>
  );
};

export default TypeDropdown;
