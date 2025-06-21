import React, { useEffect, useState, useCallback } from "react";
import { useData } from "../state/DataContext";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";

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

    loadItems().catch((err) => {
      if (isMounted) console.error(err);
    });

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
    <div style={style} className="p-2">
      {loading ? (
        <div className="animate-pulse bg-gray-200 h-6 rounded"></div>
      ) : (
        <Link
          to={`/items/${items[index].id}`}
          className="text-blue-600 hover:underline"
          aria-label={`View details for ${items[index].name}`}
        >
          {items[index].name}
        </Link>
      )}
    </div>
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search items..."
          className="w-full p-2 border rounded-md"
          aria-label="Search items"
        />
      </div>
      {loading && !items.length ? (
        <div className="space-y-2">
          {[...Array(pageSize)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-6 rounded"
            ></div>
          ))}
        </div>
      ) : (
        <>
          <List
            height={400}
            itemCount={items.length}
            itemSize={35}
            width="100%"
          >
            {Row}
          </List>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages || loading}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
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
