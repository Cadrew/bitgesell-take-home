import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ItemDetail from "../pages/ItemDetail";
import { useData } from "../state/DataContext";

jest.mock("../state/DataContext");

describe("ItemDetail", () => {
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    jest.restoreAllMocks();
    useData.mockReturnValue({
      addToCart: mockAddToCart,
    });
  });

  it("renders loading skeleton initially", () => {
    jest.spyOn(global, "fetch").mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter
        initialEntries={["/items/1"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders item details on successful fetch", async () => {
    const mockItem = {
      name: "Test",
      category: "Cat",
      price: 9.99,
      image: "/test.jpg",
    };
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockItem,
    });

    render(
      <MemoryRouter
        initialEntries={["/items/1"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
      expect(screen.getByText("Cat")).toBeInTheDocument();
      expect(screen.getByText("$9.99")).toBeInTheDocument();
      expect(
        screen.getByText(/Add to Cart/, {
          selector: "button",
        })
      ).toBeInTheDocument();
    });
  });

  it("renders error state on failed fetch", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false });

    render(
      <MemoryRouter
        initialEntries={["/items/1"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Item not found")).toBeInTheDocument();
      expect(
        screen.getByText(/Back to Products/, {
          selector: "button",
        })
      ).toBeInTheDocument();
    });
  });

  it("triggers add to cart", async () => {
    const mockItem = {
      name: "Test",
      category: "Cat",
      price: 9.99,
      image: "/test.jpg",
    };
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockItem,
    });

    render(
      <MemoryRouter
        initialEntries={["/items/1"]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route path="/items/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Test")).toBeInTheDocument();
    });

    const addToCartButton = screen.getByText(/Add to Cart/, {
      selector: "button",
    });
    fireEvent.click(addToCartButton);

    expect(mockAddToCart).toHaveBeenCalledWith(mockItem);
  });
});
