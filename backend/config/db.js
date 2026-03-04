//mongoose -to connect the database using schemas 
const mongoose = require('mongoose');
const dns = require('dns');

// Use Google DNS to bypass network restrictions
dns.setServers(['8.8.8.8', '8.8.4.4']);

//function to connect to the database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;