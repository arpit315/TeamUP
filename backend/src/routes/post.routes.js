import { Router } from "express";
import {
    createPost,
    getFeed,
    getPostById,
    getUserPosts,
    deletePost,
    toggleLike,
} from "../controllers/post.controller.js";
import {
    addComment,
    getPostComments,
    deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
router.route("/feed").get(getFeed);
router.route("/:postId").get(getPostById);
router.route("/user/:username").get(getUserPosts);
router.route("/").post(verifyJWT, upload.array("images", 4), createPost);
router.route("/:postId").delete(verifyJWT, deletePost);
router.route("/:postId/like").post(verifyJWT, toggleLike);
router.route("/:postId/comments").get(getPostComments).post(verifyJWT, addComment);
router.route("/comments/:commentId").delete(verifyJWT, deleteComment);
export default router;
