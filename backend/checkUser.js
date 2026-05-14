const mongoose = require("mongoose");
const User = require("./models/User"); // Adjust path if needed
const dotenv = require("dotenv");
dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("--- DATABASE USERS ---");
    
    const users = await User.find({});
    
    if (users.length === 0) {
      console.log("No users found in database. Run your seeder!");
    } else {
      users.forEach(u => {
        console.log(`Email: ${u.email}`);
        console.log(`Role: ${u.role}`);
        console.log(`Password (Stored): ${u.password}`);
        console.log(`IsAdmin: ${u.isAdmin}`);
        console.log("----------------------");
      });
    }
    process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

checkUsers();