const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalPrice,
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    const order = new Order({
      user: req.user._id,
      orderItems: orderItems.map((x) => ({
        ...x,
        productId: x.productId || x._id, // Support both naming conventions
        quantity: x.quantity || 1,
      })),
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: true, // Auto-mark paid since PayPal was successful
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Database Save Error:", error);
    res.status(400).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
});

/**
 * @desc    Get all orders (FOR ADMIN PANEL)
 * @route   GET /api/orders
 * @access  Private (Admin access can be added later)
 */
router.get("/", protect, async (req, res) => {
  try {
    // Populate pulls the user's name and email so the Admin table isn't empty
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
});

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/myorders
 */
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Could not fetch orders" });
  }
});

/**
 * @desc    Get order by ID
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching order" });
  }
});

module.exports = router;