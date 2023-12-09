const asyncHandler = require("express-async-handler");
const User = require("../models/registerModel");
const CA = require("../models/caModel");
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

const registerCa = asyncHandler(async (req, res, next) => {
  const { name, email, phone, gender, college, city, password, dob} = req.body;
    
  if (!name || !email || !phone || !gender || !college || !city || !password || !dob) {
    return res.status(400).json({ error: "All fields are necessary" });
  }
  
  try {
    const checkEmail = await CA.findOne({ email });

    if (checkEmail) {
      return res.status(400).json({ error: "CA already registered" });
    }

    const checkPhone = await CA.findOne({ phone });

    if (checkPhone) {
      return res.status(400).json({ error: "Phone number already taken" });
    }     

    const hashedPassword = bcryptjs.hashSync(password,10);

    const generateReferralCode = () => {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let referralCode = '';
    
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referralCode += characters[randomIndex];
      }
      return referralCode;
    };
    
    let referralCode = generateReferralCode();
    const checkReferralCode = await CA.findOne({ referralCode });
    
    if (checkReferralCode) {
      referralCode = generateReferralCode();
    }
    
    console.log(referralCode);
    
    const newCa = new CA({
      name,
      email,
      phone,
      gender,
      college,
      city,
      password: hashedPassword,
      dob,
      referralCode: referralCode,
      referralCount: 0,
    });

    try {
      await newCa.save();
     res.status(200).json("CA saved successfully");
     console.log(`CA created: ${newCa}`);
     } catch(err) {
        next(err);
     }

    
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = { registerUser, registerCa };
