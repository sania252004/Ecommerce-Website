const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");

const router = express.Router();

/**
 * Helper: get cart by userId or guestId
 */
const getCartByUserOrGuest = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

/**
 * @route   GET /api/cart
 * @desc    Get full cart (guest or logged-in)
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const { userId, guestId } = req.query;

    if (!userId && !guestId) {
      return res.status(400).json({
        message: "userId or guestId is required",
      });
    }

    const cart = await getCartByUserOrGuest(userId, guestId);

    if (!cart) {
      return res.json({
        _id: null,
        user: userId || null,
        guestId: guestId || null,
        products: [],
        totalPrice: 0,
        createdAt: null,
        updatedAt: null,
      });
    }

    res.json(cart);
  } catch (error) {
    console.error("GET CART ERROR:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

/**
 * @route   POST /api/cart
 * @desc    Add product to cart (ADD)
 * @access  Public
 */
router.post("/", async (req, res) => {
  try {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await getCartByUserOrGuest(userId, guestId);

    if (!cart) {
      cart = new Cart({
        user: userId || undefined,
        guestId: guestId || `guest_${Date.now()}`,
        products: [],
        totalPrice: 0,
      });
    }

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (index > -1) {
      cart.products[index].quantity += Number(quantity);
    } else {
      cart.products.push({
        productId,
        name: product.name,
        image: product.images?.[0]?.url || "",
        price: Number(product.price),
        size,
        color,
        quantity: Number(quantity),
      });
    }

    cart.totalPrice = Number(
      cart.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ).toFixed(2)
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route   DELETE /api/cart
 * @desc    Clear cart
 * @access  Public
 */

router.delete("/remove", async (req, res) => {
  try {
    const { productId, size, color, userId, guestId } = req.body;
    let cart = await getCartByUserOrGuest(userId, guestId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Filter out the specific item matching ID, Size, and Color
    cart.products = cart.products.filter(
      (p) => !(p.productId.toString() === productId && p.size === size && p.color === color)
    );

    // Recalculate total price
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
    res.json(cart); // Sending back the full updated cart
  } catch (error) {
    console.error("REMOVE ITEM ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * @route   PUT /api/cart/quantity
 * @desc    Update product quantity (SET, not add)
 * @access  Public
 */
router.put("/quantity", async (req, res) => {
  try {
    const { productId, quantity, size, color, guestId, userId } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: "Quantity cannot be negative" });
    }

    const cart = await getCartByUserOrGuest(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (index === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // SET quantity
    if (Number(quantity) === 0) {
      cart.products.splice(index, 1);
    } else {
      cart.products[index].quantity = Number(quantity);
    }

    cart.totalPrice = Number(
      cart.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ).toFixed(2)
    );

    await cart.save();
    res.json(cart);
  } catch (error) {
    console.error("UPDATE QUANTITY ERROR:", error);
    res.status(500).json({ message: "Failed to update quantity" });
  }
});

/**
 * @route   POST /api/cart/merge
 * @desc    Merge guest cart into user cart (login sync)
 * @access  Public
 */
router.post("/merge", async (req, res) => {
  try {
    // ✅ Safe destructuring
    const body = req.body || {};
    const { guestId, userId } = body;

    const guestCart = await Cart.findOne({ guestId });
    if (!guestCart) {
      return res.json({ message: "No guest cart to merge" });
    }

    let userCart = await Cart.findOne({ user: userId });

    // If user has no cart → assign guest cart to user
    if (!userCart) {
      guestCart.user = userId;
      guestCart.guestId = undefined;
      await guestCart.save();

      return res.json({
        message: "Guest cart assigned to user",
        cart: guestCart,
      });
    }

    // Merge products
    guestCart.products.forEach((guestItem) => {
      const index = userCart.products.findIndex(
        (item) =>
          item.productId.toString() ===
            guestItem.productId.toString() &&
          item.size === guestItem.size &&
          item.color === guestItem.color
      );

      if (index > -1) {
        userCart.products[index].quantity += guestItem.quantity;
      } else {
        userCart.products.push(guestItem);
      }
    });

    // Recalculate total
    userCart.totalPrice = userCart.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await userCart.save();
    await Cart.deleteOne({ _id: guestCart._id });

    res.json({
      message: "Cart merged successfully",
      cart: userCart,
    });
  } catch (error) {
    console.error("MERGE CART ERROR:", error);
    res.status(500).json({ message: "Cart merge failed" });
  }
});

module.exports = router; 
