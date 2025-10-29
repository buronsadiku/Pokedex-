import React, { useState } from "react";

export default function TypesBar({ selectedType, onTypeChange }) {
    const pokemonTypes = [
        { name: 'all', label: 'All Types', color: 'bg-gray-600' },
        { name: 'normal', label: 'Normal', color: 'bg-gray-500' },
        { name: 'fire', label: 'Fire', color: 'bg-red-500' },
        { name: 'water', label: 'Water', color: 'bg-blue-500' },
        { name: 'electric', label: 'Electric', color: 'bg-yellow-500' },
        { name: 'grass', label: 'Grass', color: 'bg-green-500' },
        { name: 'ice', label: 'Ice', color: 'bg-cyan-400' },
        { name: 'fighting', label: 'Fighting', color: 'bg-red-600' },
        { name: 'poison', label: 'Poison', color: 'bg-purple-600' },
        { name: 'ground', label: 'Ground', color: 'bg-yellow-600' },
        { name: 'flying', label: 'Flying', color: 'bg-indigo-400' },
        { name: 'psychic', label: 'Psychic', color: 'bg-pink-500' },
        { name: 'bug', label: 'Bug', color: 'bg-lime-500' },
        { name: 'rock', label: 'Rock', color: 'bg-yellow-700' },
        { name: 'ghost', label: 'Ghost', color: 'bg-purple-700' },
        { name: 'dragon', label: 'Dragon', color: 'bg-indigo-600' },
        { name: 'dark', label: 'Dark', color: 'bg-gray-800' },
        { name: 'steel', label: 'Steel', color: 'bg-gray-400' },
        { name: 'fairy', label: 'Fairy', color: 'bg-pink-400' }
    ];

    const handleTypeClick = (typeName) => {
        if (onTypeChange) {
            onTypeChange(typeName);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="flex flex-wrap justify-center gap-2">
                {pokemonTypes.map((type) => (
                    <button
                        key={type.name}
                        onClick={() => handleTypeClick(type.name)}
                        className={`px-4 py-2 rounded-full text-sm font-medium text-white transition-all duration-200 hover:opacity-80 ${
                            selectedType === type.name 
                                ? 'ring-2 ring-white ring-offset-2 transform scale-105' 
                                : 'hover:scale-105'
                        } ${type.color}`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>
        </div>
    );
}