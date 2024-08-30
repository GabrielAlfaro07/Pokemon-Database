import React from "react";
import PokemonCard from "./PokemonCard";

interface TeamCardProps {
  team: {
    id: string;
    pokemon: { id: string; pokemonId: string }[];
  };
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  return (
    <div className="TeamCard bg-gray-200 p-4 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Team {team.id}</h2>
      <div className="pokemon-grid grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {team.pokemon.map((pokemon, index) => (
          <PokemonCard key={index} pokemon={{ id: pokemon.pokemonId }} />
        ))}
      </div>
    </div>
  );
};

export default TeamCard;
