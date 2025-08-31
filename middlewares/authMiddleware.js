import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token required!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

export const authRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized!" });
    }
    next();
  };
};

// Check if user owns the resource or is admin
export const requireOwnerOrAdmin = (req, res, next) => {
  const resourceUserId = req.params.id;
  if (req.user.role === "admin" || req.user._id.toString() === resourceUserId) {
    return next();
  }
  res.status(403).json({ message: "Access denied!" });
};
