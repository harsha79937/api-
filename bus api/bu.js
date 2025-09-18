const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "bus_db"
});

db.connect(err => {
    if (err) {
        console.log("Error connecting to MySQL", err);
        process.exit(1);
    }
    console.log("Connected to MySQL!");
});

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to Bus API!");
});

// Create a bus
app.post("/bus", (req, res) => {
    const { bus_name, start_location, end_location, price } = req.body;
    const sql = "INSERT INTO bus (bus_name, start_location, end_location, price) VALUES (?, ?, ?, ?)";
    db.query(sql, [bus_name, start_location, end_location, price], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: result.insertId, bus_name, start_location, end_location, price });
    });
});

// Get all buses
app.get("/bus", (req, res) => {
    db.query("SELECT * FROM bus", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Get one bus by ID
app.get("/bus/:id", (req, res) => {
    db.query("SELECT * FROM bus WHERE id=?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "Bus not found" });
        res.json(results[0]);
    });
});

// Update bus by ID
app.put("/bus/:id", (req, res) => {
    const { bus_name, start_location, end_location, price } = req.body;
    const sql = "UPDATE bus SET bus_name=?, start_location=?, end_location=?, price=? WHERE id=?";
    db.query(sql, [bus_name, start_location, end_location, price, req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Bus not found" });
        res.json({ id: req.params.id, bus_name, start_location, end_location, price });
    });
});

// Delete a bus by ID
app.delete("/bus/:id", (req, res) => {
    db.query("DELETE FROM bus WHERE id=?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: "Bus not found" });
        res.json({ message: "Bus deleted successfully" });
    });
});

const PORT = 9000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
