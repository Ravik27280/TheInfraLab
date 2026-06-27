import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';

export const ComingSoonPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg))] p-4">
            <div className="max-w-md w-full text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-8 shadow-lg shadow-indigo-500/25">
                    <Rocket className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-4xl font-bold text-[rgb(var(--color-text-primary))] mb-4">
                    Coming Soon
                </h1>

                <p className="text-lg text-[rgb(var(--color-text-secondary))] mb-8">
                    We're working hard to bring you the Pro plan with exclusive features like unlimited AI evaluations and advanced problem sets.
                </p>

                <div className="flex justify-center">
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2"
                        variant="secondary"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
};
