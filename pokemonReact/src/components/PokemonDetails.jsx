import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * EXPLANATION:
 * This component displays detailed information about a single Pokemon.
 * 
 * useParams: A React Router hook that extracts URL parameters.
 *   - If the route is /pokemon/pikachu, useParams() returns { name: 'pikachu' }
 *   - This is how we know which Pokemon to display
 * 
 * useNavigate: A hook that gives us a function to navigate between routes.
 *   - navigate('/') takes us back to the main page
 *   - navigate(-1) would go back in browser history
 */

// Fetch detailed Pokemon data from the PokeAPI
const fetchPokemonDetails = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Pokemon details');
  }
  return response.json();
};

export default function PokemonDetails() {
  // Extract the Pokemon name from the URL (e.g., /pokemon/pikachu → name = "pikachu")
  const { name } = useParams();
  const navigate = useNavigate();

  // Fetch Pokemon data using React Query
  // queryKey: unique identifier for this query (used for caching)
  // queryFn: function that fetches the data
  // enabled: only run query if name exists
  const { data: pokemon, isLoading, error } = useQuery({
    queryKey: ['pokemon', name],
    queryFn: () => fetchPokemonDetails(name),
    enabled: !!name,
  });

  // Loading state - show spinner while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Loading Pokémon details...</p>
        </div>
      </div>
    );
  }

  // Error state - show error message if fetch failed
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-lg">
          <div className="text-red-500 text-center">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p className="mb-4">Failed to load Pokémon details: {error.message}</p>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Go Back to Main Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Don't render anything if no Pokemon data
  if (!pokemon) return null;

  const getTypeColor = (typeName) => {
    const colors = {
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      grass: 'bg-green-500',
      electric: 'bg-yellow-500',
      psychic: 'bg-purple-500',
      ice: 'bg-cyan-500',
      dragon: 'bg-indigo-500',
      dark: 'bg-gray-800',
      fairy: 'bg-pink-500',
      fighting: 'bg-orange-500',
      flying: 'bg-sky-500',
      poison: 'bg-violet-500',
      ground: 'bg-amber-600',
      rock: 'bg-stone-500',
      bug: 'bg-lime-500',
      ghost: 'bg-purple-700',
      steel: 'bg-gray-400',
      normal: 'bg-gray-500'
    };
    return colors[typeName] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors text-gray-700 font-medium"
        >
          {/* EXPLANATION: Arrow icon to indicate going back */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Main Page
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section with Gradient Background */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <div className="text-center">
              <h1 className="text-4xl font-bold capitalize mb-2">{pokemon.name}</h1>
              <p className="text-xl opacity-90">#{pokemon.id.toString().padStart(3, '0')}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Pokemon Image */}
            <div className="text-center mb-8">
              <img
                src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                className="w-64 h-64 mx-auto object-contain"
                onError={(e) => {
                  e.target.src = pokemon.sprites.front_default;
                }}
              />
            </div>

            {/* Pokemon ID */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-1">Pokemon ID</h3>
              <p className="text-2xl font-bold text-gray-800">#{pokemon.id.toString().padStart(3, '0')}</p>
            </div>

            {/* Types */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Types</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.types.map((type, index) => (
                  <span
                    key={index}
                    className={`px-4 py-2 rounded-full text-white font-medium ${getTypeColor(type.type.name)}`}
                  >
                    {type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Cost (Base Experience) */}
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Cost (Base Experience)</h3>
              <p className="text-3xl font-bold text-yellow-600">{pokemon.base_experience || 'N/A'}</p>
              <p className="text-sm text-gray-600 mt-1">Experience points needed to catch this Pokemon</p>
            </div>

            {/* Effects (Abilities) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Effects (Abilities)</h3>
              <div className="space-y-3">
                {pokemon.abilities.map((ability, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        ability.is_hidden 
                          ? 'bg-purple-200 text-purple-800' 
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        {ability.ability.name.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {ability.is_hidden && ' (Hidden Ability)'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {ability.is_hidden ? 'This is a hidden ability that may only appear under special conditions.' : 'This ability activates during battle.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attributes (Stats, Height, Weight) */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Attributes</h3>
              
              {/* Height and Weight */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-600 mb-1">Height</h4>
                  <p className="text-2xl font-bold text-gray-800">{(pokemon.height / 10).toFixed(1)} m</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-600 mb-1">Weight</h4>
                  <p className="text-2xl font-bold text-gray-800">{(pokemon.weight / 10).toFixed(1)} kg</p>
                </div>
              </div>

              {/* Base Stats */}
              <div>
                <h4 className="text-md font-semibold mb-3 text-gray-700">Base Stats</h4>
                <div className="space-y-3">
                  {pokemon.stats.map((stat, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-32 text-sm font-medium text-gray-600 capitalize">
                        {stat.stat.name.replace('-', ' ')}
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 text-sm font-bold text-gray-800">
                        {stat.base_stat}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
