// src/types/types.ts
export type ReturnRequest = {
  _id: string;
  orderId: string;
  customerName: string;
  returnDate: string;
  palletCount: number;
  status: 'Pending' | 'Completed' | 'Rejected';
  remarks?: string;
};
