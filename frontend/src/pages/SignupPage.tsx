import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { useAppStore } from '../store';
import * as authApi from '../api/auth.api';
import { useGoogleLogin } from '@react-oauth/google';

export const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { setUser, setToken } = useAppStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const response = await authApi.googleLogin(tokenResponse.access_token);

                // Store token and user data
                setToken(response.data.token);
                setUser(response.data.user);
                localStorage.setItem('token', response.data.token);

                // Navigate to dashboard
                navigate('/dashboard');
            } catch (err: any) {
                setError(err.message || 'Failed to sign up with Google.');
            } finally {
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google Sign-In failed. Please try again.');
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setError('Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
            setLoading(false);
            return;
        }

        try {
            await authApi.register(formData);

            // Redirect to verify code entry screen
            navigate('/verify', { state: { email: formData.email } });
        } catch (err: any) {
            if (err.data?.isUnverified) {
                // Redirect immediately to verification page
                navigate('/verify', { state: { email: formData.email } });
                return;
            }
            setError(err.message || 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
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
                            <UserPlus className="w-5 h-5 text-[#B58863]" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-white tracking-tight">
                            Infra<span className="shiny-text font-black">lab</span>
                        </h1>
                    </div>
                    <p className="text-[#A79E9C] font-light">
                        Create your account to get started
                    </p>
                </div>
 
                {/* Signup Form */}
                <div className="bg-[#161616] rounded-2xl p-8 shadow-xl border border-white/[0.04] relative">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-red-400 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-[#B58863]/20 transition-all text-sm"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-[#B58863]/20 transition-all text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-white/20 focus:ring-1 focus:ring-[#B58863]/20 transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                            <p className="mt-1.5 text-[10px] text-slate-400">
                                Must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character
                            </p>
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
                                    Creating account...
                                </>
                            ) : 'Create Account'}
                        </button>

                        {!!import.meta.env.VITE_GOOGLE_CLIENT_ID && 
                         !import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('placeholder') && 
                         !import.meta.env.VITE_GOOGLE_CLIENT_ID.includes('your_google_client_id_here') && (
                            <>
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-white/10"></span>
                                    </div>
                                    <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                                        <span className="bg-[#161616] px-3 text-slate-400">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-200 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    onClick={() => handleGoogleLogin()}
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Sign up with Google
                                </button>
                            </>
                        )}
                    </form>

                    {/* Login Link */}
                    <div className="mt-5 text-center space-y-2">
                        <p className="text-xs text-slate-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-[#B58863] hover:text-[#c49874] font-bold hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                        <p className="text-[11px] text-slate-500">
                            Already registered but not verified?{' '}
                            <Link
                                to="/verify"
                                className="text-[#B58863] hover:text-[#c49874] font-semibold hover:underline"
                            >
                                Verify here
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-500">
                    By creating an account, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};
