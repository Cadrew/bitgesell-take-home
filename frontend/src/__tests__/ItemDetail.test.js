import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ItemDetail from "../pages/ItemDetail";

describe("ItemDetail", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
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
    const mockItem = { name: "Test", category: "Cat", price: 9.99 };
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
      expect(screen.getByText(/Category:/)).toHaveTextContent("Cat");
      expect(screen.getByText(/Price:/)).toBeInTheDocument();
      expect(screen.getByText("$9.99")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Add to Cart/ })
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
        screen.getByRole("button", { name: /Back to Items/ })
      ).toBeInTheDocument();
    });
  });
});
