// src/pages/TransactionsPage.jsx
import React from "react";
import SearchBar from "../components/SearchBar";
import SortingDropdown from "../components/SortingDropdown";
import TransactionTable from "../components/TransactionTable";
import PaginationControls from "../components/PaginationControls";
import useTransactions from "../hooks/useTransactions";
import FilterChips from "../components/FilterChips";

export default function TransactionsPage() {
  const {
    state,
    results,
    totalPages,
    loading,
    setQueryParam,
    setPage,
    resetFilters,
  } = useTransactions();

  const totalText = typeof state.total === "number" ? state.total : "-";

  return (
    <div className="app-container">
      <div className="header-row" style={{ marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <SearchBar
            value={state.q}
            onChange={(q) => setQueryParam({ q, page: 1 })}
          />
        </div>

        <div style={{ marginLeft: 12 }}>
          <SortingDropdown
            sortBy={state.sortBy}
            sortDir={state.sortDir}
            onChange={(s) => setQueryParam({ ...s, page: 1 })}
          />
        </div>
      </div>

      <div className="stats-row" role="region" aria-label="summary cards">
        <div className="stat-card">
          <div className="small-muted">Total units sold</div>
          <div className="text-lg font-semibold">10</div>
        </div>
        <div className="stat-card">
          <div className="small-muted">Total Amount</div>
          <div className="text-lg font-semibold">₹89,000</div>
        </div>
        <div className="stat-card">
          <div className="small-muted">Total Discount</div>
          <div className="text-lg font-semibold">₹15,000</div>
        </div>
      </div>

      <div className="filter-chips" style={{ marginBottom: 16 }}>
        <FilterChips
          filters={state.filters}
          onChange={(nextFilters) =>
            setQueryParam({ filters: nextFilters, page: 1 })
          }
          onReset={() => resetFilters()}
        />
      </div>

      <section className="page-grid">
        <div className="table-card">
          <TransactionTable loading={loading} data={results} />
        </div>

        <div
          className="mt-4 flex items-center justify-between"
          style={{ marginTop: 12 }}
        >
          <div className="small-muted">Total results: {totalText}</div>

          <PaginationControls
            page={state.page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      </section>
    </div>
  );
}
