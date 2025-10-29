import React, { useState } from "react";

export default function Search({ onSearchChange, onSortChange }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("id-asc");

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        // Pass the search term to parent component
        if (onSearchChange) {
            onSearchChange(value);
        }
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        // Pass the sort option to parent component
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