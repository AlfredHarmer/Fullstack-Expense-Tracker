
const getToken = () => localStorage.getItem("token")

export const fetchExpenses = async () => {
    const token = getToken();

    try {
        const response = await fetch("http://localhost:3000/api/expenses", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        console.error("Error fetching expenses");
    }
};

export const addExpense = async (data) => {
    const token = getToken();

    try {
        const response = await fetch("http://localhost:3000/api/expenses", {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }, 
            body: JSON.stringify({
                catergory: data.catergory,
                amount: Number(data.amount),
                description: data.description,
                date: data.date || new Date().toISOString().split("T")[0]
            })
        });

        return response;

    } catch (error) {
        console.error("Error adding expense");
    }
};

export const deleteExpense = async (id) => {
    const token = getToken();

    try {
        const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response;

    } catch (error) {
        console.error("Error deleting expense");
    }
};


export const updateExpense = async (id, data) => {
    const token = getToken();

    try {
        const response = await fetch(`http://localhost:3000/api/expenses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", 
                Authorization: `Bearer ${token}`
            }, 
            body: JSON.stringify({
                catergory: data.expense.catergory, 
                amount: data.expense.amount,
                description: data.expense.description,
                date: data.expense.date
            })
        });

        return response;

    } catch (error) {
        console.log("Error Update Failed")
    }
};

