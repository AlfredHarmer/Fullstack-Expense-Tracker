console.log("AUTH CONTROLLER FILE LOADED"); 

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');

const register = (req, res) => {
  const { email, password } = req.body;

  //  Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  //  Check if user exists
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user
      db.run(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        function (err) {
          if (err) {
            return res.status(500).json({ message: "Insert failed" });
          }

          // Generate JWT
          const token = jwt.sign(
            { userId: this.lastID },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );

          // Return token
          res.status(201).json({ token });
        } 
      );

    } catch (error) {
      return res.status(500).json({ message: "Hashing failed" });
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return res.status(400).json({ message: "Email and Password are Required"});
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if(err) {
      return res.status(500).json({ message: "Database error" });
    }

    if(!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.status(401).json({ message: "Invalid credentials "});
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  })
};


module.exports = { register, login };

