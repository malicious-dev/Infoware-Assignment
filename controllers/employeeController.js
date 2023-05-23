const connection = require('../config/database');

// Create Employee

const createEmployee = (req, res) => {
  const full_name = req.body.full_name;
  const job_title = req.body.job_title;
  const phone_number = req.body.phone_number;
  const email = req.body.email;
  const address = req.body.address;
  const city = req.body.city;
  const state = req.body.state;
  const primary_emergency_contact_name = req.body.primary_emergency_contact_name;
  const primary_emergency_contact_phone_number = req.body.primary_emergency_contact_phone_number;
  const primary_emergency_contact_relationship = req.body.primary_emergency_contact_relationship;
  const secondary_emergency_contact_name = req.body.secondary_emergency_contact_name;
  const secondary_emergency_contact_phone_number = req.body.secondary_emergency_contact_phone_number;
  const secondary_emergency_contact_relationship = req.body.secondary_emergency_contact_relationship;

  const employee = "INSERT INTO employees ( full_name, job_title, phone_number, email, address, city, state, primary_emergency_contact_name, primary_emergency_contact_phone_number,primary_emergency_contact_relationship, secondary_emergency_contact_name, secondary_emergency_contact_phone_number, secondary_emergency_contact_relationship)  VALUES ( '" + full_name + "', '" + job_title + "', '" + phone_number + "', '" + email + "', '" + address + "', '" + city + "', '" + state + "', '" + primary_emergency_contact_name + "', '" + primary_emergency_contact_phone_number + "', '" + primary_emergency_contact_relationship + "', '" + secondary_emergency_contact_name + "', '" + secondary_emergency_contact_phone_number + "', '" + secondary_emergency_contact_relationship + "' )";

  console.log(primary_emergency_contact_phone_number)
  connection.query(employee, (err, result) => {
    if (err) {
      console.error('Error creating employee:', err);
      res.status(500).json({ error: err.message });
    } else {
      const insertedId = result.insertId;
      // res.status(201).json({ id: insertedId });
      res.status(201).json({ message: 'Employee created successfully' });
    }
  });
};

// List Employees (with pagination)
const listEmployees = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const countQuery = 'SELECT COUNT(*) AS total FROM employees';
  const query = 'SELECT * FROM employees LIMIT ? OFFSET ?';
  connection.query(countQuery, (err, countResult) => {
    if (err) {
      console.error('Error counting employees:', err);
      res.status(500).json({ error: 'Failed to count employees' });
    } else {
      const total = countResult[0].total;
      connection.query(query, [limit, offset], (err, results) => {
        if (err) {
          console.error('Error listing employees:', err);
          res.status(500).json({ error: 'Failed to list employees' });
        } else {
          const totalPages = Math.ceil(total / limit);
          const response = {
            page,
            per_page: limit,
            total,
            total_pages: totalPages,
            data: results,
          };
          res.json(response);
        }
      });
    }
  }
  );
};

// Update Employee
const updateEmployee = (req, res) => {
  const employeeId = req.params.id;
  const updatedEmployee = req.body;
  const checkQuery = 'SELECT * FROM employees WHERE id = ?';
  const updateQuery = 'UPDATE employees SET ? WHERE id = ?';
  connection.query(checkQuery, employeeId, (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'Failed to fetch employee' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      connection.query(updateQuery, [updatedEmployee, employeeId], (err) => {
        if (err) {
          console.error('Error updating employee:', err);
          res.status(500).json({ error: 'Failed to update employee' });
        } else {
          res.status(200).json({ message: 'Employee updated successfully' });
        }
      });
    }
  }
  );
};

// Delete Employee
const deleteEmployee = (req, res) => {
  const employeeId = req.params.id;
  const checkQuery = 'SELECT * FROM employees WHERE id = ?';
  const deleteQuery = 'DELETE FROM employees WHERE id = ?';
  connection.query(checkQuery, employeeId, (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'Failed to fetch employee' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      connection.query(deleteQuery, employeeId, (err) => {
        if (err) {
          console.error('Error deleting employee:', err);
          res.status(500).json({ error: 'Failed to delete employee' });
        } else {
          res.status(200).json({ message: 'Employee deleted successfully' });
        }
      });
    }
  }
  )
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
