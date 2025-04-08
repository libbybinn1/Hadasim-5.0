const express = require("express");
const router = express.Router();
const { loginUser, registerSupplier } = require("../services/authService");


//Authenticate a user
router.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  try {
    const result = await loginUser(phone, password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});


 // Register a new supplier
router.post("/register", async (req, res) => {
  try {
    const result = await registerSupplier(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

module.exports = router;
