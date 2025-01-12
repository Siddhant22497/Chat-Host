const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO DB conn  establised ",conn.connect);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
