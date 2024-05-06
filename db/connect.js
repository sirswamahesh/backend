const mongoose = require("mongoose");
require("dotenv").config();

// Database connecton

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("connection successfully!");
  } catch (error) {
    console.log("Connection error :>", error);
  }
};

module.exports = connectDB;
