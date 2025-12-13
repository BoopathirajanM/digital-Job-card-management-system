// src/utils/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Creating admin user...");
    const password = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      passwordHash: password,
      role: "manager"
    });

    console.log("Admin created:", admin);
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();