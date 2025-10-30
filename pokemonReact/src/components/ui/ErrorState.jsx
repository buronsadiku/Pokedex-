import React from 'react';

/**
 * REUSABLE COMPONENT: ErrorState
 * 
 * WHY EXTRACT THIS:
 * Error handling appears throughout apps (API failures, network issues, etc.)
 * Consistent error UX helps users understand what went wrong and what to do.
 * 
 * BENEFITS:
 * 1. Consistency - Same error experience everywhere
 * 2. User-friendly - Clear messaging and recovery options
 * 3. Maintainability - Update error UI in one place
 * 4. Reusability - Use for any error scenario
 * 
 * SENIOR DEV TIP:
 * Good error states should:
 * - Explain what went wrong (without technical jargon)
 * - Offer a way to recover (retry button, go back, etc.)
 * - Be visually distinct so users know something failed
 * - Log errors for debugging (in production, send to error tracking service)
 */

/**
 * Error state component with recovery actions
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Error title (default: "Oops! Something went wrong")
 * @param {string} props.message - Error message (default: generic message)
 * @param {Function} props.onRetry - Optional retry callback
 * @param {Function} props.onGoBack - Optional go back callback
 * @param {string} props.error - Technical error details (optional, for debugging)
 * 
 * USAGE EXAMPLES:
 * 
 * Simple:
 * <ErrorState />
 * 
 * With retry:
 * <ErrorState 
 *   message="Failed to load Pokemon"
 *   onRetry={() => refetch()}
 * />
 * 
 * With navigation:
 * <ErrorState 
 *   message="Pokemon not found"
 *   onGoBack={() => navigate('/')}
 * />
 * 
 * With technical details:
 * <ErrorState 
 *   message="Network error"
 *   error={error.message}
 *   onRetry={() => window.location.reload()}
 * />
 */
const ErrorState = ({
  title = "Oops! Something went wrong",
  message = "Failed to load Pokémon data. Please try again later.",
  onRetry,
  onGoBack,
  error
}) => {
  /**
   * DEFAULT HANDLERS
   * If no custom handlers provided, fall back to sensible defaults
   */
  const handleRetry = onRetry || (() => window.location.reload());
  const handleGoBack = onGoBack;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center max-w-md px-4">
        {/* 
          ERROR ICON
          WHY SAD FACE:
          - Universally understood symbol for "something's wrong"
          - Friendly and apologetic tone
          - Less intimidating than error symbols (❌, ⚠️)
        */}
        <div className="text-6xl mb-4">😞</div>
        
        {/* Error Title */}
        <h2 className="text-3xl font-bold text-red-600 mb-4">{title}</h2>
        
        {/* User-friendly message */}
        <p className="text-gray-600 mb-6 text-lg">{message}</p>
        
        {/* 
          TECHNICAL ERROR DETAILS
          Show in development for debugging, might hide in production
          Uses a collapsed/expandable section so it doesn't clutter UI
        */}
        {error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              Technical Details (for developers)
            </summary>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32 text-red-700">
              {typeof error === 'string' ? error : JSON.stringify(error, null, 2)}
            </pre>
          </details>
        )}
        
        {/* 
          ACTION BUTTONS
          WHY TWO BUTTONS:
          - Primary action (retry): Most users want to try again
          - Secondary action (go back): Escape hatch if retry doesn't work
          
          VISUAL HIERARCHY:
          - Retry button is prominent (red background)
          - Go back button is subtle (white background)
        */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {/* Retry Button - Always shown */}
          <button 
            onClick={handleRetry}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
          >
            Try Again
          </button>
          
          {/* Go Back Button - Only shown if handler provided */}
          {handleGoBack && (
            <button 
              onClick={handleGoBack}
              className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors shadow-md border border-gray-300"
            >
              Go Back
            </button>
          )}
        </div>
        
        {/* 
          HELPFUL TIP
          Gives users additional troubleshooting ideas
        */}
        <p className="text-sm text-gray-500 mt-6">
          💡 Tip: Check your internet connection or try refreshing the page
        </p>
      </div>
    </div>
  );
};

export default ErrorState;

