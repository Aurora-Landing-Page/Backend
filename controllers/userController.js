// Library Imports
const asyncHandler = require("express-async-handler");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const qrcode = require("qrcode");

// User Imports
const { NotFoundError, UserError, ServerError } = require("../utils/errors");
const SuccessResponse = require("../utils/successResponses");
const successHandler = require("./successController");
const emailController = require("./emailController");

// Model Imports
const { User } = require("../models/userModel");
const { PhysicalUser } = require("../models/physicalUserModel");
const CA = require("../models/caModel");
const Event = require("../models/event");
const ContactUsMessage = require("../models/contactUsMessage");

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

async function generateTicket(name, email, phone, ticketCode) {
  if (name.length > 28) { name = name.slice(0,35) + "..."; }
  if (email.length > 28) { email = email.slice(0,35) + "..."; }

  let ticketImage = await Jimp.read(process.env.TICKET_TEMPLATE_ROUTE);
  const toEncode = process.env.SITE_FOR_TICKET + "/verify?ticketCode=" + ticketCode;
  const opts = {
    errorCorrectionLevel: "H",
    color: {
      dark: "#000",
      light: "#00FF1213",
    },
    width: 300,
  };
  let qrCodeDataUrl = await qrcode.toDataURL(toEncode, opts);
  let base64Image = qrCodeDataUrl.split(";base64,").pop();
  let qrCodeImage = await Jimp.read(Buffer.from(base64Image, "base64"));

  ticketImage.composite(qrCodeImage, 1625, 173);

  const codeFont = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

  const fontCanvas = await Jimp.create(300, 300);
  fontCanvas.print(codeFont, 0, 0, ticketCode).rotate(90);
  ticketImage.blit(fontCanvas, 65, 65);

  ticketImage.print(font, 995, 383, name);
  ticketImage.print(font, 995, 449, email);
  ticketImage.print(font, 995, 514, phone);
  ticketImage.resize(1200, Jimp.AUTO);

  return ticketImage;
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
    return;
  }

  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      next(new UserError("Email already taken"));
      return;
    }

    const checkPhone = await User.findOne({ phone });
    if (checkPhone) {
      next(new UserError("Phone Number already taken"));
      return;
    }

    if (referralCode) {
      const CAdoc = await CA.findOne({ referralCode });

      if (!CAdoc) {
        next(new UserError("Invalid CA referral code"));
        return;
      } else {
        const referral = {
          name: name,
          email: email,
          phone: phone,
          college: college,
        };

        CAdoc._doc.referrals.push(referral);
        await CAdoc.save();
      }
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    let ticketCode = generateCode(6);
    const checkTicketCode = await User.findOne({ ticketCode }) && await PhysicalUser.findOne({ ticketCode });
    while (checkTicketCode) {
      ticketCode = generateCode(6);
    }

    const newUser = new User({
      name,
      email,
      phone,
      gender,
      college,
      city,
      password: hashedPassword,
      dob,
      ticketCode,
    });

    try {
      await newUser.save();
      const { password, __v, createdAt, updatedAt, _id, ...otherFields } =
        newUser._doc;
      emailController.sendSignupMail(name, email);
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
    return;
  }

  const checkEmail = await CA.findOne({ email });
  if (checkEmail) {
    next(new UserError("Email already taken"));
    return;
  }

  const checkPhone = await CA.findOne({ phone });
  if (checkPhone) {
    next(new UserError("Phone number already taken"));
    return;
  }

  try {
    let referralCode = generateCode();
    const checkReferralCode = await CA.findOne({ referralCode });
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
      const { password, __v, createdAt, updatedAt, _id, ...otherFields } = newCa._doc;
      emailController.sendSignupMailCa(name, email, referralCode);
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
function createToken(id, age = maxAge) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: age,
  });
}

// For generating the JWT and storing it in a cookie
const loginCa = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await CA.login(email, password);
    const token = createToken(user._id);
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.cookie("jwt", token, 
    // {
    //   httpOnly: true,
    //   maxAge: maxAge,
    //   domain: process.env.DOMAIN,
    //   sameSite: "none",
    //   secure: true,
    // }
    );
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
    res.cookie("jwt", token, 
    // {
    //   httpOnly: true,
    //   maxAge: maxAge,
    //   domain: process.env.DOMAIN,
    //   sameSite: "none",
    //   secure: true,
    // }
    );
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

const getUserData = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  let id;

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        next(new UserError("Invalid JWT", 403));
        return;
      } else {
        id = decoded.id;
      }
    });

    const userDoc = await User.findById(id);
    if (userDoc) {
      const { password, __v, createdAt, updatedAt, _id, ...otherFields } =
        userDoc._doc;
      successHandler(new SuccessResponse("User Found"), res, otherFields);
    } else {
      next(new NotFoundError("User not found"));
    }
  } catch (error) {
    console.error(error);
    next(new ServerError("Unknown error"));
  }
});

const getUserPaymentStatus = asyncHandler(async (req, res, next) => {
  try {
    const email = req.body.email;

    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const { associatedPayments } = userDoc._doc;
      let paid = associatedPayments;
      successHandler(new SuccessResponse("User Found"), res, paid);
    } else {
      next(new NotFoundError("User not found"));
    }
  } catch (error) {
    console.error(error);
    next(new ServerError("Unknown error"));
  }
});

const getCaData = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  let id;

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        next(new UserError("Invalid JWT", 403));
        return;
      } else {
        id = decoded.id;
      }
    });

    const CAdoc = await CA.findById(id);
    if (CAdoc) {
      const { password, __v, createdAt, updatedAt, _id, ...otherFields } =
        CAdoc._doc;
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

const contactUs = asyncHandler(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    next(new UserError("All fields are necessary"));
  } else {
    try {
      const contact_us_message = new ContactUsMessage({
        name,
        email,
        subject,
        message,
      });
      await contact_us_message.save();
      successHandler(
        new SuccessResponse(
          "Your message has been saved, we will contact you shortly"
        ),
        res
      );
    } catch (error) {
      console.error(error);
      next(new ServerError("The message could not be saved in the DB"));
    }
  }
});

const generateQR = asyncHandler(async (req, res, next) => {
  const { sendToEmail } = req.body;
  const token = req.cookies.jwt;
  let id;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      next(new UserError("Invalid JWT", 403));
    } else {
      id = decoded.id;
    }
  });

  try {
    const userDoc = await User.findById(id);
    if (!userDoc) {
      next(new UserError("Invalid credentials"));
    } else {
      const { name, email, phone, ticketCode } = userDoc._doc;
      const ticketImage = await generateTicket(name, email, phone, ticketCode);
      const buffer = await ticketImage.getBufferAsync(Jimp.MIME_PNG);
      if (sendToEmail) {
        await emailController.sendQRMail(name, email, buffer, ticketCode);
      }

      res.setHeader("Content-Type", "image/png");
      res.send(buffer);
    }
  } catch (error) {
    console.error(error);
    next(new ServerError("QR Code could not be generated"));
  }
});

module.exports = {
  registerUser,
  registerCa,
  loginCa,
  loginUser,
  logout,
  getUserData,
  getCaData,
  forgotPass,
  contactUs,
  generateQR,
  generateCode,
  generateTicket,
  getUserPaymentStatus
};
