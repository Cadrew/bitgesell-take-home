import React, { useEffect, useState, useCallback, useRef } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { FixedSizeList as List } from "react-window";

// Hook to track window height
function useWindowHeight() {
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return height;
}

// Utility: chunk flat array into rows
function chunk(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function Items() {
  const { items, fetchItems, addToCart } = useData();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // Refs and measurements for responsive width
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(window.innerWidth);

  // Measure container width
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.getBoundingClientRect().width);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Fetch items with pagination
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchItems({ page, pageSize, q: search });
      setTotal(response?.total || 0);
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

  // Tailwind breakpoints: sm(640), lg(1024), xl(1280)
  const columnCount =
    containerWidth < 640
      ? 2
      : containerWidth < 1024
      ? 3
      : containerWidth < 1280
      ? 4
      : 5;
  const rows = chunk(items, columnCount);

  const baseRowHeight = 360;
  const rowGap = 16;
  const rowHeight = baseRowHeight + rowGap;
  const totalListHeight = rows.length * rowHeight;

  // Row renderer for react-window
  const Row = ({ index, style }) => {
    const adjustedStyle = {
      ...style,
      paddingBottom: rowGap,
      boxSizing: "border-box",
      display: "grid",
      gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
    };
    return (
      <div className="grid gap-6" style={adjustedStyle}>
        {rows[index]?.map((item) => (
          <div key={item.id} className="product-card">
            <Link
              to={`/items/${item.id}`}
              className="block"
              aria-label={`View details for ${item.name}`}
            >
              <div
                className="product-image"
                style={{
                  backgroundImage: `url(${item.image || "/placeholder.png"})`,
                  backgroundPosition: "center",
                  backgroundSize: "80%",
                  backgroundRepeat: "no-repeat",
                }}
              />
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
    );
  };

  return (
    <div className="space-y-8" ref={containerRef}>
      {/* Search bar */}
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

      {/* Loading skeleton */}
      {loading && !items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(pageSize)].map((_, i) => (
            <div key={i} className="animate-pulse product-card">
              <div className="product-image bg-gray-200" />
              <div className="product-content">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Virtualized grid with full height */}
          <List
            height={totalListHeight}
            itemCount={rows.length}
            itemSize={rowHeight}
            width={containerWidth}
            style={{ overflow: "visible" }}
          >
            {Row}
          </List>

          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="pagination-btn"
              aria-label="Previous page"
            >
              <FaAngleLeft className="inline" /> Previous
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
              Next <FaAngleRight className="inline" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Items;
