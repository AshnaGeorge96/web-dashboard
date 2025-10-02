"use client";

import React from "react";
import ReturnCard from "./ReturnCard";
import { ReturnRequest } from "../types/types";

type Props = {
  data: ReturnRequest[];
  onStatusChange: (id: string, status: 'Completed' | 'Rejected') => void;
  onEdit: (returnRequest: ReturnRequest) => void; // passed from Dashboard
};

const ReturnList: React.FC<Props> = ({ data, onStatusChange, onEdit }) => {
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
        <ReturnCard
          key={item.orderId}
          data={item}
          onStatusChange={onStatusChange}
          onEdit={onEdit} // now correctly uses the prop
        />
      ))}
    </div>
  );
};

export default ReturnList;
