# 🚀 Quick Reference Guide

## 📁 File Locations Cheat Sheet

### Need to change Pokemon type colors?
→ `src/constants/pokemonTypes.js`

### Need to modify filter/sort logic?
→ `src/utils/pokemonFilters.js`

### Need to change how data is fetched?
→ `src/hooks/usePokemonData.js`

### Need to modify pagination behavior?
→ `src/hooks/usePagination.js`

### Need to update loading screen?
→ `src/components/ui/LoadingState.jsx`

### Need to update error screen?
→ `src/components/ui/ErrorState.jsx`

### Need to change single card appearance?
→ `src/components/PokemonCard.jsx`

### Need to modify the grid layout?
→ `src/components/PokemonGrid.jsx`

### Need to update pagination controls?
→ `src/components/Pagination.jsx`

### Need to change search/sort UI?
→ `src/components/Search.jsx`

### Need to modify type filter buttons?
→ `src/components/TypesBar.jsx`

---

## 🎯 Common Tasks

### Adding a New Pokemon Type

**File:** `src/constants/pokemonTypes.js`

```javascript
// Add to TYPE_COLORS
export const TYPE_COLORS = {
  // ... existing types
  newtype: 'bg-newcolor-500',
};

// Add to TYPE_SHADOW_COLORS
export const TYPE_SHADOW_COLORS = {
  // ... existing types
  newtype: '#HEXCODE',
};

// Add to POKEMON_TYPES array
export const POKEMON_TYPES = [
  // ... existing types
  { name: 'newtype', label: 'New Type', color: TYPE_COLORS.newtype },
];
```

That's it! It now works everywhere automatically! ✨

---

### Adding a New Sort Option

**Step 1:** Add option in `src/components/Search.jsx`
```javascript
<select>
  {/* Existing options */}
  <option value="name-asc">Name: A to Z</option>
</select>
```

**Step 2:** Add sort function in `src/utils/pokemonFilters.js`
```javascript
export const sortByName = (pokemonA, pokemonB, ascending = true) => {
  const diff = pokemonA.name.localeCompare(pokemonB.name);
  return ascending ? diff : -diff;
};
```

**Step 3:** Add case in `sortPokemon()` function
```javascript
export const sortPokemon = (pokemonA, pokemonB, sortBy) => {
  switch (sortBy) {
    // ... existing cases
    case 'name-asc':
      return sortByName(pokemonA, pokemonB, true);
    // ...
  }
};
```

Done! ✅

---

### Adding a New Filter

**Step 1:** Add filter UI (e.g., in `Search.jsx` or create new component)
```javascript
<select value={generation} onChange={onGenerationChange}>
  <option value="all">All Generations</option>
  <option value="1">Generation 1</option>
</select>
```

**Step 2:** Add filter function in `src/utils/pokemonFilters.js`
```javascript
export const filterByGeneration = (pokemon, generation) => {
  if (generation === 'all') return true;
  // Your filter logic here
  return pokemon.id <= 151; // Example for Gen 1
};
```

**Step 3:** Use in `PokemonGrid.jsx`
```javascript
const processedPokemon = pokemonList
  .filter(p => filterByName(p, searchTerm))
  .filter(p => filterByType(p, selectedType))
  .filter(p => filterByGeneration(p, generation)); // New filter
```

---

### Changing Items Per Page

**File:** `src/components/PokemonGrid.jsx`

```javascript
// Change this number:
const pagination = usePagination(processedPokemon, 24); // ← Change 24 to your desired number
```

---

### Modifying Loading Animation

**File:** `src/components/ui/LoadingState.jsx`

```javascript
// Find and modify the animation section:
<div className="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
  {/* Modify this part */}
</div>
```

---

### Adding a New Page/Route

**File:** `src/App.jsx`

```javascript
// Import your new component
import MyNewPage from './components/MyNewPage';

// Add route
<Routes>
  {/* Existing routes */}
  <Route path="/new-page" element={<MyNewPage />} />
</Routes>
```

---

## 🧪 Testing Checklist

### Before Committing Code:

- [ ] No linter errors (`npm run lint`)
- [ ] App runs without errors (`npm run dev`)
- [ ] All features work (search, filter, sort, pagination)
- [ ] Click a Pokemon card → details page loads
- [ ] Back button returns to list
- [ ] Responsive on mobile (test in DevTools)
- [ ] No console errors in browser

---

## 🐛 Debugging Guide

### Problem: Pokemon not loading

**Check:**
1. Browser console for errors
2. Network tab for failed requests
3. `usePokemonData.js` - check API endpoints
4. React Query DevTools (if installed)

**Common Fixes:**
- Check internet connection
- Verify PokeAPI is up (visit https://pokeapi.co)
- Clear browser cache

---

### Problem: Filter not working

**Check:**
1. Console for errors
2. `pokemonFilters.js` - verify filter logic
3. `PokemonGrid.jsx` - ensure filter is applied
4. State in App.jsx - verify props passed correctly

**Common Fixes:**
- Check if filter value is passed correctly
- Verify filter function returns boolean
- Check for typos in property names

---

### Problem: Pagination broken

**Check:**
1. `usePagination.js` - check calculations
2. `PokemonGrid.jsx` - verify pagination is used
3. Console for math errors

**Common Fixes:**
- Verify `itemsPerPage` is a number
- Check `currentPage` state updates
- Ensure `totalPages` calculated correctly

---

### Problem: Type colors wrong

**Check:**
1. `pokemonTypes.js` - verify color defined
2. Component imports `getTypeColor` correctly
3. Type name matches exactly (lowercase)

**Common Fixes:**
- Add missing type to `TYPE_COLORS`
- Check for typos in type names
- Ensure color is valid Tailwind class

---

## 📦 Component API Reference

### PokemonCard

**Props:**
```typescript
pokemon: {
  id: number;
  name: string;
  sprites: {...};
  types: Array<{type: {name: string}}>;
}
```

**Usage:**
```jsx
<PokemonCard pokemon={pokemonData} />
```

---

### PokemonGrid

**Props:**
```typescript
searchTerm: string;      // "" for no filter
selectedType: string;    // "all" for all types
sortBy: string;          // "id-asc", "id-desc", etc.
```

**Usage:**
```jsx
<PokemonGrid 
  searchTerm="pik"
  selectedType="electric"
  sortBy="id-asc"
/>
```

---

### LoadingState

**Props:**
```typescript
message?: string;           // Default: "Loading Pokémon..."
submessage?: string;        // Default: "Catching them all for you!"
loadedCount?: number;       // For progress bar
totalCount?: number;        // For progress bar
```

**Usage:**
```jsx
<LoadingState 
  message="Loading..."
  loadedCount={50}
  totalCount={151}
/>
```

---

### ErrorState

**Props:**
```typescript
title?: string;             // Default: "Oops! Something went wrong"
message?: string;           // Default error message
onRetry?: () => void;       // Retry callback
onGoBack?: () => void;      // Go back callback
error?: string | object;    // Technical error details
```

**Usage:**
```jsx
<ErrorState 
  message="Failed to load data"
  onRetry={() => refetch()}
  error={error.message}
/>
```

---

### Pagination

**Props:**
```typescript
currentPage: number;
totalPages: number;
onPageChange: (page: number) => void;
pageNumbers: number[];
showingStart: number;
showingEnd: number;
totalItems: number;
isFirstPage: boolean;
isLastPage: boolean;
```

**Usage:**
```jsx
<Pagination
  currentPage={pagination.currentPage}
  totalPages={pagination.totalPages}
  onPageChange={pagination.goToPage}
  pageNumbers={pagination.getPageNumbers()}
  // ... other props from usePagination
/>
```

---

## 🎨 Styling Guide

### Tailwind Classes Used

**Colors:**
- Primary: `blue-500`, `blue-600`
- Success: `green-500`
- Error: `red-500`, `red-600`
- Warning: `yellow-500`
- Gray: `gray-50` through `gray-800`

**Spacing:**
- Padding: `p-4`, `px-4`, `py-2`
- Margin: `m-4`, `mb-6`, `mt-8`
- Gap: `gap-2`, `gap-4`, `gap-6`

**Layout:**
- Grid: `grid`, `grid-cols-X`
- Flex: `flex`, `flex-col`, `justify-center`, `items-center`
- Container: `container mx-auto`

**Effects:**
- Hover: `hover:scale-105`, `hover:bg-blue-600`
- Transition: `transition-all`, `transition-colors`
- Shadow: `shadow-lg`, `shadow-md`

---

## 🔧 Useful Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix lint errors automatically
npm run lint -- --fix
```

---

## 📊 Performance Tips

### Optimize Images
```javascript
// Already implemented:
<img loading="lazy" />  // Lazy load images

// Future: Add srcset for responsive images
<img 
  src="small.jpg"
  srcSet="small.jpg 300w, large.jpg 1024w"
/>
```

### Memoize Expensive Calculations
```javascript
import { useMemo } from 'react';

const filtered = useMemo(() => 
  expensiveFilter(data),
  [data] // Only recalculate when data changes
);
```

### Memoize Components
```javascript
import { memo } from 'react';

const PokemonCard = memo(({ pokemon }) => {
  // Component only re-renders if pokemon changes
});
```

---

## 🎓 When to Create New Files

### Create a new **constant** file when:
- [ ] Same data used in 2+ places
- [ ] Configuration values
- [ ] Static lookup tables

### Create a new **utility** file when:
- [ ] Pure functions (no side effects)
- [ ] Logic used in multiple components
- [ ] Testable without React

### Create a new **hook** file when:
- [ ] Stateful logic used in 2+ places
- [ ] Complex logic cluttering component
- [ ] Need to test logic separately

### Create a new **component** file when:
- [ ] UI section > 50 lines
- [ ] Pattern repeats in multiple places
- [ ] Component doing multiple jobs

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't: Mix data fetching and UI in one component
```javascript
function MyComponent() {
  const [data, setData] = useState([]);
  useEffect(() => { fetch(...) }, []); // ❌ Bad
  return <div>{data.map(...)}</div>;
}
```

### ✅ Do: Use custom hooks
```javascript
function MyComponent() {
  const { data } = useMyData(); // ✅ Good
  return <div>{data.map(...)}</div>;
}
```

---

### ❌ Don't: Duplicate constants
```javascript
// File1.jsx
const colors = { fire: 'red' }; // ❌ Bad

// File2.jsx  
const colors = { fire: 'red' }; // ❌ Bad
```

### ✅ Do: Extract to shared file
```javascript
// constants/colors.js
export const colors = { fire: 'red' }; // ✅ Good

// Both files import from constants
```

---

### ❌ Don't: Create massive components
```javascript
function MyComponent() {
  // 500 lines of code ❌ Bad
}
```

### ✅ Do: Break into smaller pieces
```javascript
function MyComponent() {
  return (
    <>
      <Header />
      <Content />
      <Footer />
    </>
  ); // ✅ Good
}
```

---

## 📚 Learning Resources

### Official Docs:
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [TanStack Query](https://tanstack.com/query)

### Recommended Reading:
- Clean Code by Robert C. Martin
- Refactoring by Martin Fowler
- JavaScript: The Good Parts

### YouTube Channels:
- Web Dev Simplified
- Fireship
- Kent C. Dodds

---

## 🎯 Next Steps

1. **Practice:** Try refactoring another component yourself
2. **Extend:** Add new features (favorites, search history, compare Pokemon)
3. **Test:** Write unit tests for utils and hooks
4. **Optimize:** Add React.memo, useMemo where needed
5. **Learn:** Study the patterns used and understand why they work

---

**Remember:** Good code is code that's easy to understand and change! 🚀

Questions? Check `REFACTORING_SUMMARY.md` for detailed explanations!

