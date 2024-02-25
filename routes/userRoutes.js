import { Router } from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import validation from "../midleware/validation.js";
import { signUpSchema } from "../utils/validtors/authValidation.js";
import { UpdatePasswordSchema } from "../utils/validtors/userValidation.js";
import { uploadSinglePhoto } from "../utils/multer.js";

const router = Router();

router.post("/forgotPassword", authController.forgetPassword);
router.post("/verfiyResetCode", authController.verfiyResetCode);
router.patch("/resetPassword", authController.resetPassword);
router.post("/signup", validation(signUpSchema), authController.signUp);
router.post("/login", authController.signIn);

router.get("/confirmEmail/:token", authController.confirmEmail);

router.use(authController.protect);

router.get("/profile", userController.userProfile);
router.get("/messages", userController.getUserMessages);
router.patch(
  "/changePassword",
  validation(UpdatePasswordSchema),
  authController.changePassword
);
router.get("/profilePhoto", uploadSinglePhoto, userController.profilePhoto);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteUser);

export default router;
