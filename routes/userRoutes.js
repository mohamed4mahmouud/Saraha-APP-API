import { Router } from "express";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";

const router = Router();

router.post("/forgotPassword", authController.forgetPassword);
router.post("/verfiyResetCode", authController.verfiyResetCode);
router.patch("/resetPassword", authController.resetPassword);
router.post("/signup", authController.signUp);
router.post("/login", authController.signIn);

router.get("/confirmEmail/:token", authController.confirmEmail);

router.use(authController.protect);

router.get("/profile", userController.userProfile);
router.get("/messages", userController.getUserMessages);
router.patch("/changePassword", authController.changePassword);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteUser);

export default router;
