import mongoose from 'mongoose';

export const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.error('[MongoDB Error] MONGODB_URI is not defined in environment!');
    process.exit(1);
  }

  // Sanitize URI string in case MONGODB_URI= prefix was duplicated
  uri = uri.trim();
  if (uri.startsWith('MONGODB_URI=')) {
    uri = uri.replace(/^MONGODB_URI=/, '').trim();
  }

  try {
    console.log('[MongoDB Atlas] Connecting to MongoDB Atlas cluster...');
    const conn = await mongoose.connect(uri, {
      dbName: 'parkflow',
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`[MongoDB Atlas] Successfully connected to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Atlas Fatal Error] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
};
