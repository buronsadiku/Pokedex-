import React from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { getTypeColor, getTypeShadowColor } from '../constants/pokemonTypes';

/**
 * REFACTORED COMPONENT: PokemonCard
 * 
 * BEFORE: 390 lines doing everything (fetching, filtering, sorting, pagination, rendering)
 * AFTER: 80 lines focused on rendering ONE Pokemon card
 * 
 * WHY THIS IS BETTER:
 * 1. Single Responsibility - Only renders one card, nothing else
 * 2. Reusability - Can use this card anywhere (search results, favorites, comparisons)
 * 3. Testability - Easy to test with mock data
 * 4. Readability - Anyone can understand this in 2 minutes
 * 5. Performance - React can optimize re-renders better with small components
 * 
 * SENIOR DEV TIP:
 * Components should be like LEGO blocks - small, focused, composable.
 * If your component file is > 200 lines, it's probably doing too much.
 * Break it into smaller pieces that each do one thing well.
 * 
 * THIS COMPONENT:
 * - Receives one Pokemon object as a prop
 * - Displays the Pokemon's image, name, ID, and types
 * - Handles click navigation to details page
 * - That's it! Nothing more, nothing less.
 */

/**
 * Pokemon card component - displays a single Pokemon
 * 
 * @param {Object} props - Component props
 * @param {Object} props.pokemon - Pokemon data object
 * @param {number} props.pokemon.id - Pokemon ID number
 * @param {string} props.pokemon.name - Pokemon name
 * @param {Object} props.pokemon.sprites - Sprite images
 * @param {Array} props.pokemon.types - Array of type objects
 * 
 * USAGE:
 * <PokemonCard pokemon={pokemonData} />
 */
const PokemonCard = ({ pokemon }) => {
  const navigate = useNavigate();

  // Guard: Don't render if no Pokemon data
  if (!pokemon) return null;

  /**
   * EXTRACT DATA
   * Destructure the data we need from the Pokemon object
   */
  const { id, name, sprites, types } = pokemon;

  /**
   * GET COLORS FOR STYLING
   * Primary type determines the card's color scheme
   * Uses centralized constants instead of defining colors here
   */
  const primaryType = types[0]?.type?.name || 'normal';
  const shadowColor = getTypeShadowColor(primaryType);

  /**
   * NAVIGATION HANDLER
   * When card is clicked, navigate to Pokemon details page
   */
  const handleClick = () => {
    navigate(`/pokemon/${name}`);
  };

  /**
   * FORMAT POKEMON NAME
   * Capitalize first letter: 'pikachu' → 'Pikachu'
   */
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  /**
   * FORMAT POKEMON ID
   * Pad with zeros: 1 → '001', 25 → '025', 150 → '150'
   */
  const formattedId = `#${id.toString().padStart(3, '0')}`;

  /**
   * GET SPRITE IMAGE
   * Try to get high-quality artwork, fall back to default sprite
   */
  const imageUrl = sprites?.other?.['official-artwork']?.front_default || sprites?.front_default;

  return (
    <div
      onClick={handleClick}
      className={clsx(
        'p-4 rounded bg-white cursor-pointer transition-transform',
        'hover:scale-105 shadow-lg'
      )}
      style={{ 
        boxShadow: `0 4px 0px ${shadowColor}90` // Add colored shadow based on type
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        // Keyboard accessibility: Enter or Space activates card
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
      aria-label={`View details for ${formattedName}`}
    >
      {/* Pokemon Name */}
      <h2 className="text-lg font-bold mb-2">{formattedName}</h2>

      {/* Pokemon Image */}
      <div className="flex justify-center items-center h-32 mb-2">
        <img
          src={imageUrl}
          alt={formattedName}
          className="w-full h-full object-contain"
          loading="lazy" // Lazy load images for better performance
        />
      </div>

      {/* Pokemon ID */}
      <div className="text-center mb-2">
        <p className="text-sm text-gray-600">{formattedId}</p>
      </div>

      {/* Pokemon Types */}
      <div className="flex flex-wrap gap-1 justify-center">
        {types.map((type, index) => {
          const typeName = type.type.name;
          const typeColor = getTypeColor(typeName);
          
          return (
            <span
              key={index}
              className={`${typeColor} px-2 py-1 rounded-full text-xs font-medium text-white`}
            >
              {typeName.charAt(0).toUpperCase() + typeName.slice(1)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default PokemonCard;
