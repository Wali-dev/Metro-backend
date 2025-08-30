const express = require("express");
const database = require('./src/configs/database.config');
const cors = require('cors');
const apiRoutes = require("./src/routes/api.js");
const errorHandler = require("./src/middlewares/errorHandler.js");


const app = express();
const PORT = process.env.PORT || 8000;


// Connect the database 
database();

app.use(express.json())
// CORS
app.use(cors({ origin: "*" }));

// Routes
app.use('/api/v1', apiRoutes);


// Error Handler
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});