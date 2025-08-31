// seedUsers.js
import connectDB from "../db/index.js";
import "dotenv/config";

import User from "../models/user.js";

const seedUsers = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany();

    // Users to seed
    const users = [
      { name: "Alice", email: "alice@example.com", password: "123456", role: "customer" },
      { name: "Bob", email: "bob@example.com", password: "123456", role: "customer" },
      { name: "Charlie", email: "charlie@example.com", password: "123456", role: "customer" },
      { name: "David", email: "david@example.com", password: "123456", role: "receptionist" },
      { name: "Eva", email: "eva@example.com", password: "123456", role: "customer" },
      { name: "Frank", email: "frank@example.com", password: "123456", role: "customer" },
      { name: "Grace", email: "grace@example.com", password: "123456", role: "customer" },
      { name: "Hannah", email: "hannah@example.com", password: "123456", role: "receptionist" },
      { name: "Ivan", email: "ivan@example.com", password: "123456", role: "customer" },
      { name: "Julia", email: "julia@example.com", password: "123456", role: "admin" },
    ];

    // Insert users (passwords will be hashed automatically by pre-save hook)
    const createdUsers = await User.insertMany(users);

    console.log(`✅ ${createdUsers.length} users seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
