/**
 * POKEMON TYPE CONSTANTS
 * 
 * WHY THIS FILE EXISTS:
 * Currently, type colors are defined in BOTH PokemonCard.jsx and PokemonDetails.jsx.
 * This violates the DRY (Don't Repeat Yourself) principle.
 * 
 * BENEFITS OF CENTRALIZING:
 * 1. Single Source of Truth - Change a color once, updates everywhere
 * 2. Consistency - All components use exact same colors
 * 3. Maintainability - Adding new types? Do it in one place
 * 4. Testability - Can test color logic without React components
 * 
 * SENIOR DEV TIP:
 * Constants should live outside components. If 2+ files need the same data,
 * extract it to a shared location. This is a fundamental refactoring pattern.
 */

// Pokemon type colors for backgrounds (Tailwind classes)
export const TYPE_COLORS = {
  normal: 'bg-gray-500',
  fire: 'bg-red-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-500',
  grass: 'bg-green-500',
  ice: 'bg-cyan-400',
  fighting: 'bg-red-600',
  poison: 'bg-purple-600',
  ground: 'bg-yellow-600',
  flying: 'bg-indigo-400',
  psychic: 'bg-purple-500',
  bug: 'bg-lime-500',
  rock: 'bg-yellow-700',
  ghost: 'bg-purple-700',
  dragon: 'bg-indigo-600',
  dark: 'bg-gray-800',
  steel: 'bg-gray-400',
  fairy: 'bg-pink-400',
};

// Pokemon type colors for box shadows (hex values with transparency)
export const TYPE_SHADOW_COLORS = {
  normal: '#9CA3AF',
  fire: '#F87171',
  water: '#60A5FA',
  electric: '#FACC15',
  grass: '#4ADE80',
  ice: '#22D3EE',
  fighting: '#DC2626',
  poison: '#9333EA',
  ground: '#CA8A04',
  flying: '#818CF8',
  psychic: '#A78BFA',
  bug: '#84CC16',
  rock: '#B45309',
  ghost: '#6B21A8',
  dragon: '#4338CA',
  dark: '#1F2937',
  steel: '#9CA3AF',
  fairy: '#F472B6',
};

// Pokemon types with labels for UI display (used in TypesBar)
export const POKEMON_TYPES = [
  { name: 'all', label: 'All Types', color: 'bg-gray-600' },
  { name: 'normal', label: 'Normal', color: TYPE_COLORS.normal },
  { name: 'fire', label: 'Fire', color: TYPE_COLORS.fire },
  { name: 'water', label: 'Water', color: TYPE_COLORS.water },
  { name: 'electric', label: 'Electric', color: TYPE_COLORS.electric },
  { name: 'grass', label: 'Grass', color: TYPE_COLORS.grass },
  { name: 'ice', label: 'Ice', color: TYPE_COLORS.ice },
  { name: 'fighting', label: 'Fighting', color: TYPE_COLORS.fighting },
  { name: 'poison', label: 'Poison', color: TYPE_COLORS.poison },
  { name: 'ground', label: 'Ground', color: TYPE_COLORS.ground },
  { name: 'flying', label: 'Flying', color: TYPE_COLORS.flying },
  { name: 'psychic', label: 'Psychic', color: TYPE_COLORS.psychic },
  { name: 'bug', label: 'Bug', color: TYPE_COLORS.bug },
  { name: 'rock', label: 'Rock', color: TYPE_COLORS.rock },
  { name: 'ghost', label: 'Ghost', color: TYPE_COLORS.ghost },
  { name: 'dragon', label: 'Dragon', color: TYPE_COLORS.dragon },
  { name: 'dark', label: 'Dark', color: TYPE_COLORS.dark },
  { name: 'steel', label: 'Steel', color: TYPE_COLORS.steel },
  { name: 'fairy', label: 'Fairy', color: TYPE_COLORS.fairy },
];

/**
 * UTILITY FUNCTIONS
 * Helper functions to get type colors safely with fallbacks
 */

/**
 * Get Tailwind background color class for a Pokemon type
 * @param {string} typeName - The Pokemon type name (e.g., 'fire', 'water')
 * @returns {string} - Tailwind CSS class (e.g., 'bg-red-500')
 * 
 * WHY THIS FUNCTION:
 * - Provides a safe way to get colors with fallback
 * - Prevents undefined errors if new types are added to API
 * - Makes code more readable: getTypeColor('fire') vs TYPE_COLORS['fire'] || 'bg-gray-500'
 */
export const getTypeColor = (typeName) => {
  return TYPE_COLORS[typeName] || TYPE_COLORS.normal;
};

/**
 * Get hex shadow color for a Pokemon type
 * @param {string} typeName - The Pokemon type name
 * @returns {string} - Hex color code
 */
export const getTypeShadowColor = (typeName) => {
  return TYPE_SHADOW_COLORS[typeName] || TYPE_SHADOW_COLORS.normal;
};

/**
 * Get all type names as an array
 * @returns {string[]} - Array of type names
 * 
 * USEFUL FOR:
 * - Validating type filters
 * - Building dynamic UI elements
 * - Testing
 */
export const getAllTypeNames = () => {
  return Object.keys(TYPE_COLORS);
};

