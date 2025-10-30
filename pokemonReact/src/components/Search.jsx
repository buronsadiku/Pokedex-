import React from "react";

/**
 * REFACTORED: Search Component
 * 
 * CHANGES MADE:
 * 1. Removed local state (searchTerm, sortBy)
 * 2. Made this a fully "controlled component"
 * 3. Parent (App.jsx) now owns the state
 * 
 * WHY THIS IS BETTER:
 * - Single Source of Truth: State lives in one place (App.jsx)
 * - No State Duplication: Was maintaining state here AND in parent
 * - Simpler Logic: Just calls callbacks, doesn't manage state
 * - Easier Debugging: All state is in App, not scattered
 * 
 * CONTROLLED COMPONENT PATTERN:
 * A controlled component doesn't manage its own state.
 * It receives current values as props and calls callbacks to request changes.
 * This is the React-recommended pattern for forms.
 * 
 * BEFORE: Search had its own state + notified parent (2 sources of truth)
 * AFTER: Search just displays what parent tells it (1 source of truth)
 */

export default function Search({ searchTerm = "", sortBy = "id-asc", onSearchChange, onSortChange }) {
    const handleSearchChange = (e) => {
        const value = e.target.value;
        // Just notify parent, don't manage state locally
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        // Just notify parent, don't manage state locally
        if (onSortChange) {
            onSortChange(value);
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                {/* Search Bar */}
                <div className="w-full sm:w-auto">
                    <div className="relative">
                        <input  
                            value={searchTerm}
                            onChange={handleSearchChange}    
                            type="text"
                            placeholder="Search Pokémon..."
                            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Sort Dropdown */}
                <div className="w-full sm:w-auto">
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-white"
                    >
                        <option value="id-asc">ID: Low to High</option>
                        <option value="id-desc">ID: High to Low</option>
                        <option value="base-exp-asc">Base Exp: Low to High</option>
                        <option value="base-exp-desc">Base Exp: High to Low</option>
                    </select>
                </div>
            </div>
        </div>
    );
}