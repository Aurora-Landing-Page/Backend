// Library Imports
const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User Imports
const { NotFoundError, UserError, ServerError } = require("../utils/errors");
const SuccessResponse = require("../utils/successResponses");
const successHandler = require("./successController");
const emailController = require("./emailController");

// Model Imports
const User = require("../models/userModel");
const CA = require("../models/caModel");
const Event = require("../models/event");
const IndividualEvent = Event.individualEvent;
const GroupEvent = Event.groupEvent;

// Import environment variables
const dotenv = require("dotenv");
dotenv.config();

// JWT cookie persists for 1 day (value below is in ms)
const maxAge = 1 * 24 * 60 * 60 * 1000;

// Generates alphanumeric code of specified length
function generateCode(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let referralCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters[randomIndex];
  }
  return referralCode;
}

const registerUser = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    gender,
    college,
    city,
    dob,
    password,
    referralCode,
  } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !gender ||
    !college ||
    !city ||
    !password ||
    !dob
  ) {
    next(new UserError("All fields are necessary"));
  }

  try {
    const checkEmail = await User.findOne({ email });

    if (checkEmail) {
      next(new UserError("Email already taken"));
    }

    const checkPhone = await User.findOne({ phone });

    if (checkPhone) {
      next(new UserError("Phone Number already taken"));
    }

    if (referralCode) {
      const CAdoc = await CA.findOne({ referralCode });

      if (!CAdoc) {
        next(new UserError("Invalid CA referral code"));
      } else {
        const referral = {
          name: name,
          email: email,
          phone: phone,
          college: college,
        };

        CAdoc.referrals.push(referral);
        await CAdoc.save();
      }
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
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
      const { password, __v, ...otherFields } = newUser._doc;
      successHandler(
        new SuccessResponse("User created successfully", 201),
        res,
        otherFields
      );
    } catch (err) {
      console.error(err);
      next(new ServerError("User could not be created"));
    }
  } catch (error) {
    console.error(error);
    next(new ServerError("Unknown error"));
  }
});

const registerCa = asyncHandler(async (req, res, next) => {
  const { name, email, phone, gender, college, city, password, dob } = req.body;

  if (
    !name ||
    !email ||
    !phone ||
    !gender ||
    !college ||
    !city ||
    !password ||
    !dob
  ) {
    next(new UserError("All fields are necessary"));
  }

  try {
    const checkEmail = await CA.findOne({ email });

    if (checkEmail) {
      next(new UserError("Email already taken"));
    }

    const checkPhone = await CA.findOne({ phone });

    if (checkPhone) {
      next(new UserError("Phone Number already taken"));
    }

    let referralCode = generateCode();
    const checkReferralCode = await CA.findOne({ referralCode });

    // Regenerate referral code until a unique one is obtained
    while (checkReferralCode) {
      referralCode = generateCode();
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
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
    });

    try {
      await newCa.save();
      const { password, __v, ...otherFields } = newCa._doc;
      successHandler(
        new SuccessResponse("CA created successfully", 201),
        res,
        otherFields
      );
    } catch (err) {
      console.error(err);
      next(new ServerError("CA could not be created"));
    }
  } catch (error) {
    console.error(error);
    next(new ServerError("Unknown error"));
  }
});

// Actually responsible for creating the token
function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: maxAge,
  });
}

// For generating the JWT and storing it in a cookie
const loginCa = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await CA.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    successHandler(new SuccessResponse(`Logged in`, 202), res, {
      id: user._id,
    });
  } catch (err) {
    next(new UserError("Invalid username / password", 403));
  }
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge });
    successHandler(new SuccessResponse(`Logged in`, 202), res, {
      id: user._id,
    });
  } catch (err) {
    next(new UserError("Invalid username / password", 403));
  }
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt");
  successHandler(new SuccessResponse("Logged Out!"), res);
});

const getCaData = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  let id;

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        next(new UserError("Invalid JWT", 403));
      } else {
        id = decoded.id;
      }
    });

    const CAdoc = await CA.findById(id);
    if (CAdoc) {
      const { password, __v, ...otherFields } = CAdoc._doc;
      successHandler(new SuccessResponse("CA Found"), res, otherFields);
    } else {
      next(new NotFoundError("CA not found"));
    }
  } catch (error) {
    console.error(error);
    next(new ServerError("Unknown error"));
  }
});

const forgotPass = asyncHandler(async (req, res, next) => {
  const { email, type } = req.body;

  if (type === "user") {
    await resetPassAndSendMail(User, email, res, next);
  } else if (type === "CA") {
    await resetPassAndSendMail(CA, email, res, next);
  } else {
    next(new UserError("Invalid user type"));
  }
});

const resetPassAndSendMail = async (model, email, res, next) => {
  const code = generateCode(5);
  const doc = await model.findOne({ email });

  if (doc) {
    doc.password = bcryptjs.hashSync(code, 10);
    await doc.save();

    try {
      await emailController.sendForgotPassMail(email, doc.name, code);
      successHandler(
        new SuccessResponse(`New password sent to email id ${email}`),
        res
      );
    } catch (error) {
      console.error(error);
      next(new ServerError("Failed to send email"));
    }
  } else {
    next(new NotFoundError(`User with email ${email} not found`));
  }
};

const getEvents = asyncHandler(async (req, res, next) => {
  const { eventId, type } = req.body;

  if (type === "individual") {
    await getIndividualParticipants(IndividualEvent, eventId, res, next);
  } else if (type === "group") {
    await getGroupParticipants(GroupEvent, eventId, res, next);
  } else {
    next(new UserError("Invalid event type"));
  }
});

const getIndividualParticipants = async (model, eventId, res, next) => {
  const event = await model.findById(eventId);

  if (event) {
  } else {
    next(
      new NotFoundError(`Individual event with eventID ${eventId} not found`)
    );
  }
};

const getGroupParticipants = async (model, eventId, res, next) => {
  const event = await model.findById(eventId);

  if (event) {
  } else {
    next(
      new NotFoundError(`Individual event with eventID ${eventId} not found`)
    );
  }
};

module.exports = {
  registerUser,
  registerCa,
  loginCa,
  loginUser,
  logout,
  getCaData,
  forgotPass,
  getEvents,
};
