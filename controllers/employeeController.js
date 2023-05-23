const db = require('../config/database');

// Create Employee

const createEmployee = (req, res) => {
  const employee = {
    full_name: req.body.full_name,
    job_title: req.body.job_title,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state
  };

  const contactDetails = {
    phone_number: req.body.phone_number,
    email: req.body.email,
    primary_emergency_contact_name: req.body.primary_emergency_contact_name,
    primary_emergency_contact_phone_number: req.body.primary_emergency_contact_phone_number,
    primary_emergency_contact_relationship: req.body.primary_emergency_contact_relationship,
    secondary_emergency_contact_name: req.body.secondary_emergency_contact_name,
    secondary_emergency_contact_phone_number: req.body.secondary_emergency_contact_phone_number,
    secondary_emergency_contact_relationship: req.body.secondary_emergency_contact_relationship
  };

  // Insert the employee data into the database
  db.query('INSERT INTO employees SET ?', employee, (error, results) => {
    if (error) {
      console.error('Error creating employee:', error);
      res.status(500).json({ error: 'Failed to create employee' });
    } else {
      const employeeId = results.insertId;
      contactDetails.employee_id = employeeId;

      // Insert the contact details into the database
      db.query('INSERT INTO contact_details SET ?', contactDetails, (error) => {
        if (error) {
          console.error('Error creating contact details:', error);
          res.status(500).json({ error: 'Failed to create contact details' });
        } else {
          res.status(201).json({ message: 'Employee created successfully' });
        }
      });
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
  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error('Error counting employees:', err);
      res.status(500).json({ error: 'Failed to count employees' });
    } else {
      const total = countResult[0].total;
      db.query(query, [limit, offset], (err, results) => {
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
  const { id } = req.params;
  const employee = {
    full_name: req.body.full_name,
    job_title: req.body.job_title,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state
  };

  const contactDetails = {
    phone_number: req.body.phone_number,
    email: req.body.email,
    primary_emergency_contact_name: req.body.primary_emergency_contact_name,
    primary_emergency_contact_phone_number: req.body.primary_emergency_contact_phone_number,
    primary_emergency_contact_relationship: req.body.primary_emergency_contact_relationship,
    secondary_emergency_contact_name: req.body.secondary_emergency_contact_name,
    secondary_emergency_contact_phone_number: req.body.secondary_emergency_contact_phone_number,
    secondary_emergency_contact_relationship: req.body.secondary_emergency_contact_relationship
  };

  // Update the employee data in the database
  db.query('UPDATE employees SET ? WHERE id = ?', [employee, id], (error, results) => {
    if (error) {
      console.error('Error updating employee:', error);
      res.status(500).json({ error: 'Failed to update employee' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      // Update the contact details in the database
      db.query('UPDATE contact_details SET ? WHERE employee_id = ?', [contactDetails, id], (error) => {
        if (error) {
          console.error('Error updating contact details:', error);
          res.status(500).json({ error: 'Failed to update contact details' });
        } else {
          res.json({ message: 'Employee updated successfully' });
        }
      });
    }
  });
};

// Delete Employee
const deleteEmployee = (req, res) => {
  const employeeId = req.params.id;
  const checkQuery = 'SELECT * FROM employees WHERE id = ?';
  const deleteQuery = 'DELETE FROM employees WHERE id = ?';
  db.query(checkQuery, employeeId, (err, results) => {
    if (err) {
      console.error('Error fetching employee:', err);
      res.status(500).json({ error: 'Failed to fetch employee' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      db.query(deleteQuery, employeeId, (err) => {
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
  const { id } = req.params;

  // Retrieve the employee and their associated contact details from the database
  db.query('SELECT employees.*, contact_details.* FROM employees LEFT JOIN contact_details ON employees.id = contact_details.employee_id WHERE employees.id = ?', id, (error, results) => {
    if (error) {
      console.error('Error retrieving employee:', error);
      res.status(500).json({ error: 'Failed to retrieve employee' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
    } else {
      const employee = {
        id: results[0].id,
        full_name: results[0].full_name,
        job_title: results[0].job_title,
        address: results[0].address,
        city: results[0].city,
        state: results[0].state,
        contact_details: {
          phone_number: results[0].phone_number,
          email: results[0].email,
          primary_emergency_contact_name: results[0].primary_emergency_contact_name,
          primary_emergency_contact_phone_number: results[0].primary_emergency_contact_phone_number,
          primary_emergency_contact_relationship: results[0].primary_emergency_contact_relationship,
          secondary_emergency_contact_name: results[0].secondary_emergency_contact_name,
          secondary_emergency_contact_phone_number: results[0].secondary_emergency_contact_phone_number,
          secondary_emergency_contact_relationship: results[0].secondary_emergency_contact_relationship
        }
      };
      res.json(employee);
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
