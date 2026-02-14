const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../../../config/cloudinary");

const AppError = require("../../../utils/appError");
const asyncHandler = require("../../../utils/asyncHandler");

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body || {};

  // 🔥 Basic Validation
  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  if (!req.file) {
    throw new AppError("Profile photo is required", 400);
  }

  // 🔥 Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists with this email", 400);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    throw new AppError("Invalid email format", 400);
  }

  // 🔥 Upload profile photo to Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "rentease/users" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(req.file.buffer);
  });

  // 🔥 Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 🔥 Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    profilePhoto: uploadResult.secure_url,
  });

  // 🔥 Generate JWT token
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  // 🔥 Remove password before sending response
  user.password = undefined;

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user,
      token,
    },
  });
});

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return next(new AppError("Email is required", 400));
    }

    if (!password) {
      return next(new AppError("Password is required", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError("Invalid credentials", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Invalid credentials", 400));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    user.role = undefined;

    res.status(200).json({
      success: true,
      user: user,
      message: "Login successful",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error); // 🔥 send to error middleware
  }
};
