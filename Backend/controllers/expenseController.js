const db = require("../db/db");

const createExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;
  const userId = req.user.userId;

  if (!amount || !date) {
    return res.status(400).json({ error: "Amount and date are required" });
  }

  const sql = `
    INSERT INTO expenses (user_id, amount, category, description, date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
    `;

  try {
    const result = await db.query(sql, [
      userId,
      amount,
      category,
      description,
      date,
    ]);

    res.status(201).json({
      id: result.rows[0].id,
      user_id: userId,
      amount,
      category,
      description,
      date,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create expense" });
  }
};

const getExpenses = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await db.query(
      " SELECT * FROM expenses WHERE user_id = $1",
      [userId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Database error" });
  }
};

const getExpenseById = async (req, res) => {
  const userId = req.user.userId;
  const expenseId = req.params.id;

  try {
    const result = await db.query(
      " SELECT * FROM expenses WHERE id = $1 AND user_id = $2",
      [expenseId, userId],
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to fetch expense" });
  }
};

const updateExpense = async (req, res) => {
  const userId = req.user.userId;
  const expenseId = req.params.id;

  const { amount, category, description, date } = req.body;

  const sql = `
    UPDATE expenses
    SET amount = $1, category = $2, description = $3,
    date= $4 WHERE id = $5 AND user_id = $6
    RETURNING *   
    `;

  try {
    const result = await db.query(sql, [
      amount,
      category,
      description,
      date,
      expenseId,
      userId,
    ]);

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Expense not found or not authorised" });
    }

    res.status(200).json({
      message: "Expense updated successfully",
      expense: result.rows[0],
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to up date expense" });
  }
};

const deleteExpense = async (req, res) => {
  const userId = req.user.userId;
  const expenseId = req.params.id;

  try {
    const result = await db.query(
      "DELETE FROM expenses WHERE id = $1 AND user_id = $2",
      [expenseId, userId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Expense not found or not authorised" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Expenses not deleted" });
  }
};

module.exports = {
  getExpenses,
  createExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
