console.log('EXPENSE ROUTE WORKING')
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
    getExpenses,
    createExpense,
    getExpenseById,
    updateExpense,
    deleteExpense
} = require("../controllers/expenseController");

router.use(authMiddleware);

router.get("/expenses", getExpenses);
router.post("/expenses", createExpense);
router.get("/expenses/:id", getExpenseById);
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);


module.exports = router;