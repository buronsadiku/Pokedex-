import React from "react";
import { POKEMON_TYPES } from '../constants/pokemonTypes';

/**
 * REFACTORED: TypesBar
 * 
 * CHANGES MADE:
 * 1. Removed local pokemonTypes array (was 20 lines)
 * 2. Import POKEMON_TYPES from centralized constants
 * 3. Removed unused useState import
 * 
 * WHY THIS IS BETTER:
 * - DRY: Types defined once, used everywhere
 * - Consistency: Same colors across app
 * - Maintainability: Add new type once, updates everywhere
 */

export default function TypesBar({ selectedType, onTypeChange }) {

    const handleTypeClick = (typeName) => {
        if (onTypeChange) {
            onTypeChange(typeName);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-6">
            <div className="flex flex-wrap justify-center gap-2">
                {POKEMON_TYPES.map((type) => (
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