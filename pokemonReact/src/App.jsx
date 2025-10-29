import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import PokemonList from './components/PokemonList'
import PokemonDetails from './components/PokemonDetails'
import Search from './components/Search'
import TypesBar from './components/TypesBar'

/**
 * EXPLANATION:
 * This is the main App component that sets up React Router.
 * 
 * React Router allows us to navigate between different "pages" in a single-page application (SPA).
 * Instead of reloading the entire page, React Router changes what component is displayed.
 * 
 * BrowserRouter: Wraps the entire app to enable routing functionality
 * Routes: Container for all route definitions
 * Route: Defines a path and which component to render at that path
 *   - path="/" means the home/main page
 *   - path="/pokemon/:name" means a dynamic route where :name is a parameter (like /pokemon/pikachu)
 */

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("id-asc");

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  const handleTypeChange = (newType) => {
    setSelectedType(newType);
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        <Routes>
          {/* Main page route - shows the Pokemon list */}
          <Route 
            path="/" 
            element={
              <>
                <Search onSearchChange={handleSearchChange} onSortChange={handleSortChange} />
                <TypesBar selectedType={selectedType} onTypeChange={handleTypeChange} />
                <PokemonList searchTerm={searchTerm} selectedType={selectedType} sortBy={sortBy} />
              </>
            } 
          />
          
          {/* Details page route - shows individual Pokemon details */}
          <Route path="/pokemon/:name" element={<PokemonDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
