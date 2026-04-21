import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Post } from "../models/post.model.js";
import { Comment } from "../models/comment.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { createNotification } from "../utils/notification.utils.js";
const createPost = asyncHandler(async (req, res) => {
    const { content, tags } = req.body;
    if (!content?.trim()) {
        throw new ApiError(400, "Post content is required");
    }
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
        const results = await Promise.all(uploadPromises);
        imageUrls = results
            .filter(res => res && (res.secure_url || res.url))
            .map(res => res.secure_url || res.url);
        if (imageUrls.length === 0 && req.files.length > 0) {
            throw new ApiError(500, "Failed to upload images to Cloudinary");
        }
    }
    const parsedTags = Array.isArray(tags)
        ? tags
        : tags?.split(",").map((t) => t.trim()).filter(Boolean) || [];
    const post = await Post.create({
        content,
        images: imageUrls,
        author: req.user._id,
        tags: parsedTags,
    });
    const populatedPost = await Post.findById(post._id).populate(
        "author",
        "username fullName avatar"
    );
    return res
        .status(201)
        .json(new ApiResponse(201, populatedPost, "Post created successfully"));
});
const getFeed = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;   
    const limit = parseInt(req.query.limit) || 10; 
    const skip = (page - 1) * limit;              
    const posts = await Post.find()
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit)
        .populate("author", "username fullName avatar"); 
    const postsWithCommentCount = await Promise.all(posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return { ...post._doc, commentCount };
    }));
    const totalPosts = await Post.countDocuments();
    return res.status(200).json(
        new ApiResponse(200, {
            posts: postsWithCommentCount,
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
        }, "Feed fetched successfully")
    );
});
const getPostById = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("author", "username fullName avatar");
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    const commentCount = await Comment.countDocuments({ post: post._id });
    return res
        .status(200)
        .json(new ApiResponse(200, { ...post._doc, commentCount }, "Post fetched successfully"));
});
const getUserPosts = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { User } = await import("../models/user.model.js");
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const posts = await Post.find({ author: user._id })
        .sort({ createdAt: -1 })
        .populate("author", "username fullName avatar");
    const postsWithCommentCount = await Promise.all(posts.map(async (post) => {
        const commentCount = await Comment.countDocuments({ post: post._id });
        return { ...post._doc, commentCount };
    }));
    return res
        .status(200)
        .json(new ApiResponse(200, postsWithCommentCount, "User posts fetched successfully"));
});
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    if (post.author.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this post");
    }
    await Post.findByIdAndDelete(postId);
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Post deleted successfully"));
});
const toggleLike = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) {
        throw new ApiError(404, "Post not found");
    }
    const userId = req.user._id;
    const alreadyLiked = post.likes.some((id) => id.toString() === userId.toString());
    if (alreadyLiked) {
        post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
        post.likes.push(userId);
    }
    await post.save();
    if (!alreadyLiked && post.author.toString() !== userId.toString()) {
        await createNotification({
            recipient: post.author,
            sender: userId,
            type: "LIKE",
            post: postId,
        });
    }
    return res.status(200).json(
        new ApiResponse(200, {
            liked: !alreadyLiked,
            totalLikes: post.likes.length,
        }, alreadyLiked ? "Post unliked" : "Post liked")
    );
});
export {
    createPost,
    getFeed,
    getPostById,
    getUserPosts,
    deletePost,
    toggleLike,
};
