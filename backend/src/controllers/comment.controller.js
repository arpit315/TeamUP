import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { createNotification } from "../utils/notification.utils.js";

const addComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    const comment = await Comment.create({
        content,
        post: postId,
        owner: req.user._id,
    });

    const populatedComment = await Comment.findById(comment._id).populate(
        "owner",
        "username fullName avatar"
    );

    if (post.author.toString() !== req.user._id.toString()) {
        await createNotification({
            recipient: post.author,
            sender: req.user._id,
            type: "COMMENT",
            post: postId,
            comment: comment._id,
        });
    }

    return res
        .status(201)
        .json(new ApiResponse(201, populatedComment, "Comment added successfully"));
});

const getPostComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("owner", "username fullName avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { addComment, getPostComments, deleteComment };
