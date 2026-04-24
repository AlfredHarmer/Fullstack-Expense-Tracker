
const sqlite3 = require('sqlite3').verbose();
const path = require('path');



const dbPath = path.resolve(__dirname, 'expense_tracker.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

console.log('USING DB PATH:', dbPath);

module.exports = db;