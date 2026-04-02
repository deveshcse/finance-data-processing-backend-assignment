import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../modules/users/user.model.js";
import Transaction from "../modules/transactions/transaction.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");

const CATEGORIES = {
  income: ["Salary", "Freelance", "Dividends", "Gift", "Refund"],
  expense: ["Food", "Rent", "Utilities", "Entertainment", "Transportation", "Health", "Shopping", "Education"],
};

const DUMMY_USERS = [
  { name: "John Admin", email: "admin@example.com", role: "admin" },
  { name: "Jane Analyst", email: "analyst@example.com", role: "analyst" },
  { name: "Bob Viewer", email: "viewer@example.com", role: "viewer" },
];

const seed = async () => {
  try {
    console.log("🚀 Starting database seeding...");
    
    // 1. Connect to Database
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // 2. Clear existing data
    await User.deleteMany({ email: { $in: DUMMY_USERS.map(u => u.email) } });
    await Transaction.deleteMany({});
    console.log("🧹 Cleared existing demo users and ALL transactions");

    // 3. Create Users
    const hashedDefaultPassword = await bcrypt.hash("Password123", BCRYPT_SALT_ROUNDS);
    const createdUsers = await User.create(
      DUMMY_USERS.map(user => ({
        ...user,
        password: "Password123", // The pre-save hook will hash it
      }))
    );
    console.log(`👤 Created ${createdUsers.length} dummy users`);

    // 4. Generate Transactions
    const transactions = [];
    const now = new Date();

    createdUsers.forEach((user) => {
      // 50 transactions per user
      for (let i = 0; i < 50; i++) {
        const type = Math.random() > 0.3 ? "expense" : "income";
        const categoryList = CATEGORIES[type];
        const category = categoryList[Math.floor(Math.random() * categoryList.length)];
        
        // Random date within last 90 days
        const date = new Date();
        date.setDate(now.getDate() - Math.floor(Math.random() * 90));
        
        const amount = type === "income" 
          ? Math.floor(Math.random() * 5000) + 1000 
          : Math.floor(Math.random() * 500) + 10;

        transactions.push({
          amount,
          type,
          category,
          date,
          notes: `Dummy ${type} for ${category}`,
          createdBy: user._id,
        });
      }
    });

    await Transaction.insertMany(transactions);
    console.log(`💰 Inserted ${transactions.length} dummy transactions`);

    console.log("✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seed();
