import React from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { WorkspaceLayout } from '../features/workspace/WorkspaceLayout';
import { RequirementsPanel } from '../features/workspace/RequirementsPanel';
import { ArchitectureCanvas } from '../features/workspace/ArchitectureCanvas';
import { WorkspaceRightPanel } from '../features/workspace/WorkspaceRightPanel';
import { useAppStore, getCanvasHash } from '../store';
import * as designsApi from '../api/designs.api';
import { getExampleSolution } from '../features/workspace/exampleSolutions';
import { getProblems } from '../api/problems.api';
import { Lock, ArrowLeft, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { UpgradeModal } from '../components/UpgradeModal';
import { Button } from '../components/Button';

export const WorkspacePage: React.FC = () => {
    const { problemId } = useParams<{ problemId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const designId = searchParams.get('designId');
    const { currentProblem, problems, setNodes, setEdges, user } = useAppStore();
    const [isLoadingDesign, setIsLoadingDesign] = React.useState(true);
    const [isProLocked, setIsProLocked] = React.useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = React.useState(false);

    // 1. Load problems list if not already loaded (e.g. on manual page refresh)
    React.useEffect(() => {
        const fetchProblems = async () => {
            if (problems.length === 0) {
                try {
                    const problemsData = await getProblems();
                    useAppStore.getState().setProblems(problemsData);
                } catch (error) {
                    console.error('Failed to load problems list:', error);
                }
            }
        };
        fetchProblems();
    }, [problems]);

    // 2. Resolve problem ID (handling friendly slugs from the homepage)
    // and restrict direct access to pro problems for free users.
    React.useEffect(() => {
        if (!problemId || problems.length === 0) return;

        const SLUG_MAP: Record<string, string> = {
            'url-shortener': 'Design a URL Shortener (TinyURL / Bit.ly)',
            'rate-limiter': 'Design a Rate Limiter',
            'youtube': 'Design YouTube / Video Streaming Platform',
            'cdn': 'Design a Content Delivery Network (CDN)',
            'pastebin': 'Design Pastebin',
            'notification': 'Design a Notification System',
            'crawler': 'Design a Web Crawler',
            'kv-store': 'Design a Key-Value Store',
            'autocomplete': 'Design a Search Autocomplete / Typeahead System',
            'uber': 'Design Uber / Lyft (Ride-sharing)',
            'tiktok': 'Design TikTok / Short-form Video Platform',
            'maps': 'Design Google Maps / Navigation',
            'payment': 'Design a Payment System / Wallet (PhonePe / PayPal / Stripe)',
            'spotify': 'Design Spotify / Music Streaming',
            'distributed-cache': 'Design a Distributed Cache',
        };

        // Try to find the problem by matching ObjectID or slug mapping
        let targetProblem = problems.find((p) => p.id === problemId);
        
        if (!targetProblem) {
            const mappedTitle = SLUG_MAP[problemId.toLowerCase()];
            if (mappedTitle) {
                targetProblem = problems.find(
                    (p) => p.title.toLowerCase() === mappedTitle.toLowerCase()
                );
            }
        }

        if (targetProblem) {
            // Check pro restriction
            const isUserPro = user?.role === 'pro';
            if (targetProblem.isPro && !isUserPro) {
                setIsProLocked(true);
                useAppStore.getState().setCurrentProblem(targetProblem);
                return;
            }

            setIsProLocked(false);

            // If we resolved a friendly slug to an ObjectID, redirect to the official ObjectID route
            if (problemId !== targetProblem.id) {
                const search = window.location.search;
                navigate(`/workspace/${targetProblem.id}${search}`, { replace: true });
                return;
            }

            // Set as current problem
            useAppStore.getState().setCurrentProblem(targetProblem);
        } else {
            console.warn(`Problem not found for ID or slug: ${problemId}`);
        }
    }, [problemId, problems, user, navigate]);

    // Load existing design for this problem (if any)
    React.useEffect(() => {
        const loadDesign = async () => {
            if (!problemId) return;

            try {
                // Clear any previous feedback/state immediately
                useAppStore.getState().setFeedback(null);
                setNodes([]);
                setEdges([]);
                useAppStore.getState().setCurrentDesign(null, null);

                setIsLoadingDesign(true);

                // Check if we need to load the example reference solution
                const loadExampleParam = searchParams.get('loadExample');
                if (loadExampleParam === 'true') {
                    const targetProblem = problems.find((p) => p.id === problemId) || currentProblem;
                    if (targetProblem) {
                        useAppStore.getState().setCurrentProblem(targetProblem);
                        const solution = getExampleSolution(targetProblem.title);
                        if (solution) {
                            setNodes(solution.nodes);
                            setEdges(solution.edges);
                            useAppStore.getState().setFeedback(solution.feedback);
                            useAppStore.getState().setCurrentDesign(null, null);
                            useAppStore.getState().setLastSavedHash(null);
                            console.log('✅ Loaded example reference design:', targetProblem.title);
                            
                            // Remove loadExample from search parameters to prevent reloading on manual refresh
                            const newParams = new URLSearchParams(window.location.search);
                            newParams.delete('loadExample');
                            const newSearch = newParams.toString();
                            navigate(
                                `${window.location.pathname}${newSearch ? '?' + newSearch : ''}`,
                                { replace: true }
                            );
                            
                            setIsLoadingDesign(false);
                            return;
                        }
                    }
                }

                let existingDesign = null;
                const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(problemId);

                if (designId) {
                    existingDesign = await designsApi.getDesign(designId);
                } else if (isValidObjectId) {
                    existingDesign = await designsApi.getDesignByProblemId(problemId);
                }

                if (existingDesign) {
                    // Ensure the problem is actually set to this design's problem
                    if (existingDesign.problemId !== problemId) {
                        const problem = problems.find((p) => p.id === existingDesign.problemId);
                        if (problem) {
                            useAppStore.getState().setCurrentProblem(problem);
                        }
                    }

                    // Load existing design into canvas
                    setNodes(existingDesign.nodes);
                    setEdges(existingDesign.edges);
                    useAppStore.getState().setCurrentDesign(existingDesign.id, existingDesign.name || null);
                    useAppStore.getState().setLastSavedHash(getCanvasHash(existingDesign.nodes, existingDesign.edges));
                    console.log('✅ Loaded existing design:', existingDesign);

                    // Load feedback if available
                    if (existingDesign.feedback) {
                        useAppStore.getState().setFeedback(existingDesign.feedback);
                    }
                } else {
                    // No existing design - start with empty canvas
                    useAppStore.getState().setLastSavedHash(null);
                    console.log('ℹ️ No existing design found, starting fresh');
                }
            } catch (error) {
                console.error('❌ Error loading design:', error);
                // Start with empty canvas on error
                setNodes([]);
                setEdges([]);
                useAppStore.getState().setFeedback(null);
                useAppStore.getState().setCurrentDesign(null, null);
            } finally {
                setIsLoadingDesign(false);
            }
        };

        loadDesign();
    }, [problemId, setNodes, setEdges]);

    if (isProLocked && currentProblem) {
        return (
            <div className="min-h-screen w-full bg-[#0D1518] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background glowing effects */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#B58863]/10 blur-[120px] pointer-events-none" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

                <div className="w-full max-w-2xl bg-[#161616]/80 border border-white/[0.04] backdrop-blur-xl rounded-2xl p-8 md:p-10 shadow-2xl relative">
                    <div className="absolute top-4 left-4">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate('/problems')}
                            className="text-slate-400 hover:text-white"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Challenges
                        </Button>
                    </div>

                    <div className="flex flex-col items-center text-center mt-8 space-y-6">
                        {/* Lock Circle Graphic */}
                        <div className="w-16 h-16 bg-[#B58863]/10 border border-[#B58863]/20 rounded-full flex items-center justify-center text-[#B58863] animate-pulse">
                            <Lock className="w-8 h-8" />
                        </div>

                        {/* Title and Badge */}
                        <div className="space-y-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#B58863]/20 border border-[#B58863]/30 text-[#B58863]">
                                <Sparkles className="w-3.5 h-3.5" /> PRO CHALLENGE
                            </span>
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-3">
                                {currentProblem.title}
                            </h2>
                        </div>

                        {/* Description */}
                        <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed">
                            {currentProblem.description}
                        </p>

                        {/* Metadata Grid */}
                        <div className="w-full grid md:grid-cols-2 gap-4 mt-4 text-left">
                            {currentProblem.companies && currentProblem.companies.length > 0 && (
                                <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Building2 className="w-3.5 h-3.5 text-[#B58863]" /> Asked at Companies
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {currentProblem.companies.map((company) => (
                                            <span key={company} className="px-2 py-0.5 bg-white/[0.05] rounded-md text-xs font-medium text-slate-300">
                                                {company}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {currentProblem.concepts && currentProblem.concepts.length > 0 && (
                                <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B58863]" /> Key Concepts Tested
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {currentProblem.concepts.slice(0, 4).map((concept) => (
                                            <span key={concept} className="px-2 py-0.5 bg-white/[0.05] rounded-md text-xs font-medium text-slate-300">
                                                {concept}
                                            </span>
                                        ))}
                                        {currentProblem.concepts.length > 4 && (
                                            <span className="px-2 py-0.5 rounded-md text-xs font-medium text-slate-500">
                                                +{currentProblem.concepts.length - 4} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4">
                            <button
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#B58863] to-[#CBA37E] text-[#111C20] font-bold shadow-lg shadow-[#B58863]/20 hover:opacity-95 active:scale-[0.98] transition-all text-sm"
                            >
                                Unlock with Infralab Pro
                            </button>
                            <button
                                onClick={() => navigate('/problems')}
                                className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white font-semibold active:scale-[0.98] transition-all text-sm"
                            >
                                Explore Free Challenges
                            </button>
                        </div>
                    </div>
                </div>

                <UpgradeModal 
                    isOpen={isUpgradeModalOpen} 
                    onClose={() => setIsUpgradeModalOpen(false)} 
                />
            </div>
        );
    }

    if (!currentProblem) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-[rgb(var(--color-text-secondary))]">Loading problem...</p>
            </div>
        );
    }

    if (isLoadingDesign) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-[rgb(var(--color-text-secondary))]">Loading workspace...</p>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[rgb(var(--color-bg))] transition-theme">
            <WorkspaceLayout
                left={<RequirementsPanel problem={currentProblem} />}
                center={<ArchitectureCanvas />}
                right={<WorkspaceRightPanel />}
            />
        </div>
    );
};
