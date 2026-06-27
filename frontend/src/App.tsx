import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ENABLE_PRO_PLANS } from './config';
import { DashboardPage } from './pages/DashboardPage';
import { ProblemsPage } from './pages/ProblemsPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { PricingPage } from './pages/PricingPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfilePage } from './pages/ProfilePage';
import { ComingSoonPage } from './pages/ComingSoonPage';

// Placeholder pages
import { DesignsPage } from './pages/DesignsPage';

import { PracticeModePage } from './pages/PracticeModePage';

import LeaderboardPage from './pages/LeaderboardPage';

import { SettingsPage } from './pages/SettingsPage';
import { DocsPage } from './pages/DocsPage';
import { FeedbackPage } from './pages/FeedbackPage';

import { useEffect } from 'react';
import { useAppStore } from './store';

function App() {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/pricing" element={ENABLE_PRO_PLANS ? <PricingPage /> : <Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/docs" element={<DocsPage />} />

        {/* Protected app routes (with layout) */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/designs" element={<DesignsPage />} />
          <Route path="/practice" element={<PracticeModePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
        </Route>

        {/* Workspace route - fullscreen without layout */}
        <Route path="/workspace/:problemId" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
