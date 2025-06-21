import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { DataProvider, useData } from "../state/DataContext";

// Helper component to use context
function TestComponent({ initialFetch = true }) {
  const {
    items,
    fetchItems,
    error,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
  } = useData();

  React.useEffect(() => {
    if (initialFetch) {
      fetchItems({ page: 1, pageSize: 2, q: "" }).catch(() => {});
    }
  }, [fetchItems, initialFetch]);

  const handleAddToCart = () => {
    addToCart({
      id: 1,
      name: "Test Item",
      price: 10,
      category: "Test",
      image: "/test.jpg",
    });
  };

  const handleRemoveFromCart = () => {
    removeFromCart(1);
  };

  const handleUpdateQuantity = () => {
    updateCartQuantity(1, 3);
  };

  if (error) return <div role="alert">Error: {error}</div>;
  return (
    <div>
      <div data-testid="items-count">{items.length}</div>
      <div data-testid="cart-count">{cart.length}</div>
      <button onClick={handleAddToCart} data-testid="add-to-cart">
        Add to Cart
      </button>
      <button onClick={handleRemoveFromCart} data-testid="remove-from-cart">
        Remove from Cart
      </button>
      <button onClick={handleUpdateQuantity} data-testid="update-quantity">
        Update Quantity
      </button>
    </div>
  );
}

describe("DataContext", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it("fetches items and provides them via context", async () => {
    const fakeItems = [{ id: 1 }, { id: 2 }];
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ items: fakeItems, total: 2 }),
    });

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("items-count")).toHaveTextContent("2");
    });
  });

  it("handles fetch error and sets error state", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false });

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Error: Failed to fetch items"
      );
    });
  });

  it("adds item to cart", async () => {
    render(
      <DataProvider>
        <TestComponent initialFetch={false} />
      </DataProvider>
    );

    fireEvent.click(screen.getByTestId("add-to-cart"));
    expect(screen.getByTestId("cart-count")).toHaveTextContent("1");

    fireEvent.click(screen.getByTestId("add-to-cart"));
    expect(screen.getByTestId("cart-count")).toHaveTextContent("1"); // Same item, quantity increases
  });

  it("removes item from cart", async () => {
    render(
      <DataProvider>
        <TestComponent initialFetch={false} />
      </DataProvider>
    );

    fireEvent.click(screen.getByTestId("add-to-cart"));
    expect(screen.getByTestId("cart-count")).toHaveTextContent("1");

    fireEvent.click(screen.getByTestId("remove-from-cart"));
    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
  });

  it("updates item quantity in cart", async () => {
    render(
      <DataProvider>
        <TestComponent initialFetch={false} />
      </DataProvider>
    );

    fireEvent.click(screen.getByTestId("add-to-cart"));
    fireEvent.click(screen.getByTestId("update-quantity"));
    expect(screen.getByTestId("cart-count")).toHaveTextContent("1"); // Still one item
  });
});
