import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '../store';
import { Button } from '../components/Button';
import * as feedbackApi from '../api/feedback.api';

export const FeedbackPage: React.FC = () => {
    const { user } = useAppStore();
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (!comment.trim()) {
            setError('Please share your comments or feedback details.');
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
        } catch (err: any) {
            setError(err.message || 'Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-[#B58863]/10 border border-[#B58863]/20 rounded-xl text-[#B58863]">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Share Feedback</h1>
                </div>
                <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                    Help us refine and improve Infralab! Share your thoughts on our evaluation engine, editor, problems, or user experience.
                </p>
            </div>

            {/* Main Form Container */}
            <div className="bg-[rgb(var(--color-card))] border border-[rgb(var(--color-border))] rounded-2xl p-6 md:p-8 shadow-sm">
                {success ? (
                    <div className="py-12 text-center animate-in fade-in duration-300">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-[rgb(var(--color-text-primary))]">Thank you for your feedback!</h3>
                        <p className="mt-2 text-sm text-[rgb(var(--color-text-secondary))] max-w-md mx-auto leading-relaxed">
                            Your comments have been submitted successfully. We review all feedback to continuously improve our system design editor and grading system.
                        </p>
                        <Button 
                            variant="secondary" 
                            className="mt-6"
                            onClick={() => setSuccess(false)}
                        >
                            Submit Another Feedback
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="flex items-start gap-2.5 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Star Rating Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-[rgb(var(--color-text-primary))]">
                                Overall Rating
                            </label>
                            <p className="text-xs text-[rgb(var(--color-text-secondary))]">
                                How would you rate your overall experience with the platform?
                            </p>
                            <div className="flex items-center gap-1.5 pt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(null)}
                                        className="p-1 transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${
                                                star <= (hoverRating !== null ? hoverRating : rating)
                                                    ? 'fill-[#B58863] text-[#B58863]'
                                                    : 'text-[rgb(var(--color-border))]'
                                            } transition-colors duration-150`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-3 text-sm font-bold text-[#B58863]">
                                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Decent' : rating === 2 ? 'Needs Improvement' : 'Disappointing'}
                                </span>
                            </div>
                        </div>

                        {/* Name and Email fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label htmlFor="feedback-name" className="block text-xs font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    id="feedback-name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your Name (Optional)"
                                    className="w-full bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[#B58863]/20 focus:border-[#B58863]/40 transition-all"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="feedback-email" className="block text-xs font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="feedback-email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your Email (Optional)"
                                    className="w-full bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-2.5 text-sm text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[#B58863]/20 focus:border-[#B58863]/40 transition-all"
                                />
                            </div>
                        </div>

                        {/* Comment Textarea */}
                        <div className="space-y-1.5">
                            <label htmlFor="feedback-comment" className="block text-xs font-semibold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                                Comments & Suggestions
                            </label>
                            <textarea
                                id="feedback-comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                rows={6}
                                placeholder="What did you like? What features would you like to see? Are there any issues you've encountered?..."
                                className="w-full bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-xl px-4 py-3 text-sm text-[rgb(var(--color-text-primary))] focus:outline-none focus:ring-2 focus:ring-[#B58863]/20 focus:border-[#B58863]/40 transition-all resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto glass-btn-primary flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] px-8 py-3 font-semibold text-sm transition-all"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Feedback'
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
