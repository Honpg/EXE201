require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Transaction = require('./models/Transaction');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  await Transaction.deleteMany({});

  const users = [];
  for (let i = 1; i <= 5; i++) {
    const user = await User.create({
      name: `User ${i}`,
      email: `user${i}@example.com`,
      password: 'password123',
      role: 'user'
    });
    await Transaction.create({
      user: user._id,
      planName: 'Basic Plan',
      price: 9.99
    });
    users.push(user);
  }

  console.log('Seeded users:', users.length);
  await mongoose.disconnect();
}

seed();
