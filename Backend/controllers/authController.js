const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/db");

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rowCount === 0) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const insertUser = await db.query(
        `
        INSERT INTO users (email, password) VALUES ($1, $2)
        RETURNING id`,
        [email, hashedPassword],
      );

      const userId = insertUser.rows[0].id;

      const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      res.status(201).json({ message: "User created", token });
    } else {
      return res.status(400).json({ message: "User already exsists" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to create user " });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are Required" });
  }

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordCompare = await bcrypt.compare(
      password,
      result.rows[0].password,
    );

    const userId = result.rows[0].id;

    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    if (!passwordCompare) {
      res.status(404).json({ error: "Invalid credentials" });
    } else {
      res.status(200).json({ token });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Failed to login" });
  }
};

module.exports = { register, login };
