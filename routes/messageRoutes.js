import { Router } from "express";
import * as messsageController from "../controllers/messageController.js";

const router = Router();

router.route("/addMessage/:recieverId").post(messsageController.addMessage);

export default router;
