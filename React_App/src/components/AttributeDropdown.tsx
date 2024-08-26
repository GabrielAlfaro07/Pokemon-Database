interface AttributeDropdownProps {
  selectedAttribute: string | null;
  onChange: (attribute: string | null) => void;
}

const attributes = [
  "Countable",
  "Consumable",
  "Usable-overworld",
  "Usable-in-battle",
  "Holdable",
  "Holdable-passive",
  "Holdable-active",
  "Underground",
];

const AttributeDropdown = ({
  selectedAttribute,
  onChange,
}: AttributeDropdownProps) => {
  return (
    <select
      className="bg-white text-gray-800 text-base rounded-full px-3 py-2"
      value={selectedAttribute || ""}
      onChange={(e) => onChange(e.target.value || null)}
    >
      <option value="">All Attributes</option>
      {attributes.map((attribute) => (
        <option key={attribute} value={attribute.toLowerCase()}>
          {attribute}
        </option>
      ))}
    </select>
  );
};

export default AttributeDropdown;
