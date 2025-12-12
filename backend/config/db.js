const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    //const conn = await mongoose.connect(process.env.MONGODB_URI, {
      //useNewUrlParser: true,
      //useUnifiedTopology: true,
      const conn = await mongoose.connect(process.env.MONGODB_URI);
    //});
    
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log(` Database: ${conn.connection.name}`);
    
    // Create indexes for better performance
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('users').createIndex({ saIdNumber: 1 }, { unique: true });
    await mongoose.connection.db.collection('transactions').createIndex({ user: 1, date: -1 });
    
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
