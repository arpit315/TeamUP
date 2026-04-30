import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
        return () => {
            document.documentElement.removeAttribute('data-theme');
        }
    }, []);

    return (
        <div className="landing-page-container min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans selection:bg-blue-500/30 relative overflow-hidden">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
                .landing-page-container {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                .bg-glow {
                    position: absolute;
                    top: -20%;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 70vw;
                    height: 50vw;
                    background: radial-gradient(ellipse at top, rgba(37, 99, 235, 0.05) 0%, rgba(10, 10, 10, 0) 70%);
                    pointer-events: none;
                    z-index: 0;
                }
                .btn-primary {
                    background-color: #EDEDED;
                    color: #0A0A0A;
                    transition: background-color 0.2s ease, transform 0.1s ease;
                }
                .btn-primary:hover {
                    background-color: #FFFFFF;
                }
                .btn-primary:active {
                    transform: scale(0.98);
                }
                .btn-secondary {
                    background-color: transparent;
                    color: #A3A3A3;
                    border: 1px solid #262626;
                    transition: all 0.2s ease, transform 0.1s ease;
                }
                .btn-secondary:hover {
                    background-color: #171717;
                    color: #EDEDED;
                    border-color: #404040;
                }
                .btn-secondary:active {
                    transform: scale(0.98);
                }
            `}</style>
            
            <div className="bg-glow"></div>

            
            <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-gray-800 to-black flex items-center justify-center border border-white/10 shadow-sm">
                        <span className="text-white font-semibold text-sm">D</span>
                    </div>
                    <span className="text-lg font-medium text-white tracking-tight">DevConnect</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link to="/register" className="text-sm font-medium btn-primary px-4 py-2 rounded-md">
                        Get Started
                    </Link>
                </div>
            </nav>

            
            <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-32 pb-24 text-center mt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-80"></span>
                    <span className="text-xs font-medium text-gray-300 uppercase tracking-widest">Live Developer Network</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white mb-6 max-w-4xl leading-[1.1] md:leading-[1.1]">
                    The Professional Network <br className="hidden md:block" /> for Engineers
                </h1>
                
                <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl font-normal leading-relaxed">
                    Connect with elite developers, collaborate on projects, and accelerate your career in a focused environment.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <Link to="/register" className="btn-primary px-7 py-3 rounded-lg font-medium text-sm md:text-base w-full sm:w-auto flex items-center justify-center shadow-lg shadow-white/5">
                        Start Building
                    </Link>
                    <Link to="/login" className="btn-secondary px-7 py-3 rounded-lg font-medium text-sm md:text-base w-full sm:w-auto flex items-center justify-center">
                        Explore Network
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Landing;
