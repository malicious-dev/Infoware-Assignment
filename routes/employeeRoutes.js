const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employeeController');

// Create Employee
router
  .post('/employees', employeeController.createEmployee)
  // List Employees (with pagination)
  .get('/employees', employeeController.listEmployees)
  // Update Employee
  .put('/employees/:id', employeeController.updateEmployee)
  // Delete Employee
  .delete('/employees/:id', employeeController.deleteEmployee)
  // Get By Id Employee
  .get('/employees/:id', employeeController.getEmployeeById);

module.exports = router;
