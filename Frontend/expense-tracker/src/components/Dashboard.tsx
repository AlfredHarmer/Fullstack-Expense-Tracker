import React, { type ComponentProps } from "react";
import { fetchExpenses, createExpense, deleteExpense, updateExpense } from "../services/expenseService";
import type { Expense } from "../types/expense";
import type { DashboardProps } from "../types/componentProps";


function Dashboard({ setIsLoggedIn } : DashboardProps ) {
  const [expenseCategory, setExpenseCategory] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [description, setDescription] =React.useState("");
  const [date, setDate] = React.useState("");

  const [errors, setErrors] = React.useState({
    category: "",
    amount: ""
  });


  // Add New Expense
  const handleCreateExpense = async () => {

    let newErrors = {
      category: "",
      amount: ""
    };

    // Input Validation 
    if (!expenseCategory) {
      newErrors.category = "Expense Category Required";
    };

    if (!amount) {
      newErrors.amount = "Expense Amount Required"
    };

    setErrors(newErrors);

    if (newErrors.category || newErrors.amount) {
      return;
    };

    const response = await createExpense({
      category: expenseCategory,
      amount: Number(amount),
      description,
      date
    });

      if(response?.ok) {
        setExpenseCategory("");
        setAmount("");
        setDescription("");
        setDate("");

        handleFetchExpenses();
      }

  };

  // Delete Expense
  const handleDelete = async (id: number) => {

    const response = await deleteExpense(id);

    if (response?.ok) {
      handleFetchExpenses(); // Refresh List
    } else {
      console.error("Failed to delete");
    }

  };

  // Edit Expense
  const handleEditChange = (
    id: number, 
    field: 'category' | 'amount' | 'description' | 'date',
    value: string,
  ) => {
    setExpenses((prev) =>
    prev.map((expense) => {
      if (expense.id !== id) {
        return expense; 
      }

      if (field === 'amount') {
        return {
          ...expense,
          amount: Number(value),
        };
      }

      return {
        ...expense,
        [field]: value,
      };
    }),
  );
};
  // Update Expense
  const handleUpdate = async (id: number) => {
  
    const expense = expenses.find(e => e.id === id);

    if (!expense) {
      return
    };

    const response = await updateExpense(id, expense);

      if (response?.ok) {
        setEditingId(null);
        handleFetchExpenses();
      }
  };

  const total = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  
  // Fetches Users Expenses 
  const handleFetchExpenses = async () => {

    const response = await fetchExpenses();

    
    if (!response) {
      console.error("Failed to fetch expenses");
      return;
    };

    const data = await response.json();

    if (response.ok) {        
      setExpenses(data);
    } else if (response.status === 403) {
      console.error("Invalid token");

      localStorage.removeItem("token");
      setIsLoggedIn(false);
    } else {
      console.error("Failed to fecth expenses");
    }
  };

  React.useEffect(() => {
    handleFetchExpenses();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <input
       value={expenseCategory}
       onChange={(e) => setExpenseCategory(e.target.value)} 
       placeholder="Name" 
      />
      <input
       value={amount}
       onChange={(e) => setAmount(e.target.value)} 
       placeholder="Amount" 
       />
      <input
       value={description}
       onChange={(e) => setDescription(e.target.value)}
       placeholder="Description"
      />
      <input
       type="date"
       value={date}
       onChange={(e) => setDate(e.target.value)}
      />

      <button onClick={handleCreateExpense}>
      Add
      </button>

      <p>{errors.category}{errors.amount}</p>


      <ul>
        {Array.isArray(expenses) && expenses.map((expense) => (
          <li key={expense.id}>
            {editingId === expense.id ? (
              <>
              <input
              value={expense.category}
              onChange={(e) => handleEditChange(expense.id, "category", e.target.value)}
              />

              <input
              value={expense.amount}
              onChange={(e) => handleEditChange(expense.id, "amount", e.target.value)}
              />

              <input
              value={expense.description || ""}
              onChange={(e) => 
                handleEditChange(expense.id, "description", e.target.value)
              }
              placeholder="Description"
              />

              <input
              type="date"
              value={expense.date ? expense.date.split("T")[0] : ""}
              onChange={(e) => 
                handleEditChange(expense.id, "date", e.target.value)
              }
              />
              
              <button onClick={() => handleUpdate(expense.id)}>
                Save
              </button>
              </>
            ) : (
              <>

              
                <div>
                  <strong>{expense.category}</strong> -£{expense.amount}
                </div>
                <div>{expense.description}</div>
                <div>{new Date(expense.date).toLocaleDateString()}</div>
              
                <button onClick={() => setEditingId(expense.id)}> 
                 Edit
                </button>
              
                <button onClick={() => handleDelete(expense.id)}>
                 Delete 
                </button>
              

              </>
            )}

          </li>
        ))}
      </ul>

      <p>Total: £{total}</p>

      <button onClick={() => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
      }}>
        Logout
      </button>

    </div>
  );
}

export default Dashboard;