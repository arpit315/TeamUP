import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    getCurrentUser,
    getUserProfile,
    updateAccountDetails,
    updateUserAvatar,
    getAllUsers,
    toggleFollowUser,
    searchUsers,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/profile/:username").get(getUserProfile);
router.route("/all").get(verifyJWT, getAllUsers);
router.route("/search").get(verifyJWT, searchUsers);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/me").get(verifyJWT, getCurrentUser);
router.route("/update-details").patch(verifyJWT, updateAccountDetails);
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router.route("/follow/:userId").post(verifyJWT, toggleFollowUser);
export default router;
