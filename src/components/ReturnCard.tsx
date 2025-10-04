"use client";

import React from "react";
import { ReturnRequest } from "../types/types";
import { FaCheckCircle, FaTimesCircle, FaClock, FaEdit } from "react-icons/fa";

type Props = {
  data: ReturnRequest;
  onStatusChange: (id: string, status: "Pending" | "Completed" | "Rejected") => void;
  onEdit: (returnRequest: ReturnRequest) => void; // new prop for editing
};

const ReturnCard: React.FC<Props> = ({ data, onStatusChange, onEdit }) => {
  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Completed: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    Pending: <FaClock className="inline-block mr-1" />,
    Completed: <FaCheckCircle className="inline-block mr-1" />,
    Rejected: <FaTimesCircle className="inline-block mr-1" />,
  };

  return (
    <div className="border rounded-lg p-4 shadow-md mb-4 bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-200">
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">
        {data.customerName}
      </h3>

      <p className="text-sm text-gray-700 dark:text-gray-300">Order ID: {data.orderId}</p>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        Return Date: {new Date(data.returnDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-700 dark:text-gray-300">Pallet Count: {data.palletCount}</p>

      {data.remarks && (
        <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">Remarks: {data.remarks}</p>
      )}

      {/* Status badge */}
      <div className="mt-3">
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold ${statusStyles[data.status]}`}
        >
          {statusIcons[data.status]} {data.status}
        </span>
      </div>

      {/* Buttons */}
      <div className="mt-3 flex gap-2">
        {data.status === "Pending" && (
          <>
            <button
              onClick={() => onStatusChange(data._id, "Completed")}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
            >
              Complete
            </button>
            <button
              onClick={() => onStatusChange(data._id, "Rejected")}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
            >
              Reject
            </button>
          </>
        )}

        {/* Edit button (always visible) */}
        <button
          onClick={() => onEdit(data)}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200 flex items-center gap-1"
        >
          <FaEdit /> Edit
        </button>
      </div>
    </div>
  );
};

export default ReturnCard;
