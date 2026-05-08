export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}