import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { VoiceProvider } from './contexts/VoiceContext';
import { Header } from './components/common/Header';
import { PatientNavigation } from './components/common/PatientNavigation';
import { CaregiverSidebar } from './components/common/CaregiverSidebar';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { OfflineBanner } from './components/common/OfflineBanner';

import { LandingPage } from './pages/LandingPage';
import { GoogleLoginPage } from './pages/GoogleLoginPage';

// Patient Pages
import { PatientHome } from './pages/patient/PatientHome';
import { MemoryLanePage } from './pages/patient/MemoryLanePage';
import { ActivitySelectionPage } from './pages/patient/ActivitySelectionPage';
import { ActivityPlayPage } from './pages/patient/ActivityPlayPage';
import { ActivityResultPage } from './pages/patient/ActivityResultPage';
import { MemoryCompanionPage } from './pages/patient/MemoryCompanionPage';
import { RoutinePage } from './pages/patient/RoutinePage';
import { RegionalContextPage } from './pages/patient/RegionalContextPage';
import { PatientMemoryLibraryPage } from './pages/patient/PatientMemoryLibraryPage';
import { VoiceCompanionPage } from './pages/patient/VoiceCompanionPage';
import { MatchPeopleGamePage } from './pages/patient/MatchPeopleGamePage';
import { FestivalsCulturePage } from './pages/patient/FestivalsCulturePage';
import { PlacesRememberPage } from './pages/patient/PlacesRememberPage';
import { CulturalMusicPage } from './pages/patient/CulturalMusicPage';
import { OfflineModePage } from './pages/patient/OfflineModePage';
import { JourneyActivityPage } from './pages/patient/JourneyActivityPage';
import { PatientSettingsPage } from './pages/patient/PatientSettingsPage';
import { DailyTasksPage } from './pages/patient/DailyTasksPage';
import { MemoryBoxGamePage } from './pages/patient/MemoryBoxGamePage';

// Caregiver Pages
import { CaregiverDashboard } from './pages/caregiver/CaregiverDashboard';
import { PatientProfilePage } from './pages/caregiver/PatientProfilePage';
import { MemoryLibraryPage } from './pages/caregiver/MemoryLibraryPage';
import { MemoryFormPage } from './pages/caregiver/MemoryFormPage';
import { AnalyticsPage } from './pages/caregiver/AnalyticsPage';
import { ActivityReportsPage } from './pages/caregiver/ActivityReportsPage';
import { FamilyCareTeamPage } from './pages/caregiver/FamilyCareTeamPage';
import { ConnectedAccountsPage } from './pages/caregiver/ConnectedAccountsPage';
import { VoiceSettingsPage } from './pages/caregiver/VoiceSettingsPage';
import { ChangeAlertsPage } from './pages/caregiver/ChangeAlertsPage';
import { RemindersPage } from './pages/caregiver/RemindersPage';
import { AIRecommendationsPage } from './pages/caregiver/AIRecommendationsPage';
import { ConsentPrivacyPage } from './pages/caregiver/ConsentPrivacyPage';
import { SettingsPage } from './pages/caregiver/SettingsPage';
import { FamilyStoryCapturePage } from './pages/caregiver/FamilyStoryCapturePage';

// Admin Page
import { AdminDashboard } from './pages/admin/AdminDashboard';

const PatientLayout: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
        <OfflineBanner />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/patient/home" replace />} />
            <Route path="/home" element={<PatientHome />} />
            <Route path="/regional-context" element={<RegionalContextPage />} />
            <Route path="/profile" element={<RegionalContextPage />} />
            <Route path="/memories" element={<PatientMemoryLibraryPage />} />
            <Route path="/memory-lane" element={<MemoryLanePage />} />
            <Route path="/activities" element={<ActivitySelectionPage />} />
            <Route path="/play" element={<ActivityPlayPage />} />
            <Route path="/memory-box" element={<MemoryBoxGamePage />} />
            <Route path="/match-people" element={<MatchPeopleGamePage />} />
            <Route path="/activity-result" element={<ActivityResultPage />} />
            <Route path="/voice" element={<VoiceCompanionPage />} />
            <Route path="/companion" element={<MemoryCompanionPage />} />
            <Route path="/routine" element={<RoutinePage />} />
            <Route path="/tasks" element={<DailyTasksPage />} />
            <Route path="/festivals" element={<FestivalsCulturePage />} />
            <Route path="/places" element={<PlacesRememberPage />} />
            <Route path="/music" element={<CulturalMusicPage />} />
            <Route path="/journey" element={<JourneyActivityPage />} />
            <Route path="/offline" element={<OfflineModePage />} />
            <Route path="/settings" element={<PatientSettingsPage />} />
          </Routes>
        </main>
        <PatientNavigation />
      </div>
    </ProtectedRoute>
  );
};

const CaregiverLayout: React.FC = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-[#F4F7FB]">
        <OfflineBanner />
        <Header />
        <div className="flex flex-1 max-w-7xl w-full mx-auto">
          <CaregiverSidebar />
          <main className="flex-1 p-4 md:p-8 min-h-[calc(100vh-65px)]">
            <Routes>
              <Route path="/" element={<Navigate to="/caregiver/dashboard" replace />} />
              <Route path="/dashboard" element={<CaregiverDashboard />} />
              <Route path="/profile" element={<PatientProfilePage />} />
              <Route path="/regional-context" element={<RegionalContextPage />} />
              <Route path="/memories" element={<MemoryLibraryPage />} />
              <Route path="/memories/new" element={<MemoryFormPage />} />
              <Route path="/family-story" element={<FamilyStoryCapturePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/reports" element={<ActivityReportsPage />} />
              <Route path="/family" element={<FamilyCareTeamPage />} />
              <Route path="/connected-accounts" element={<ConnectedAccountsPage />} />
              <Route path="/voice-settings" element={<VoiceSettingsPage />} />
              <Route path="/alerts" element={<ChangeAlertsPage />} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
              <Route path="/consent" element={<ConsentPrivacyPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <VoiceProvider>
          <Router>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<GoogleLoginPage />} />
              <Route path="/offline" element={<OfflineModePage />} />
              <Route path="/patient/*" element={<PatientLayout />} />
              <Route path="/caregiver/*" element={<CaregiverLayout />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex flex-col bg-[#F5F6FA]">
                      <Header />
                      <main className="p-8 max-w-5xl mx-auto flex-1 w-full">
                        <AdminDashboard />
                      </main>
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </VoiceProvider>
      </AccessibilityProvider>
    </AuthProvider>
  );
};

export default App;
