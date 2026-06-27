import React, { useState } from 'react';
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Sparkles,
    ShieldAlert,
    Lightbulb,
    ChevronDown,
    Copy,
    Check,
    Award
} from 'lucide-react';
import { Panel } from '../../components/Panel';
import { useAppStore } from '../../store';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Simple Circular Progress Component
const CircularProgress = ({ score, size = 110, strokeWidth = 8, color = "text-emerald-500" }: { score: number; size?: number; strokeWidth?: number; color?: string }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    className="text-gray-200 dark:text-gray-800"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`${color} transition-all duration-1000 ease-out`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className={`text-2xl font-black ${color}`}>{score}</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Score</span>
            </div>
        </div>
    );
};

// Collapsible Section Component with Premium Styling
const FeedbackSection = ({
    title,
    count,
    icon,
    children,
    defaultOpen = false,
    colorClass
}: {
    title: string;
    count: number;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    colorClass: string;
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (count === 0) return null;

    return (
        <div className="group rounded-2xl bg-[rgb(var(--color-bg))] overflow-hidden transition-all duration-300 border border-[rgb(var(--color-border))] hover:border-[rgb(var(--color-primary))]/20">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-transparent via-transparent to-transparent hover:from-[rgb(var(--color-bg-secondary))] transition-all duration-300"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <div className={cn("p-1.5 rounded-lg shadow-inner", colorClass.replace('text-', 'bg-').replace('500', '500/10'), "group-hover:scale-105 transition-transform duration-300")}>
                        <div className={cn(colorClass, "w-4 h-4 flex items-center justify-center")}>{icon}</div>
                    </div>
                    <span className="font-bold text-sm text-[rgb(var(--color-text-primary))] tracking-tight">{title}</span>
                    <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm", colorClass.replace('text-', 'bg-').replace('500', '500/10'), colorClass)}>
                        {count}
                    </span>
                </div>
                <div className={cn("p-0.5 rounded-full bg-[rgb(var(--color-bg-secondary))] transition-all duration-300 group-hover:bg-[rgb(var(--color-border))]", isOpen ? "rotate-180" : "")}>
                    <ChevronDown className="w-3.5 h-3.5 text-[rgb(var(--color-text-secondary))]" />
                </div>
            </button>

            <div className={cn("grid transition-all duration-300 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                <div className="overflow-hidden">
                    <div className="p-4 pt-0 space-y-3">
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-[rgb(var(--color-border))] to-transparent mb-4 opacity-50" />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProgressBar = ({ label, percentage, colorClass }: { label: string; percentage: number; colorClass: string }) => (
    <div className="space-y-1">
        <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-[rgb(var(--color-text-secondary))]">{label}</span>
            <span className="text-[rgb(var(--color-text-primary))]">{percentage}%</span>
        </div>
        <div className="w-full h-1 bg-[rgb(var(--color-border))] rounded-full overflow-hidden">
            <div
                className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)}
                style={{ width: `${percentage}%` }}
            />
        </div>
    </div>
);

export const FeedbackPanel: React.FC = () => {
    const { feedback } = useAppStore();
    const [subTab, setSubTab] = useState<'overview' | 'risks' | 'recommendations'>('overview');
    const [copyStatus, setCopyStatus] = useState<string>('');

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-emerald-400';
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-rose-500';
    };

    const getGrade = (score: number) => {
        if (score >= 90) return 'A';
        if (score >= 80) return 'B';
        if (score >= 70) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 90) return 'Excellent Architecture';
        if (score >= 80) return 'Very Good Design';
        if (score >= 70) return 'Good Start';
        if (score >= 60) return 'Needs Refinement';
        return 'Requires Attention';
    };

    const copyReportToClipboard = () => {
        if (!feedback) return;

        const reqStatus = (feedback.requirementAnalysis || [])
            .map((r: any) => `- [${r.met ? 'x' : ' '}] ${r.requirement}: ${r.comment}`)
            .join('\n');

        const errorsList = (feedback.errors || []).map((e: string) => `- ❌ ${e}`).join('\n');
        const warningsList = (feedback.warnings || []).map((w: string) => `- ⚠️ ${w}`).join('\n');
        const strengthsList = (feedback.strengths || []).map((s: string) => `-  ${s}`).join('\n');
        const suggestionsList = (feedback.suggestions || []).map((s: string) => `- 💡 ${s}`).join('\n');

        const report = `### System Design Evaluation Report
**Score**: ${feedback.score}/100 | **Grade**: ${getGrade(feedback.score)}
**Summary**: ${feedback.summary || ''}

#### Requirement Analysis
${reqStatus || 'No requirements specified.'}

${errorsList ? `#### Critical Issues\n${errorsList}\n` : ''}
${warningsList ? `#### Warnings\n${warningsList}\n` : ''}
${strengthsList ? `#### Key Strengths\n${strengthsList}\n` : ''}
${suggestionsList ? `#### Optimization Tips\n${suggestionsList}\n` : ''}
${feedback.securityAnalysis ? `#### Security Analysis\n${feedback.securityAnalysis}\n` : ''}
${feedback.scalabilityAnalysis ? `#### Scalability Analysis\n${feedback.scalabilityAnalysis}\n` : ''}
`;

        navigator.clipboard.writeText(report)
            .then(() => {
                setCopyStatus('Copied!');
                setTimeout(() => setCopyStatus(''), 2000);
            })
            .catch(() => {
                alert('Failed to copy report.');
            });
    };

    const scoreColor = feedback ? getScoreColor(feedback.score) : 'text-gray-400';

    const getFunctionalityScore = () => {
        if (!feedback) return 0;
        const reqs = feedback.requirementAnalysis || [];
        if (reqs.length === 0) return 100;
        const metCount = reqs.filter((r: any) => r.met).length;
        return Math.round((metCount / reqs.length) * 100);
    };

    const getScalabilityScore = () => {
        if (!feedback) return 0;
        let base = 100;
        const errorsCount = feedback.errors?.length || 0;
        const warningsCount = feedback.warnings?.length || 0;
        const suggestionsCount = feedback.suggestions?.length || 0;
        base = base - (errorsCount * 12) - (warningsCount * 6) - (suggestionsCount * 2);
        return Math.max(Math.min(base, 100), 50);
    };

    const getResiliencyScore = () => {
        if (!feedback) return 0;
        let base = 100;
        const allText = [
            ...(feedback.errors || []),
            ...(feedback.warnings || []),
            feedback.summary || ''
        ].join(' ').toLowerCase();

        if (allText.includes('spof') || allText.includes('single point of failure')) base -= 25;
        if (allText.includes('failover') || allText.includes('replication') || allText.includes('replicas')) {
            if (allText.includes('missing') || allText.includes('no') || allText.includes('lacks')) {
                base -= 20;
            }
        }
        return Math.max(Math.min(base, 100), 40);
    };

    const getSecurityScore = () => {
        if (!feedback) return 0;
        let base = 100;
        const text = (feedback.securityAnalysis || '').toLowerCase();
        if (text.includes('vulnerability') || text.includes('unencrypted') || text.includes('compromise')) base -= 20;
        if (text.includes('missing authentication') || text.includes('no tls') || text.includes('no encryption')) base -= 25;
        return Math.max(Math.min(base, 100), 60);
    };

    return (
        <div className="h-full bg-[rgb(var(--color-surface))] flex flex-col w-full relative">
            <Panel
                title="AI Architecture Review"
                headerAction={
                    <div className="flex items-center gap-2">
                        {feedback && (
                            <button
                                onClick={copyReportToClipboard}
                                className="p-1.5 rounded-lg border border-[rgb(var(--color-border))] bg-[rgb(var(--color-card))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] flex items-center gap-1.5 text-xs font-semibold"
                                title="Copy evaluation report as Markdown"
                            >
                                {copyStatus ? (
                                    <>
                                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                                        <span className="text-emerald-500 text-[10px]">{copyStatus}</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                    </>
                                )}
                            </button>
                        )}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-[rgb(var(--color-primary))]/10 to-[rgb(var(--color-primary-hover))]/10 border border-[rgb(var(--color-primary))]/20 shadow-sm backdrop-blur-sm">
                            <Sparkles className="w-3 h-3 text-[rgb(var(--color-primary))] animate-pulse" />
                            <span className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-hover))] uppercase tracking-wider">Gemini 3.5 Flash</span>
                        </div>
                    </div>
                }
            >
                {!feedback ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[rgb(var(--color-primary))] blur-3xl opacity-20 rounded-full animate-pulse" />
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[rgb(var(--color-card))] to-[rgb(var(--color-bg))] flex items-center justify-center border border-[rgb(var(--color-border))] shadow-2xl relative z-10 backdrop-blur-xl">
                                <Sparkles className="w-8 h-8 text-[rgb(var(--color-primary))] drop-shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" />
                            </div>
                        </div>
                        <div className="space-y-2 max-w-xs mx-auto">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(var(--color-text-primary))] to-[rgb(var(--color-text-secondary))]">
                                Ready to Evaluate
                            </h3>
                            <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                Complete your system design and click <span className="font-semibold text-[rgb(var(--color-primary))]">Evaluate Design</span> to get instant, AI-powered architectural feedback.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full overflow-hidden">
                        <div className="flex border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]/30 p-1 gap-1">
                            <button
                                onClick={() => setSubTab('overview')}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all",
                                    subTab === 'overview'
                                        ? "bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-primary))] shadow-sm border border-[rgb(var(--color-border))]"
                                        : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))]/50"
                                )}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setSubTab('risks')}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5",
                                    subTab === 'risks'
                                        ? "bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-primary))] shadow-sm border border-[rgb(var(--color-border))]"
                                        : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))]/50"
                                )}
                            >
                                Risks
                                {((feedback.errors?.length || 0) + (feedback.warnings?.length || 0)) > 0 && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                )}
                            </button>
                            <button
                                onClick={() => setSubTab('recommendations')}
                                className={cn(
                                    "flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all",
                                    subTab === 'recommendations'
                                        ? "bg-[rgb(var(--color-card))] text-[rgb(var(--color-text-primary))] shadow-sm border border-[rgb(var(--color-border))]"
                                        : "text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text-primary))] hover:bg-[rgb(var(--color-bg-tertiary))]/50"
                                )}
                            >
                                Recommendations
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar pb-10">
                            {subTab === 'overview' && (
                                <>
                                    <div className="relative overflow-hidden rounded-2xl p-1 bg-gradient-to-br from-[rgb(var(--color-primary))]/10 via-[rgb(var(--color-primary))]/5 to-[rgb(var(--color-primary-hover))]/10 shadow-sm border border-[rgb(var(--color-border))]">
                                        <div className="relative bg-[rgb(var(--color-card))] rounded-[0.9rem] p-5 flex flex-col items-center gap-4 text-center">
                                            <div className="flex items-center justify-between w-full">
                                                <div className="flex items-center gap-1.5">
                                                    <Award className="w-4 h-4 text-[rgb(var(--color-primary))]" />
                                                    <span className="text-xs font-bold text-[rgb(var(--color-text-primary))]">Design Quality Audit</span>
                                                </div>
                                                <span className="px-2 py-0.5 rounded-full bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))] text-[10px] font-bold">Grade {getGrade(feedback.score)}</span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-5 w-full pt-1">
                                                <CircularProgress score={feedback.score} color={scoreColor} size={100} strokeWidth={8} />
                                                <div className="flex-1 text-left space-y-1">
                                                    <h3 className={cn("font-bold text-base", scoreColor)}>
                                                        {getScoreLabel(feedback.score)}
                                                    </h3>
                                                    <p className="text-[11px] text-[rgb(var(--color-text-secondary))] leading-relaxed font-medium">
                                                        {feedback.summary || "Architecture analysis complete."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl p-5 space-y-4">
                                        <h4 className="text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">Evaluation Breakdown</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <ProgressBar label="Functional Coverage" percentage={getFunctionalityScore()} colorClass="bg-emerald-500" />
                                            <ProgressBar label="Scalability & Latency" percentage={getScalabilityScore()} colorClass="bg-[rgb(var(--color-primary))]" />
                                            <ProgressBar label="Resiliency & Redundancy" percentage={getResiliencyScore()} colorClass="bg-cyan-500" />
                                            <ProgressBar label="Security posture" percentage={getSecurityScore()} colorClass="bg-indigo-500" />
                                        </div>
                                    </div>

                                    {feedback.requirementAnalysis && feedback.requirementAnalysis.length > 0 && (
                                        <div className="space-y-3">
                                            <h4 className="text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider">Functional Requirements Status</h4>
                                            <div className="space-y-2.5">
                                                {feedback.requirementAnalysis.map((req: any, idx: number) => (
                                                    <div key={idx} className={cn(
                                                        "p-3 rounded-xl border flex gap-3 shadow-sm transition-all duration-300",
                                                        req.met
                                                            ? "bg-emerald-500/5 border-emerald-500/10"
                                                            : "bg-rose-500/5 border-rose-500/10"
                                                    )}>
                                                        <div className={cn(
                                                            "mt-0.5 p-1 rounded-full h-fit",
                                                            req.met ? "bg-emerald-500/10" : "bg-rose-500/10"
                                                        )}>
                                                            {req.met
                                                                ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                                : <XCircle className="w-3.5 h-3.5 text-rose-500" />
                                                            }
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-bold text-xs text-[rgb(var(--color-text-primary))]">{req.requirement}</p>
                                                            <p className="text-[11px] text-[rgb(var(--color-text-secondary))] mt-0.5 leading-relaxed font-medium">
                                                                {req.comment}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {subTab === 'risks' && (
                                <div className="space-y-4">
                                    <div className="space-y-2.5">
                                        <h4 className="text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider flex items-center gap-1.5 text-rose-500">
                                            <XCircle className="w-4 h-4 text-rose-500" />
                                            Critical Issues ({feedback.errors?.length || 0})
                                        </h4>
                                        {feedback.errors && feedback.errors.length > 0 ? (
                                            feedback.errors.map((error, idx) => (
                                                <div key={idx} className="p-3.5 rounded-xl bg-gradient-to-br from-rose-500/5 to-rose-500/10 border border-rose-500/10 flex gap-3 shadow-sm hover:scale-[1.01] transition-transform duration-200">
                                                    <div className="mt-0.5 p-1 bg-rose-500/10 rounded-full h-fit">
                                                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                                                    </div>
                                                    <div className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                                        {error}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-xs font-semibold text-center">
                                                🎉 No critical architecture issues found. Awesome work!
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2.5 pt-2">
                                        <h4 className="text-xs font-bold text-[rgb(var(--color-text-primary))] uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
                                            <AlertTriangle className="w-4 h-4 text-amber-500" />
                                            Warnings ({feedback.warnings?.length || 0})
                                        </h4>
                                        {feedback.warnings && feedback.warnings.length > 0 ? (
                                            feedback.warnings.map((warning, idx) => (
                                                <div key={idx} className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/5 to-amber-500/10 border border-amber-500/10 flex gap-3 shadow-sm hover:scale-[1.01] transition-transform duration-200">
                                                    <div className="mt-0.5 p-1 bg-amber-500/10 rounded-full h-fit">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                                    </div>
                                                    <div className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                                        {warning}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-xs font-semibold text-center">
                                                👍 No warnings detected.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {subTab === 'recommendations' && (
                                <div className="space-y-4">
                                    <FeedbackSection
                                        title="Optimization Tips"
                                        count={feedback.suggestions?.length || 0}
                                        icon={<Lightbulb className="w-4 h-4" />}
                                        colorClass="text-[rgb(var(--color-primary))]"
                                        defaultOpen={true}
                                    >
                                        {feedback.suggestions?.map((suggestion, idx) => (
                                            <div key={idx} className="p-3.5 rounded-xl bg-gradient-to-br from-[rgb(var(--color-primary))]/5 to-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/10 flex gap-3 shadow-sm hover:scale-[1.01] transition-transform duration-200">
                                                <div className="mt-0.5 p-1 bg-[rgb(var(--color-primary))]/10 rounded-full h-fit">
                                                    <Lightbulb className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" />
                                                </div>
                                                <div className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                                    {suggestion}
                                                </div>
                                            </div>
                                        ))}
                                    </FeedbackSection>

                                    <FeedbackSection
                                        title="Key Strengths"
                                        count={feedback.strengths?.length || 0}
                                        icon={<CheckCircle2 className="w-4 h-4" />}
                                        colorClass="text-emerald-500"
                                        defaultOpen={false}
                                    >
                                        {feedback.strengths?.map((strength, idx) => (
                                            <div key={idx} className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 border border-emerald-500/10 flex gap-3 shadow-sm hover:scale-[1.01] transition-transform duration-200">
                                                <div className="mt-0.5 p-1 bg-emerald-500/10 rounded-full h-fit">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                </div>
                                                <div className="text-xs font-semibold text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                                    {strength}
                                                </div>
                                            </div>
                                        ))}
                                    </FeedbackSection>

                                    {feedback.securityAnalysis && (
                                        <FeedbackSection
                                            title="Security Assessment"
                                            count={1}
                                            icon={<ShieldAlert className="w-4 h-4" />}
                                            colorClass="text-indigo-500"
                                            defaultOpen={true}
                                        >
                                            <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
                                                <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed font-semibold">
                                                    {feedback.securityAnalysis}
                                                </p>
                                            </div>
                                        </FeedbackSection>
                                    )}

                                    {feedback.scalabilityAnalysis && (
                                        <FeedbackSection
                                            title="Scalability Assessment"
                                            count={1}
                                            icon={<Sparkles className="w-4 h-4" />}
                                            colorClass="text-cyan-500"
                                            defaultOpen={true}
                                        >
                                            <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                                                <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed font-semibold">
                                                    {feedback.scalabilityAnalysis}
                                                </p>
                                            </div>
                                        </FeedbackSection>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Panel>
        </div>
    );
};
