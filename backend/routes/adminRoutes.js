const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Order = require("../models/Order");

// Import your auth middleware 
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/admin/users
// @desc    Create a new user (Admin only)
// @access  Private/Admin
router.post("/users", protect, admin, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    //  Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create the user
    const user = await User.create({
      name,
      email,
      password,
      role: role || "customer", 
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "User created successfully by admin",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Admin Create User Error:", error);
    res.status(500).json({ message: "Server error during user creation" });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user details or role (Admin only)
// @access  Private/Admin
router.put("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update basic info
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    // Handle password update separately if provided
    if (req.body.password) {
      user.password = req.body.password; 
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      message: "User updated successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    console.error("Admin Update Error:", error);
    res.status(500).json({ message: "Server error during update" });
  }
});

// @route   GET /api/admin/stats
// @desc    Get total sales and order count
// @access  Private/Admin
router.get("/stats", protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find({});
    const totalSales = orders.reduce((acc, item) => acc + item.totalPrice, 0);

    res.json({
      totalOrders,
      totalSales,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        return res.status(400).json({ message: "You cannot delete your own admin account!" });
      }
      await user.deleteOne();
      res.json({ message: "User removed successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;