import { Notification } from "../models/notification.model.js";
import { io, getReceiverSocketId } from "../socket/socket.js";

export const createNotification = async ({ recipient, sender, type, post, comment }) => {
    try {
        const notification = await Notification.create({
            recipient,
            sender,
            type,
            post,
            comment,
        });

        const populatedNotification = await Notification.findById(notification._id)
            .populate("sender", "username fullName avatar")
            .populate("post", "content");

        const receiverSocketId = getReceiverSocketId(recipient.toString());
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newNotification", populatedNotification);
        }

        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};
