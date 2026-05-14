const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/product");
const User = require("./models/User");
const Cart = require("./models/cart");

const products = require("./data/products");

dotenv.config();

// Connect DB
mongoose.connect(process.env.MONGO_URI);

// Seed Function
const seedData = async () => {
  try {
    // Delete old data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create Admin User
    // IMPORTANT:
    // Password is plain text because User model hashes automatically
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
      isAdmin: true,
    });

    const userID = createdUser._id;

    // Add user reference to products
    const sampleProducts = products.map((product) => ({
      ...product,
      user: userID,
    }));

    // Insert Products
    await Product.insertMany(sampleProducts);

    console.log("✅ Data seeded successfully!");
    console.log("Admin Email: admin@example.com");
    console.log("Admin Password: 123456");

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding the data:", error);
    process.exit(1);
  }
};

seedData();