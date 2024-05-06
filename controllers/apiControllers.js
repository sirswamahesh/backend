const express = require("express");
const usersSchema = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();
// creating endpoint for user login

router.post("/signup", async (req, res) => {
  console.log(req.body);
  let check = await usersSchema.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user found with same email address.",
    });
  } else {
    const user = await usersSchema.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const data = {
      user: {
        id: user._id,
      },
    };
    const token = jwt.sign(data, "secret_ecom");
    res.json({ success: true, token });
  }
});

router.post("/login", async (req, res) => {
  let user = await usersSchema.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user._id,
        },
      };

      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong email id" });
  }
});

module.exports = router;
