import dotenv from 'dotenv';
dotenv.config({ override: true });

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // Connect to MongoDB Atlas BEFORE starting Express server
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[ParkFlow API] Server running on http://localhost:${PORT}`);
  });
};

startServer();
