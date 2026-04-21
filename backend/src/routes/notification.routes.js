import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    getNotifications, 
    markAsRead, 
    deleteNotification 
} from "../controllers/notification.controller.js";

const router = Router();

router.use(verifyJWT); 

router.route("/").get(getNotifications);
router.route("/mark-read").patch(markAsRead);
router.route("/mark-read/:notificationId").patch(markAsRead);
router.route("/:notificationId").delete(deleteNotification);

export default router;
