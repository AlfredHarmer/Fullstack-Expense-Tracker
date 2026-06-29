
import express from "express";
import {authMiddleware} from "../middleware/authMiddleware";
import {
    getExpenses, 
    createExpense, 
    getExpenseById, 
    updateExpense, 
    deleteExpense
} from "../controllers/expenseController";


const router = express.Router();

router.use(authMiddleware);

router.get("/expenses", getExpenses);
router.post("/expenses", createExpense);
router.get("/expenses/:id", getExpenseById);
router.put("/expenses/:id", updateExpense);
router.delete("/expenses/:id", deleteExpense);

export default router;