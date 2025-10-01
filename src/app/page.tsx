"use client";

import React, { useState } from "react";
import ReturnList from "../components/ReturnList";
import { ReturnRequest } from "../types/types";
import { v4 as uuidv4 } from "uuid";

const initialData: ReturnRequest[] = [
  {
    orderId: "ORD123",
    customerName: "ABC Company",
    returnDate: "2025-10-01",
    palletCount: 5,
    status: "Pending",
    remarks: "Handle with care",
  },
  {
    orderId: "ORD124",
    customerName: "XYZ Ltd.",
    returnDate: "2025-09-28",
    palletCount: 2,
    status: "Completed",
  },
];

export default function Dashboard() {
  const [returns, setReturns] = useState<ReturnRequest[]>(initialData);
  const [search, setSearch] = useState("");

  // Form state
  const [customerName, setCustomerName] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [palletCount, setPalletCount] = useState<number>(1);
  const [remarks, setRemarks] = useState("");

  // Collapsible form state
  const [showForm, setShowForm] = useState(true);

  // Filtered list for search
  const filteredData = returns.filter(
    (item) =>
      item.customerName.toLowerCase().includes(search.toLowerCase()) ||
      item.orderId.toLowerCase().includes(search.toLowerCase())
  );

  // Add new return
  const handleAddReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const newReturn: ReturnRequest = {
      orderId: `ORD-${uuidv4().slice(0, 8)}`,
      customerName,
      returnDate,
      palletCount,
      status: "Pending",
      remarks: remarks || undefined,
    };
    setReturns([newReturn, ...returns]);
    setCustomerName("");
    setReturnDate("");
    setPalletCount(1);
    setRemarks("");
  };

  // Change status handler
  const handleStatusChange = (id: string, status: "Completed" | "Rejected") => {
    const updatedReturns = returns.map((r) =>
      r.orderId === id ? { ...r, status } : r
    );
    setReturns(updatedReturns);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-700">
            Home
          </a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-700">
            Returns
          </a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-700">
            Reports
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Header + search */}
        <header className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
            Pallet Return Dashboard
          </h1>

          <input
            type="text"
            placeholder="Search by customer or order ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </header>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-500 text-white rounded-lg shadow flex flex-col items-center">
            <span className="text-2xl font-bold">{returns.length}</span>
            <span>Total Returns</span>
          </div>

          <div className="p-4 bg-yellow-500 text-white rounded-lg shadow flex flex-col items-center">
            <span className="text-2xl font-bold">
              {returns.filter((r) => r.status === "Pending").length}
            </span>
            <span>Pending</span>
          </div>

          <div className="p-4 bg-green-500 text-white rounded-lg shadow flex flex-col items-center">
            <span className="text-2xl font-bold">
              {returns.filter((r) => r.status === "Completed").length}
            </span>
            <span>Completed</span>
          </div>

          <div className="p-4 bg-red-500 text-white rounded-lg shadow flex flex-col items-center">
            <span className="text-2xl font-bold">
              {returns.filter((r) => r.status === "Rejected").length}
            </span>
            <span>Rejected</span>
          </div>
        </div>

        {/* Toggle Add Return Form */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
        >
          {showForm ? "Hide Form" : "Add New Return"}
        </button>

        {/* Add Return Form */}
        {showForm && (
          <form
            onSubmit={handleAddReturn}
            className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-all duration-300"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              Add New Return
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                required
                className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <input
                type="number"
                placeholder="Pallet Count"
                value={palletCount}
                onChange={(e) => setPalletCount(Number(e.target.value))}
                min={1}
                required
                className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Remarks (optional)"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Add Return
            </button>
          </form>
        )}

        {/* Return requests list */}
        <ReturnList data={filteredData} onStatusChange={handleStatusChange} />
      </main>
    </div>
  );
}
