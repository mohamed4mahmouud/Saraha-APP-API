import { Router } from "express";
import * as messsageController from "../controllers/messageController.js";
import validation from "../midleware/validation.js";
import { messageSchema } from "../utils/validtors/messageValidation.js";

const router = Router();

router
  .route("/addMessage/:recieverId")
  .post(validation(messageSchema), messsageController.addMessage);

export default router;
