import React from 'react';

/**
 * REUSABLE COMPONENT: LoadingState
 * 
 * WHY EXTRACT THIS:
 * Loading screens appear in multiple places (list, details, future features).
 * Defining the loading UI once ensures consistency across the app.
 * 
 * BENEFITS:
 * 1. Consistency - Same loading experience everywhere
 * 2. Maintainability - Update loading UI in one place
 * 3. Reusability - Use in any component that loads data
 * 4. DRY - Don't repeat the same JSX in multiple files
 * 
 * SENIOR DEV TIP:
 * Loading, error, and empty states are perfect candidates for reusable components.
 * They appear throughout apps and should be consistent for good UX.
 * 
 * COMPONENT STRUCTURE:
 * This is a "presentational component" - it just displays UI, no logic.
 * It accepts props to customize the message but has sensible defaults.
 */

/**
 * Loading state component with Pokemon-themed animation
 * 
 * @param {Object} props - Component props
 * @param {string} props.message - Main loading message (default: "Loading Pokémon...")
 * @param {string} props.submessage - Secondary message (default: "Catching them all for you!")
 * @param {number} props.loadedCount - Number of items loaded (optional, for progress)
 * @param {number} props.totalCount - Total items to load (optional, for progress)
 * 
 * USAGE EXAMPLES:
 * 
 * Simple:
 * <LoadingState />
 * 
 * With custom message:
 * <LoadingState message="Loading details..." submessage="Please wait" />
 * 
 * With progress:
 * <LoadingState loadedCount={50} totalCount={151} />
 */
const LoadingState = ({ 
  message = "Loading Pokémon...",
  submessage = "Catching them all for you!",
  loadedCount,
  totalCount
}) => {
  /**
   * CONDITIONAL RENDERING:
   * Show progress bar only if both counts are provided
   */
  const showProgress = loadedCount !== undefined && totalCount !== undefined;
  const progressPercentage = showProgress ? (loadedCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        {/* Pokemon-themed Loading Animation */}
        <div className="mb-8">
          {/* 
            POKEBALL ANIMATION:
            - Outer circle: gradient background with pulse animation
            - Inner circle: white center
            - Lightning emoji: represents catching Pokemon
            
            WHY THIS DESIGN:
            - Recognizable Pokemon theme (pokeball colors)
            - Pulse animation gives visual feedback that something is happening
            - Simple enough to not distract, engaging enough to not bore
          */}
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
        
        {/* Loading Text */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{message}</h2>
        <p className="text-gray-600 mb-8">{submessage}</p>
        
        {/* Progress Bar - Only shown if counts provided */}
        {showProgress && (
          <>
            <div className="w-80 bg-gray-200 rounded-full h-2 mx-auto mb-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Loading Counter */}
            <p className="text-sm text-gray-500">
              Loading {loadedCount} of {totalCount} Pokémon
            </p>
          </>
        )}
        
        {/* Animated dots */}
        {/*
          WHY ANIMATED DOTS:
          - Provides visual feedback that app isn't frozen
          - Staggered animation (0s, 0.1s, 0.2s) creates wave effect
          - Simple CSS animation, no JavaScript needed
        */}
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
};

export default LoadingState;

