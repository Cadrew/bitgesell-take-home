import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { FaShoppingCart, FaHome, FaList, FaInfoCircle } from "react-icons/fa";
import Items from "./Items";
import ItemDetail from "./ItemDetail";
import Cart from "./Cart";
import { DataProvider, useData } from "../state/DataContext";

function NavBar() {
  const { cart } = useData();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <FaShoppingCart className="h-6 w-6" />
          <span>Shop</span>
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            <FaHome className="inline mr-1" /> Home
          </Link>
          <Link to="/" className="nav-link">
            <FaList className="inline mr-1" /> Products
          </Link>
          <Link to="/cart" className="nav-cart">
            <FaShoppingCart className="h-6 w-6" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <DataProvider>
      <NavBar />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
      <footer className="footer">
        <div className="footer-container">
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Shop</h4>
            <p className="text-gray-400">
              Your trusted destination for premium products.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="footer-link">
                  Products
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <p className="text-gray-400">Email: support@shop.com</p>
            <p className="text-gray-400">Phone: +1 234 567 890</p>
          </div>
        </div>
      </footer>
    </DataProvider>
  );
}

export default App;
