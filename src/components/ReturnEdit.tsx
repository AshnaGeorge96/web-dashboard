"use client";

import React, { useState } from "react";
import { ReturnRequest } from "../types/types";

type Props = {
  returnData: ReturnRequest;
  onSave: (updatedReturn: ReturnRequest) => void;
  onCancel: () => void;
};

const ReturnEdit: React.FC<Props> = ({ returnData, onSave, onCancel }) => {
  const [customerName, setCustomerName] = useState(returnData.customerName);
  const [returnDate, setReturnDate] = useState(returnData.returnDate);
  const [palletCount, setPalletCount] = useState(returnData.palletCount);
  const [remarks, setRemarks] = useState(returnData.remarks || "");
  const [status, setStatus] = useState(returnData.status);

  const handleSave = () => {
    onSave({
      ...returnData,
      customerName,
      returnDate,
      palletCount,
      remarks,
      status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Return</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer Name"
            className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <input
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <input
            type="number"
            value={palletCount}
            onChange={(e) => setPalletCount(Number(e.target.value))}
            min={1}
            className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Remarks"
            className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as "Pending" | "Completed" | "Rejected")}
            className="p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnEdit;
