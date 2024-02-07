import { userModel } from "../DB/models/userModel.js";
import asyncHandler from "express-async-handler";
import { messageModel } from "../DB/models/messageModel.js";
import AppError from "../utils/appError.js";

export const userProfile = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ _id: req.user.id });

  if (!user) {
    return next(new AppError("Invalid user id", 404));
  }
  res.status(200).json({ message: "succcess", user });
});

export const getUserMessages = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const userMessages = await messageModel.find({ recieverId: id });
  res.status(200).json({ message: "success", userMessages });
});

export const updateMe = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, userName, email } = req.body;
  const { id } = req.user;

  if (req.body.password) {
    return next(new AppError("This route isn't for password updates", 400));
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    id,
    {
      firstName,
      lastName,
      userName,
      email,
    },
    { new: true }
  );
  if (!updatedUser) {
    return next(new AppError("No user for this id", 404));
  }

  res.status(200).json({ message: "success", updatedUser });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const deletedUser = await userModel.findByIdAndUpdate(id, { active: false });

  if (!deletedUser) {
    return next(new AppError("No user for this id", 404));
  }
  res.status(204).json({ message: "user deleted" });
});
