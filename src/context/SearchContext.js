import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useState({ source: '', destination: '', date: '' });
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const updateSearch = (params) => setSearchParams(params);
  const updateResults = (results) => { setSearchResults(results); setHasSearched(true); };
  const clearSearch = () => { setSearchResults([]); setHasSearched(false); };

  return (
    <SearchContext.Provider value={{ searchParams, searchResults, hasSearched, updateSearch, updateResults, clearSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
};
