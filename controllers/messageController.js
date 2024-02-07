import asyncHandler from "express-async-handler";
import { messageModel } from "../DB/models/messageModel.js";
import { userModel } from "../DB/models/userModel.js";
import AppError from "../utils/appError.js";

export const addMessage = asyncHandler(async (req, res, next) => {
  const { recieverId } = req.params;
  const { text } = req.body;
  const foundedUser = await userModel.findById(recieverId);

  if (!foundedUser) {
    return next(new AppError("Invalid id", 404));
  }
  const newMessage = await messageModel.create({ recieverId, text });
  res.json({ message: "message added", newMessage });
});
