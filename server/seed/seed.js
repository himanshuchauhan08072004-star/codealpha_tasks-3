require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const slugify = require('../utils/slugify');
const users = require('./data/users');
const products = require('./data/products');

const run = async () => {
  await connectDB();

  console.log('Clearing existing users and products...');
  await User.deleteMany();
  await Product.deleteMany();

  console.log('Seeding users...');
  // Save individually (not insertMany) so the User pre-save hash hook runs
  for (const u of users) {
    await User.create(u);
  }

  console.log('Seeding products...');
  const withSlugs = products.map((p) => ({ ...p, slug: slugify(p.name) }));
  await Product.insertMany(withSlugs);

  console.log(`Seeded ${users.length} users and ${products.length} products.`);
  console.log('');
  console.log('Demo credentials:');
  console.log('  Admin:    admin@shopsphere.test / Admin123!');
  console.log('  Customer: customer@shopsphere.test / Customer123!');

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
