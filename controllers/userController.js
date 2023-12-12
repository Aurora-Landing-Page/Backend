const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const emailController = require("../controllers/emailController")
const jwt = require("jsonwebtoken");

// Model Imports
const User = require("../models/userModel");
const schema = require("../models/caModel");
const CA = schema.CA;
const minUser = schema.minUser;

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

// JWT cookie persists for 1 day (value below is in ms)
const maxAge = 1 * 24 * 60 * 60 * 1000;

// Generates alphanumeric code of specified length
function generateCode(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let referralCode = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
  }
  return referralCode;
};

const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, gender, college, city, dob, password, referralCode } = req.body;

  if (!name || !email || !phone || !gender || !college || !city || !password || !dob) {
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

    if (referralCode) {
      const CAdoc = await CA.findOne({ referralCode })

      if (!CAdoc) { return res.status(400).json({ error: "Invalid referral code" }) }
      else {
        const referral = new minUser({
          name,
          email,
          phone,
          college
        })

        CAdoc.referrals.push(referral)
        await CAdoc.save()
      }
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
      res.status(200).json({ "message": "User saved successfully" });
    } catch (err) {
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
    
    let referralCode = generateCode();
    const checkReferralCode = await CA.findOne({ referralCode });
    
    if (checkReferralCode) {
      referralCode = generateCode();
    }

    const hashedPassword = bcryptjs.hashSync(password,10);
    const newCa = new CA({
      name,
      email,
      phone,
      gender,
      college,
      city,
      password: hashedPassword,
      dob,
      referralCode: referralCode
    });

    try {
      await newCa.save();
      res.status(200).json({ 
        "message": "CA saved successfully", 
        "CA": {
          "name": name,
          "email": email,
          "phone": phone,
          "gender": gender,
          "college": college,
          "city": city,
          "dob": dob,
          "referralCode": referralCode
        } 
      });
    } catch (err) {
      console.error(err)
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
    res.status(200).json({ userId: user._id })
  } catch (err) {
    res.status(400).json({ 
      title:"Invalid Request",
      message: err.message
    })
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge })
    res.status(200).json({ userId: user._id })
  } catch (err) {
    res.status(400).json({ 
      title:"Invalid Request",
      message: err.message
    })
  }
})

const logout = asyncHandler(async (req, res) => {
  res.clearCookie('jwt')
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

const getCaData = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt
  let id

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) { res.status(400).json({ "errors": {"message": "Invalid JWT"} }) } 
      else { const id = decoded.id }
    })

    const CAdoc = await CA.findOne({ id })
    const object = {
      name: CAdoc.name,
      email: CAdoc.email,
      phone: CAdoc.phone,
      gender: CAdoc.gender,
      college: CAdoc.college,
      city: CAdoc.city,
      dob: CAdoc.dob,
      referralCode: CAdoc.referralCode,
      referralCount: CAdoc.referralCount,
      referrals: CAdoc.referrals
    } 

    res.status(200).json(object)
  } catch (error) {
    console.error(error)
    res.status(500).json({ "errors": {"message": "Internal Server Error"} })
  }
})

const forgotPass = asyncHandler(async (req, res) => {
  const { email, type } = req.body

  try {
    const code = generateCode(5)

    if (type == 'user') {
      const userDoc = await User.findOne({ email })

      if (userDoc) {
        emailController.sendForgotPassMail(email, code)
        res.status(200).json({ "message": `OTP sent to email id ${ email }` })
      } else {
        res.status(404).json({ 
          title:"Invalid Request",
          message: "User not found"
        })
      }
    } else if (type == 'CA') {
      const caDoc = await CA.findOne({ email })

      if (caDoc) {
        emailController.sendForgotPassMail(email, code)
        res.status(200).json({ "message": `OTP sent to email id ${ email }` })
      } else {
        res.status(404).json({ 
          title:"Invalid Request",
          message: "CA not found"
        })
      }
    } else {
      res.status(400).json({ 
        title:"Invalid Request",
        message: "Please define user type"
      })
    }   
  } catch (error) {
    console.error(error)
    res.status(500).json({ message:"Internal Server Error" })
  } 
})

module.exports = { registerUser, registerCa, loginCa, loginUser, logout, loginTest, getCaData, forgotPass };
