import { create } from "zustand";
import api from "../api/axios";
import useChatStore from "./chatStore";

const useNotificationStore = create((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,

    fetchNotifications: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get("/notifications");
            const notifications = res.data.data;
            set({
                notifications,
                unreadCount: notifications.filter((n) => !n.isRead).length,
            });
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    markAsRead: async (notificationId = null) => {
        try {
            await api.patch(`/notifications/mark-read${notificationId ? `/${notificationId}` : ""}`);

            if (notificationId) {
                set((state) => ({
                    notifications: state.notifications.map((n) =>
                        n._id === notificationId ? { ...n, isRead: true } : n
                    ),
                    unreadCount: Math.max(0, state.unreadCount - 1),
                }));
            } else {
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
                    unreadCount: 0,
                }));
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    },

    subscribeToNotifications: () => {
        const socket = useChatStore.getState().socket;
        if (!socket) return;

        socket.on("newNotification", (notification) => {
            set((state) => ({
                notifications: [notification, ...state.notifications],
                unreadCount: state.unreadCount + 1,
            }));

        });
    },

    unsubscribeFromNotifications: () => {
        const socket = useChatStore.getState().socket;
        if (!socket) return;
        socket.off("newNotification");
    },
}));

export default useNotificationStore;
