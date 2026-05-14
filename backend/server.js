const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Route Imports
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes"); 
const userRoutes = require("./routes/userRoutes"); 
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// --- Public API Routes ---
app.use("/api/products", productRoutes); 
app.use("/api/users", userRoutes); 
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// --- Admin API Routes ---
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));