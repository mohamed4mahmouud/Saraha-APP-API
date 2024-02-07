import { Router } from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.post("/forgotPassword", authController.forgetPassword);
router.post("/verfiyResetCode", authController.verfiyResetCode);
router.patch("/resetPassword", authController.resetPassword);
router.post("/signup", authController.signUp);
router.post("/login", authController.signIn);

router.route("/confirmEmail/:token").get(authController.confirmEmail);

router
  .route("/profile")
  .get(authController.protect, userController.userProfile);

router
  .route("/messages")
  .get(authController.protect, userController.getUserMessages);

router
  .route("/changePassword")
  .patch(authController.protect, authController.changePassword);

router
  .route("/updateMe")
  .patch(authController.protect, userController.updateMe);

router
  .route("/deleteMe")
  .delete(authController.protect, userController.deleteUser);

export default router;
