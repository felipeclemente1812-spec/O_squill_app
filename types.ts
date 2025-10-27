export interface ExpenseType {
    id: string;
    name: string;
    amount: string;
    percentage: string;
    date: string;
    category?: string;
}

export interface IncomeType {
    id: string;
    name: string;
    amount: string;
}

export interface SpendingType {
    id: string;
    name: string;
    amount: string;
    date: string;
    category?: string;
}
interface PieSlice {
  id: string;
  value: number;
  color: string;
  text: string;
  percentage: number;
  sliceThickness?: number;
}
