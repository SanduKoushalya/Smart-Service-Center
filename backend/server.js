const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const PORT = process.env.PORT || 5000;

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "smart_service",
});

db.connect(err => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("MySQL Connected");
});

function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(403).json({ message: "No token provided" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token format invalid" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.userId = decoded.id;
    next();
  });
}

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const checkUserSql = "SELECT id FROM users WHERE email = ?";
    db.query(checkUserSql, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user
      const insertSql = "INSERT INTO users (name, email, password, memberSince) VALUES (?, ?, ?, NOW())";
      db.query(insertSql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ message: "Error creating user" });
        }

        const token = jwt.sign({ id: result.insertId }, JWT_SECRET, { expiresIn: "24h" });
        res.status(201).json({
          message: "User registered successfully",
          token,
          user: { id: result.insertId, name, email }
        });
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const sql = "SELECT id, name, email, password, vehicles, memberSince FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const user = results[0];
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });
      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          vehicles: user.vehicles,
          memberSince: user.memberSince
        }
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/api/user", verifyToken, (req, res) => {
  const sql = "SELECT name, email, vehicles, memberSince FROM users WHERE id = ?";
  db.query(sql, [req.userId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(results[0]);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});