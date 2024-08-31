function getTypeColor(type: string): string {
    const typeColorMap: { [key: string]: string } = {
      fire: "#F5A75A",
      water: "#7EB2F0",
      grass: "#9AD8A5",
      electric: "#F9E4A3",
      ice: "#B2E2E2",
      fighting: "#D76B6B",
      poison: "#B57BCE",
      ground: "#F2D7A0",
      flying: "#C1A3F0",
      psychic: "#F9A4A9",
      bug: "#C2D76B",
      rock: "#D4B48F",
      ghost: "#9E9AC7",
      dragon: "#9A6CF8",
      dark: "#9E8C6E",
      steel: "#D3D3E1",
      fairy: "#F4BCC6",
      normal: "#B5B5A0",
    };
    return typeColorMap[type.toLowerCase()] || "#BDC3C7";
  }
  
  function darkenColor(color: string): string {
    const typeDarkColorMap: { [key: string]: string } = {
      fire: "#F03000",
      water: "#3860E0",
      grass: "#48A830",
      electric: "#D8B000",
      ice: "#78C0C0",
      fighting: "#A00000",
      poison: "#802080",
      ground: "#C0A848",
      flying: "#7050C0",
      psychic: "#D80060",
      bug: "#A89820",
      rock: "#A88800",
      ghost: "#504068",
      dragon: "#5020D0",
      dark: "#503830",
      steel: "#9090A0",
      fairy: "#C06080",
      normal: "#A0A878",
    };
    return Object.values(typeDarkColorMap).find(
      (darkColor, index) => Object.values(getTypeColor)[index] === color
    ) || "#34495e";
  }

    export { getTypeColor, darkenColor };