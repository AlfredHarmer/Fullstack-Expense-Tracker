require("dotenv").config();
require("./db/migrations/init.js");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(express.json()); // to parse JSON bodies

const authRoutes = require("./routes/authRoutes");
const expensesRoutes = require("./routes/expenseRoutes");

app.use("/api/auth", authRoutes);
app.use("/api", expensesRoutes);

app.get("/", (req, res) => {
  res.send("Expense Tracker Backend is running!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
