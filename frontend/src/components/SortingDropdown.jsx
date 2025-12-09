import React from "react";

const OPTIONS = [
  { label: "Date (Newest)", sortBy: "date", sortDir: "desc" },
  { label: "Date (Oldest)", sortBy: "date", sortDir: "asc" },
  { label: "Quantity (High→Low)", sortBy: "quantity", sortDir: "desc" },
  { label: "Customer Name (A–Z)", sortBy: "customerName", sortDir: "asc" },
];

export default function SortingDropdown({ sortBy, sortDir, onChange }) {
  const value = OPTIONS.findIndex(
    (o) => o.sortBy === sortBy && o.sortDir === sortDir
  );
  return (
    <select
      className="border rounded px-3 py-2 text-sm"
      value={value}
      onChange={(e) => {
        const opt = OPTIONS[e.target.value];
        onChange({ sortBy: opt.sortBy, sortDir: opt.sortDir });
      }}
    >
      {OPTIONS.map((o, i) => (
        <option key={o.label} value={i}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
