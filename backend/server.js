const express=require('express');
const dotenv=require('dotenv');
const connectDB=require('./config/db');
const cors = require('cors');

//Loadin env variables
dotenv.config();

//Connect to database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Test route
app.get('/', (req, res) => {
    res.json({message:'Medverify API is running !'});
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});