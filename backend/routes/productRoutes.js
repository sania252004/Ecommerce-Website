const express = require("express");
const Product = require("../models/product");
const router = express.Router();

// @route   GET /api/products/new-arrivals
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(newArrivals);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   GET /api/products/best-seller
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne({ isBestSeller: true });
    if (!bestSeller) {
      const fallback = await Product.findOne().sort({ createdAt: -1 });
      return res.json(fallback);
    }
    res.json(bestSeller);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   GET /api/products/similar/:id  ✅ NEW
router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find products with same category or gender, exclude current product
    const similarProducts = await Product.find({
      _id: { $ne: id }, // Exclude current product
      $or: [
        { category: product.category },
        { gender: product.gender },
      ],
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   GET /api/products/:id  ✅ NEW
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route   GET /api/products
router.get("/", async (req, res) => {
  try {
    const { gender, category, color, size, minPrice, maxPrice, sortBy, search, limit } = req.query;
    let query = {};

    if (gender) query.gender = gender;
    if (category) query.category = category;
    if (color) query.colors = { $in: [color] };
    if (size) query.sizes = { $in: [size] };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === "priceAsc") sortOptions = { price: 1 };
    if (sortBy === "priceDesc") sortOptions = { price: -1 };

    let productQuery = Product.find(query).sort(sortOptions);
    if (limit) productQuery = productQuery.limit(Number(limit)); // ✅ Handle limit param

    const products = await productQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;