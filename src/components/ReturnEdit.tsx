"use client";

import React, { useState } from "react";
import { ReturnRequest } from "../types/types";

type ReturnEditProps = {
  returnData: ReturnRequest;
  onSave: (updatedReturn: ReturnRequest) => void;
  onCancel: () => void;
};

export default function ReturnEdit({ returnData, onSave, onCancel }: ReturnEditProps) {
  const [customerName, setCustomerName] = useState(returnData.customerName);
  const [returnDate, setReturnDate] = useState(returnData.returnDate);
  const [palletCount, setPalletCount] = useState(returnData.palletCount);
  const [remarks, setRemarks] = useState(returnData.remarks || "");

  const handleSave = () => {
    onSave({
      ...returnData,
      customerName,
      returnDate,
      palletCount,
      remarks,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Edit Return</h2>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
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
            placeholder="Pallet Count"
            value={palletCount}
            onChange={(e) => setPalletCount(Number(e.target.value))}
            min={1}
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

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
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
}
