const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json()); // middleware to parse JSON

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",    // your MySQL host
  user: "root",         // your MySQL user
  password: "root", // your MySQL password
  database: "json_data"    // your MySQL database
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error("❌ Error connecting to MySQL:", err);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL!");
});

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to the Users API with MySQL!");
});

// CREATE - Add new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(sql, [name, email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(207).json({ id: result.insertId, name, email });
  });
});

// READ - Get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});
  
// READ - Get single user by id
app.get("/users/:id", (req, res) => {
  db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});

// UPDATE - Update user by id
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;
  const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(sql, [name, email, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ id: req.params.id, name, email });
  });
});



// DELETE - Remove user by id
app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  });
});

// Start server
const PORT = 8000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));