import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret");
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({ message: "Invalid token!" });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Account is not active!" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token!" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired!" });
    }
    res.status(500).json({ error: error.message });
  }
};

// Check if user is admin
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required!" });
  }
  next();
};

// Check if user is customer
export const requireCustomer = (req, res, next) => {
  if (req.user.role !== "customer") {
    return res.status(403).json({ message: "Customer access required!" });
  }
  next();
};

// Check if user owns the resource or is admin
export const requireOwnerOrAdmin = (resourceUserId) => {
  return (req, res, next) => {
    if (req.user.role === "admin" || req.user.id === resourceUserId) {
      return next();
    }
    res.status(403).json({ message: "Access denied!" });
  };
};
