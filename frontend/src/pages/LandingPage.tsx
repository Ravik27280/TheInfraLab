import React, { useState } from 'react';
import { 
    ArrowRight, Code, Trophy, Cpu, 
    Database, Network, Activity, Brain, CheckCircle2, 
    AlertTriangle, Moon, Sun, ArrowUpRight, Layers,
    Sparkles, Star, ChevronLeft, ChevronRight, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import * as feedbackApi from '../api/feedback.api';
import { Card } from '../components/Card';
import { useAppStore } from '../store';
import { Logo } from '../components/Logo';
import { SEO } from '../components/SEO';

interface NodeDetail {
    title: string;
    description: string;
    aiReview: {
        status: 'success' | 'warning' | 'info';
        text: string;
    };
    latency: string;
    role: string;
}

const NODE_DETAILS: Record<string, NodeDetail> = {
    client: {
        title: "User Traffic Source",
        description: "Represents global clients initiating REST / WebSocket connections.",
        aiReview: {
            status: "success",
            text: "Traffic levels stable. Multi-region routing is configured correctly via Route 53 latency policy."
        },
        latency: "5-15ms",
        role: "Origin Traffic"
    },
    gateway: {
        title: "API Gateway (Nginx/Envoy)",
        description: "Entrypoint routing, TLS termination, CORS policy, and rate-limiting.",
        aiReview: {
            status: "warning",
            text: "Single Point of Failure (SPOF) - Active-passive redundant gateways are recommended to prevent downtime."
        },
        latency: "2-5ms",
        role: "Reverse Proxy & Route"
    },
    auth: {
        title: "Auth Microservice",
        description: "Validates session tokens, handles sign-ins, and manages permissions.",
        aiReview: {
            status: "success",
            text: "Stateless microservice is horizontally autoscaled behind a target tracking policy."
        },
        latency: "10-25ms",
        role: "Authentication"
    },
    cache: {
        title: "Redis Cache Cluster",
        description: "In-memory caching layer storing user session contexts with strict TTLs.",
        aiReview: {
            status: "success",
            text: "Cache-aside pattern utilized. Redis replication factor set to 3 across distinct zones."
        },
        latency: "<1ms",
        role: "Session Caching"
    },
    database: {
        title: "PostgreSQL Database (Primary)",
        description: "Primary relational storage holding accounts and problem profiles.",
        aiReview: {
            status: "warning",
            text: "DB write operations are currently un-partitioned. Large datasets could lead to high replication lag."
        },
        latency: "15-40ms",
        role: "Relational Persistence"
    }
};

const CHALLENGES = [
    {
        id: 'url-shortener',
        title: 'URL Shortener (TinyURL)',
        desc: 'Design a high-performance URL shortening service with redirection capabilities and analytics.',
        difficulty: 'Easy',
        difficultyColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        nodes: 5,
        traffic: '50k req/sec',
    },
    {
        id: 'distributed-cache',
        title: 'Distributed Cache',
        desc: 'Design a low-latency distributed caching system like Redis with LRU eviction and replication.',
        difficulty: 'Medium',
        difficultyColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        nodes: 6,
        traffic: '5M req/sec',
    },
    {
        id: 'rate-limiter',
        title: 'Distributed Rate Limiter',
        desc: 'Implement a rate limiting middleware supporting sliding window logs across multiple region datacenters.',
        difficulty: 'Medium',
        difficultyColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        nodes: 6,
        traffic: '2M req/sec',
    },
    {
        id: 'pastebin',
        title: 'Pastebin (Text Sharing)',
        desc: 'Design a pastebin service that stores short text snippets, handles expiration, and provides rapid reads.',
        difficulty: 'Medium',
        difficultyColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        nodes: 6,
        traffic: '100k writes/day',
    }
];

const MOCK_TESTIMONIALS: feedbackApi.FeedbackItem[] = [
    {
        id: 'mock-1',
        name: 'Aman G. (Staff Architect)',
        rating: 5,
        comment: 'Infralab is an absolute game-changer. The interactive connection flows and packet animation helped me finally visualize how backpressure propagates through downstream microservices!',
        createdAt: new Date().toISOString()
    },
    {
        id: 'mock-2',
        name: 'Sarah K. (Senior Infrastructure Engineer)',
        rating: 5,
        comment: 'The Gemini AI evaluation reviews are incredibly specific. It caught that my distributed key-value store had single point of failure bottlenecks and suggested multi-primary replication!',
        createdAt: new Date().toISOString()
    },
    {
        id: 'mock-3',
        name: 'David L. (Tech Lead)',
        rating: 5,
        comment: 'Highly recommend this sandbox. Drawing architectures visually is so much faster than whiteboard grids, and the leaderboard score rankings keep you sharp for interviews.',
        createdAt: new Date().toISOString()
    }
];

export const LandingPage: React.FC = () => {
    const { user, theme, toggleTheme } = useAppStore();
    const [hoveredNode, setHoveredNode] = useState<string>('gateway');
    const [feedbacks, setFeedbacks] = useState<feedbackApi.FeedbackItem[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);

    React.useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const data = await feedbackApi.getFeaturedFeedback();
                if (data && data.length > 0) {
                    setFeedbacks(data);
                } else {
                    setFeedbacks(MOCK_TESTIMONIALS);
                }
            } catch (err) {
                console.warn('Failed to load testimonials, using defaults', err);
                setFeedbacks(MOCK_TESTIMONIALS);
            }
        };
        fetchFeedback();
    }, []);

    React.useEffect(() => {
        if (feedbacks.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % feedbacks.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [feedbacks]);

    React.useEffect(() => {
        document.title = "Infralab - Master System Design Interviews";
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.setAttribute('name', 'description');
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', 'Master your system design interview. Design scalable architectures on an interactive canvas and get evaluated in real-time by Infralab\'s AI engine.');
    }, []);

    const handlePrevSlide = () => {
        if (feedbacks.length === 0) return;
        setActiveIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
    };

    const handleNextSlide = () => {
        if (feedbacks.length === 0) return;
        setActiveIndex((prev) => (prev + 1) % feedbacks.length);
    };

    const activeDetail = NODE_DETAILS[hoveredNode] || NODE_DETAILS.gateway;

    return (
        <div className="min-h-screen bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-primary))] relative overflow-hidden transition-theme reveal-animation font-sans">
            <SEO 
                title="Master System Design Interviews" 
                description="Learn system design with interactive visual sandboxes. Build distributed architectures, caching layers, sharded databases, and get evaluated in real-time by our AI engine." 
            />
            {/* Embedded custom styling for glowing connection paths and background floating blobs */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float-slow-1 {
                    0%, 100% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.95); }
                }
                @keyframes float-slow-2 {
                    0%, 100% { transform: translate(0px, 0px) scale(1.05); }
                    50% { transform: translate(-40px, 40px) scale(0.9); }
                }
                @keyframes dash-flow {
                    to {
                        stroke-dashoffset: -40;
                    }
                }
                .animate-float-blob-1 {
                    animation: float-slow-1 18s ease-in-out infinite;
                }
                .animate-float-blob-2 {
                    animation: float-slow-2 22s ease-in-out infinite;
                    animation-delay: -5s;
                }
                .animate-dash-line {
                    stroke-dasharray: 8 8;
                    animation: dash-flow 2.5s linear infinite;
                }
                .mesh-gradient-bg {
                    filter: blur(140px);
                    opacity: 0.06;
                    transition: opacity 0.3s ease;
                }
                .dark .mesh-gradient-bg {
                    opacity: 0.18;
                }
                .animated-grid-overlay {
                    background-image: linear-gradient(to right, rgba(15, 23, 42, 0.04) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
                    background-size: 4rem 4rem;
                    animation: grid-drift 40s linear infinite;
                }
                .dark .animated-grid-overlay {
                    background-image: linear-gradient(to right, rgba(255, 255, 255, 0.012) 1px, transparent 1px),
                                      linear-gradient(to bottom, rgba(255, 255, 255, 0.012) 1px, transparent 1px);
                }
            `}} />

            {/* Drifting Grid Overlay */}
            <div className="absolute inset-0 animated-grid-overlay pointer-events-none z-0" />

            {/* Glowing Mesh blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 mesh-gradient-bg">
                <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] rounded-full bg-[#B58863] animate-float-blob-1" />
                <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#0EA5E9] animate-float-blob-2" />
                <div className="absolute bottom-[10%] left-[20%] w-[380px] h-[380px] rounded-full bg-[#6366F1] animate-float-blob-1" />
            </div>

            {/* Navbar Header */}
            <header className="sticky top-0 z-50 bg-white/75 dark:bg-[#080E10]/75 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.04] transition-theme">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Logo className="w-9 h-9 flex-shrink-0 text-[#B58863]" />
                        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
                            Infra<span className="text-[#B58863] font-black">lab</span>
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <Link to="/problems" className="hover:text-slate-900 dark:hover:text-white transition-colors">Problems</Link>
                        <Link to="/leaderboard" className="hover:text-slate-900 dark:hover:text-white transition-colors">Leaderboard</Link>
                        <Link to="/docs" className="hover:text-slate-900 dark:hover:text-white transition-colors">Docs</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={toggleTheme} 
                            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors border border-slate-200 dark:border-white/[0.04]"
                            aria-label="Toggle theme"
                        >
                            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </button>

                        {user ? (
                            <Link to="/dashboard">
                                <button className="glass-btn-primary py-2 px-4 text-xs md:text-sm flex items-center gap-1">
                                    Dashboard <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-2 transition-colors">
                                    Sign In
                                </Link>
                                <Link to="/signup">
                                    <button className="glass-btn-primary py-2 px-4 text-xs md:text-sm">
                                        Sign Up Free
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Value Prop Left Column */}
                    <div className="lg:col-span-5 text-left relative space-y-6">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B58863]/10 border border-[#B58863]/25 text-xs font-semibold text-[#B58863]">
                            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI System Design Sandbox
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                            Design systems <br />
                            <span className="shiny-text">visually.</span> <br />
                            Get instant AI review.
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                            Practice real system design challenges on an interactive canvas. Build architectures with drag-and-drop nodes, map connections, and get instant **Gemini-powered** reviews highlighting scaling bottleneck, cost, and availability flaws.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link to="/problems">
                                <button className="glass-btn-primary flex items-center gap-2 group py-3 px-6 text-sm hover:scale-[1.02] transition-all">
                                    Start Designing Free 
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link to="/pricing">
                                <button className="glass-btn-secondary hover:scale-[1.02] transition-all py-3 px-6 text-sm">
                                    Compare Premium plans
                                </button>
                            </Link>
                        </div>
                        
                        <div className="flex gap-8 pt-6 border-t border-slate-200 dark:border-white/[0.04] text-xs text-slate-500 dark:text-slate-400">
                            <div>
                                <span className="block text-lg font-bold text-slate-900 dark:text-white">40+</span>
                                Templates & Problems
                            </div>
                            <div>
                                <span className="block text-lg font-bold text-slate-900 dark:text-white">1s</span>
                                AI Feedback Loop
                            </div>
                            <div>
                                <span className="block text-lg font-bold text-slate-900 dark:text-white">100%</span>
                                Browser-based Sandbox
                            </div>
                        </div>
                    </div>

                    {/* Interactive Showcase Right Column */}
                    <div className="lg:col-span-7 space-y-4">
                        {/* Browser Window Wrapper */}
                        <div className="w-full bg-white dark:bg-[#111C20]/90 border border-slate-200 dark:border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md transition-theme">
                            
                            {/* Browser Mockup TitleBar */}
                            <div className="bg-slate-50 dark:bg-[#0D1518] px-4 py-3 flex items-center justify-between border-b border-slate-200 dark:border-white/[0.04] transition-theme">
                                <div className="flex gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-widest uppercase">
                                    Interactive Sandbox Preview
                                </div>
                                <div className="flex gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                </div>
                            </div>

                            {/* Canvas Sandbox Body */}
                            <div className="relative w-full h-[260px] bg-slate-50/50 dark:bg-[#0E171B]/95 p-4 flex items-center justify-center select-none overflow-hidden transition-theme">
                                
                                {/* SVG Grid Path Connections overlay */}
                                <svg viewBox="0 0 500 300" className="absolute inset-0 w-full h-full pointer-events-none z-0">
                                    <defs>
                                        <linearGradient id="glow-grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4" />
                                        </linearGradient>
                                        <linearGradient id="glow-grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#B58863" stopOpacity="0.8" />
                                            <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.8" />
                                        </linearGradient>
                                    </defs>
                                    
                                    {/* Client -> Gateway */}
                                    <path d="M 60 150 L 180 150" stroke={theme === 'dark' ? 'url(#glow-grad-dark)' : 'url(#glow-grad-light)'} strokeWidth="1.5" className="animate-dash-line" />
                                    
                                    {/* Gateway -> Auth */}
                                    <path d="M 180 150 L 320 90" stroke={theme === 'dark' ? 'url(#glow-grad-dark)' : 'url(#glow-grad-light)'} strokeWidth="1.5" className="animate-dash-line" />
                                    
                                    {/* Gateway -> Cache */}
                                    <path d="M 180 150 L 320 210" stroke={theme === 'dark' ? 'url(#glow-grad-dark)' : 'url(#glow-grad-light)'} strokeWidth="1.5" className="animate-dash-line" />
                                    
                                    {/* Auth -> DB */}
                                    <path d="M 320 90 L 440 90" stroke={theme === 'dark' ? 'url(#glow-grad-dark)' : 'url(#glow-grad-light)'} strokeWidth="1.5" className="animate-dash-line" />
                                    
                                    {/* Auth -> Cache */}
                                    <path d="M 320 90 L 320 210" stroke={theme === 'dark' ? 'url(#glow-grad-dark)' : 'url(#glow-grad-light)'} strokeWidth="1.5" className="animate-dash-line" />
                                </svg>

                                {/* Nodes Layout absolute elements over SVG */}
                                
                                {/* Node 1: Client */}
                                <div 
                                    style={{ left: '12%', top: '50%', transform: 'translate(-50%, -50%)' }}
                                    className={`absolute cursor-pointer p-2.5 rounded-xl border flex flex-col items-center gap-1 z-10 transition-all duration-300 w-[95px] ${
                                        hoveredNode === 'client' 
                                        ? 'bg-slate-100 dark:bg-[#253D46] border-indigo-500 dark:border-[#B58863] scale-105 shadow-[0_0_15px_rgba(79,70,229,0.15)] dark:shadow-[0_0_15px_rgba(181,136,99,0.25)]' 
                                        : 'bg-white dark:bg-[#142329]/95 border-slate-200 dark:border-white/[0.06] hover:border-slate-400'
                                    }`}
                                    onMouseEnter={() => setHoveredNode('client')}
                                >
                                    <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-white text-center">User Client</span>
                                    <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono">X: 60 | Y: 150</span>
                                </div>

                                {/* Node 2: API Gateway */}
                                <div 
                                    style={{ left: '36%', top: '50%', transform: 'translate(-50%, -50%)' }}
                                    className={`absolute cursor-pointer p-2.5 rounded-xl border flex flex-col items-center gap-1 z-10 transition-all duration-300 w-[95px] ${
                                        hoveredNode === 'gateway' 
                                        ? 'bg-slate-100 dark:bg-[#253D46] border-indigo-500 dark:border-[#B58863] scale-105 shadow-[0_0_15px_rgba(79,70,229,0.15)] dark:shadow-[0_0_15px_rgba(181,136,99,0.25)]' 
                                        : 'bg-white dark:bg-[#142329]/95 border-slate-200 dark:border-white/[0.06] hover:border-slate-400'
                                    }`}
                                    onMouseEnter={() => setHoveredNode('gateway')}
                                >
                                    <Network className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-white text-center">API Gateway</span>
                                    <span className="text-[8px] text-amber-600 dark:text-[#B58863] font-mono font-bold">1 SPOF Alert</span>
                                </div>

                                {/* Node 3: Auth Service */}
                                <div 
                                    style={{ left: '64%', top: '30%', transform: 'translate(-50%, -50%)' }}
                                    className={`absolute cursor-pointer p-2.5 rounded-xl border flex flex-col items-center gap-1 z-10 transition-all duration-300 w-[95px] ${
                                        hoveredNode === 'auth' 
                                        ? 'bg-slate-100 dark:bg-[#253D46] border-indigo-500 dark:border-[#B58863] scale-105 shadow-[0_0_15px_rgba(79,70,229,0.15)] dark:shadow-[0_0_15px_rgba(181,136,99,0.25)]' 
                                        : 'bg-white dark:bg-[#142329]/95 border-slate-200 dark:border-white/[0.06] hover:border-slate-400'
                                    }`}
                                    onMouseEnter={() => setHoveredNode('auth')}
                                >
                                    <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-white text-center">Auth Service</span>
                                    <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono">Microservice</span>
                                </div>

                                {/* Node 4: Redis Cache */}
                                <div 
                                    style={{ left: '64%', top: '70%', transform: 'translate(-50%, -50%)' }}
                                    className={`absolute cursor-pointer p-2.5 rounded-xl border flex flex-col items-center gap-1 z-10 transition-all duration-300 w-[95px] ${
                                        hoveredNode === 'cache' 
                                        ? 'bg-slate-100 dark:bg-[#253D46] border-indigo-500 dark:border-[#B58863] scale-105 shadow-[0_0_15px_rgba(79,70,229,0.15)] dark:shadow-[0_0_15px_rgba(181,136,99,0.25)]' 
                                        : 'bg-white dark:bg-[#142329]/95 border-slate-200 dark:border-white/[0.06] hover:border-slate-400'
                                    }`}
                                    onMouseEnter={() => setHoveredNode('cache')}
                                >
                                    <Layers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-white text-center">Redis Cache</span>
                                    <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono">Cluster</span>
                                </div>

                                {/* Node 5: PostgreSQL Database */}
                                <div 
                                    style={{ left: '88%', top: '30%', transform: 'translate(-50%, -50%)' }}
                                    className={`absolute cursor-pointer p-2.5 rounded-xl border flex flex-col items-center gap-1 z-10 transition-all duration-300 w-[95px] ${
                                        hoveredNode === 'database' 
                                        ? 'bg-slate-100 dark:bg-[#253D46] border-indigo-500 dark:border-[#B58863] scale-105 shadow-[0_0_15px_rgba(79,70,229,0.15)] dark:shadow-[0_0_15px_rgba(181,136,99,0.25)]' 
                                        : 'bg-white dark:bg-[#142329]/95 border-slate-200 dark:border-white/[0.06] hover:border-slate-400'
                                    }`}
                                    onMouseEnter={() => setHoveredNode('database')}
                                >
                                    <Database className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                    <span className="text-[10px] font-bold text-slate-800 dark:text-white text-center">PostgreSQL DB</span>
                                    <span className="text-[8px] text-amber-600 dark:text-[#B58863] font-mono font-bold">1 Warning</span>
                                </div>

                            </div>

                            {/* Node Details / AI Feedback Panel */}
                            <div className="bg-slate-100 dark:bg-[#0C1417] p-5 border-t border-slate-200 dark:border-white/[0.04] grid md:grid-cols-12 gap-4 items-center transition-theme">
                                <div className="md:col-span-5 md:border-r border-slate-200 dark:border-white/[0.04] pr-4 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">{activeDetail.title}</span>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200/50 border border-slate-300 dark:bg-white/5 dark:border-white/10 text-slate-600 dark:text-slate-400 font-mono">
                                            {activeDetail.latency}
                                        </span>
                                    </div>
                                    <p className="text-[10.5px] text-slate-600 dark:text-slate-400 leading-normal font-light">
                                        {activeDetail.description}
                                    </p>
                                    <div className="text-[9px] text-indigo-600 dark:text-[#B58863] font-mono font-semibold">Role: {activeDetail.role}</div>
                                </div>

                                <div className="md:col-span-7 flex gap-3 items-start bg-white dark:bg-[#111C20]/50 p-3 rounded-lg border border-slate-200 dark:border-white/[0.03]">
                                    <div className="mt-0.5 shrink-0">
                                        {activeDetail.aiReview.status === 'success' ? (
                                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 dark:text-emerald-400" />
                                        ) : (
                                            <AlertTriangle className="w-4.5 h-4.5 text-amber-500 dark:text-[#B58863]" />
                                        )}
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            <Brain className="w-3 h-3 text-indigo-500 dark:text-[#B58863]" /> Gemini AI Analysis
                                        </div>
                                        <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal font-normal">
                                            {activeDetail.aiReview.text}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Challenges Section */}
                <section className="mt-28 py-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                        <div className="space-y-1">
                            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-[#B58863]">Practice Playground</p>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Top System Design Challenges
                            </h2>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm mt-3 md:mt-0 font-light">
                            Solve complex templates asked at Tier-1 tech interviews and test your structural knowledge.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CHALLENGES.map((item) => (
                            <Link to={`/workspace/${item.id}`} key={item.id} className="block group">
                                <Card className="bg-white dark:bg-[#111C20]/60 border border-slate-200 dark:border-white/[0.04] p-5 h-full hover:bg-slate-50/50 dark:hover:bg-[#152329]/80 hover:border-indigo-400/40 dark:hover:border-[#B58863]/30 transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.difficultyColor}`}>
                                                {item.difficulty}
                                            </span>
                                            <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-md font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-[#B58863] transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-white/[0.04] mt-6 text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                        <div>
                                            Nodes: <span className="text-slate-800 dark:text-white font-bold">{item.nodes}</span>
                                        </div>
                                        <div>
                                            Traffic: <span className="text-slate-800 dark:text-white font-bold">{item.traffic}</span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Core Capabilities Section */}
                <section className="mt-28 py-20 border-y border-slate-200 dark:border-white/[0.03] bg-slate-50 dark:bg-slate-950/20 rounded-3xl px-8 relative overflow-hidden transition-theme">
                    <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-[#B58863]">Features & Engine</p>
                        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            A Full Sandbox for Scale Analysis
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-light">
                            Infralab provides a comprehensive canvas to help you visually structure architectures and inspect failure scenarios.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="space-y-4 p-4">
                            <div className="w-10 h-10 bg-indigo-600/5 dark:bg-[#B58863]/10 border border-indigo-600/10 dark:border-[#B58863]/25 rounded-xl flex items-center justify-center">
                                <Code className="w-5 h-5 text-indigo-600 dark:text-[#B58863]" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Visual Canvas Blueprinting</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                Drag, drop, and link structural elements like API gateways, sharded DBs, stream queues, and load balancers to map flows in real-time.
                            </p>
                        </div>

                        <div className="space-y-4 p-4">
                            <div className="w-10 h-10 bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/10 dark:border-sky-500/25 rounded-xl flex items-center justify-center">
                                <Brain className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">AI-Powered Evaluations</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                Get instant structural score reviews. Gemini checks for latency, availability, failover scenarios, cost efficiencies, and bottlenecks.
                            </p>
                        </div>

                        <div className="space-y-4 p-4">
                            <div className="w-10 h-10 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/25 rounded-xl flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Interactive Leaderboards</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                Submit solutions and see how you score compared to candidates in the developer community. Track progress and target weaknesses.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Community Testimonials / Feedback Slider */}
                {feedbacks.length > 0 && (
                    <section className="mt-28 relative z-10 max-w-3xl mx-auto text-center space-y-8">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B58863]/10 border border-[#B58863]/25 text-xs font-semibold text-[#B58863]">
                                <MessageSquare className="w-3.5 h-3.5" /> What Our Community Says
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                                Testimonials & Developer Feedback
                            </h3>
                        </div>

                        {/* Testimonial Slider Card */}
                        <div className="relative bg-white/45 dark:bg-[#161616]/40 p-8 rounded-2xl border border-slate-200/80 dark:border-white/[0.04] shadow-sm backdrop-blur-md overflow-hidden min-h-[180px] flex flex-col justify-between">
                            <div className="absolute top-0 left-0 w-1 bg-[#B58863] h-full" />
                            
                            {/* Stars */}
                            <div className="flex justify-center gap-1 mb-4">
                                {Array.from({ length: feedbacks[activeIndex]?.rating || 5 }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Quote Comment */}
                            <blockquote className="text-sm md:text-base font-light text-slate-700 dark:text-slate-300 italic leading-relaxed px-4">
                                "{feedbacks[activeIndex]?.comment}"
                            </blockquote>

                            {/* Author */}
                            <div className="mt-6 font-semibold text-xs md:text-sm text-[#B58863]">
                                — {feedbacks[activeIndex]?.name}
                            </div>

                            {/* Nav Buttons */}
                            {feedbacks.length > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-6">
                                    <button
                                        onClick={handlePrevSlide}
                                        className="p-1.5 rounded-full border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                        aria-label="Previous testimonial"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <div className="flex gap-1.5">
                                        {feedbacks.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setActiveIndex(idx)}
                                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                                    idx === activeIndex
                                                        ? 'bg-[#B58863] w-3'
                                                        : 'bg-slate-300 dark:bg-slate-700'
                                                }`}
                                                aria-label={`Go to slide ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleNextSlide}
                                        className="p-1.5 rounded-full border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white"
                                        aria-label="Next testimonial"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Final CTA Section */}
                <section className="mt-28 py-16 text-center space-y-6 max-w-3xl mx-auto relative z-10">
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        Build Architectures That <br />
                        <span className="shiny-text">Scale to Millions</span>
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base max-w-md mx-auto font-light leading-relaxed">
                        Join developers who use Infralab to practice system design, pass interview screens, and master backend scalability.
                    </p>
                    <div className="pt-4">
                        <Link to="/problems">
                            <button className="glass-btn-primary px-8 py-3.5 text-sm hover:scale-[1.02] transition-all">
                                Start Designing Now
                            </button>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="border-t border-slate-200 dark:border-white/[0.04] bg-slate-50 dark:bg-[#0A1012] py-8 text-center text-xs text-slate-500 relative z-10 transition-theme">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-400 font-bold">
                        <Logo className="w-5 h-5 text-[#B58863]" /> Infra<span className="text-[#B58863]">lab</span>
                    </div>
                    <div>
                        © {new Date().getFullYear()} Infralab. Built for engineers mastering systems scale.
                    </div>
                </div>
            </footer>
        </div>
    );
};
