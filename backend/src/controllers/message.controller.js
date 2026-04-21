import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import mongoose from "mongoose";
const sendMessage = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const { receiverId } = req.params;
    const senderId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
        throw new ApiError(400, "Invalid receiver ID");
    }
    if (!content || content.trim() === "") {
        throw new ApiError(400, "Message content cannot be empty");
    }
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });
    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        });
    }
    const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
    });
    if (newMessage) {
        conversation.messages.push(newMessage._id);
    }
    await conversation.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res
        .status(201)
        .json(new ApiResponse(201, newMessage, "Message sent successfully"));
});
const getMessages = asyncHandler(async (req, res) => {
    const { targetUserId } = req.params;
    const senderId = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
        throw new ApiError(400, "Invalid target user ID");
    }
    const conversation = await Conversation.findOne({
        participants: { $all: [senderId, targetUserId] },
    }).populate("messages");
    if (!conversation) {
        return res.status(200).json(new ApiResponse(200, [], "No messages yet"));
    }
    const messages = conversation.messages;
    return res
        .status(200)
        .json(new ApiResponse(200, messages, "Messages fetched successfully"));
});
export { sendMessage, getMessages };
