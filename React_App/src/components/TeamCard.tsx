// components/TeamCard.tsx
import React from "react";
import PokemonCard from "./PokemonCard";
import DeleteTeamButton from "./DeleteTeamButton";

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
  onTeamDeleted: () => void; // Callback function to refresh the team list after deletion
}

const TeamCard: React.FC<TeamCardProps> = ({
  teamId,
  pokemonList,
  pokemonDetails,
  onTeamDeleted,
}) => {
  return (
    <div className="team-container bg-gray-400 p-4 mb-4 rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="team-id text-white text-2xl font-bold">{teamId}</h2>
        <DeleteTeamButton teamId={teamId} onDelete={onTeamDeleted} />
      </div>
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
