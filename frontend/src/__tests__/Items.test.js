import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Items from "../pages/Items";
import { useData } from "../state/DataContext";

jest.mock("../state/DataContext");

describe("Items", () => {
  beforeEach(() => {
    useData.mockReturnValue({
      items: [
        { id: 1, name: "Item1", category: "Cat1", price: 10 },
        { id: 2, name: "Item2", category: "Cat2", price: 20 },
      ],
      fetchItems: jest.fn().mockResolvedValue({ total: 2 }),
      error: null,
    });
  });

  it("renders search input and items list", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Items />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText("Search items...")).toBeInTheDocument();
    expect(await screen.findByText("Item1")).toBeInTheDocument();
    expect(screen.getByText("Cat1")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
  });

  it("disables previous button on first page", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Items />
      </MemoryRouter>
    );

    const prevButton = await screen.findByRole("button", {
      name: /Previous page/,
    });
    expect(prevButton).toBeDisabled();
  });

  it("next button is disabled when no further pages", async () => {
    render(
      <MemoryRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Items />
      </MemoryRouter>
    );

    const nextButton = await screen.findByRole("button", { name: /Next page/ });
    expect(nextButton).toBeDisabled();
  });
});
