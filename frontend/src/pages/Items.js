import React, { useEffect, useState, useCallback } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

function Items() {
  const { items, fetchItems, addToCart } = useData();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchItems({ page, pageSize, q: search });
      setTotal(response.total);
    } finally {
      setLoading(false);
    }
  }, [fetchItems, page, pageSize, search]);

  useEffect(() => {
    let isMounted = true;
    loadItems().catch((err) => isMounted && console.error(err));
    return () => {
      isMounted = false;
    };
  }, [loadItems]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-8">
      <div className="relative">
        <FaSearch className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search products..."
          className="search-input"
          aria-label="Search products"
        />
      </div>
      {loading && !items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(pageSize)].map((_, i) => (
            <div key={i} className="animate-pulse product-card">
              <div className="product-image bg-gray-200"></div>
              <div className="product-content">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="product-card">
                <Link
                  to={`/items/${item.id}`}
                  className="block"
                  aria-label={`View details for ${item.name}`}
                >
                  <div
                    className="product-image"
                    style={{
                      backgroundImage: `url(${
                        item.image || "/placeholder.png"
                      })`,
                      backgroundPosition: "center",
                      backgroundSize: "80%",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>
                  <div className="product-content">
                    <h3 className="product-title">{item.name}</h3>
                    <p className="product-category">{item.category}</p>
                    <p className="product-price">${item.price}</p>
                  </div>
                </Link>
                <button
                  className="btn-add-to-cart-item w-full mt-2"
                  onClick={() => addToCart(item)}
                  aria-label={`Add ${item.name} to cart`}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="pagination-btn"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-gray-600 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages || loading}
              className="pagination-btn"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Items;
