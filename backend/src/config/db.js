const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI
    );

    // Shows exactly which cluster and database this server is writing to.
    console.log(
      `MongoDB connected: host=${connection.connection.host}, database=${connection.connection.name}`
    );
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;