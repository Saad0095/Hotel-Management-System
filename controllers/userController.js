import User from "../models/user.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, address,role } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "Email already registered" });
    
    let userRole = "customer";
    if (role && req.user && req.user.role === "admin") {
      userRole = role; 
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      role: userRole
    });

    const token = generateToken(user);
    res.status(201).json({
      message: "User Created Successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({
      message: "User LoggedIn Successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { role, status, name, email, phone, address } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    // Only allow admin to change role and status
    const updateData = { name, email, phone, address };
    if (req.user.role === "admin") {
      if (role) updateData.role = role;
      if (status) updateData.status = status;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    res.json({ message: "User updated successfully!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found!" });

    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account!" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
