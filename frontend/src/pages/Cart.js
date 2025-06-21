import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useData } from "../state/DataContext";
import { FaTrash, FaArrowLeft } from "react-icons/fa";

function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useData();
  const navigate = useNavigate();

  const total = cart
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
    .toFixed(2);

  if (!cart.length) {
    return (
      <div className="main-container text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Cart is Empty
        </h2>
        <p className="text-gray-600 mb-6">
          Explore our products and start shopping!
        </p>
        <Link to="/" className="btn-primary">
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="main-container py-12">
      <button
        onClick={() => navigate("/")}
        className="btn-secondary mb-6"
        aria-label="Back to products"
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Your Cart</h2>
      <div className="space-y-6">
        {cart.map((item) => (
          <div key={item.id} className="product-card flex items-start gap-4">
            <div
              className="product-image w-24 h-24 flex-shrink-0"
              style={{
                backgroundImage: `url(${item.image || "/placeholder.png"})`,
                backgroundPosition: "center",
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="product-content flex-grow">
              <h3 className="product-title">{item.name}</h3>
              <p className="product-category">{item.category}</p>
              <p className="product-price">${item.price}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateCartQuantity(item.id, item.quantity - 1)
                    }
                    className="btn-secondary px-3 py-1"
                    disabled={item.quantity <= 1}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    -
                  </button>
                  <span className="text-gray-700 font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateCartQuantity(item.id, item.quantity + 1)
                    }
                    className="btn-secondary px-3 py-1"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="btn text-red-600 hover:text-red-800"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <FaTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Total: ${total}</h3>
        <button
          className="btn-primary"
          onClick={() => alert("Checkout functionality not implemented")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
