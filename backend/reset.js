require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Double check: is it "User" or "userModel"?

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    const email = "admin@example.com"; 
    const newPassword = "admin123"; // Set this to whatever you want

    // Hash the new password so the backend can read it
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { password: hashedPassword },
      { new: true }
    );

    if (updatedUser) {
      console.log(`✅ Success! Password for ${email} is now: ${newPassword}`);
    } else {
      console.log("❌ User not found.");
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

resetPassword();