// src/types/types.ts
export type ReturnRequest = {
  orderId: string;
  customerName: string;
  returnDate: string;
  palletCount: number;
  status: 'Pending' | 'Completed' | 'Rejected';
  remarks?: string;
};
