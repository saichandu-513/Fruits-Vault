import React, { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [term, setTerm] = useState("");

  const value = useMemo(
    () => ({
      term,
      setTerm
    }),
    [term]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return ctx;
}
