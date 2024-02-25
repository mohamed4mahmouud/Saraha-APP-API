import { userModel } from "../DB/models/userModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/sendEmail.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKENKEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

const hashedResetCode = (resetCode) => {
  return crypto.createHash("sha256").update(resetCode).digest("hex");
};

export const signUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, passwordConfirm } = req.body;
  const foundUser = await userModel.findOne({ email });

  if (password !== passwordConfirm) {
    return next(new AppError("Password doesn't match", 400));
  }

  if (foundUser) {
    return next(new AppError("E-mail already in use", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 8);

  const newUser = await userModel.create({
    userName,
    email,
    password: hashedPassword,
  });
  const token = createToken(newUser._id);

  const message = `<a href="${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/confirmEmail/${token}">Please click here to verify your email</a>`;
  sendEmail(email, message);
  res.status(201).json({ message: "success", newUser });
});

export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if ((!email, !password)) {
    return next(new AppError("Please Provide Email And password", 400));
  }
  const user = await userModel.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  if (!user.confirmEmail) {
    return next(new AppError("Please confirm your email", 400));
  }
  const token = createToken(user._id);
  res.status(200).json({
    message: "success",
    token,
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.TOKENKEY);
  if (!decoded) {
    return next(new AppError("invalid token", 400));
  }
  const user = await userModel.findOne({
    _id: decoded.id,
    confirmEmail: false,
  });
  if (!user) {
    return next(
      new AppError("You are already confirmed email or invalid token", 400)
    );
  }
  const updatedUser = await userModel.findByIdAndUpdate(
    decoded.id,
    { confirmEmail: true },
    { new: true }
  );
  res.status(200).json({ message: "updated", updatedUser });
});

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in", 401));
  }

  const decoded = jwt.verify(token, process.env.TOKENKEY);
  const currentUser = await userModel.findById(decoded.id);

  //check if user still exist
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exist ", 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("User Recently changed password", 401));
  }

  req.user = currentUser;
  next();
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  //get user by email
  const { email } = req.body;
  if (!email) {
    return next(new AppError("Please provide email", 400));
  }
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("There is no user with that email", 404));
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashCode = hashedResetCode(resetCode);

  user.passwordResetCode = hashCode;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  user.passwordResetVerifed = false;
  await user.save();

  const message = `Hi ${user.userName},\n we received a request to reset the password on your Saraha Account. \n ${resetCode}`;
  try {
    sendEmail(email, message);
  } catch (error) {
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerfied = undefined;

    res.status(500).json({ message: "error send email" });
  }

  res.status(200).json({ message: "success" });
});

export const verfiyResetCode = asyncHandler(async (req, res, next) => {
  const { resetCode } = req.body;
  const hashCode = hashedResetCode(resetCode);
  const user = await userModel.findOne({
    passwordResetCode: hashCode,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Reset code invalid or expired"));
  }

  user.passwordResetVerifed = true;
  await user.save();
  res.status(200).json({ message: "success" });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("No users for this email", 404));
  }
  if (!user.passwordResetVerifed) {
    return next(new AppError("Reset code not verified", 400));
  }

  const hashedPassword = await bcrypt.hash(req.body.newPassword, 8);

  user.password = hashedPassword;
  user.passwordResetCode = undefined;
  user.passwordResetVerifed = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = createToken(user._id);
  res.status(200).json({ token });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, newConfirmPassword } = req.body;

  // Validate input fields

  if (newPassword !== newConfirmPassword) {
    return next(
      new AppError("New Password Must Equal new Confirm Password", 400)
    );
  }

  if (!currentPassword || !newPassword || !newConfirmPassword) {
    return next(
      new AppError("Please provide both current and new passwords", 400)
    );
  }

  const user = await userModel.findById(req.user._id);

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError("Your current password is wrong", 400));
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 8);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password changed successfully", user });
  } catch (error) {
    return next(
      new AppError("Failed to change password. Please try again later", 500)
    );
  }
});
