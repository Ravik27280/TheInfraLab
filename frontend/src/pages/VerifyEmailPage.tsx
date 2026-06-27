import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { MailCheck, Key, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAppStore } from '../store';
import * as authApi from '../api/auth.api';

export const VerifyEmailPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setUser, setToken } = useAppStore();

    // Retrieve email from navigation state
    const stateEmail = (location.state as { email?: string })?.email || '';
    
    const [email, setEmail] = useState(stateEmail);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        if (!stateEmail) {
            setError('Please enter your email to request or enter a verification code.');
        }
    }, [stateEmail]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!email) {
            setError('Email address is required.');
            return;
        }

        if (!code || code.length !== 6 || isNaN(Number(code))) {
            setError('Please enter a valid 6-digit numeric verification code.');
            return;
        }

        setLoading(true);

        try {
            const response = await authApi.verifyEmail(email, code);

            // Successfully verified! Save tokens and details
            setToken(response.data.token);
            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);

            setMessage('Email verified successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'Verification failed. Please check the code and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            setError('Email address is required to resend code.');
            return;
        }

        setError('');
        setMessage('');
        setResending(true);

        try {
            const response = await authApi.resendVerification(email);
            setMessage(response.message || 'Verification code resent successfully. Check your console/email!');
        } catch (err: any) {
            setError(err.message || 'Failed to resend code. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#10232A] px-4 relative overflow-hidden reveal-animation">
            {/* Minimal Animated Drifting Grid Overlay */}
            <div className="absolute inset-0 animated-grid-overlay pointer-events-none z-0" />

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2.5 mb-3">
                        <div className="w-10 h-10 bg-[#B58863]/10 border border-[#B58863]/20 rounded-xl flex items-center justify-center">
                            <MailCheck className="w-5 h-5 text-[#B58863]" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">
                            Infra<span className="shiny-text font-black">lab</span>
                        </h1>
                    </div>
                    <p className="text-[#A79E9C] font-light">
                        Security Email Verification
                    </p>
                </div>

                {/* Verification Card */}
                <div className="bg-[#161616] rounded-2xl p-8 shadow-xl border border-white/[0.04] relative">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Status Messages */}
                        {error && (
                            <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400 font-medium">{error}</p>
                            </div>
                        )}
                        {message && (
                            <div className="flex items-start gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <MailCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-emerald-400 font-medium">{message}</p>
                            </div>
                        )}

                        {/* Instructions */}
                        <p className="text-xs text-slate-400 leading-relaxed text-center mb-2">
                            Enter the 6-digit confirmation code generated for your account. If you are developing locally, the code is printed to your backend console log.
                        </p>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={!!stateEmail}
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-[#B58863]/20 transition-all text-sm disabled:opacity-50"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Code Input */}
                        <div>
                            <label htmlFor="code" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                6-Digit Code
                            </label>
                            <div className="relative">
                                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    id="code"
                                    name="code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.slice(0, 6))}
                                    required
                                    maxLength={6}
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-[#B58863]/20 transition-all text-sm font-mono tracking-widest text-center text-lg"
                                    placeholder="000000"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full glass-btn-primary flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] mt-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Verifying code...
                                </>
                            ) : 'Verify Email'}
                        </button>

                        {/* Action buttons */}
                        <div className="flex justify-between items-center pt-2">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resending || !email}
                                className="text-xs text-[#B58863] hover:text-[#c49874] hover:underline font-bold disabled:opacity-50"
                            >
                                {resending ? 'Resending code...' : 'Resend code'}
                            </button>

                            <Link
                                to="/login"
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 hover:underline"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" /> Back to login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
