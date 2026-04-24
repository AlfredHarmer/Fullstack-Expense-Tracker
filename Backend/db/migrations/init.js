const db = require('../db');
db.all(`SELECT * FROM expenses`, [], (err, rows) => {
  console.log('ALL EXPENSES IN DB:', rows); // tester
});
db.serialize(() => {
  console.log("RUNNING MIGRATIONS...");

  // USERS TABLE 
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `);


  db.run(`
    CREATE TABLE expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      category TEXT,
      description TEXT,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating expenses table:', err);
    } else {
      console.log('Expenses table ready');
    }
  });

  // Debug check
  db.all(`PRAGMA table_info(expenses);`, [], (err, rows) => {
    console.log("EXPENSES TABLE STRUCTURE:", rows);
  });
});