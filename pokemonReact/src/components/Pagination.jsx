import React from 'react';

/**
 * REUSABLE COMPONENT: Pagination
 * 
 * WHY EXTRACT THIS:
 * The old PokemonCard.jsx had 100+ lines of pagination UI (lines 308-386).
 * That's too much UI code mixed with data fetching and filtering.
 * 
 * BENEFITS:
 * 1. Reusability - Can paginate any list (users, products, articles, etc.)
 * 2. Separation - UI separate from business logic
 * 3. Testability - Easy to test rendering with different states
 * 4. Maintainability - All pagination UI in one focused file
 * 
 * SENIOR DEV TIP:
 * When a section of UI is:
 * - 50+ lines of JSX
 * - Reusable across different contexts
 * - Self-contained with clear inputs/outputs
 * → Extract it into its own component
 * 
 * COMPONENT TYPE:
 * This is a "controlled component" - it doesn't manage its own state.
 * The parent controls pagination via props. This makes it more flexible.
 */

/**
 * Pagination controls component
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentPage - Current active page (1-indexed)
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback when page changes: (pageNumber) => void
 * @param {Array<number>} props.pageNumbers - Array of page numbers to display
 * @param {number} props.showingStart - First item number shown (for "Showing X-Y of Z")
 * @param {number} props.showingEnd - Last item number shown
 * @param {number} props.totalItems - Total number of items
 * @param {boolean} props.isFirstPage - Whether on first page
 * @param {boolean} props.isLastPage - Whether on last page
 * 
 * USAGE EXAMPLE:
 * const pagination = usePagination(items, 24);
 * 
 * <Pagination
 *   currentPage={pagination.currentPage}
 *   totalPages={pagination.totalPages}
 *   onPageChange={pagination.goToPage}
 *   pageNumbers={pagination.getPageNumbers()}
 *   showingStart={pagination.showingStart}
 *   showingEnd={pagination.showingEnd}
 *   totalItems={pagination.totalItems}
 *   isFirstPage={pagination.isFirstPage}
 *   isLastPage={pagination.isLastPage}
 * />
 */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageNumbers = [],
  showingStart,
  showingEnd,
  totalItems,
  isFirstPage,
  isLastPage
}) => {
  /**
   * DON'T RENDER IF ONLY ONE PAGE
   * No need for pagination controls if everything fits on one page
   */
  if (totalPages <= 1) return null;

  /**
   * CONDITIONAL CLASS NAMES
   * Helper function for button styling based on state
   */
  const getPreviousButtonClasses = () => {
    return `px-4 py-2 rounded-lg font-medium transition-all ${
      isFirstPage
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
    }`;
  };

  const getNextButtonClasses = () => {
    return `px-4 py-2 rounded-lg font-medium transition-all ${
      isLastPage
        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
        : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
    }`;
  };

  const getPageButtonClasses = (pageNum) => {
    return `px-4 py-2 rounded-lg font-medium transition-all ${
      pageNum === currentPage
        ? 'bg-blue-600 text-white scale-110 shadow-lg'
        : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-500 hover:scale-105'
    }`;
  };

  /**
   * SHOWING ELLIPSIS LOGIC
   * Determine if we need "..." between page numbers
   */
  const showStartEllipsis = currentPage > 4 && totalPages > 7;
  const showEndEllipsis = currentPage < totalPages - 3 && totalPages > 7;

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      {/* 
        ITEM COUNTER
        Shows "Showing 1-24 of 151 Pokémon"
        Helps users understand where they are in the list
      */}
      <p className="text-gray-600 text-sm">
        Showing {showingStart} - {showingEnd} of {totalItems} Pokémon
      </p>

      {/* 
        PAGINATION CONTROLS
        Layout: [Previous] [1] [2] [3] ... [Next]
      */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {/* 
          PREVIOUS BUTTON
          Disabled on first page (grayed out)
        */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className={getPreviousButtonClasses()}
          aria-label="Previous page"
        >
          Previous
        </button>

        {/* 
          FIRST PAGE + ELLIPSIS
          Always show page 1 if we're far from it
          Show "..." if there are hidden pages between 1 and visible range
        */}
        {showStartEllipsis && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-blue-500 transition-all"
              aria-label="Go to page 1"
            >
              1
            </button>
            <span className="text-gray-400 px-1">...</span>
          </>
        )}

        {/* 
          PAGE NUMBER BUTTONS
          Shows 5-7 page numbers around current page
          Current page is highlighted and slightly larger
        */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={getPageButtonClasses(pageNum)}
            aria-label={`Go to page ${pageNum}`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </button>
        ))}

        {/* 
          ELLIPSIS + LAST PAGE
          Show "..." and last page number if we're far from the end
        */}
        {showEndEllipsis && (
          <>
            <span className="text-gray-400 px-1">...</span>
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-4 py-2 rounded-lg bg-white border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-blue-500 transition-all"
              aria-label={`Go to page ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* 
          NEXT BUTTON
          Disabled on last page (grayed out)
        */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className={getNextButtonClasses()}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;

