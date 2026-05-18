const pool = require("../db");

const createTables = async () => {
  console.log("RUNNING MIGRATIONS...");

  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT )
      `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      description TEXT,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

    return console.log("Tables created");
  } catch (err) {
    console.log(err);
    console.log({ error: "Failed to create database" });
  }
};

createTables();
