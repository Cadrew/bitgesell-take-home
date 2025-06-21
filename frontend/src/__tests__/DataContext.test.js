import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { DataProvider, useData } from "../state/DataContext";

// Helper component to use context
function TestComponent() {
  const { items, fetchItems, error } = useData();

  React.useEffect(() => {
    fetchItems({ page: 1, pageSize: 2, q: "" }).catch(() => {});
  }, [fetchItems]);

  if (error) return <div role="alert">Error: {error}</div>;
  return <div data-testid="items-count">{items.length}</div>;
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
});
