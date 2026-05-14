const express = require("express");
const router = express.Router();

const Checkout = require("../models/Checkout");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Order = require("../models/Order");

const { protect } = require("../middleware/authMiddleware");

/**
 * CREATE CHECKOUT
 * Works with items sent in Body (Postman) OR items in the Database Cart
 */
router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    // Extract items and total directly from the request body
    const { shippingAddress, paymentMethod, checkoutItem, total } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        message: "Shipping address and payment method are required",
      });
    }

    // Prevent multiple active checkouts
    const existingCheckout = await Checkout.findOne({
      user: userId,
      isFinalized: false,
    });

    if (existingCheckout) {
      return res.status(400).json({
        message:
          "You already have an active checkout. Please finalize or cancel it.",
      });
    }

    let finalItems = [];
    let finalTotalPrice = 0;

    // LOGIC: Check if items were provided in Postman body first
    if (checkoutItem && checkoutItem.length > 0) {
      finalItems = checkoutItem;
      finalTotalPrice = total;
    } else {
      // FALLBACK: Look for the cart in the database
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product"
      );

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      finalItems = cart.items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        image: item.product.images?.[0] || "",
        price: item.product.price,
        quantity: item.quantity,
      }));
      finalTotalPrice = cart.totalPrice;
    }

    // Create the checkout document
    const checkout = await Checkout.create({
      user: userId,
      checkoutItems: finalItems,
      shippingAddress,
      paymentMethod,
      totalPrice: finalTotalPrice,
      paymentStatus: "pending",
      isPaid: false,
      isFinalized: false,
    });

    res.status(201).json(checkout);
  } catch (error) {
    console.error("CHECKOUT ERROR:", error);
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
});

/**
 * MARK CHECKOUT AS PAID
 */
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    checkout.isPaid = true;
    checkout.paidAt = Date.now();
    checkout.paymentStatus = "paid";
    checkout.paymentDetails = req.body.paymentDetails || {};

    const updatedCheckout = await checkout.save();
    res.json(updatedCheckout);
  } catch (error) {
    console.error("PAYMENT ERROR:", error);
    res.status(500).json({ message: "Payment update failed" });
  }
});

/**
 * FINALIZE CHECKOUT → CREATE ORDER
 */
router.put("/:id/finalize", protect, async (req, res) => {
  try {
    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (checkout.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Checkout already finalized" });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({ message: "Payment not completed" });
    }

    // Create order from checkout details

    const order = await Order.create({
      user: checkout.user,
      orderItems: checkout.checkoutItems.map((item) => ({
        ...item,
        quantity: item.quantity || 1, 
      })),
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod, 
      totalPrice: checkout.totalPrice,
      isPaid: true,
      paidAt: checkout.paidAt,
    });

    // Update product stock
    for (const item of checkout.checkoutItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.countInStock -= item.quantity || 1;
        await product.save();
      }
    }

    checkout.isFinalized = true;
    checkout.finalizedAt = Date.now();
    await checkout.save();

    // Clear user's database cart if it exists
    await Cart.findOneAndDelete({ user: checkout.user });

    res.json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("FINALIZE CHECKOUT ERROR:", error);
    res.status(500).json({
      message: "Order creation failed",
      error: error.message, // This tells us what actually happened
      stack: error.stack,
    });
  }
});

/**
 * GET USER CHECKOUTS
 */
router.get("/my", protect, async (req, res) => {
  try {
    const checkouts = await Checkout.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(checkouts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch checkouts" });
  }
});

module.exports = router;
