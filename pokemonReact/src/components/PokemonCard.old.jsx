import React, {useState, useEffect} from 'react';
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';

import {useQuery, useQueries} from "@tanstack/react-query";

/**
 * EXPLANATION:
 * We import useNavigate from react-router-dom to enable navigation.
 * useNavigate is a hook that returns a function we can call to navigate to different routes.
 */


export default function PokemonCard({ searchTerm = "", selectedType = "all", sortBy = "id-asc", onLoadingChange }) {
  // useNavigate hook gives us a function to navigate to different routes
  const navigate = useNavigate();

  /**
   * EXPLANATION: Pagination State
   * currentPage: Tracks which page the user is currently viewing (starts at 1)
   * We use useState to manage this state - when currentPage changes, React re-renders the component
   */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // Number of Pokemon to show per page

  const {data: listData, isLoading: isLoadingList} = useQuery({queryKey: ['pokemon'], queryFn: () => fetch('https://pokeapi.co/api/v2/pokemon?limit=151').then((results) => results.json())});

  const pokemonDetails = useQueries({
    queries: listData?.results?.map((pokemon) => ({
      queryKey: ["pokemonDetails", pokemon.name],
      queryFn: () => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`).then(res => res.json())
    })) || []
  })

  // Check if any Pokemon details are still loading
  const isLoadingDetails = pokemonDetails.some(query => query.isLoading);
  const hasError = pokemonDetails.some(query => query.error);
  const isLoading = isLoadingList || isLoadingDetails;

  // Notify parent component about loading state
  React.useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  /**
   * EXPLANATION: Reset pagination when filters change
   * When the user changes search term, type filter, or sort order,
   * we reset to page 1 because the filtered results have changed.
   * useEffect runs whenever searchTerm, selectedType, or sortBy changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType, sortBy]);

  // Show loading screen until all Pokemon are fetched
  if (isLoadingList || isLoadingDetails) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          {/* Pokemon Loading Animation */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
            </div>
          </div>
          
          {/* Loading Text */}
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Loading Pokémons...</h2>
          <p className="text-gray-600 mb-8">Catching them all for you!</p>
          
          {/* Progress Bar */}
          <div className="w-80 bg-gray-200 rounded-full h-2 mx-auto mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"></div>
          </div>
          
          {/* Loading Counter */}
          <p className="text-sm text-gray-500">
            Loading {pokemonDetails.filter(q => q.data).length} of {pokemonDetails.length} Pokémon
          </p>
          
          {/* Animated dots */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there are any errors
  if (hasError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8">Failed to load Pokémon data. Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Filter Pokemon based on search term and type
  const filteredPokemon = pokemonDetails.filter((query) => {
    if (!query.data || query.isLoading || query.error) return false;
    
    const pokemon = query.data;
    const pokemonName = pokemon.name.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    // Check name filter
    const nameMatches = pokemonName.startsWith(searchLower);
    
    // Check type filter
    const typeMatches = selectedType === "all" || 
      pokemon.types.some(type => type.type.name === selectedType);
    
    return nameMatches && typeMatches;
  });

  // Sort Pokemon based on selected sort option
  const sortedPokemon = filteredPokemon.sort((a, b) => {
    const pokemonA = a.data;
    const pokemonB = b.data;
    
    switch (sortBy) {
      case 'id-asc':
        return pokemonA.id - pokemonB.id;
      case 'id-desc':
        return pokemonB.id - pokemonA.id;
      case 'base-exp-asc':
        return pokemonA.base_experience - pokemonB.base_experience;
      case 'base-exp-desc':
        return pokemonB.base_experience - pokemonA.base_experience;
      default:
        return pokemonA.id - pokemonB.id;
    }
  });

  /**
   * EXPLANATION: Pagination Calculations
   * totalPages: Calculate how many pages we need based on total Pokemon and items per page
   *   - Math.ceil() rounds up (e.g., 25 Pokemon ÷ 24 per page = 1.04 → 2 pages)
   * 
   * startIndex: Calculate which Pokemon to start showing on current page
   *   - Page 1: start at 0 (shows items 0-23)
   *   - Page 2: start at 24 (shows items 24-47)
   *   - Formula: (currentPage - 1) * itemsPerPage
   * 
   * endIndex: Calculate which Pokemon to stop showing
   *   - Simply startIndex + itemsPerPage
   * 
   * paginatedPokemon: Slice the sorted array to show only current page's items
   */
  const totalPages = Math.ceil(sortedPokemon.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPokemon = sortedPokemon.slice(startIndex, endIndex);

  /**
   * EXPLANATION: Pagination Button Handler
   * When user clicks a page number, update currentPage state
   * React will automatically re-render and show the new page's Pokemon
   */
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate which page numbers to display
  // Show max 7 page buttons at a time (current page ± 3 pages)
  const getPageNumbers = () => {
    const maxVisiblePages = 7;
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // If we have 7 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - 3);
      let endPage = Math.min(totalPages, currentPage + 3);
      
      // Adjust if we're near the beginning or end
      if (currentPage <= 4) {
        endPage = maxVisiblePages;
      } else if (currentPage >= totalPages - 3) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Pokemon Grid */}
      <section className='Pokemon-List grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 mb-8'>
        {paginatedPokemon.map((query, index) => 
      
      {
        if (query.isLoading) return <p key={index}>Loading…</p>;
        if (query.error) return <p key={index}>Error loading</p>;

         const poke = query.data;

         const typeColors = {
          fire: "#F87171", // red-400
          water: "#60A5FA", // blue-400
          grass: "#4ADE80", // green-400
          electric: "#FACC15", // yellow-400
          psychic: "#A78BFA", // purple-400
          ice: "#22D3EE", // cyan-400
          fighting: "#DC2626", // red-600
          poison: "#9333EA", // purple-600
          ground: "#CA8A04", // yellow-600
          flying: "#818CF8", // indigo-400
          bug: "#84CC16", // lime-500
          rock: "#B45309", // yellow-700
          ghost: "#6B21A8", // purple-700
          dragon: "#4338CA", // indigo-600
          dark: "#1F2937", // gray-800
          steel: "#9CA3AF", // gray-400
          fairy: "#F472B6", // pink-400
          default: "#9CA3AF" // gray-400

         }
         const primaryType = poke.types[0].type.name;
         const color = typeColors[primaryType] || typeColors.default;
         
         return (
           <div 
             key={poke.id} 
             className={clsx('p-4 rounded hover:scale-105 shadow-lg cursor-pointer transition-transform')} 
             style={{ boxShadow: `0 4px 0px ${color}90` }}
             onClick={() => {
               // EXPLANATION: When a Pokemon card is clicked, navigate to its details page
               // navigate() takes a path as a string. We use `/pokemon/${poke.name}` which matches
               // the route we defined in App.jsx: `/pokemon/:name`
               // The Pokemon name becomes the :name parameter in the route
               navigate(`/pokemon/${poke.name}`);
             }}
           >
             <h1 className='text-lg font-bold'>{poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h1>
             <img
               src={poke.sprites.other['official-artwork'].front_default}
               alt={poke.name}
             />
             <div className='mt-2 text-center '>
               <p className='text-sm text-gray-600'>#{poke.id.toString().padStart(3, '0') }</p>
             </div>
             <div className='flex flex-wrap gap-1 justify-center mt-2'>
               {poke.types.map((type, typeIndex) => (
                 <span
                   key={typeIndex}
                   className={`px-2 py-1 mb-3 rounded-full text-xs font-medium text-white ${
                     type.type.name === 'fire' ? 'bg-red-500' :
                     type.type.name === 'water' ? 'bg-blue-500' :
                     type.type.name === 'grass' ? 'bg-green-500' :
                     type.type.name === 'electric' ? 'bg-yellow-500' :
                     type.type.name === 'psychic' ? 'bg-purple-500' :
                     type.type.name === 'ice' ? 'bg-cyan-400' :
                     type.type.name === 'fighting' ? 'bg-red-600' :
                     type.type.name === 'poison' ? 'bg-purple-600' :
                     type.type.name === 'ground' ? 'bg-yellow-600' :
                     type.type.name === 'flying' ? 'bg-indigo-400' :
                     type.type.name === 'bug' ? 'bg-lime-500' :
                     type.type.name === 'rock' ? 'bg-yellow-700' :
                     type.type.name === 'ghost' ? 'bg-purple-700' :
                     type.type.name === 'dragon' ? 'bg-indigo-600' :
                     type.type.name === 'dark' ? 'bg-gray-800' :
                     type.type.name === 'steel' ? 'bg-gray-400' :
                     type.type.name === 'fairy' ? 'bg-pink-400' :
                     'bg-gray-500'
                   }`}
                 >
                   {type.type.name}
                 </span>
               ))}
             </div>
           </div>
         );
      })}
      </section>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          {/* EXPLANATION: Show current page info */}
          <p className="text-gray-600 text-sm">
            Showing {startIndex + 1} - {Math.min(endIndex, sortedPokemon.length)} of {sortedPokemon.length} Pokémon
          </p>

          {/* EXPLANATION: Pagination Buttons */}
          <div className="flex flex-wrap justify-center items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
              }`}
            >
              Previous
            </button>

            {/* Page Number Buttons */}
            {/* Show first page if we're not showing it already */}
            {currentPage > 4 && totalPages > 7 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-blue-500 transition-all"
                >
                  1
                </button>
                {currentPage > 5 && <span className="text-gray-400">...</span>}
              </>
            )}

            {/* Display page numbers */}
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white scale-110 shadow-lg'
                    : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:scale-105'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Show last page if we're not showing it already */}
            {currentPage < totalPages - 3 && totalPages > 7 && (
              <>
                {currentPage < totalPages - 4 && <span className="text-gray-400">...</span>}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-blue-500 transition-all"
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
  
}
