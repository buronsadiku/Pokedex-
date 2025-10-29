import React, {useState, useEffect} from 'react';

import PokemonCard from './PokemonCard';

import {useQuery, useQueries} from "@tanstack/react-query";


export default function PokemonList({ searchTerm = "", selectedType = "all", sortBy = "id-asc" }) {

  return (
   
    <>
      <PokemonCard searchTerm={searchTerm} selectedType={selectedType} sortBy={sortBy} />
    </>
  
  )
  
}

