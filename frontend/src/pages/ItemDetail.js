import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useData } from "../state/DataContext";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { addToCart } = useData();

  useEffect(() => {
    let isMounted = true;
    fetch(`http://localhost:3001/api/items/${id}`)
      .then((res) =>
        res.ok ? res.json() : Promise.reject(new Error("Item not found"))
      )
      .then((data) => isMounted && setItem(data))
      .catch((err) => isMounted && setError(err.message));
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg font-medium">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="btn-secondary mt-4"
          aria-label="Back to products"
        >
          <FaArrowLeft className="mr-2" /> Back to Products
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="animate-pulse product-card max-w-2xl mx-auto mt-12">
        <div className="product-image bg-gray-200"></div>
        <div className="product-content">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <button
        onClick={() => navigate("/")}
        className="btn-secondary mb-6"
        aria-label="Back to products"
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </button>
      <div className="product-card">
        <div
          className="product-image"
          style={{
            backgroundImage: `url(${item.image || "/placeholder.png"})`,
            backgroundPosition: "center",
            backgroundSize: "60%",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="product-content">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{item.name}</h2>
          <p className="product-category mb-2">{item.category}</p>
          <p className="product-price mb-4">${item.price}</p>
          <button
            className="btn-add-to-cart w-full"
            onClick={() => addToCart(item)}
            aria-label={`Add ${item.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
