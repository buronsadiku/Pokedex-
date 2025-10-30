import { useQuery, useQueries } from "@tanstack/react-query";

/**
 * CUSTOM HOOK: usePokemonData
 * 
 * WHY CUSTOM HOOKS:
 * Custom hooks are one of React's most powerful patterns for code reuse.
 * They extract stateful logic so multiple components can use the same data logic.
 * 
 * BENEFITS:
 * 1. Separation of Concerns - Data fetching logic separate from UI
 * 2. Reusability - Any component can use this hook to get Pokemon data
 * 3. Testability - Can test data logic without rendering components
 * 4. DRY - Write data fetching once, use everywhere
 * 
 * SENIOR DEV TIP:
 * If you find yourself copying useState/useEffect logic between components,
 * extract it into a custom hook. Hooks are for sharing stateful behavior.
 * 
 * HOOK NAMING CONVENTION:
 * Always start custom hooks with "use" (e.g., usePokemonData, useAuth, useFetch)
 * This tells React it's a hook and enables hooks rules checking.
 */

/**
 * Fetch Pokemon data from PokeAPI with details for each Pokemon
 * 
 * @returns {Object} Hook return object
 * @returns {Array} return.pokemonList - Array of Pokemon data objects
 * @returns {boolean} return.isLoading - True while data is being fetched
 * @returns {boolean} return.hasError - True if any fetch failed
 * @returns {Object} return.error - Error object if fetch failed
 * @returns {number} return.loadedCount - Number of Pokemon currently loaded
 * @returns {number} return.totalCount - Total number of Pokemon to load
 * 
 * WHAT THIS HOOK DOES:
 * 1. Fetches list of first 151 Pokemon from PokeAPI
 * 2. For each Pokemon, fetches detailed data (types, stats, sprites, etc.)
 * 3. Manages loading states for both list and individual Pokemon
 * 4. Returns clean data ready for components to use
 * 
 * WHY TWO API CALLS:
 * PokeAPI returns basic list first, then requires separate calls for details.
 * We use React Query's useQueries to fetch all details in parallel efficiently.
 * 
 * USAGE IN COMPONENT:
 * const { pokemonList, isLoading, hasError } = usePokemonData();
 * 
 * if (isLoading) return <LoadingState />;
 * if (hasError) return <ErrorState />;
 * return <PokemonGrid pokemon={pokemonList} />;
 */
const usePokemonData = () => {
  // Step 1: Fetch the list of Pokemon (just names and URLs)
  const { 
    data: listData, 
    isLoading: isLoadingList,
    error: listError 
  } = useQuery({
    queryKey: ['pokemon-list'],
    queryFn: async () => {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
      if (!response.ok) {
        throw new Error('Failed to fetch Pokemon list');
      }
      return response.json();
    },
    // React Query options for better UX:
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });

  // Step 2: Fetch detailed data for each Pokemon in parallel
  // useQueries is perfect for fetching multiple related resources
  const pokemonDetailsQueries = useQueries({
    queries: listData?.results?.map((pokemon) => ({
      queryKey: ['pokemon-details', pokemon.name],
      queryFn: async () => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${pokemon.name}`);
        }
        return response.json();
      },
      // Don't fetch until list is loaded
      enabled: !!listData,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 30,
    })) || []
  });

  // Calculate loading states
  // We're loading if either the list is loading OR any details are loading
  const isLoadingDetails = pokemonDetailsQueries.some(query => query.isLoading);
  const isLoading = isLoadingList || isLoadingDetails;

  // Check if any queries failed
  const hasError = !!listError || pokemonDetailsQueries.some(query => query.error);
  const firstError = listError || pokemonDetailsQueries.find(q => q.error)?.error;

  // Calculate loading progress for UX feedback
  const totalCount = pokemonDetailsQueries.length;
  const loadedCount = pokemonDetailsQueries.filter(q => q.data).length;

  // Extract successfully loaded Pokemon data
  // Filter out failed/loading queries and extract just the data
  const pokemonList = pokemonDetailsQueries
    .filter(query => query.data && !query.isLoading && !query.error)
    .map(query => query.data);

  /**
   * RETURN OBJECT STRUCTURE:
   * We return an object (not array) so components can destructure only what they need.
   * This is more flexible than returning [pokemonList, isLoading, hasError].
   * 
   * GOOD: const { pokemonList, isLoading } = usePokemonData();
   * BAD:  const [pokemonList, isLoading] = usePokemonData(); // Must use in exact order
   */
  return {
    pokemonList,      // Array of Pokemon objects with full details
    isLoading,        // Boolean: true while fetching
    hasError,         // Boolean: true if any fetch failed
    error: firstError,// Error object for error handling
    loadedCount,      // Number: how many Pokemon loaded (for progress bar)
    totalCount,       // Number: total Pokemon to load
  };
};

export default usePokemonData;

