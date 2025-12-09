import React from "react";

export default function SearchBar({ value = "", onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        aria-label="Search by customer name or phone"
        className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-300"
        placeholder="Search by name or phone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="px-3 py-2 border rounded bg-white text-sm hover:bg-gray-50"
        onClick={() => onChange("")}
      >
        Clear
      </button>
    </div>
  );
}
