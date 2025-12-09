import React, { useState, useEffect } from "react";

const REGIONS = ["North", "South", "East", "West"];
const GENDERS = ["Male", "Female", "Other"];

export default function FilterPanel({ filters, onChange, onReset }) {
  const [local, setLocal] = useState(filters);

  useEffect(() => setLocal(filters), [filters]);

  const toggleArray = (key, value) => {
    const next = { ...local };
    next[key] = next[key] || [];
    if (next[key].indexOf(value) !== -1)
      next[key] = next[key].filter((v) => v !== value);
    else next[key] = [...next[key], value];
    setLocal(next);
    onChange(next);
  };

  const onAgeChange = (k, v) => {
    const next = { ...local, [k]: v };
    setLocal(next);
    onChange(next);
  };

  return (
    <div className="border rounded p-4 bg-white" style={{ width: 240 }}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        <button className="text-xs text-teal-600" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="mb-3">
        <div className="text-sm font-semibold mb-1">Region</div>
        <div className="flex flex-col gap-2">
          {REGIONS.map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  Array.isArray(local.regions) &&
                  local.regions.indexOf(r) !== -1
                }
                onChange={() => toggleArray("regions", r)}
              />
              <span>{r}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm font-semibold mb-1">Gender</div>
        <div className="flex flex-col gap-2">
          {GENDERS.map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={
                  Array.isArray(local.genders) &&
                  local.genders.indexOf(g) !== -1
                }
                onChange={() => toggleArray("genders", g)}
              />
              <span>{g}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold mb-1">Age</div>
        <div className="flex gap-2 items-center">
          <input
            value={local.ageMin || ""}
            onChange={(e) => onAgeChange("ageMin", e.target.value)}
            placeholder="Min"
            className="w-20 px-2 py-1 border rounded text-sm"
            type="number"
            min="0"
          />
          <span className="text-sm">—</span>
          <input
            value={local.ageMax || ""}
            onChange={(e) => onAgeChange("ageMax", e.target.value)}
            placeholder="Max"
            className="w-20 px-2 py-1 border rounded text-sm"
            type="number"
            min="0"
          />
        </div>
      </div>
    </div>
  );
}
