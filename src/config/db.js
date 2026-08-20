const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error('Set MONGO_URI in Backend/.env to a running MongoDB instance (local or Atlas).');
    process.exit(1);
  }
}

module.exports = connectDB;
