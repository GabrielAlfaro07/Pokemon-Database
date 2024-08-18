import { useState } from "react";

type Props = {
  data: string[];
  onSelect?: (elemento: string) => void;
};

function List({ data, onSelect }: Props) {
  const [index, setIndex] = useState(1);
  const handleClick = (i: number, elemento: string) => {
    setIndex(i);
    onSelect?.(elemento);
  };
  return (
    <div>
      <ul className="list-group">
        {data.map((elemento, i) => (
          <li
            onClick={() => handleClick(i, elemento)}
            key={elemento}
            className={`list-group-item ${index == i ? "active" : ""}`}
          >
            {elemento}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
