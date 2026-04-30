import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        return () => document.documentElement.removeAttribute('data-theme');
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/register', formData);
            const loginResp = await api.post('/users/login', { email: formData.email, password: formData.password });
            setUser(loginResp.data.data.user);
            toast.success('Account created successfully! Welcome!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-blue-500/30 flex flex-col relative overflow-hidden">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                .auth-container { font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
                .bg-glow {
                    position: absolute; top: -20%; left: 50%; transform: translateX(-50%); width: 70vw; height: 50vw;
                    background: radial-gradient(ellipse at top, rgba(37, 99, 235, 0.05) 0%, rgba(10, 10, 10, 0) 70%); pointer-events: none; z-index: 0;
                }
                .minimal-input {
                    background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.1); color: #EDEDED; transition: all 0.2s ease;
                    border-radius: 0.5rem; padding: 0.75rem 1rem; width: 100%; font-size: 0.875rem;
                }
                .minimal-input:focus {
                    background: rgba(255, 255, 255, 0.04); border-color: rgba(255, 255, 255, 0.2); outline: none;
                }
                .btn-primary {
                    background-color: #EDEDED; color: #0A0A0A; transition: background-color 0.2s ease, transform 0.1s ease;
                    border-radius: 0.5rem; padding: 0.75rem 1.5rem; font-weight: 500; font-size: 0.875rem; width: 100%;
                }
                .btn-primary:hover { background-color: #FFFFFF; }
                .btn-primary:active { transform: scale(0.98); }
            `}</style>
            
            <div className="bg-glow"></div>

            <nav className="relative z-10 px-6 py-5 md:px-12 w-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 shadow-sm">
                        <span className="text-white font-semibold text-sm">D</span>
                    </div>
                    <span className="text-lg font-medium text-white tracking-tight">DevConnect</span>
                </Link>
                <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Already have an account? Log in
                </Link>
            </nav>

            <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative z-10 w-full max-w-md mx-auto auth-container pb-20">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-semibold tracking-tight text-white mb-2">Create an account</h2>
                    <p className="text-sm text-gray-400">Join DevConnect to collaborate with engineers</p>
                </div>

                <div className="w-full bg-[#0A0A0A] border border-white/10 p-8 rounded-2xl shadow-2xl">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
                            <input
                                name="fullName" type="text" required
                                value={formData.fullName} onChange={handleChange}
                                className="minimal-input"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
                            <input
                                name="username" type="text" required
                                value={formData.username} onChange={handleChange}
                                className="minimal-input"
                                placeholder="johndoe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email address</label>
                            <input
                                name="email" type="email" required
                                value={formData.email} onChange={handleChange}
                                className="minimal-input"
                                placeholder="developer@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                            <input
                                name="password" type="password" required minLength="6"
                                value={formData.password} onChange={handleChange}
                                className="minimal-input"
                                placeholder="Minimum 6 characters"
                            />
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center">
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export default Register;
