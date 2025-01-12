const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO DB conn  establised");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
