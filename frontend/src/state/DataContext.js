import React, { createContext, useCallback, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(
    async ({ page = 1, pageSize = 10, q = "" } = {}) => {
      const url = new URL("http://localhost:3001/api/items");
      url.searchParams.append("page", page);
      url.searchParams.append("pageSize", pageSize);
      if (q) url.searchParams.append("q", q);

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch items");
      const data = await res.json();
      setItems(data.items);
      return data;
    },
    []
  );

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
