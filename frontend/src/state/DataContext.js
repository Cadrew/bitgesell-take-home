import React, { createContext, useCallback, useContext, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(
    async ({ page = 1, pageSize = 10, q = "" } = {}) => {
      try {
        const url = new URL("http://localhost:3001/api/items");
        url.searchParams.append("page", page);
        url.searchParams.append("pageSize", pageSize);
        if (q) url.searchParams.append("q", q);

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch items");
        const data = await res.json();
        setItems(data.items);
        setError(null);
        return data;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const addToCart = useCallback((item) => {
    setCart((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === item.id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateCartQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }, []);

  return (
    <DataContext.Provider
      value={{
        items,
        fetchItems,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
