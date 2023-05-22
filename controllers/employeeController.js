const connection = require('../config/database');
// Create Employee
const createEmployee = (req, res) => {
  const employee = req.body;

  connection.query('INSERT INTO employees SET ?', employee, (err, result) => {
    if (err) {
      console.error('Error creating employee:', err);
      res.status(500).json({ error: 'Failed to create employee' });
    } else {
      const insertedId = result.insertId;
      res.status(201).json({ id: insertedId });
    }
  });
};

// List Employees (with pagination)
const listEmployees = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  connection.query('SELECT * FROM employees LIMIT ?, ?', [offset, limit], (err, results) => {
    if (err) {
      console.error('Error fetching employees:', err);
      res.status(500).json({ error: 'Failed to fetch employees' });
    } else {
      res.json(results);
    }
  });
};

// Update Employee
const updateEmployee = (req, res) => {
  const employeeId = req.params.id;
  const updatedEmployee = req.body;

  connection.query('UPDATE employees SET ? WHERE id = ?', [updatedEmployee, employeeId], (err) => {
    if (err) {
      console.error('Error updating employee:', err);
      res.status(500).json({ error: 'Failed to update employee' });
    } else {
      res.status(204).send();
    }
  });
};

// Delete Employee
const deleteEmployee = (req, res) => {
  const employeeId = req.params.id;

  connection.query('DELETE FROM employees WHERE id = ?', employeeId, (err) => {
    if (err) {
      console.error('Error deleting employee:', err);
      res.status(500).json({ error: 'Failed to delete employee' });
    } else {
      res.status(204).send();
    }
  });
};

// Get Employee
const getEmployeeById = (req, res) => {
  const employeeId = req.params.id;

  connection.query('SELECT * FROM employees WHERE id = ?', employeeId, (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'Failed to fetch employee' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      res.json(results[0]);
    }
  });
};

module.exports = {
  createEmployee,
  listEmployees,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
};
