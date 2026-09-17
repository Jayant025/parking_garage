import 'dotenv/config';
import mongoose from 'mongoose';

const testUris = [
  'mongodb+srv://jayantrajawat200_db_user:%40jayant200425@cluster0.ti6eabt.mongodb.net/parkflow?retryWrites=true&w=majority',
  'mongodb+srv://jayantrajawat200_db_user:jayant%40200425@cluster0.ti6eabt.mongodb.net/parkflow?retryWrites=true&w=majority',
  'mongodb+srv://jayantrajawat200_db_user:Jayant%40200425@cluster0.ti6eabt.mongodb.net/parkflow?retryWrites=true&w=majority',
  'mongodb+srv://jayantrajawat200_db_user:jayant200425@cluster0.ti6eabt.mongodb.net/parkflow?retryWrites=true&w=majority',
];

async function testAll() {
  for (const uri of testUris) {
    console.log(`Testing URI: ${uri.replace(/:([^@]+)@/, ':****@')}`);
    try {
      const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
      console.log(`SUCCESS! Connected to host: ${conn.connection.host}`);
      await mongoose.disconnect();
      return uri;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }
  return null;
}

testAll();
