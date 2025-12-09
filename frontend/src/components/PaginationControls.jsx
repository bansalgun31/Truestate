import React from "react";

export default function PaginationControls({ page, totalPages, onPageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        Previous
      </button>

      <div style={{ display: "flex", gap: 8 }}>
        {pages.map((p) => (
          <button
            key={p}
            className={p === page ? "page-btn active" : "page-btn"}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        className="page-btn"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}
