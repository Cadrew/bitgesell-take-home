import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Items from "../pages/Items";
import { useData } from "../state/DataContext";

jest.mock("../state/DataContext");

describe("Items", () => {
  const mockFetchItems = jest.fn().mockResolvedValue({ total: 2 });
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    useData.mockReturnValue({
      items: [
        {
          id: 1,
          name: "Item1",
          category: "Cat1",
          price: 10,
          image: "/img1.jpg",
        },
        {
          id: 2,
          name: "Item2",
          category: "Cat2",
          price: 20,
          image: "/img2.jpg",
        },
      ],
      fetchItems: mockFetchItems,
      addToCart: mockAddToCart,
      error: null,
    });
    jest.restoreAllMocks();
  });

  it("renders search input and items list", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Items />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Item1")).toBeInTheDocument();
      expect(screen.getByText("Cat1")).toBeInTheDocument();
      expect(screen.getByText("$10")).toBeInTheDocument();
      expect(
        screen.getAllByText(/Add to Cart/, {
          selector: "button",
        })
      ).toHaveLength(2);
    });
  });

  it("disables previous button on first page", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Items />
      </MemoryRouter>
    );

    await waitFor(() => {
      const prevButton = screen.getByText(/Previous/, {
        selector: "button",
      });
      expect(prevButton).toBeDisabled();
    });
  });

  it("next button is disabled when no further pages", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Items />
      </MemoryRouter>
    );

    await waitFor(() => {
      const nextButton = screen.getByText(/Next/, {
        selector: "button",
      });
      expect(nextButton).toBeDisabled();
    });
  });

  it("triggers add to cart", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Items />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Item1")).toBeInTheDocument();
    });

    const addToCartButtons = screen.getAllByText(/Add to Cart/, {
      selector: "button",
    });
    fireEvent.click(addToCartButtons[0]);

    expect(mockAddToCart).toHaveBeenCalledWith({
      id: 1,
      name: "Item1",
      category: "Cat1",
      price: 10,
      image: "/img1.jpg",
    });
  });

  it("handles search input", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Items />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search products...");
    fireEvent.change(searchInput, { target: { value: "Item1" } });

    await waitFor(() => {
      expect(mockFetchItems).toHaveBeenCalledWith(
        expect.objectContaining({ q: "Item1", page: 1 })
      );
    });
  });
});
