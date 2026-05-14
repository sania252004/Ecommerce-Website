const express = require("express");
const router = express.Router();
const Product = require("../models/product"); // Ensure this matches your file name exactly
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/admin/products
// @desc    Get all products for admin dashboard
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   POST /api/admin/products
// @desc    Create a new product
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      // Map both potential frontend names to the schema field
      countInStock: req.body.countInStock !== undefined ? req.body.countInStock : (req.body.stock || 0),
      material: req.body.materials, // Mapping plural to singular if needed
      user: req.user._id, // Reference to the admin user
    });
    
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(400).json({ message: "Invalid product data", error: error.message });
  }
});

// @route   PUT /api/admin/products/:id
// @desc    Update an existing product (including Stock)
// @access  Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 1. Update general fields dynamically
    Object.assign(product, req.body);

    // 2. SPECIFIC FIX FOR STOCK:
    // This handles if the frontend sends the value as 'countInStock' OR 'stock'
    if (req.body.countInStock !== undefined) {
      product.countInStock = req.body.countInStock;
    } else if (req.body.stock !== undefined) {
      product.countInStock = req.body.stock;
    }

    // 3. Fix for materials pluralization
    if (req.body.materials) {
      product.material = req.body.materials;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Update failed", error: error.message });
  }
});

// @route   DELETE /api/admin/products/:id
// @desc    Delete a product by ID
// @access  Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

module.exports = router;