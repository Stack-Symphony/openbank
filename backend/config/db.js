const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Recommended modern options (optional but good practice)
      serverSelectionTimeoutMS: 5000,   // timeout after 5s instead of 30s
      maxPoolSize: 10,                  // limit connection pool
      autoIndex: false,                 // ← This prevents the "createIndexes requires authentication" crash
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);

    // Now that we're connected, safely create required indexes
    // (run only once or on deployment – they are idempotent)
    console.log("Creating indexes...");

    await conn.connection.db.collection("users").createIndex(
      { email: 1 },
      { unique: true, background: true }
    );
    console.log("Index created: users.email (unique)");

    await conn.connection.db.collection("users").createIndex(
      { saIdNumber: 1 },
      { unique: true, background: true }
    );
    console.log("Index created: users.saIdNumber (unique)");

    await conn.connection.db.collection("transactions").createIndex(
      { user: 1, date: -1 },
      { background: true }
    );
    console.log("Index created: transactions.user + date (compound)");

    console.log("All indexes created successfully");

  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    // Optional: log full error in development for debugging
    // console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;