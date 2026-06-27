import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, Lock, FileText, Activity, Clock, BookOpen, LayoutGrid, List } from 'lucide-react';

import { useAppStore } from '../store';
import * as problemsApi from '../api/problems.api';
import * as designsApi from '../api/designs.api';
import type { Design } from '../types';
import { UpgradeModal } from '../components/UpgradeModal';
import { ENABLE_PRO_PLANS } from '../config';
import { SEO } from '../components/SEO';

const getProblemCategories = (title: string): string[] => {
    const lowerTitle = title.toLowerCase();
    const categories: string[] = [];
    
    // Scalability matching
    if (
        lowerTitle.includes('twitter') ||
        lowerTitle.includes('rate limiter') ||
        lowerTitle.includes('instagram') ||
        lowerTitle.includes('whatsapp') ||
        lowerTitle.includes('uber') ||
        lowerTitle.includes('youtube') ||
        lowerTitle.includes('netflix') ||
        lowerTitle.includes('web crawler') ||
        lowerTitle.includes('notification') ||
        lowerTitle.includes('autocomplete') ||
        lowerTitle.includes('spotify') ||
        lowerTitle.includes('key-value') ||
        lowerTitle.includes('google drive') ||
        lowerTitle.includes('news feed') ||
        lowerTitle.includes('chat system') ||
        lowerTitle.includes('tinder') ||
        lowerTitle.includes('skyscanner') ||
        lowerTitle.includes('goibibo') ||
        lowerTitle.includes('leetcode') ||
        lowerTitle.includes('logging') ||
        lowerTitle.includes('zoom') ||
        lowerTitle.includes('google pay') ||
        lowerTitle.includes('upi') ||
        lowerTitle.includes('nearby friends') ||
        lowerTitle.includes('google maps') ||
        lowerTitle.includes('ad click') ||
        lowerTitle.includes('leaderboard') ||
        lowerTitle.includes('stock exchange')
    ) {
        categories.push('Scalability');
    }
    
    // API Design matching
    if (
        lowerTitle.includes('tinyurl') ||
        lowerTitle.includes('url shortener') ||
        lowerTitle.includes('pastebin') ||
        lowerTitle.includes('rate limiter') ||
        lowerTitle.includes('whatsapp') ||
        lowerTitle.includes('uber') ||
        lowerTitle.includes('notification') ||
        lowerTitle.includes('ticketmaster') ||
        lowerTitle.includes('yelp') ||
        lowerTitle.includes('airbnb') ||
        lowerTitle.includes('autocomplete') ||
        lowerTitle.includes('amazon') ||
        lowerTitle.includes('news feed') ||
        lowerTitle.includes('chat system') ||
        lowerTitle.includes('tinder') ||
        lowerTitle.includes('bookmyshow') ||
        lowerTitle.includes('skyscanner') ||
        lowerTitle.includes('goibibo') ||
        lowerTitle.includes('leetcode') ||
        lowerTitle.includes('zoom') ||
        lowerTitle.includes('google pay') ||
        lowerTitle.includes('upi') ||
        lowerTitle.includes('nearby friends') ||
        lowerTitle.includes('google maps') ||
        lowerTitle.includes('stock exchange')
    ) {
        categories.push('API Design');
    }
    
    // Database matching
    if (
        lowerTitle.includes('tinyurl') ||
        lowerTitle.includes('url shortener') ||
        lowerTitle.includes('pastebin') ||
        lowerTitle.includes('instagram') ||
        lowerTitle.includes('youtube') ||
        lowerTitle.includes('netflix') ||
        lowerTitle.includes('google drive') ||
        lowerTitle.includes('web crawler') ||
        lowerTitle.includes('twitter') ||
        lowerTitle.includes('ticketmaster') ||
        lowerTitle.includes('yelp') ||
        lowerTitle.includes('airbnb') ||
        lowerTitle.includes('spotify') ||
        lowerTitle.includes('amazon') ||
        lowerTitle.includes('key-value') ||
        lowerTitle.includes('news feed') ||
        lowerTitle.includes('chat system') ||
        lowerTitle.includes('tinder') ||
        lowerTitle.includes('bookmyshow') ||
        lowerTitle.includes('skyscanner') ||
        lowerTitle.includes('goibibo') ||
        lowerTitle.includes('leetcode') ||
        lowerTitle.includes('logging') ||
        lowerTitle.includes('google pay') ||
        lowerTitle.includes('upi') ||
        lowerTitle.includes('nearby friends') ||
        lowerTitle.includes('google maps') ||
        lowerTitle.includes('ad click') ||
        lowerTitle.includes('leaderboard') ||
        lowerTitle.includes('stock exchange')
    ) {
        categories.push('Database');
    }
    
    return categories;
};

const getProblemImage = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('tinyurl') || lowerTitle.includes('url shortener')) {
        return 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('pastebin')) {
        return 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('rate limiter')) {
        return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('instagram')) {
        return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('whatsapp')) {
        return 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('uber')) {
        return 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('youtube') || lowerTitle.includes('netflix') || lowerTitle.includes('video streaming')) {
        return 'https://images.unsplash.com/photo-1574375927938-d5a98e8fed85?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('google drive') || lowerTitle.includes('file storage') || lowerTitle.includes('dropbox')) {
        return 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('web crawler')) {
        return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('notification')) {
        return 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('twitter')) {
        return 'https://images.unsplash.com/photo-1611605698335-8b15d27e03f9?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('ticketmaster') || lowerTitle.includes('bookmyshow') || lowerTitle.includes('reservation')) {
        return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('yelp') || lowerTitle.includes('nearby places') || lowerTitle.includes('proximity')) {
        return 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('airbnb')) {
        return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('autocomplete') || lowerTitle.includes('typeahead')) {
        return 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('spotify')) {
        return 'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('amazon') || lowerTitle.includes('e-commerce')) {
        return 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('key-value') || lowerTitle.includes('distributed key-value')) {
        return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('tinder')) {
        return 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('goibibo') || lowerTitle.includes('skyscanner')) {
        return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('leetcode')) {
        return 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('logging')) {
        return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('zoom')) {
        return 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('google pay') || lowerTitle.includes('upi') || lowerTitle.includes('payment') || lowerTitle.includes('wallet')) {
        return 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('nearby friends')) {
        return 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('google maps') || lowerTitle.includes('navigation')) {
        return 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('ad click') || lowerTitle.includes('aggregator')) {
        return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('leaderboard')) {
        return 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('stock exchange')) {
        return 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('chat system')) {
        return 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=500&auto=format&fit=crop&q=60';
    }
    if (lowerTitle.includes('news feed') || lowerTitle.includes('social timeline')) {
        return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=500&auto=format&fit=crop&q=60';
    }
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=60';
};

export const ProblemsPage: React.FC = () => {
    const navigate = useNavigate();
    const { problems, setProblems, setCurrentProblem, user, searchQuery } = useAppStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userDesigns, setUserDesigns] = useState<Design[]>([]);
    const [activeCategory, setActiveCategory] = useState('All Challenges');
    const [selectedCompany, setSelectedCompany] = useState('All Companies');
    const [sortBy, setSortBy] = useState('default');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');

            try {
                // Fetch problems dynamically on mount
                const problemsData = await problemsApi.getProblems();
                setProblems(problemsData);

                // Fetch user designs for progress tracking
                if (user) {
                    const designsData = await designsApi.getUserDesigns();
                    setUserDesigns(designsData);
                }

            } catch (err: any) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setProblems, user]);

    const handleStartProblem = (problem: typeof problems[0]) => {
        const isProProblem = problem.isPro;
        const isUserPro = user?.role === 'pro';

        if (isProProblem && !isUserPro) {
            if (ENABLE_PRO_PLANS) {
                navigate('/pricing');
            } else {
                setIsUpgradeModalOpen(true);
            }
            return;
        }

        setCurrentProblem(problem);
        navigate(`/workspace/${problem.id}`);
    };

    const handleStartProblemWithExample = (problem: typeof problems[0]) => {
        setCurrentProblem(problem);
        navigate(`/workspace/${problem.id}?loadExample=true`);
    };

    const getProblemStatus = (problemId: string) => {
        const design = userDesigns.find(d => d.problemId === problemId);
        if (!design) return 'new';

        // If it has feedback with a good score, consider it complete
        if (design.feedback && design.feedback.score >= 70) return 'completed';

        return 'in-progress';
    };

    const allCompanies = Array.from(
        new Set(problems.flatMap((p) => p.companies || []))
    ).sort();

    const filteredProblems = problems.filter((problem) => {
        const matchesCategory = activeCategory === 'All Challenges' || getProblemCategories(problem.title).includes(activeCategory);
        const matchesSearch = !searchQuery || 
            problem.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (problem.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (problem.companies || []).some(c => c.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (problem.concepts || []).some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCompany = selectedCompany === 'All Companies' || 
            (problem.companies || []).includes(selectedCompany);

        return matchesCategory && matchesSearch && matchesCompany;
    });

    const sortedProblems = [...filteredProblems].sort((a, b) => {
        if (sortBy === 'default') {
            // 1. Example one (URL Shortener / TinyURL) should always be on top
            const aIsExample = a.title.toLowerCase().includes('url shortener') || a.title.toLowerCase().includes('tinyurl');
            const bIsExample = b.title.toLowerCase().includes('url shortener') || b.title.toLowerCase().includes('tinyurl');
            
            if (aIsExample && !bIsExample) return -1;
            if (!aIsExample && bIsExample) return 1;
            
            // 2. Open (unlocked) problems show first, then locked ones
            const aLocked = a.isPro && user?.role !== 'pro';
            const bLocked = b.isPro && user?.role !== 'pro';
            
            if (!aLocked && bLocked) return -1;
            if (aLocked && !bLocked) return 1;
            
            // 3. Fallback: originally free problems show first, then originally pro ones
            if (a.isPro !== b.isPro) {
                return a.isPro ? 1 : -1;
            }
            
            return 0;
        } else if (sortBy === 'alphabetical') {
            return a.title.localeCompare(b.title);
        } else if (sortBy === 'difficulty') {
            const diffWeight = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
            const aW = diffWeight[a.difficulty] || 1;
            const bW = diffWeight[b.difficulty] || 1;
            return aW - bW;
        } else if (sortBy === 'companies') {
            const aCount = a.companies ? a.companies.length : 0;
            const bCount = b.companies ? b.companies.length : 0;
            return bCount - aCount; // Descending order of company counts
        }
        return 0;
    });

    return (
        <div className="p-6">
            <SEO 
                title="System Design Challenges & Sandbox Editor" 
                description="Practice real system design interview questions on an interactive canvas. Design URL shorteners, distributed caches, rate limiters, and video streaming systems." 
            />
            <div className="mb-8">
                <h2 className="text-4xl font-extrabold text-[rgb(var(--color-text-primary))] mb-3 tracking-tight">
                    System Design <span className="shiny-text font-black">Problems</span>
                </h2>
                <p className="text-[rgb(var(--color-text-secondary))] max-w-2xl text-base">
                    Master the art of designing large-scale distributed systems with interactive challenges. Build robust, high-performance architectures from scratch.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-[rgb(var(--color-border))] mb-8">
                {['All Challenges', 'Scalability', 'API Design', 'Database'].map((category) => {
                    const isActive = activeCategory === category;
                    return (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`pb-3 border-b-2 font-medium text-sm transition-all duration-200 px-1 relative ${
                                isActive
                                    ? 'border-[#B58863] text-[#B58863] font-bold'
                                    : 'border-transparent text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
                            }`}
                        >
                            {category}
                        </button>
                    );
                })}
            </div>

            {/* Controls Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-[rgb(var(--color-card))]/40 p-4 rounded-2xl border border-[rgb(var(--color-border))]/60">
                <div className="flex flex-wrap items-center gap-4">
                    {/* Company Filter Dropdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">Company</span>
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border))] rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-[#B58863] focus:ring-1 focus:ring-[#B58863] transition-all cursor-pointer shadow-sm"
                        >
                            <option value="All Companies">All Companies</option>
                            {allCompanies.map((company) => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By Dropdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">Sort By</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border))] rounded-xl px-3 py-1.5 text-sm font-medium focus:outline-none focus:border-[#B58863] focus:ring-1 focus:ring-[#B58863] transition-all cursor-pointer shadow-sm"
                        >
                            <option value="default">Recommended</option>
                            <option value="alphabetical">Alphabetical (A-Z)</option>
                            <option value="difficulty">Difficulty (Easy → Hard)</option>
                            <option value="companies">Company Count</option>
                        </select>
                    </div>
                </div>

                {/* Grid/List Toggle */}
                <div className="flex items-center bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] p-1 rounded-xl shadow-inner">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-lg transition-all ${
                            viewMode === 'grid'
                                ? 'bg-[#B58863] text-[#161616] font-bold shadow-sm'
                                : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
                        }`}
                        title="Grid View"
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-lg transition-all ${
                            viewMode === 'list'
                                ? 'bg-[#B58863] text-[#161616] font-bold shadow-sm'
                                : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))]'
                        }`}
                        title="List View"
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-[rgb(var(--color-primary))] animate-spin mb-4" />
                    <p className="text-[rgb(var(--color-text-secondary))]">Loading problems...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-app mb-4">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-red-500 font-medium">Failed to load data</p>
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                </div>
            )}

            {/* Problems Content */}
            {!loading && !error && (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                        {problems.length === 0 ? (
                            <p className="text-center text-[rgb(var(--color-text-secondary))] py-12 col-span-full">
                                No problems available. Contact your administrator.
                            </p>
                        ) : sortedProblems.length === 0 ? (
                            <p className="text-center text-[rgb(var(--color-text-secondary))] py-12 col-span-full">
                                No problems found matching filters.
                            </p>
                        ) : (
                            sortedProblems.map((problem) => {
                                const status = getProblemStatus(problem.id);
                                const isLocked = problem.isPro && user?.role !== 'pro';

                                const requirementCount = problem.functionalRequirements.length + problem.nonFunctionalRequirements.length;
                                const estimatedTime = problem.estimatedTime || "45 Mins";

                                return (
                                    <div key={problem.id} className={`bg-[rgb(var(--color-card))] rounded-2xl border border-[rgb(var(--color-border))] overflow-hidden flex flex-col group transition-all hover:-translate-y-1 shadow-sm hover:shadow-md hover:border-[#B58863]/30 ${isLocked ? 'opacity-75' : ''}`}>
                                        {/* Top Cover Image */}
                                        <div className="h-40 relative border-b border-[rgb(var(--color-border))] overflow-hidden opacity-80 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg))]">
                                            <img 
                                                src={getProblemImage(problem.title)} 
                                                alt={problem.title} 
                                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-[rgb(var(--color-card))]/80 dark:via-[rgb(var(--color-card))]/25"></div>
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                                            <span 
                                                className={`absolute top-4 left-4 uppercase text-[10px] px-2.5 py-1 rounded-md font-extrabold tracking-wider border backdrop-blur-md shadow-sm select-none ${
                                                    (problem.difficulty || '').toLowerCase() === 'easy'
                                                        ? 'bg-black/90 text-emerald-400 border-emerald-500/40'
                                                        : (problem.difficulty || '').toLowerCase() === 'medium'
                                                            ? 'bg-black/90 text-amber-400 border-amber-500/40'
                                                            : 'bg-black/90 text-rose-400 border-rose-500/40'
                                                }`}
                                            >
                                                {problem.difficulty}
                                            </span>
                                            
                                            {isLocked && (
                                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-2 py-1 rounded flex items-center gap-1 text-xs text-amber-400 border border-white/10 font-bold">
                                                    <Lock className="w-3 h-3" /> PRO
                                                </div>
                                            )}
                                            {status === 'completed' && (
                                                <div className="absolute top-4 right-4 bg-emerald-500/20 backdrop-blur px-2 py-1 rounded flex items-center gap-1 text-xs text-emerald-400 border border-emerald-500/30 font-bold">
                                                    <CheckCircle2 className="w-3 h-3" /> DONE
                                                </div>
                                            )}
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] mb-2 leading-tight group-hover:text-[#B58863] transition-colors line-clamp-2">
                                                {problem.title}
                                            </h3>

                                            {/* Company Badges */}
                                            {problem.companies && problem.companies.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-4">
                                                    {problem.companies.slice(0, 3).map((c) => (
                                                        <span 
                                                            key={c}
                                                            className="text-[9px] px-1.5 py-0.5 rounded bg-[rgb(var(--color-bg-secondary))]/60 text-[rgb(var(--color-text-secondary))] border border-[rgb(var(--color-border))]/50 font-semibold"
                                                        >
                                                            {c}
                                                        </span>
                                                    ))}
                                                    {problem.companies.length > 3 && (
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[rgb(var(--color-bg-secondary))]/60 text-[rgb(var(--color-text-tertiary))] border border-[rgb(var(--color-border))]/50 font-medium">
                                                            +{problem.companies.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            
                                            <div className="space-y-3 mb-6 flex-1 text-[rgb(var(--color-text-secondary))]">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <FileText className="w-4 h-4 text-gray-500" />
                                                    <span>{requirementCount} Requirements</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <Activity className="w-4 h-4 text-gray-500" />
                                                    <span>{problem.scale ? "System Scale Design" : "Architecture Design"}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <Clock className="w-4 h-4 text-gray-500" />
                                                    <span>{estimatedTime}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex flex-col gap-2 mt-auto">
                                                <button
                                                    onClick={() => handleStartProblem(problem)}
                                                    className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                                        isLocked 
                                                        ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                                                        : 'bg-[#B58863] text-[#161616] hover:bg-[#c49874]'
                                                    }`}
                                                >
                                                    {isLocked ? (
                                                        <>Unlock <Lock className="w-4 h-4" /></>
                                                    ) : (
                                                        <>{status === 'new' ? 'Start Challenge' : 'Continue'} <ArrowRight className="w-4 h-4" /></>
                                                    )}
                                                </button>
                                                
                                                {(problem.title.toLowerCase().includes('url shortener') ||
                                                  problem.title.toLowerCase().includes('tinyurl')) && (
                                                    <button
                                                        onClick={() => handleStartProblemWithExample(problem)}
                                                        className="w-full py-2.5 rounded-xl font-bold text-sm border border-[#B58863]/30 text-[#B58863] hover:bg-[#B58863]/10 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <BookOpen className="w-4 h-4" /> View Example Solution
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {problems.length === 0 ? (
                            <p className="text-center text-[rgb(var(--color-text-secondary))] py-12">
                                No problems available. Contact your administrator.
                            </p>
                        ) : sortedProblems.length === 0 ? (
                            <p className="text-center text-[rgb(var(--color-text-secondary))] py-12">
                                No problems found matching filters.
                            </p>
                        ) : (
                            sortedProblems.map((problem) => {
                                const status = getProblemStatus(problem.id);
                                const isLocked = problem.isPro && user?.role !== 'pro';
                                const requirementCount = problem.functionalRequirements.length + problem.nonFunctionalRequirements.length;
                                const estimatedTime = problem.estimatedTime || "45 Mins";

                                return (
                                    <div 
                                        key={problem.id} 
                                        className={`bg-[rgb(var(--color-card))] rounded-2xl border border-[rgb(var(--color-border))] p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-[#B58863]/30 hover:shadow-sm ${
                                            isLocked ? 'opacity-75' : ''
                                        }`}
                                    >
                                        {/* Left side: Problem Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-[rgb(var(--color-text-primary))] leading-tight hover:text-[#B58863] transition-colors truncate">
                                                    {problem.title}
                                                </h3>
                                                <span 
                                                    className={`uppercase text-[9px] px-2 py-0.5 rounded font-extrabold tracking-wider border select-none ${
                                                        (problem.difficulty || '').toLowerCase() === 'easy'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : (problem.difficulty || '').toLowerCase() === 'medium'
                                                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    }`}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                                {isLocked && (
                                                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                                        <Lock className="w-3 h-3" /> PRO
                                                    </span>
                                                )}
                                                {status === 'completed' && (
                                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" /> DONE
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-4 line-clamp-2">
                                                {problem.description}
                                            </p>

                                            {/* Meta info & badges */}
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[rgb(var(--color-text-secondary))]">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-gray-500" />
                                                    <span>{requirementCount} Requirements</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Activity className="w-4 h-4 text-gray-500" />
                                                    <span>{estimatedTime}</span>
                                                </div>
                                                {problem.companies && problem.companies.length > 0 && (
                                                    <div className="flex flex-wrap items-center gap-1.5 md:border-l border-[rgb(var(--color-border))] md:pl-4">
                                                        <span className="text-[10px] font-bold uppercase text-[rgb(var(--color-text-secondary))]/80">Asked in</span>
                                                        {problem.companies.map((c) => (
                                                            <span 
                                                                key={c} 
                                                                className="text-[9px] px-1.5 py-0.5 rounded bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] border border-[rgb(var(--color-border))]"
                                                            >
                                                                {c}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right side: Action Buttons */}
                                        <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-48 justify-end">
                                            <button
                                                onClick={() => handleStartProblem(problem)}
                                                className={`w-full py-2 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                                                    isLocked 
                                                    ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' 
                                                    : 'bg-[#B58863] text-[#161616] hover:bg-[#c49874]'
                                                }`}
                                            >
                                                {isLocked ? (
                                                    <>Unlock <Lock className="w-4 h-4" /></>
                                                ) : (
                                                    <>{status === 'new' ? 'Start Challenge' : 'Continue'} <ArrowRight className="w-4 h-4" /></>
                                                )}
                                            </button>
                                            
                                            {(problem.title.toLowerCase().includes('url shortener') ||
                                              problem.title.toLowerCase().includes('tinyurl')) && (
                                                <button
                                                    onClick={() => handleStartProblemWithExample(problem)}
                                                    className="w-full py-2 rounded-xl font-bold text-sm border border-[#B58863]/30 text-[#B58863] hover:bg-[#B58863]/10 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <BookOpen className="w-4 h-4" /> Example
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )
            )}
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
        </div>
    );
};

