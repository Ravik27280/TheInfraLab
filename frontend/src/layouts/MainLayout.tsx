import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { FeedbackModal } from '../components/FeedbackModal';


export const MainLayout: React.FC = () => {
    const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);

    React.useEffect(() => {
        const handleOpenFeedback = () => setIsFeedbackOpen(true);
        window.addEventListener('open-feedback', handleOpenFeedback);
        return () => window.removeEventListener('open-feedback', handleOpenFeedback);
    }, []);

    return (
        <div className="page-container bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-primary))] relative">
            {/* Minimal Animated Drifting Grid Overlay */}
            <div className="absolute inset-0 animated-grid-overlay pointer-events-none z-0" />

            <Sidebar />
            <div className="content-area flex flex-col relative z-10">
                <Topbar />
                <main className="flex-1 overflow-auto relative">
                    <Outlet />
                </main>
            </div>



            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
            />
        </div>
    );
};
