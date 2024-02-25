import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import AppError from "./appError.js";

const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = uuidv4() + "-" + file.originalname;
    cb(null, fileName);
  },
});

const multerFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Only images allowed", 400), false);
  }
};

export const uploadSinglePhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single("image");
