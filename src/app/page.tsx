"use client";

import React, { useState, useEffect } from "react";
import ReturnList from "../components/ReturnList";
import ReturnEdit from "@/components/ReturnEdit";
import { ReturnRequest } from "../types/types";

export default function Dashboard() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(true);

  // Add form state
  const [customerName, setCustomerName] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [palletCount, setPalletCount] = useState<number>(1);
  const [remarks, setRemarks] = useState("");

  // Edit modal state
  const [editingReturn, setEditingReturn] = useState<ReturnRequest | null>(null);

  // Fetch all returns
  const fetchReturns = async () => {
    try {
      const res = await fetch("/api/returns");
      if (!res.ok) throw new Error("Failed to fetch returns");
      const data = await res.json();
      setReturns(data);
    } catch (err) {
      console.error("Error fetching returns:", err);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // Add new return
  const handleAddReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    const newReturn: ReturnRequest = {
      _id: crypto.randomUUID(),
      orderId: `ORD-${Date.now()}`,
      customerName,
      returnDate,
      palletCount,
      status: "Pending",
      remarks: remarks || "",
    };

    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReturn),
      });
      if (!res.ok) throw new Error("Failed to add return");

      // Reset form
      setCustomerName("");
      setReturnDate("");
      setPalletCount(1);
      setRemarks("");
      fetchReturns();
    } catch (err) {
      console.error("Error adding return:", err);
    }
  };

  // Unified edit/update function
  const handleEditReturn = async (updatedReturn: ReturnRequest) => {
    try {
      const res = await fetch(`/api/returns/${updatedReturn._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: updatedReturn.status,
          customerName: updatedReturn.customerName,
          returnDate: updatedReturn.returnDate,
          palletCount: updatedReturn.palletCount,
          remarks: updatedReturn.remarks,
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        console.error("API error:", data);
        throw new Error(data.error || "Failed to update return");
      }

      setEditingReturn(null);
      fetchReturns();
    } catch (err) {
      console.error("Error updating return:", err);
    }
  };

  // Change status only
  const handleStatusChange = async (
    id: string,
    newStatus: "Pending" | "Completed" | "Rejected"
  ) => {
    const returnToUpdate = returns.find((r) => r._id === id);
    if (!returnToUpdate) return;

    await handleEditReturn({ ...returnToUpdate, status: newStatus });
  };

  // Delete a return
const handleDeleteReturn = async (id: string) => {
  if (!confirm("Are you sure you want to delete this return?")) return;

  try {
    const res = await fetch(`/api/returns/${id}`, { method: "DELETE" });

    let data: any = {};
    const contentType = res.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      try {
        data = await res.json();
      } catch (err) {
        console.warn("Failed to parse JSON response from DELETE:", err);
      }
    }

    if (!res.ok) {
      throw new Error(data.error || "Failed to delete return");
    }

    console.log("Return deleted:", id);
    fetchReturns();
  } catch (err) {
    console.error("Error deleting return:", err);
  }
};





  // Filtered returns
  const filteredData = returns.filter(
    (r) =>
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-700">Home</a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-700">Returns</a>
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-700">Reports</a>
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

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-500 text-white rounded-lg shadow flex flex-col items-center">
            <span className="text-2xl font-bold">{filteredData.length}</span>
            <span>Total Returns</span>
          </div>
          <div className="p-4 bg-yellow-500 text-white rounded-lg shadow flex flex-col items-center">
            <span className="text-2xl font-bold">
              {filteredData.filter((r) => r.status === "Pending").length}
            </span>
            <span>Pending</span>
          </div>
          <div className="p-4 bg-green-500 text-white rounded-lg shadow flex flex-col items-center">
            <span className="text-2xl font-bold">
              {filteredData.filter((r) => r.status === "Completed").length}
            </span>
            <span>Completed</span>
          </div>
          <div className="p-4 bg-red-500 text-white rounded-lg shadow flex flex-col items-center">
            <span className="text-2xl font-bold">
              {filteredData.filter((r) => r.status === "Rejected").length}
            </span>
            <span>Rejected</span>
          </div>
        </div>

        {/* Toggle Add Form */}
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

        {/* Return List */}
        <ReturnList
          data={filteredData}
          onStatusChange={handleStatusChange}
          onEdit={(r) => setEditingReturn(r)}
          onDelete={handleDeleteReturn}
        />

        {/* Edit Modal */}
        {editingReturn && (
          <ReturnEdit
            returnData={editingReturn}
            onSave={handleEditReturn}
            onCancel={() => setEditingReturn(null)}
          />
        )}
      </main>
    </div>
  );
}
