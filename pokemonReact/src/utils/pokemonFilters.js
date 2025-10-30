/**
 * POKEMON FILTERING AND SORTING UTILITIES
 * 
 * WHY THIS FILE EXISTS:
 * These are PURE FUNCTIONS - they take input and return output without side effects.
 * They don't depend on React, don't use state, don't modify anything.
 * 
 * BENEFITS OF EXTRACTING BUSINESS LOGIC:
 * 1. Testability - Can test without mounting React components
 * 2. Reusability - Use same logic in different components or even different projects
 * 3. Readability - Function names document what the code does
 * 4. Maintainability - Logic lives in one place, not scattered across components
 * 
 * SENIOR DEV TIP:
 * Always separate "what to do" (business logic) from "how to display it" (UI).
 * Business logic should be pure functions that work anywhere.
 * This is a key principle in Clean Architecture and Functional Programming.
 */

/**
 * Filter Pokemon by name (searches from the start of the name)
 * 
 * @param {Object} pokemon - Pokemon data object
 * @param {string} searchTerm - The search term to filter by
 * @returns {boolean} - True if Pokemon name matches search term
 * 
 * EXAMPLE:
 * filterByName({ name: 'pikachu' }, 'pik') // true
 * filterByName({ name: 'pikachu' }, 'chu') // false (doesn't start with 'chu')
 * filterByName({ name: 'pikachu' }, '') // true (empty search matches all)
 */
export const filterByName = (pokemon, searchTerm) => {
  if (!searchTerm) return true; // No search term = show all
  if (!pokemon || !pokemon.name) return false;
  
  const pokemonName = pokemon.name.toLowerCase();
  const searchLower = searchTerm.toLowerCase();
  
  return pokemonName.startsWith(searchLower);
};

/**
 * Filter Pokemon by type
 * 
 * @param {Object} pokemon - Pokemon data object with types array
 * @param {string} selectedType - The type to filter by (or 'all' for no filter)
 * @returns {boolean} - True if Pokemon has the selected type
 * 
 * EXAMPLE:
 * const pikachu = { types: [{ type: { name: 'electric' } }] };
 * filterByType(pikachu, 'electric') // true
 * filterByType(pikachu, 'water') // false
 * filterByType(pikachu, 'all') // true (shows all types)
 */
export const filterByType = (pokemon, selectedType) => {
  if (!selectedType || selectedType === 'all') return true; // Show all types
  if (!pokemon || !pokemon.types) return false;
  
  return pokemon.types.some(type => type.type.name === selectedType);
};

/**
 * Combined filter function that checks both name and type
 * 
 * @param {Object} pokemon - Pokemon data object
 * @param {string} searchTerm - Search term for name filtering
 * @param {string} selectedType - Type for type filtering
 * @returns {boolean} - True if Pokemon matches both filters
 * 
 * WHY COMBINE:
 * Makes it easy to apply multiple filters at once.
 * Component just calls one function instead of managing multiple filter checks.
 */
export const filterPokemon = (pokemon, searchTerm = '', selectedType = 'all') => {
  return filterByName(pokemon, searchTerm) && filterByType(pokemon, selectedType);
};

/**
 * Sort Pokemon by ID (Pokedex number)
 * 
 * @param {Object} pokemonA - First Pokemon to compare
 * @param {Object} pokemonB - Second Pokemon to compare
 * @param {boolean} ascending - Sort direction (true = ascending, false = descending)
 * @returns {number} - Negative if A comes first, positive if B comes first, 0 if equal
 * 
 * SENIOR DEV TIP:
 * Array.sort() expects a comparator function that returns:
 * - Negative number: A comes before B
 * - Positive number: B comes before A
 * - Zero: Keep original order
 */
export const sortById = (pokemonA, pokemonB, ascending = true) => {
  if (!pokemonA || !pokemonB) return 0;
  
  const diff = pokemonA.id - pokemonB.id;
  return ascending ? diff : -diff;
};

/**
 * Sort Pokemon by base experience
 * 
 * @param {Object} pokemonA - First Pokemon to compare
 * @param {Object} pokemonB - Second Pokemon to compare
 * @param {boolean} ascending - Sort direction
 * @returns {number} - Sort comparator result
 */
export const sortByBaseExperience = (pokemonA, pokemonB, ascending = true) => {
  if (!pokemonA || !pokemonB) return 0;
  
  const expA = pokemonA.base_experience || 0;
  const expB = pokemonB.base_experience || 0;
  
  const diff = expA - expB;
  return ascending ? diff : -diff;
};

/**
 * Sort Pokemon based on sort option string
 * 
 * @param {Object} pokemonA - First Pokemon to compare
 * @param {Object} pokemonB - Second Pokemon to compare  
 * @param {string} sortBy - Sort option: 'id-asc', 'id-desc', 'base-exp-asc', 'base-exp-desc'
 * @returns {number} - Sort comparator result
 * 
 * WHY THIS FUNCTION:
 * Centralizes the switch/case logic for different sort options.
 * Component can pass sort string directly without managing the logic.
 * 
 * USAGE IN COMPONENT:
 * const sorted = [...pokemon].sort((a, b) => sortPokemon(a, b, sortBy));
 */
export const sortPokemon = (pokemonA, pokemonB, sortBy = 'id-asc') => {
  switch (sortBy) {
    case 'id-asc':
      return sortById(pokemonA, pokemonB, true);
    case 'id-desc':
      return sortById(pokemonA, pokemonB, false);
    case 'base-exp-asc':
      return sortByBaseExperience(pokemonA, pokemonB, true);
    case 'base-exp-desc':
      return sortByBaseExperience(pokemonA, pokemonB, false);
    default:
      return sortById(pokemonA, pokemonB, true);
  }
};

/**
 * Apply filters and sorting to a Pokemon array
 * 
 * @param {Array} pokemonList - Array of Pokemon objects
 * @param {Object} options - Filtering and sorting options
 * @param {string} options.searchTerm - Search term for name filtering
 * @param {string} options.selectedType - Type for filtering
 * @param {string} options.sortBy - Sort option
 * @returns {Array} - Filtered and sorted Pokemon array
 * 
 * WHY THIS IS POWERFUL:
 * One function that does the entire data transformation pipeline.
 * Component just calls this with options and gets back ready-to-display data.
 * 
 * EXAMPLE USAGE:
 * const processedPokemon = applyFiltersAndSort(allPokemon, {
 *   searchTerm: 'pik',
 *   selectedType: 'electric',
 *   sortBy: 'id-asc'
 * });
 */
export const applyFiltersAndSort = (pokemonList, options = {}) => {
  const {
    searchTerm = '',
    selectedType = 'all',
    sortBy = 'id-asc'
  } = options;
  
  if (!Array.isArray(pokemonList)) return [];
  
  // Step 1: Filter the list
  const filtered = pokemonList.filter(pokemon => 
    filterPokemon(pokemon, searchTerm, selectedType)
  );
  
  // Step 2: Sort the filtered list
  const sorted = [...filtered].sort((a, b) => 
    sortPokemon(a, b, sortBy)
  );
  
  return sorted;
};

