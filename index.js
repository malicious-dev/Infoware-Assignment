require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const app = express();
const port = 3000;




// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(notFound);
// app.use(errorHandler);


// Routes
app.use(employeeRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
