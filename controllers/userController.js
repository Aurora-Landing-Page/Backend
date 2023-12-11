const asyncHandler = require("express-async-handler");
const User = require("../models/registerModel");
const CA = require("../models/caModel");
const bcryptjs =  require('bcryptjs');
const jwt = require("jsonwebtoken");

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

// JWT cookie persists for 1 day (value below is in ms)
const maxAge = 1 * 24 * 60 * 60 * 1000;

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

// Actually responsible for creating the token
function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: maxAge
  })
}

// For generating the JWT and storing it in a cookie
const loginCa = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await CA.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge })  
    res.cookie('name', user.username, { maxAge: maxAge }) 
    res.status(200).json({ userId: user._id })
  } catch (err) {
    console.error(`Error occured, stack trace: \n ${ err.stack }`);
    res.status(500).json({ 
      title:"Server Error",
      message: err.message
    })
  }
})

const logoutCa = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 })
  res.cookie('name', '', { maxAge: 1 })
  res.status(200).json({ "message": "Logged out!" })
})

const loginTest = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt
  try {
      if (token) {
          jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
              if (err) { res.status(400).json({ "errors": {"message": "Invalid JWT"} }) } 
              else { res.status(200).json({ "decoded": decoded }) }
          })
      } else { res.status(400).json({ "errors": {"message": "JWT does not exist, please login first"} }) }
  } catch (error) {
      console.error(error)
      res.status(500).json({ "errors": {"message": "JWT does not exist, please login first"} })
  }
});

module.exports = { registerUser, registerCa, loginCa, logoutCa, loginTest };
