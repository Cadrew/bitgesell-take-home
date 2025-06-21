import React, { useEffect, useState, useCallback } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import { FaSearch } from "react-icons/fa";

function Items() {
  const { items, fetchItems } = useData();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
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

  const Row = ({ index, style }) => (
    <div style={style} className="px-2 py-1">
      {loading ? (
        <div className="animate-pulse bg-gray-100 rounded-lg p-4 shadow">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      ) : (
        <Link
          to={`/items/${items[index].id}`}
          className="block bg-white rounded-lg p-4 shadow hover:shadow-lg transition-transform transform hover:-translate-y-1"
          aria-label={`View details for ${items[index].name}`}
        >
          <h3 className="text-lg font-semibold text-gray-800">
            {items[index].name}
          </h3>
          <p className="text-sm text-gray-500">{items[index].category}</p>
          <p className="text-md font-bold text-blue-600">
            ${items[index].price}
          </p>
        </Link>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <FaSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search items..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          aria-label="Search items"
        />
      </div>
      {loading && !items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(pageSize)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 rounded-lg p-4 shadow"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <List
            height={600}
            itemCount={items.length}
            itemSize={120}
            width="100%"
            className="bg-gray-50 rounded-lg p-2"
          >
            {Row}
          </List>
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition"
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
