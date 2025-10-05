"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { ReturnRequest } from "../types/types";
import ReturnList from "../components/ReturnList";
import ReturnEdit from "@/components/ReturnEdit";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle, X, Sun, Moon } from "lucide-react";

export default function Dashboard() {
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [palletCount, setPalletCount] = useState<number>(1);
  const [remarks, setRemarks] = useState("");
  const [editingReturn, setEditingReturn] = useState<ReturnRequest | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [theme, setTheme] = useState("light");

  // Fetch returns
  const fetchReturns = async () => {
    try {
      const res = await fetch("/api/returns");
      if (!res.ok) throw new Error("Failed to fetch returns");
      const data = await res.json();
      setReturns(data.reverse());
    } catch (err) {
      console.error("Error fetching returns:", err);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

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

      setCustomerName("");
      setReturnDate("");
      setPalletCount(1);
      setRemarks("");
      setShowForm(false);
      fetchReturns();
    } catch (err) {
      console.error("Error adding return:", err);
    }
  };

  // Edit return
  const handleEditReturn = async (updatedReturn: ReturnRequest) => {
    try {
      const res = await fetch(`/api/returns/${updatedReturn._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReturn),
      });
      if (!res.ok) throw new Error("Failed to update return");
      setEditingReturn(null);
      fetchReturns();
    } catch (err) {
      console.error("Error updating return:", err);
    }
  };

  const handleStatusChange = async (
    id: string,
    newStatus: "Pending" | "Completed" | "Rejected"
  ) => {
    const target = returns.find((r) => r._id === id);
    if (!target) return;
    await handleEditReturn({ ...target, status: newStatus });
  };

  const handleDeleteReturn = async (id: string) => {
    if (!confirm("Delete this return?")) return;
    try {
      const res = await fetch(`/api/returns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete return");
      fetchReturns();
    } catch (err) {
      console.error("Error deleting return:", err);
    }
  };

  // Filter and paginate
  const filtered = returns.filter(
    (r) =>
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.orderId.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => setCurrentPage(1), [search]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Sidebar */}
      <Sidebar theme={"light"} toggleTheme={function (): void {
        throw new Error("Function not implemented.");
      } } />
      {/* <aside className="w-64 bg-gray-800 dark:bg-gray-900 text-white p-6 flex-shrink-0 shadow-xl rounded-r-2xl flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-8">KNWO 2.0</h2>
          <nav className="space-y-2">
            {["Dashboard", "Returns", "Reports", "Settings"].map((item) => (
              <a
                key={item}
                href="#"
                className="block py-2 px-3 rounded-lg hover:bg-gray-700 hover:scale-105 transition-transform"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
        <button
          onClick={toggleTheme}
          className="mt-8 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow hover:scale-105 transition-transform"
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </aside> */}

      {/* Main */}
      <main className="flex-1 p-8 transition-colors duration-500">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Pallet Return Dashboard
          </h1>
          <div className="relative mt-4 sm:mt-0">
            <Search className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
            />
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Returns", value: filtered.length, gradient: "bg-gradient-to-r from-blue-500 to-indigo-500" },
            { label: "Pending", value: filtered.filter((r) => r.status === "Pending").length, gradient: "bg-gradient-to-r from-yellow-400 to-yellow-600" },
            { label: "Completed", value: filtered.filter((r) => r.status === "Completed").length, gradient: "bg-gradient-to-r from-green-400 to-green-600" },
            { label: "Rejected", value: filtered.filter((r) => r.status === "Rejected").length, gradient: "bg-gradient-to-r from-red-400 to-red-600" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className={`${stat.gradient} text-white p-4 rounded-2xl shadow-lg flex flex-col items-center transition-transform`}
            >
              <span className="text-3xl font-bold">{stat.value}</span>
              <span>{stat.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Add Return Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg hover:scale-105 transition-transform mt-2"
        >
          {showForm ? <X size={18} /> : <PlusCircle size={18} />}
          {showForm ? "Close Form" : "Add New Return"}
        </button>

        {/* Add Return Form */}
        <AnimatePresence>
          {showForm && (
            <motion.form
              onSubmit={handleAddReturn}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-4 transition-colors duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Add New Return
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="number"
                  placeholder="Pallet Count"
                  value={palletCount}
                  min={1}
                  onChange={(e) => setPalletCount(Number(e.target.value))}
                  required
                  className="p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
                <input
                  type="text"
                  placeholder="Remarks (optional)"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                />
              </div>
              <button
                type="submit"
                className="mt-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow hover:scale-105 transition-transform"
              >
                Submit
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Return List */}
        <div className="mt-8">
          <ReturnList
            data={currentItems}
            onStatusChange={handleStatusChange}
            onEdit={(r) => setEditingReturn(r)}
            onDelete={handleDeleteReturn}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-xl disabled:opacity-50 hover:scale-105 transition-transform"
            >
              Prev
            </button>
            <span className="text-gray-900 dark:text-gray-100">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded-xl disabled:opacity-50 hover:scale-105 transition-transform"
            >
              Next
            </button>
          </div>
        )}

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
