import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const [usersRes, projectsRes] = await Promise.all([
                    axiosInstance.get(`/users/search?q=${encodeURIComponent(query)}`),
                    axiosInstance.get(`/projects/search?q=${encodeURIComponent(query)}`)
                ]);
                setUsers(usersRes.data.data || []);
                setProjects(projectsRes.data.data || []);
            } catch (error) {
                console.error("Search error:", error);
                toast.error("Failed to fetch search results");
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (!query) {
        return (
            <div className="w-full flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-[#030712] min-h-[calc(100vh-72px)]">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Search DevConnect</h2>
                <p className="text-slate-500 dark:text-slate-400">Type a query in the navbar search field to find users and projects.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-8 min-h-[calc(100vh-72px)] block">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Search Results for "{query}"
            </h1>
            
            <div className="flex border-b border-slate-200 dark:border-white/10 mb-8 w-full block">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`py-3 px-6 text-sm font-medium transition-colors ${activeTab === 'users' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                >
                    Users ({users.length})
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    className={`py-3 px-6 text-sm font-medium transition-colors ${activeTab === 'projects' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'}`}
                >
                    Projects ({projects.length})
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12 w-full block">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="w-full block">
                    {activeTab === 'users' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full block">
                            {users.length > 0 ? (
                                users.map(user => (
                                    <Link key={user._id} to={`/profile/${user.username}`} className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md hover:border-primary/30 transition-all flex items-center gap-4 group block">
                                        <img src={user.avatar} alt={user.fullName} className="w-16 h-16 rounded-full object-cover shadow-sm bg-slate-100 border border-slate-200 dark:border-white/10" />
                                        <div className="flex-1 min-w-0 block">
                                            <h3 className="font-semibold text-slate-900 dark:text-white text-lg truncate group-hover:text-primary transition-colors">{user.fullName}</h3>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm truncate">@{user.username}</p>
                                            {user.techStack && user.techStack.length > 0 && (
                                                <div className="mt-2 flex flex-wrap gap-1 block">
                                                    {user.techStack.slice(0, 3).map((tech, i) => (
                                                        <span key={i} className="px-2 py-0.5 text-xs bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-md truncate max-w-full inline-block">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {user.techStack.length > 3 && <span className="text-xs text-slate-400 inline-block font-medium">+{user.techStack.length - 3}</span>}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 col-span-full py-8 text-center bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 w-full block">No users found matching "{query}"</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full block">
                            {projects.length > 0 ? (
                                projects.map(project => (
                                    <div key={project._id} className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/10 hover:shadow-md hover:border-primary/30 transition-all group w-full block">
                                        <div className="flex items-start justify-between mb-4 w-full block">
                                            <div className="flex items-center gap-3 w-full block">
                                                <Link to={`/profile/${project.author?.username}`} className="block">
                                                    <img src={project.author?.avatar} alt={project.author?.fullName} className="w-10 h-10 rounded-full object-cover shadow-sm hover:ring-2 hover:ring-primary/50 transition-all border border-slate-200 dark:border-white/10" />
                                                </Link>
                                                <div className="block">
                                                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{project.title}</h3>
                                                    <Link to={`/profile/${project.author?.username}`} className="text-xs text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">By {project.author?.fullName}</Link>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4 bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5 w-full block">{project.description}</p>
                                        <div className="flex flex-wrap gap-3 mt-auto w-full block">
                                            {project.githubUrl && (
                                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-primary transition-colors px-4 py-2 bg-slate-100 dark:bg-white/10 rounded-lg flex-1 text-center inline-block">GitHub</a>
                                            )}
                                            {project.liveUrl && (
                                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white hover:text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20 px-4 py-2 rounded-lg flex-1 text-center inline-block">Live Demo</a>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 col-span-full py-8 text-center bg-white dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10 w-full block">No projects found matching "{query}"</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
