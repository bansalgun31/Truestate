// src/hooks/useTransactions.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { fetchTransactions } from "../services/api";

export default function useTransactions(initial = {}) {
  const [state, setState] = useState({
    page: 1,
    q: "",
    sortBy: "Date",
    sortDir: "asc",
    filters: {},
    total: null,
    ...initial,
  });

  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const cancelRef = useRef(false);

  const load = useCallback(
    async (override = {}) => {
      const s = { ...state, ...override };

      const payload = {
        page: s.page || 1,
        search: s.q || "",
        regions: (s.filters && s.filters.regions) || [],
        genders: (s.filters && s.filters.genders) || [],
        categories: (s.filters && s.filters.categories) || [],
        tags: (s.filters && s.filters.tags) || [],
        paymentMethods: (s.filters && s.filters.paymentMethods) || [],
        ageMin: (s.filters && s.filters.ageMin) || "",
        ageMax: (s.filters && s.filters.ageMax) || "",
        dateFrom: (s.filters && s.filters.dateFrom) || "",
        dateTo: (s.filters && s.filters.dateTo) || "",
        sortBy: s.sortBy || "",
        sortOrder: s.sortDir || "asc",
      };

      cancelRef.current = false;
      setLoading(true);

      try {
        const data = await fetchTransactions(payload);
        if (cancelRef.current) return;

        setResults(data.results || []);
        setTotalPages(data.totalPages || 1);
        setState((prev) => ({
          ...prev,
          total:
            typeof data.total !== "undefined"
              ? data.total
              : (data.results || []).length,
        }));
      } catch (err) {
        console.error("useTransactions.load error:", err);
        setResults([]);
        setTotalPages(1);
        setState((prev) => ({ ...prev, total: 0 }));
      } finally {
        if (!cancelRef.current) setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.page, state.q, state.sortBy, state.sortDir, JSON.stringify(state.filters)]
  );

  useEffect(() => {
    cancelRef.current = false;
    load();
    return () => {
      cancelRef.current = true;
    };
  }, [load]);

  function setQueryParam(patch) {
    setState((s) => ({ ...s, ...patch }));
  }

  function setPage(p) {
    setState((s) => ({ ...s, page: p }));
  }

  function resetFilters() {
    setState((s) => ({ ...s, filters: {}, page: 1 }));
  }

  return {
    state,
    results,
    total: state.total,
    totalPages,
    loading,
    setQueryParam,
    setPage,
    resetFilters,
    reload: () => load(),
  };
}
