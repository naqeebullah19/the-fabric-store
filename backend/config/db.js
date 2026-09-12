const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tfs_clone';

  try {
    // Attempt standard connection with 2.5s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    await checkAndAutoSeed();
    return;
  } catch (err) {
    console.log(`Direct MongoDB connection to ${uri} failed (${err.message}). Starting local embedded database...`);
  }

  // Fallback to embedded userland MongoDB (mongodb-memory-server)
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create({
      binary: { version: '4.4.18' },
      instance: { dbName: 'tfs_clone' },
    });
    const memoryUri = mongod.getUri();
    await mongoose.connect(memoryUri);
    console.log(`Embedded MongoDB started successfully at ${memoryUri}`);
    await checkAndAutoSeed();
  } catch (memErr) {
    console.error('Fatal: Could not start embedded MongoDB:', memErr.message);
    process.exit(1);
  }
};

async function checkAndAutoSeed() {
  try {
    const Product = require('../models/Product');
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Automatically seeding catalog...');
      const { seedDatabase } = require('../utils/seed');
      await seedDatabase({ clearExisting: false });
    }
  } catch (seedErr) {
    console.error('Auto-seeding check failed:', seedErr.message);
  }
}

process.on('SIGINT', async () => {
  if (mongod) await mongod.stop();
  process.exit(0);
});

module.exports = connectDB;
