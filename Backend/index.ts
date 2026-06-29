import "dotenv/config";
import "./db/migrations/init";
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json()); // To parse JSON bodies

import authRoutes from "./routes/authRoutes";
import expenseRoutes from "./routes/expenseRoutes";

app.use("/api/auth", authRoutes);
app.use("/api", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
