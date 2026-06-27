import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Star, CheckCircle, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from './Button';
import * as feedbackApi from '../api/feedback.api';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!comment.trim()) {
            setError('Please share your thoughts or comments.');
            return;
        }

        setLoading(true);

        try {
            await feedbackApi.submitFeedback({
                rating,
                comment,
                name: name.trim() || undefined,
                email: email.trim() || undefined,
            });

            setSuccess(true);
            setComment('');
            setName('');
            setEmail('');
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2500);

        } catch (err: any) {
            setError(err.message || 'Failed to submit feedback. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-[rgb(var(--color-surface))] rounded-2xl shadow-2xl border border-[rgb(var(--color-border))] overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header/Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[rgb(var(--color-bg-secondary))] transition-colors"
                    aria-label="Close feedback modal"
                >
                    <X className="w-5 h-5 text-[rgb(var(--color-text-secondary))]" />
                </button>

                <div className="p-6">
                    {success ? (
                        <div className="py-8 text-center animate-in fade-in zoom-in duration-300">
                            <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">Thank You!</h3>
                            <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))] max-w-xs mx-auto">
                                Your valuable feedback has been submitted successfully. We appreciate your support in improving Infralab!
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-4">
                                <div className="inline-flex items-center gap-2 mb-2">
                                    <div className="p-1.5 bg-[#B58863]/10 border border-[#B58863]/20 rounded-lg text-[#B58863]">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                    <h2 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">Share Feedback</h2>
                                </div>
                                <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed">
                                    Help us refine our architecture tools! Rate your experience and drop suggestions below.
                                </p>
                            </div>

                            {/* Error alert */}
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 font-medium">
                                    {error}
                                </div>
                            )}

                            {/* Star Selector */}
                            <div className="text-center py-2 bg-[rgb(var(--color-bg-secondary))]/55 rounded-xl border border-[rgb(var(--color-border))]">
                                <span className="block text-[10px] uppercase font-bold text-[rgb(var(--color-text-secondary))] tracking-wider mb-1.5">Rating</span>
                                <div className="flex items-center justify-center gap-1.5">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isFilled = hoverRating !== null ? star <= hoverRating : star <= rating;
                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(null)}
                                                className="p-1 transition-transform active:scale-90 hover:scale-110"
                                            >
                                                <Star
                                                    className={`w-7 h-7 transition-colors ${
                                                        isFilled
                                                            ? 'fill-amber-400 text-amber-400 filter drop-shadow-[0_0_2px_rgba(251,191,36,0.3)]'
                                                            : 'text-[rgb(var(--color-border))]'
                                                    }`}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                                <span className="block text-xs font-semibold text-amber-400 mt-1.5">
                                    {rating === 1 && 'Needs Improvement ⚠️'}
                                    {rating === 2 && 'Good Attempt 👍'}
                                    {rating === 3 && 'Decent App 😊'}
                                    {rating === 4 && 'Great Platform! 🚀'}
                                    {rating === 5 && 'Excellent/Perfect! 💎'}
                                </span>
                            </div>

                            {/* Comment */}
                            <div>
                                <label htmlFor="comment" className="block text-xs font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-2">
                                    Feedback / Suggestions
                                </label>
                                <textarea
                                    id="comment"
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us what you liked, what can be improved, or bugs you encountered..."
                                    required
                                    className="w-full px-3 py-2 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl text-[rgb(var(--color-text-primary))] text-sm focus:outline-none focus:border-[#B58863] focus:ring-1 focus:ring-[#B58863]/30 transition-all resize-none placeholder-slate-500"
                                />
                            </div>

                            {/* Optional Fields (Name & Email) */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="name" className="block text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-1.5">
                                        Display Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. John"
                                        className="w-full px-3 py-1.5 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl text-[rgb(var(--color-text-primary))] text-xs focus:outline-none focus:border-[#B58863] transition-all"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider mb-1.5">
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="e.g. you@domain.com"
                                        className="w-full px-3 py-1.5 bg-[rgb(var(--color-surface))] border border-[rgb(var(--color-border))] rounded-xl text-[rgb(var(--color-text-primary))] text-xs focus:outline-none focus:border-[#B58863] transition-all"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#B58863] text-[#161616] hover:bg-[#c49874] font-bold border-0 mt-2 py-2.5 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : 'Submit Feedback'}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
