const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public'))); // This serves files from the 'public' folder

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Change this to your MySQL username
    password: 'Text123', // Change this to your MySQL password
    database: 'employee_management'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');
});

// Get All Employees
app.get('/api/employees', (req, res) => {
    db.query('SELECT * FROM employees', (err, results) => {
        if (err) {
            throw err;
        }
        res.json(results);
    });
});

// Add New Employee
app.post('/api/employees', (req, res) => {
    const newEmployee = req.body;
    db.query('INSERT INTO employees SET ?', newEmployee, (err) => {
        if (err) {
            throw err;
        }
        res.send('Employee added');
    });
});

// Delete Employee
app.delete('/api/employees/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE employee_id = ?', id, (err) => {
        if (err) {
            throw err;
        }
        res.send('Employee deleted');
    });
});

// Serve the HTML file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // Adjust this path to point to your index.html
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
