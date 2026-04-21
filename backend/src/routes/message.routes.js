import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT);
router.route("/send/:receiverId").post(sendMessage);
router.route("/:targetUserId").get(getMessages);
export default router;
