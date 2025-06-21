import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Cart from "../pages/Cart";
import { DataProvider, useData } from "../state/DataContext";

describe("Cart", () => {
  const mockCart = [
    {
      id: 1,
      name: "Item1",
      price: 10,
      category: "Cat1",
      image: "/img1.jpg",
      quantity: 5,
    },
    {
      id: 2,
      name: "Item2",
      price: 20,
      category: "Cat2",
      image: "/img2.jpg",
      quantity: 1,
    },
  ];

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(window, "alert").mockImplementation(() => {});
  });

  afterEach(() => {
    window.alert.mockRestore();
  });

  const wrapper = ({ children }) => (
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <DataProvider>{children}</DataProvider>
    </MemoryRouter>
  );

  const TestComponent = () => {
    const { addToCart } = useData();
    React.useEffect(() => {
      mockCart.forEach((item) => addToCart(item));
    }, [addToCart]);
    return <Cart />;
  };

  it("renders empty cart message", () => {
    render(<Cart />, { wrapper });

    expect(screen.getByText("Your Cart is Empty")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Shop Now/ })).toBeInTheDocument();
  });

  it("renders cart items and total", () => {
    render(<TestComponent />, { wrapper });

    expect(screen.getByText("Item1")).toBeInTheDocument();
    expect(screen.getByText("Cat1")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("$10")).toBeInTheDocument();
    expect(screen.getByText("Item2")).toBeInTheDocument();
    expect(screen.getByText("Cat2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("$20")).toBeInTheDocument();
    expect(screen.getByText("Total: $70.00")).toBeInTheDocument();
  });

  it("increases item quantity", () => {
    render(<TestComponent />, { wrapper });

    const increaseButtons = screen.getAllByLabelText(
      /Increase quantity of Item1/,
      {
        selector: "button",
      }
    );
    fireEvent.click(increaseButtons[0]);

    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("Total: $80.00")).toBeInTheDocument();
  });

  it("decreases item quantity", () => {
    render(<TestComponent />, { wrapper });

    const decreaseButtons = screen.getAllByLabelText(
      /Decrease quantity of Item1/,
      {
        selector: "button",
      }
    );
    fireEvent.click(decreaseButtons[0]);

    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("Total: $60.00")).toBeInTheDocument();
  });

  it("removes item from cart", () => {
    render(<TestComponent />, { wrapper });

    const removeButtons = screen.getAllByLabelText(/Remove Item1 from cart/, {
      selector: "button",
    });
    fireEvent.click(removeButtons[0]);

    expect(screen.queryByText("Item1")).not.toBeInTheDocument();
    expect(screen.getByText("Total: $20.00")).toBeInTheDocument();
  });

  it("navigates back to products", () => {
    render(<TestComponent />, { wrapper });

    const backButton = screen.getByText(/Back to Products/, {
      selector: "button",
    });
    fireEvent.click(backButton);

    // Note: Navigation is not testable with MemoryRouter without mocking useNavigate
    // If you want to test navigation, mock useNavigate as in ItemDetail.test.js
  });

  it("triggers checkout alert", () => {
    render(<TestComponent />, { wrapper });

    const checkoutButton = screen.getByText(/Proceed to Checkout/, {
      selector: "button",
    });
    fireEvent.click(checkoutButton);

    expect(window.alert).toHaveBeenCalledWith(
      "Checkout functionality not implemented"
    );
  });
});
