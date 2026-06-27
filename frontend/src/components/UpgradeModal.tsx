import React from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { X, Check, Lock, MessageSquare } from 'lucide-react';
import { Button } from './Button';
import { ENABLE_PRO_PLANS } from '../config';

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFeedbackClick?: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, onFeedbackClick }) => {
    if (!isOpen) return null;

    const navigate = useNavigate();

    const handleUpgrade = () => {
        onClose();
        navigate('/coming-soon');
    };

    const handleFeedback = () => {
        onClose();
        if (onFeedbackClick) {
            onFeedbackClick();
        } else {
            // Dispatches global event so that MainLayout or Sidebar can catch it
            window.dispatchEvent(new CustomEvent('open-feedback'));
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[rgb(var(--color-surface))] rounded-xl shadow-2xl border border-[rgb(var(--color-border))] overflow-hidden animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-[rgb(var(--color-bg-secondary))] transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                </button>

                {ENABLE_PRO_PLANS ? (
                    <div className="p-6">
                        <div className="mb-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-[#B58863] to-[#c49874]">
                                <Check className="w-6 h-6 text-[#161616]" />
                            </div>
                            <h2 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Upgrade to Pro</h2>
                            <p className="mt-2 text-[rgb(var(--color-text-secondary))]">
                                Unlock full access to all system design problems and advanced features.
                            </p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {['Access to Hard problems (Uber, Netflix, etc.)', 'Unlimited AI Evaluations', 'Priority Support', 'Ad-free Experience'].map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span className="text-[rgb(var(--color-text-primary))]">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-[rgb(var(--color-bg-secondary))] rounded-lg p-4 mb-6 border border-[rgb(var(--color-border))]">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-sm text-[rgb(var(--color-text-secondary))]">Pro Plan</p>
                                    <p className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">$9.99<span className="text-sm font-normal text-[rgb(var(--color-text-secondary))]">/month</span></p>
                                </div>
                                <div className="text-xs text-[rgb(var(--color-text-secondary))] bg-[rgb(var(--color-surface))] px-2 py-1 rounded border border-[rgb(var(--color-border))]">
                                    Cancel anytime
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleUpgrade}
                            className="w-full bg-[#B58863] text-[#161616] hover:bg-[#c49874] font-bold border-0"
                        >
                            Upgrade Now
                        </Button>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="mb-6 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-[#B58863]/10 to-[#c49874]/10 border border-[#B58863]/20">
                                <Lock className="w-5 h-5 text-[#B58863]" />
                            </div>
                            <h2 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">Premium Challenge</h2>
                            <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                Premium system design templates are locked during our initial testing phase.
                            </p>
                        </div>

                        <div className="bg-[rgb(var(--color-bg-secondary))] rounded-xl p-4 mb-6 border border-[rgb(var(--color-border))] text-sm text-[rgb(var(--color-text-secondary))] leading-relaxed">
                            We are gathering developer feedback on our current drawing tools, flow animation paths, and Gemini AI evaluations to prioritize our features roadmap.
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={handleFeedback}
                                className="w-full bg-[#B58863] text-[#161616] hover:bg-[#c49874] font-bold border-0 flex items-center justify-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" /> Share Your Feedback
                            </Button>
                            <Button
                                onClick={onClose}
                                variant="secondary"
                                className="w-full font-bold"
                            >
                                Maybe Later
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};
