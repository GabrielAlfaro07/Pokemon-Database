function Title() {
  // Código JSX -> React.createElement
  const nombre = "Gabriel";
  if (nombre) {
    return <h1>Hola {nombre}</h1>;
  }
  return <h1>Hola Mundo</h1>;
}

export default Title;
