const asyncHandler = require("express-async-handler");
const User = require("../models/registerModel");

const registerUser = asyncHandler(async (req, res, next) => {
  const { first_name, last_name, email, phone } = req.body;
  
  if (!first_name || !last_name || !email || !phone) {
    return res.status(400).json({ error: "All fields are necessary" });
  }

  try {
    const userAvailable = await User.findOne({ email });

    if (userAvailable) {
      return res.status(400).json({ error: "User already registered" });
    }

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone,
    });

    console.log(`User created: ${newUser}`);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // Handle other errors, log them, and pass to the error handling middleware
    console.error(error);
    return next(error);
  }
});

module.exports = { registerUser };
