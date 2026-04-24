import React from "react";

function Dashboard({ setIsLoggedIn }) {
  const [expenseName, setExpenseName] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [expenses, setExpenses] = React.useState([]);
  const [editingId, setEditingId] = React.useState(null);
  const [description, setDescription] =React.useState("");
  const [date, setDate] = React.useState("");


  // Add New Expense
  const handleAddExpense = async () => {

    console.log("Sending:", {
      category: expenseName,
      amount: Number(amount),
      description: description,
      date: date || new Date().toISOString()
    });
    // Input Validation 
    if (!expenseName || !amount) {
      console.error("Missing Fields");
      return;
    } 
    // Get token from browers so request can authenticated 
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          category: expenseName,
          amount: Number(amount),
          description: description,
          date: date || new Date().toISOString().split("T")[0]
        })
      });

      if(response.ok) {
        setExpenseName("");
        setAmount("");
        setDescription("");
        setDate("");

        fetchExpenses();
      }

    } catch (error) {
      console.error("Error adding expense");
    }
  };

  // Delete Expense
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchExpenses(); // Refresh List
      } else {
        console.error("Failed to delete");
      }

    } catch (error) {
      console.error("Error deleting expense");
    }
  };

  // Edit Expense
  const handleEditChange = (id, field, value) => {
    setExpenses(prev => 
      prev.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  // Update Expense
  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token")

    const expense = expenses.find(e => e.id === id);

    try {
      const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          category: expense.category,
          amount: expense.amount,
          amount: expense.amount,
          description: expense.description,
          date: expense.date
        })
      });

      if (response.ok) {
        setEditingId(null);
        fetchExpenses();
      }

    } catch (error) {
      console.error("Update failed");
    }
  };

  const total = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  
  // Fetches Users Expenses 
  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    
      
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/api/expenses", {
        headers: {
           Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log("FETCHED DATA:", data);


      if (response.ok) {        
        setExpenses(data);
        console.log("STATE SET");
      } else if (response.status === 403) {
        console.error("Invalid token");

        localStorage.removeItem("token");
        setIsLoggedIn(false);
      } else {
        console.error(date.message);
      }

    } catch (error) {
      console.error("Error fetching expenses");
    }
  };

  React.useEffect(() => {
    console.log("Calling fetchExpenses");
    fetchExpenses();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <input
       value={expenseName}
       onChange={(e) => setExpenseName(e.target.value)} 
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

      <button onClick={handleAddExpense}>
      Add
      </button>

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