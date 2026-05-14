const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/admin/orders
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   PUT /api/admin/orders/:id
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const updateData = { status };

    if (status === "Delivered") {
      updateData.isDelivered = true;
      updateData.deliveredAt = Date.now();
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

module.exports = router;