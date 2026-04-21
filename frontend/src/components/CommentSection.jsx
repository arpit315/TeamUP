import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { FiSend, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const CommentSection = ({ postId, authorId, onCommentAdded, onCommentDeleted }) => {
    const { user } = useAuthStore();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/posts/${postId}/comments`);
                setComments(res.data.data);
            } catch (error) {
                console.error("Failed to fetch comments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setSubmitting(true);
        try {
            const res = await api.post(`/posts/${postId}/comments`, { content: newComment });
            setComments([res.data.data, ...comments]);
            setNewComment('');
            if (onCommentAdded) onCommentAdded();
            toast.success("Comment added");
        } catch (error) {
            toast.error("Failed to add comment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await api.delete(`/posts/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
            if (onCommentDeleted) onCommentDeleted();
            toast.success("Comment deleted");
        } catch (error) {
            toast.error("Failed to delete comment");
        }
    };

    return (
        <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
            {user && (
                <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
                    <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full object-cover shadow-sm"
                    />
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full bg-slate-50 border-none rounded-xl py-2 px-4 pr-10 text-sm focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                        />
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary-dark disabled:text-slate-300 transition-colors"
                        >
                            <FiSend className={`w-4 h-4 ${submitting ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center py-4">
                        <div className="w-5 h-5 border-2 border-slate-200 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : comments.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-2">No comments yet. Be the first!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-3 group">
                            <Link to={`/profile/${comment.owner.username}`}>
                                <img
                                    src={comment.owner.avatar}
                                    alt={comment.owner.fullName}
                                    className="w-8 h-8 rounded-full object-cover shadow-sm hover:ring-2 ring-primary/20 transition-all"
                                />
                            </Link>
                            <div className="flex-1">
                                <div className="bg-slate-50 rounded-2xl px-4 py-2.5 relative">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <Link
                                            to={`/profile/${comment.owner.username}`}
                                            className="font-bold text-[13px] text-secondary hover:text-primary transition-colors"
                                        >
                                            {comment.owner.fullName}
                                        </Link>
                                        <span className="text-[10px] font-medium text-slate-400">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium">
                                        {comment.content}
                                    </p>

                                    {user?._id === comment.owner._id && (
                                        <button
                                            onClick={() => handleDelete(comment._id)}
                                            className="absolute -right-2 top-0 p-1.5 bg-white shadow-sm border border-slate-100 rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 hover:scale-110"
                                        >
                                            <FiTrash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentSection;
