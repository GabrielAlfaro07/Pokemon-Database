import React, { useEffect, useState } from 'react';
import './Api.css';

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

function Api() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon/?offset=900&limit=1000') // Limite para 30 Pokémon (3 columnas x 10 filas)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setPokemonList(data.results))
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return ( 
    <div className="Api">
      <header>Pokedex</header>
      <div className="pokemon-grid">
        {pokemonList.map((pokemon, index) => (
          <div key={index} className="pokemon-item">
            <Show_Pokemon pokemon={pokemon} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Show_Pokemon({ pokemon }: { pokemon: Pokemon }) {
  const [infPokemon, setInfPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(pokemon.url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setInfPokemon(data))
      .catch(error => setError(error.message))
      .finally(() => setLoading(false));
  }, [pokemon.url]);

  if (loading) return <div>Loading details...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="pokemon-card">
      {infPokemon?.sprites.front_default ? (
        <img src={infPokemon.sprites.front_default} alt={infPokemon.name} />
      ) : (
        <img src="/no-image.png" alt="No image available" />
      )}
      <h2>{infPokemon?.name}</h2>
      <h3>ID: {infPokemon?.id}</h3>
    </div>
  );
}

export default Api;

