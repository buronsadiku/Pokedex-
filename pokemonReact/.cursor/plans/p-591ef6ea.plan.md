<!-- 591ef6ea-84fe-4577-be37-6018ced66bc0 066abf92-951b-46ae-8d11-48aa5c327ef6 -->
# Pokedex Rewrite: Step-by-Step Plan (JS + React Query)

## Scope

- JS + React + React Router + React Query
- Core features parity: list + details, filters (search/type), sort, pagination, loading/error states

## Implementation Order

### 1) Project Setup

- Create React app skeleton (Vite or CRA).
- Install deps: react-router-dom, @tanstack/react-query.
- Add base folders: `src/components`, `src/hooks`, `src/utils`, `src/constants`.
- Initialize QueryClient and Router in `src/main.jsx`.

### 2) Constants

- Add `src/constants/pokemonTypes.js` with type names and colors.

### 3) Utilities (Pure JS)

- Add `src/utils/pokemonFilters.js` with:
- `filterByName`, `filterByType`, `filterPokemon`
- `sortById`, `sortByBaseExperience`, `sortPokemon`
- `applyFiltersAndSort(list, {searchTerm, selectedType, sortBy})`

### 4) Data Hook

- Implement `src/hooks/usePokemonData.js` using React Query:
- List query: `pokemon?limit=151`
- Details queries with `useQueries`, `enabled: !!listData`
- Return: `{ pokemonList, isLoading, hasError, error, loadedCount, totalCount }`

### 5) Pagination Hook

- Implement `src/hooks/usePagination.js`:
- State: `currentPage`
- Derived: `paginatedItems`, `totalPages`, helpers: `goToPage`, `getPageNumbers`, `isFirstPage`, `isLastPage`, `showingStart/End`, `totalItems`.

### 6) UI Building Blocks

- `src/components/ui/LoadingState.jsx`: progress based on `loadedCount/totalCount`.
- `src/components/ui/ErrorState.jsx`: message, error text, retry button.
- `src/components/Header.jsx`: simple title bar.

### 7) Filters UI

- `src/components/Search.jsx` (controlled):
- Props: `searchTerm`, `sortBy`, `onSearchChange`, `onSortChange`.
- `src/components/TypesBar.jsx` (controlled):
- Props: `selectedType`, `onTypeChange`, renders buttons from `POKEMON_TYPES`.

### 8) Cards and Pagination

- `src/components/PokemonCard.jsx`: render sprite, name, id, types, link to details.
- `src/components/Pagination.jsx`: buttons for prev/next and page numbers, uses pagination props.

### 9) Orchestrator: Grid

- `src/components/PokemonGrid.jsx`:
- Props: `searchTerm`, `selectedType`, `sortBy`.
- Calls `usePokemonData()` → loading/error → `applyFiltersAndSort()` → `usePagination()` → render grid + pagination.

### 10) Details Page

- `src/components/PokemonDetails.jsx`:
- Read `:name` from route, fetch pokemon by name with React Query, render key fields.

### 11) App Shell / Routing

- `src/App.jsx`:
- Local state: `searchTerm`, `selectedType`, `sortBy`.
- Routes: `/` → Search, TypesBar, PokemonGrid. `/pokemon/:name` → PokemonDetails.

### 12) Polish

- Handle empty results state in grid.
- Basic responsive layout.

## Notes

- Keep hooks returning objects (named fields).
- Use descriptive `queryKey`s like `['pokemon-list']`, `['pokemon-details', name]`.
- Optional chaining and guard clauses to avoid runtime errors.

### To-dos

- [ ] Initialize project, install React Router + React Query, set up main.jsx
- [ ] Create pokemonTypes.js with names and colors
- [ ] Implement pokemonFilters.js (filters, sorters, applyFiltersAndSort)
- [ ] Implement usePokemonData.js (list + details with React Query)
- [ ] Implement usePagination.js (state + helpers)
- [ ] Create LoadingState.jsx (progress UI)
- [ ] Create ErrorState.jsx (retry support)
- [ ] Create Header.jsx (app title)
- [ ] Create Search.jsx (controlled input + sort select)
- [ ] Create TypesBar.jsx (type buttons from constants)
- [ ] Create PokemonCard.jsx (card layout + link)
- [ ] Create Pagination.jsx (prev/next + numbers)
- [ ] Create PokemonGrid.jsx (hook + filters + pagination + render)
- [ ] Create PokemonDetails.jsx (fetch by :name)
- [ ] Wire App.jsx (state, routes, compose UI)
- [ ] Add empty results state and responsive layout