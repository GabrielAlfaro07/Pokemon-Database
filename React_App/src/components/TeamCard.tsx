// components/TeamCard.tsx
import React from "react";
import PokemonCard from "./PokemonCard";

interface PokemonDetails {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    type: {
      name: string;
      url: string;
    };
  }[];
}

interface TeamCardProps {
  teamId: string;
  pokemonList: {
    id: string;
    pokemonId: string;
  }[];
  pokemonDetails: { [pokemonId: string]: PokemonDetails };
}

const TeamCard: React.FC<TeamCardProps> = ({
  teamId,
  pokemonList,
  pokemonDetails,
}) => {
  return (
    <div className="team-container bg-gray-300 p-4 mb-4 rounded-2xl">
      <h2 className="team-id text-white text-2xl font-bold mb-4">{teamId}</h2>
      <div className="pokemon-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {pokemonList.map(({ pokemonId }) => {
          const pokemon = pokemonDetails[pokemonId];
          return pokemon ? (
            <div key={pokemonId} className="pokemon-item flex justify-center">
              <PokemonCard
                pokemon={{
                  name: pokemon.name,
                  url: `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
                }}
                details={pokemon}
              />
            </div>
          ) : (
            <div
              key={pokemonId}
              className="pokemon-card bg-gray-200 p-4 rounded-lg"
            >
              <p>Loading Pokémon details...</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamCard;
