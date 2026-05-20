require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/userModel');

const createCustomer = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash('Saritha@123', 10);

  const user = await User.create({
    name: 'Saritha',
    email: 'saritha@gmail.com',
    password: hashedPassword,
    role: 'user',
    customerId: 'saritha_store'
  });

  console.log('✅ Customer created:', user);
  mongoose.disconnect();
};

createCustomer().catch(console.error);