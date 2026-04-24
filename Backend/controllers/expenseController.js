const db = require("../db/db");

const createExpense = (req, res) => {
    console.log('REQ.USER:', req.user);
    console.log('USER ID BEING USED:', req.user.userId);
    const { amount, category, description, date } = req.body;
    const userId =req.user.userId;

    if (!amount || !date) {
        return res.status(400).json({ error: 'Amount and date are required' });
    } 

    const sql = `
    INSERT INTO expenses (user_id, amount, category, description, date)
    VALUES (?, ?, ?, ?, ?)
    `;

    console.log('SQL VALUES:', [req.user.userId, amount, category, description, date]);

    db.run(sql, [userId, amount, category, description, date], function (err) {
        if (err) {
            console.error('Error inserting expense:', err);
            return res.status(500).json({ error: 'Failed to create expense' });
        }

        res.status(201).json({
            id: this.lastID,
            user_id: userId, 
            amount,
            category,
            description,
            date
        });
    });
};


const getExpenses = (req, res) => {
    const userId = req.user.userId;

    db.all(
        "SELECT * FROM expenses WHERE user_id = ?",
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            res.json(rows);
        }
    );
};



const getExpenseById = (req, res) => {
  const userId = req.user.userId;
  const expenseId = req.params.id;

  db.get(
    `SELECT * FROM expenses WHERE id = ? AND user_id = ?`, 
    [expenseId, userId],
    (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to fetch expense' });
        }

        if (!row) {
            return res.status(404).json({ error: 'Expense not found' });
        }

        res.json(row);
    }
  );
};

const updateExpense = (req, res) => {
  const userId = req.user.userId;
  const expenseId = req.params.id;

  const { amount, category, description, date } = req.body;

  const sql = ` 
  UPDATE expenses
  SET amount = ?, category = ?, description = ?, date = ?
  WHERE id = ? AND user_id = ? 
  `;

  db.run(
    sql,
    [amount, category, description, date, expenseId, userId],
    function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to update expense' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Expense not found or not authorised' });
        }

        res.json({ message: 'Expense updated successfully' });
    }
  );
};


const deleteExpense = (req, res) => {
  const userId = req.user.userId;
  const expenseId = req.params.id;

  db.run(
    `DELETE FROM expenses WHERE id = ? AND user_id = ?`,
    [expenseId, userId], 
    function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete expense' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Expense not found or not authorised' });
        }

        res.json({ message: 'Expense deleted successfully '});
    }
  );
};


module.exports = { 
    getExpenses,
    createExpense,
    getExpenseById,
    updateExpense,
    deleteExpense,
 };