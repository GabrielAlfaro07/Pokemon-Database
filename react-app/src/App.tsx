import Card, { CardBody } from "./components/Card";
import List from "./components/List";
import Button from "./components/Button";
import { useState } from "react";

function App() {
  const [data, setData] = useState(["Goku", "Tanjiro", "Eren"]);
  // const [isLoading, setIsLoading] = useState(false);
  // const handleClick = () => setIsLoading(!isLoading);

  // const list: string[] = ["Goku", "Tanjiro", "Eren"];
  // const handleSelect = (elemento: string) => {
  //   console.log("Imprimiendo", elemento);
  // };

  // return (
  //   <Card>
  //     <CardBody title="Hola Mundo" text="Este es el texto" />
  //     {list.length !== 0 && <List data={list} onSelect={handleSelect} />}
  //     <Button isLoading={isLoading} onClick={handleClick}>
  //       Hola Mundo
  //     </Button>
  //   </Card>
  // );
  const addMinion = () => setData([...data, "Minion"]);
  const delMinion = () => setData(data.slice(0, -1));

  return (
    <Card>
      <Button onClick={addMinion}>Agregar</Button>
      <Button onClick={delMinion}>Eliminar</Button>
      <List data={data}></List>
    </Card>
  );
}

export default App;
