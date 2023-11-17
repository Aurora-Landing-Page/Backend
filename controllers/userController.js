const asyncHandler = require("express-async-handler");
const User = require("../models/registerModel");
const bcryptjs =  require('bcryptjs');

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, gender, college,city,dob, password, confirm_password } = req.body;
  
  if (!name || !email || !phone || !gender || !college || !city || !password || !confirm_password || !dob) {
    return res.status(400).json({ error: "All fields are necessary" });
  }

  try {
    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      return res.status(400).json({ error: "User already registered" });
    }

    const checkPhone = await User.findOne({ phone });

    if (checkPhone) {
      return res.status(400).json({ error: "Phone number already taken" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: "Password didn't match" });
    }     


    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({
      name,
      email,
      phone,
      gender,
      college,
      city,
      password: hashedPassword,
      dob,
    });

    try {
      await newUser.save();
     res.status(200).json("user saved successfully");
     console.log(`User created: ${newUser}`);
     } catch(err) {
        next(err);
     }

    
  } catch (error) {
    console.error(error);
    return next(error);
  }
});



module.exports = { registerUser };
