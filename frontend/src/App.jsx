import React from "react";
import TransactionsPage from "./pages/TransactionsPage";
import "./styles/global.css";

export default function App() {
  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-800">
      {/* use the same app-container wrapper for header and main so they align */}
      <header className="app-container header-container mb-6">
        <h1 className="text-3xl font-serif font-semibold">
          Sales Management System
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage transactions with search, filters, sorting and pagination
        </p>
      </header>

      <main className="app-container">
        <TransactionsPage />
      </main>
    </div>
  );
}
