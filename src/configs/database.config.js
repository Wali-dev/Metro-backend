const mongoose = require('mongoose');
require('dotenv').config();

const URL = process.env.DATABASE_URL;

const database = async () => {
    try {
        await mongoose.connect(URL, {
            maxPoolSize: 10, // handles concurrent connections better
        });
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error.message);

        // Retry after 5 seconds if connection fails
        setTimeout(database, 5000);
    }
};


module.exports = database;
