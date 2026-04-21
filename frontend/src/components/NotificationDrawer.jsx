import React from 'react';
import useNotificationStore from '../store/notificationStore';
import { FiX, FiHeart, FiMessageSquare, FiUserPlus, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NotificationDrawer = ({ isOpen, onClose }) => {
    const { notifications, markAsRead, unreadCount } = useNotificationStore();

    if (!isOpen) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'LIKE': return <FiHeart className="text-red-400 fill-current" />;
            case 'COMMENT': return <FiMessageSquare className="text-blue-400 fill-current" />;
            case 'FOLLOW': return <FiUserPlus className="text-green-400" />;
            default: return null;
        }
    };

    const getMessage = (type) => {
        switch (type) {
            case 'LIKE': return 'liked your post';
            case 'COMMENT': return 'commented on your post';
            case 'FOLLOW': return 'started following you';
            default: return '';
        }
    };

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] animate-fade-in"
                onClick={onClose}
            ></div>
            <div className={`fixed right-0 top-0 h-screen w-full max-w-[400px] bg-white shadow-2xl z-[70] flex flex-col transition-transform duration-300 animate-slide-in-right`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-secondary">Notifications</h2>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">You have {unreadCount} unread items</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button 
                                onClick={() => markAsRead()}
                                className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-all flex items-center gap-2 group"
                                title="Mark all as read"
                            >
                                <FiCheckCircle className="w-5 h-5" />
                                <span className="text-xs font-bold hidden group-hover:inline">Mark all read</span>
                            </button>
                        )}
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
                        >
                            <FiX className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                                <FiMessageSquare className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="font-bold text-secondary">No notifications yet</h3>
                            <p className="text-sm text-slate-400 max-w-[200px] mt-1 font-medium">When people interact with you, you'll see it here.</p>
                        </div>
                    ) : (
                        notifications.map((notification) => (
                            <div 
                                key={notification._id}
                                className={`p-4 rounded-2xl border transition-all hover:bg-slate-50 group relative ${notification.isRead ? 'bg-white border-slate-100' : 'bg-primary/[0.02] border-primary/10 shadow-sm'}`}
                            >
                                <div className="flex gap-4">
                                    <Link to={`/profile/${notification.sender.username}`} onClick={onClose}>
                                        <img 
                                            src={notification.sender.avatar} 
                                            alt={notification.sender.fullName} 
                                            className="w-10 h-10 rounded-full object-cover border border-slate-100 shadow-sm"
                                        />
                                    </Link>
                                    <div className="flex-1">
                                        <p className="text-[14px] leading-snug">
                                            <Link to={`/profile/${notification.sender.username}`} onClick={onClose} className="font-bold text-secondary hover:text-primary transition-colors">
                                                {notification.sender.fullName}
                                            </Link>{' '}
                                            <span className="text-slate-500 font-medium">{getMessage(notification.type)}</span>
                                        </p>

                                        {notification.post && (
                                            <p className="text-[12px] text-slate-400 mt-1 line-clamp-1 italic font-medium">
                                                "{notification.post.content}"
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="p-1 rounded bg-slate-100">
                                                {getIcon(notification.type)}
                                            </div>
                                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                                {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    {!notification.isRead && (
                                        <button 
                                            onClick={() => markAsRead(notification._id)}
                                            className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0"
                                            title="Mark as read"
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationDrawer;
