
export interface Expense {
    id: number;
    userId: number;
    amount: number;
    category: string;
    description?: string;
    date: string;
};

export interface ExpenseData {
    amount: number;
    category: string;
    description?:string;
    date?: string;
};

