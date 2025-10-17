import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Director from './models/Director.js';

dotenv.config();

const createDirector = async () => {
  await connectDB();

  const username = 'Motri';
  const email = 'yosefasefa8889@gmail.com';
  const password = 'yosii888';

  const existing = await Director.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    console.log('Director already exists');
    process.exit(0);
  }

  const director = new Director({ username, email, password });

  try {
    await director.save();
    console.log('Director created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating director:', err);
    process.exit(1);
  }
};

createDirector();
