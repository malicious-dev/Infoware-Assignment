require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes');
const app = express();
const port = 3000;


// Routes
app.use(employeeRoutes);


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
