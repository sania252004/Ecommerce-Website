const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Handle both possible JWT structures
      const userId = decoded.id || (decoded.user && decoded.user.id);
      
      req.user = await User.findById(userId).select("-password");
      if (!req.user) return res.status(401).json({ message: "User not found" });
      
      next();
    } catch (error) {
      res.status(401).json({ message: "Token invalid" });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };