"use client";

import React from "react";
import { FaTrash } from "react-icons/fa";
import ReturnCard from "./ReturnCard";
import { ReturnRequest } from "../types/types";

type Props = {
  data: ReturnRequest[];
  onStatusChange: (id: string, status: "Pending" | "Completed" | "Rejected") => void;
  onEdit: (returnRequest: ReturnRequest) => void;
  onDelete: (id: string) => void; // added delete prop
};

const ReturnList: React.FC<Props> = ({ data, onStatusChange, onEdit, onDelete }) => {
  if (data.length === 0) {
    return (
      <p className="text-gray-700 dark:text-gray-300 text-center mt-8">
        No return requests found.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <div key={item.orderId} className="relative">
          <ReturnCard
            data={item}
            onStatusChange={onStatusChange}
            onEdit={() => onEdit(item)}
            //onDelete={() => onDelete(item._id)}
          />
          <button
  onClick={() => onDelete(item._id)}
  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
  title="Delete Return"
>
  <FaTrash />
</button>
        </div>
      ))}
    </div>
  );
};

export default ReturnList;
