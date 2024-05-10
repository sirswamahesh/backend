const express = require("express");
const usersSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
// creating endpoint for user login
const SECRET_KEY = "your-secret-key";

const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.status(200).send("Welcome to home");
});

router.post("/login", async (req, res) => {
  const { username, password ,email} = req.body;
  console.log(">>>>>>>>>>>>>>body", req.body);
  try {
    // Check if the user exists
    const user = await usersSchema.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY);
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/register", async (req, res) => {
  const { username, password, role,email } = req.body;
  console.log(">>>>>>>>>>>>>>>>>>>>.req.body", req.body);
  try {
    // Check if the user already exists
    const existingUser = await usersSchema.findOne({ username });
    console.log(">>>>>>>>", existingUser);
    if (existingUser == null) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new usersSchema({
        username,
        password: hashedPassword,
        email,
        role,
      });
      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } else {
      return res.status(400).json({ message: "Username already exists" });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send("Access denied. Token is missing");
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).send("Invalid token");
  }
};
router.get("/admin", verifyToken, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).send("Access denied. Admin access required");
  }
  res.status(200).send("Welcome to admin panel");
});

router.get("/home", verifyToken, (req, res) => {
  res.status(200).send("Welcome to home");
});

module.exports = router;
