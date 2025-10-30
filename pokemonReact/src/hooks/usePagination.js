import { useState, useEffect, useMemo } from 'react';

/**
 * CUSTOM HOOK: usePagination
 * 
 * WHY THIS HOOK:
 * Pagination logic is complex with lots of math and edge cases.
 * It's the same across different lists (Pokemon, users, products, etc.)
 * Extracting it into a hook makes it reusable and testable.
 * 
 * BENEFITS:
 * 1. Reusability - Use for any paginated list, not just Pokemon
 * 2. Encapsulation - All pagination logic in one place
 * 3. Testability - Test pagination math without UI
 * 4. Readability - Component doesn't need 100+ lines of pagination code
 * 
 * SENIOR DEV TIP:
 * Pagination is a perfect candidate for a custom hook because:
 * - It's stateful (current page)
 * - It has complex calculations (page numbers, ranges)
 * - It's used in many different contexts
 * - The logic is independent of what's being paginated
 * 
 * This is called "separation of concerns" - pagination logic doesn't care
 * if it's paginating Pokemon, users, or blog posts.
 */

/**
 * Hook for managing pagination state and calculations
 * 
 * @param {Array} items - The full array of items to paginate
 * @param {number} itemsPerPage - How many items to show per page (default: 24)
 * @returns {Object} Pagination state and controls
 * 
 * RETURN VALUES EXPLAINED:
 * - currentPage: The active page number (1-indexed)
 * - totalPages: Total number of pages based on items length
 * - paginatedItems: Just the items for the current page
 * - startIndex: Index of first item on current page (0-indexed)
 * - endIndex: Index after last item on current page
 * - goToPage: Function to change to a specific page
 * - goToNextPage: Function to go forward one page
 * - goToPreviousPage: Function to go back one page
 * - getPageNumbers: Function that returns array of page numbers to display
 * - isFirstPage: Boolean, true if on first page
 * - isLastPage: Boolean, true if on last page
 * 
 * USAGE EXAMPLE:
 * const {
 *   paginatedItems,
 *   currentPage,
 *   totalPages,
 *   goToPage,
 *   goToNextPage,
 *   goToPreviousPage
 * } = usePagination(pokemonList, 24);
 */
const usePagination = (items = [], itemsPerPage = 24) => {
  // State: Current page number (starts at 1, not 0, because that's what users expect)
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * EFFECT: Reset to page 1 when items array changes
   * 
   * WHY THIS IS NEEDED:
   * If user is on page 5 and then filters the list, page 5 might not exist anymore.
   * We reset to page 1 whenever the items array changes (filtering, sorting, etc.)
   * 
   * DEPENDENCY ARRAY:
   * We watch items.length instead of items because we don't want to reset
   * if the order changes, only if the number of items changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  /**
   * MEMOIZED CALCULATIONS
   * 
   * useMemo prevents recalculating these values on every render.
   * They only recalculate when dependencies change.
   * 
   * WHY useMemo:
   * - totalPages: Simple math, but why recalculate 60 times per second?
   * - startIndex/endIndex: Used multiple times, calculate once
   * - paginatedItems: Array.slice creates new array, only do when needed
   * 
   * PERFORMANCE TIP:
   * Don't overuse useMemo. Only use it for:
   * 1. Expensive calculations
   * 2. Values used as dependencies in other hooks
   * 3. Reference equality matters (passing to child components)
   */

  // Calculate total number of pages needed
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Calculate which array indices to show on current page
  const { startIndex, endIndex } = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return { startIndex: start, endIndex: end };
  }, [currentPage, itemsPerPage]);

  // Get just the items for current page
  const paginatedItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  // Check if we're on first or last page (for disabling buttons)
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  /**
   * NAVIGATION FUNCTIONS
   * These functions update the current page and scroll to top for better UX
   */

  const goToPage = (pageNumber) => {
    // Validate page number is in valid range
    if (pageNumber < 1 || pageNumber > totalPages) return;
    
    setCurrentPage(pageNumber);
    
    // Scroll to top smoothly when page changes
    // This is good UX because user might be at bottom of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToNextPage = () => {
    if (!isLastPage) {
      goToPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (!isFirstPage) {
      goToPage(currentPage - 1);
    }
  };

  /**
   * GET VISIBLE PAGE NUMBERS
   * 
   * WHY THIS FUNCTION:
   * We can't show 100 page buttons if there are 100 pages.
   * This calculates which page numbers to display (usually 5-7 around current page)
   * 
   * ALGORITHM:
   * - If ≤ 7 pages: show all
   * - Otherwise: show current page ± 3 pages
   * - Adjust if near start/end to always show same number of buttons
   * 
   * EXAMPLE:
   * Current page 5 of 20: shows [2, 3, 4, 5, 6, 7, 8]
   * Current page 1 of 20: shows [1, 2, 3, 4, 5, 6, 7]
   * Current page 20 of 20: shows [14, 15, 16, 17, 18, 19, 20]
   */
  const getPageNumbers = () => {
    const maxVisiblePages = 7;
    const pages = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if we have few enough
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - 3);
      let endPage = Math.min(totalPages, currentPage + 3);
      
      // Adjust if we're near the beginning
      if (currentPage <= 4) {
        endPage = maxVisiblePages;
      } 
      // Adjust if we're near the end
      else if (currentPage >= totalPages - 3) {
        startPage = totalPages - maxVisiblePages + 1;
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  /**
   * RETURN OBJECT
   * 
   * We return everything the component needs for pagination:
   * - State values (currentPage, totalPages)
   * - Derived data (paginatedItems, page numbers)
   * - Control functions (goToPage, next, previous)
   * - Helper booleans (isFirstPage, isLastPage)
   */
  return {
    // State
    currentPage,
    totalPages,
    
    // Data
    paginatedItems,
    startIndex,
    endIndex,
    
    // Controls
    goToPage,
    goToNextPage,
    goToPreviousPage,
    
    // Helpers
    getPageNumbers,
    isFirstPage,
    isLastPage,
    
    // Metadata (useful for showing "Showing 1-24 of 151")
    showingStart: startIndex + 1,
    showingEnd: Math.min(endIndex, items.length),
    totalItems: items.length,
  };
};

export default usePagination;

