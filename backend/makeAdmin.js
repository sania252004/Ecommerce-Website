const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Path to your User model
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    // 1. Delete existing admin to be sure
    await User.deleteOne({ email: "admin@example.com" });

    // 2. Create fresh admin with hashed password
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true // Crucial for the next steps!
    });

    console.log("✅ Admin user created successfully!");
    process.exit();
}).catch(err => console.log(err));