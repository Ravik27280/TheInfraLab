import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, Zap, Brain, Play, Check, Award } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppStore } from '../store';

export const PracticeModePage: React.FC = () => {
    const navigate = useNavigate();
    const { problems } = useAppStore();
    const [selectedDuration, setSelectedDuration] = useState(45); // minutes
    const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>('Easy');

    const handleStartSession = () => {
        // Find a random problem matching difficulty, or any if not selected
        let eligibleProblems = problems;
        if (selectedDifficulty) {
            eligibleProblems = problems.filter(p => p.difficulty === selectedDifficulty);
        }

        // Fallback to any problem if none matches (safeguard)
        if (eligibleProblems.length === 0) {
            eligibleProblems = problems;
        }

        if (eligibleProblems.length === 0) {
            alert("No practice problems are currently available. Please load problems on the challenges page.");
            return;
        }

        const randomProblem = eligibleProblems[Math.floor(Math.random() * eligibleProblems.length)];

        // Navigate to workspace with practice mode params
        navigate(`/workspace/${randomProblem.id}?mode=practice&duration=${selectedDuration}`);
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Header Banner */}
            <div className="text-center relative py-8 px-6 rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent border border-[rgb(var(--color-border))] overflow-hidden">
                <div className="absolute inset-0 bg-violet-500 blur-3xl opacity-5 rounded-full -top-12" />
                <div className="inline-flex items-center justify-center p-4 bg-violet-500/10 rounded-2xl mb-4 relative z-10">
                    <Zap className="w-8 h-8 text-violet-500" />
                </div>
                <h2 className="text-3xl font-extrabold text-[rgb(var(--color-text-primary))] mb-3 relative z-10 tracking-tight">
                    System Design Practice Mode
                </h2>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] max-w-lg mx-auto leading-relaxed relative z-10">
                    Simulate real-world tech interview conditions. Select a time limit, set your target difficulty, and sketch your architecture under pressure.
                </p>
            </div>

            {/* Selection Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Duration Selection */}
                <Card className="hover:border-violet-500/20 transition-all duration-300 hover:shadow-lg p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-[#B58863]/10 rounded-xl">
                                <Timer className="w-5 h-5 text-[#B58863]" />
                            </div>
                            <h3 className="font-bold text-base text-[rgb(var(--color-text-primary))]">Session Duration</h3>
                        </div>
                        <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-6 leading-relaxed">
                            Choose how long you have to draft requirements and layout components.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {[30, 45, 60].map(mins => (
                            <button
                                key={mins}
                                onClick={() => setSelectedDuration(mins)}
                                className={`py-3 px-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${selectedDuration === mins
                                    ? 'bg-[#B58863]/10 border-[#B58863] text-[#B58863] shadow-sm'
                                    : 'bg-[rgb(var(--color-bg-secondary))] border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:border-violet-500/30'
                                    }`}
                            >
                                <span className="text-sm">{mins}</span>
                                <span>Mins</span>
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Difficulty Selection */}
                <Card className="hover:border-violet-500/20 transition-all duration-300 hover:shadow-lg p-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-5">
                            <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                                <Brain className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h3 className="font-bold text-base text-[rgb(var(--color-text-primary))]">Difficulty Level</h3>
                        </div>
                        <p className="text-xs text-[rgb(var(--color-text-secondary))] mb-6 leading-relaxed">
                            Pick your target problem level. Select one or deselect for any difficulty.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {['Easy', 'Medium', 'Hard'].map(diff => (
                            <button
                                key={diff}
                                onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
                                className={`py-3.5 px-2 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${selectedDifficulty === diff
                                    ? diff === 'Easy' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                                        : diff === 'Medium' ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                                            : 'bg-rose-500/10 border-rose-500 text-rose-500'
                                    : 'bg-[rgb(var(--color-bg-secondary))] border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:border-violet-500/30'
                                    }`}
                            >
                                {selectedDifficulty === diff && <Check className="w-3.5 h-3.5 shrink-0" />}
                                {diff}
                            </button>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Start Button */}
            <div className="flex justify-center pt-2">
                <Button
                    size="lg"
                    onClick={handleStartSession}
                    className="w-full md:w-auto min-w-[240px] h-14 text-base bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-0"
                >
                    <Play className="w-4 h-4 fill-current" />
                    Start Practice Session
                </Button>
            </div>

            {/* Why Practice Section */}
            <div className="mt-8 border-t border-[rgb(var(--color-border))] pt-10">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--color-text-secondary))] mb-6 text-center sm:text-left flex items-center gap-2">
                    <Award className="w-4 h-4 text-violet-500" />
                    Why Practice Mode?
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-[rgb(var(--color-bg-secondary))]/50 border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors space-y-2">
                        <h4 className="font-bold text-sm text-[rgb(var(--color-text-primary))]">Time Management</h4>
                        <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed">
                            Build pace and structure your system sketch within typical FAANG 45-minute design rounds.
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-[rgb(var(--color-bg-secondary))]/50 border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors space-y-2">
                        <h4 className="font-bold text-sm text-[rgb(var(--color-text-primary))]">Unexpected Challenges</h4>
                        <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed">
                            Hone adaptive thinking. Practice mode selects from your seeded problem pool at random.
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-[rgb(var(--color-bg-secondary))]/50 border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg-secondary))] transition-colors space-y-2">
                        <h4 className="font-bold text-sm text-[rgb(var(--color-text-primary))]">Evaluator Stress Test</h4>
                        <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed">
                            Simulate high-pressure scenarios to gain confidence drafting real-time resilient architectures.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
