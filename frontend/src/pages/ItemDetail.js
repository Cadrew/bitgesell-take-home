import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/items/${id}`)
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
        <p className="text-red-600 text-lg">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaArrowLeft className="mr-2" /> Back to Items
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="animate-pulse max-w-lg mx-auto mt-12 bg-gray-100 rounded-lg p-6 shadow">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-12">
      <button
        onClick={() => navigate("/")}
        className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
        aria-label="Back to items"
      >
        <FaArrowLeft className="mr-2" /> Back to Items
      </button>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.name}</h2>
          <p className="text-gray-600 mb-2">
            <strong>Category:</strong> {item.category}
          </p>
          <p className="text-gray-600 mb-4">
            <strong>Price:</strong>{" "}
            <span className="text-green-600 font-semibold">${item.price}</span>
          </p>
          <button
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            onClick={() => alert("Add to cart functionality not implemented")}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
