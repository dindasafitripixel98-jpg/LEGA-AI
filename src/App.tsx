/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * LEGA - AI Self Awareness Platform Indonesia
 * SHAQILA DIGITAL 99
 */

import React, { useState } from 'react';
import { ModuleType, UserProfile, EmotionLog, JournalEntry, EmotionCategory } from './types';
import { INITIAL_EMOTION_LOGS, INITIAL_JOURNALS } from './data/initialData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CrisisModal } from './components/CrisisModal';

import { Dashboard } from './components/Dashboard';
import { AICoach } from './components/AICoach';
import { EmotionAnalysis } from './components/EmotionAnalysis';
import { SelfDiscovery } from './components/SelfDiscovery';
import { LegaPatternAwareness } from './components/LegaPatternAwareness';
import { MindfulnessExercises } from './components/MindfulnessExercises';
import { LegaGratitude } from './components/LegaGratitude';
import { LegaForgiveness } from './components/LegaForgiveness';
import { LegaInnerChild } from './components/LegaInnerChild';
import { LegaOverthinking } from './components/LegaOverthinking';
import { LegaAnxiety } from './components/LegaAnxiety';
import { LegaStress } from './components/LegaStress';
import { LegaAnger } from './components/LegaAnger';
import { LegaSadness } from './components/LegaSadness';
import { LegaGuilt } from './components/LegaGuilt';
import { LegaShame } from './components/LegaShame';
import { LegaFear } from './components/LegaFear';
import { LegaLifePurpose } from './components/LegaLifePurpose';
import { LegaSpiritualReflection } from './components/LegaSpiritualReflection';
import { LegaObserver } from './components/LegaObserver';
import { BodyAwareness } from './components/BodyAwareness';
import { BreathingExercises } from './components/BreathingExercises';
import { EmotionalRelease } from './components/EmotionalRelease';
import { JournalView } from './components/JournalView';
import { AIInsights } from './components/AIInsights';
import { AudioPlayerView } from './components/AudioPlayerView';
import { ArticlesView } from './components/ArticlesView';
import { MindBodyConnection } from './components/MindBodyConnection';
import { ProgressStats } from './components/ProgressStats';
import { ProfileView } from './components/ProfileView';
import { SettingsView } from './components/SettingsView';
import { AdminPanel } from './components/AdminPanel';
import { PwaInstallModal } from './components/PwaInstallModal';
import { PwaNotificationBanner } from './components/PwaNotificationBanner';
import { GlobalVoiceBar } from './components/GlobalVoiceBar';
import { LuxuryLandingPage } from './components/LuxuryLandingPage';
import { LuxuryLoginView } from './components/LuxuryLoginView';
import { LuxuryOnboardingView } from './components/LuxuryOnboardingView';
import { useDemoAuth } from './lib/demoAuthManager';
import { DemoBanner } from './components/DemoBanner';
import { DemoAuthModal } from './components/DemoAuthModal';
import { DemoExpirationScreen } from './components/DemoExpirationScreen';
import { setStoredVoiceName } from './lib/voiceService';

export type AppFlowStage = 'landing' | 'login' | 'onboarding' | 'app';

export default function App() {
  const getInitialFlowStage = (): AppFlowStage => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const stageParam = params.get('stage');
      if (stageParam && ['landing', 'login', 'onboarding', 'app'].includes(stageParam)) {
        return stageParam as AppFlowStage;
      }
      if (params.get('module')) {
        return 'app';
      }
    }
    return 'landing';
  };

  const getInitialModule = (): ModuleType => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mod = params.get('module');
      if (mod) return mod as ModuleType;
    }
    return 'dashboard';
  };

  const [flowStage, setFlowStage] = useState<AppFlowStage>(getInitialFlowStage);
  const [currentModule, setCurrentModule] = useState<ModuleType>(getInitialModule);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState<boolean>(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  // Demo Account 24-Hour Auth Hook
  const demoState = useDemoAuth();

  const getInitialProfile = (): UserProfile => {
    const defaultProfile: UserProfile = {
      name: 'Teman LEGA',
      email: 'teman@lega.app',
      avatar: 'lotus',
      bio: 'Menemukan keheningan di tengah riuh dunia, menyayangi diri seutuhnya.',
      reflectionGoal: 'Mengenal diri lebih dalam, mengelola cemas kerja, dan membangun ketenangan batin.',
      preferredTone: 'tenang',
      preferredVoice: 'Suara Tenang',
      primaryEmotionFocus: 'overthinking',
      dailyReminderTime: '21:00',
      enableSoundscapes: true,
      streakDays: 4,
      totalReflections: 12,
      registeredDate: new Date().toISOString().split('T')[0],
    };

    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lega_user_profile');
        if (stored) {
          return { ...defaultProfile, ...JSON.parse(stored) };
        }
      } catch (err) {
        console.warn('Profile parse notice:', err);
      }
    }
    return defaultProfile;
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(getInitialProfile);

  const [emotionLogs, setEmotionLogs] = useState<EmotionLog[]>(INITIAL_EMOTION_LOGS);
  const [journals, setJournals] = useState<JournalEntry[]>(INITIAL_JOURNALS);

  const handleSaveEmotionLog = (log: EmotionLog) => {
    setEmotionLogs((prev) => [log, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      totalReflections: prev.totalReflections + 1,
    }));
  };

  const handleAddJournal = (entry: JournalEntry) => {
    setJournals((prev) => [entry, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      totalReflections: prev.totalReflections + 1,
    }));
  };

  const handleQuickLogMood = (emotion: EmotionCategory, intensity: number) => {
    const quickLog: EmotionLog = {
      id: `quick-${Date.now()}`,
      timestamp: new Date().toISOString(),
      emotion,
      intensity,
      physicalSensations: ['Check-in cepat'],
      triggers: ['Dashboard Harian'],
      notes: 'Pencatatan emosi cepat dari Dashboard',
    };
    handleSaveEmotionLog(quickLog);
  };

  const renderModuleView = () => {
    switch (currentModule) {
      case 'dashboard':
        return (
          <Dashboard
            userProfile={userProfile}
            emotionLogs={emotionLogs}
            journals={journals}
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onQuickLogMood={handleQuickLogMood}
            onOpenPwaModal={() => setIsPwaModalOpen(true)}
          />
        );
      case 'ai-coach':
        return (
          <AICoach
            userProfile={userProfile}
            onOpenCrisis={() => setIsCrisisOpen(true)}
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
          />
        );
      case 'emotion-analysis':
        return (
          <EmotionAnalysis
            onSaveLog={handleSaveEmotionLog}
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
          />
        );
      case 'self-discovery':
        return (
          <SelfDiscovery
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
            userProfile={userProfile}
          />
        );
      case 'pattern-awareness':
        return (
          <LegaPatternAwareness
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
            onOpenCrisis={() => setIsCrisisOpen(true)}
          />
        );
      case 'mindfulness':
        return (
          <MindfulnessExercises
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onOpenCrisis={() => setIsCrisisOpen(true)}
          />
        );
      case 'gratitude':
        return (
          <LegaGratitude
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'forgiveness':
        return (
          <LegaForgiveness
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'inner-child':
        return (
          <LegaInnerChild
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'overthinking':
        return (
          <LegaOverthinking
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'anxiety':
        return (
          <LegaAnxiety
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'stress':
        return (
          <LegaStress
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'anger':
        return (
          <LegaAnger
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'sadness':
        return (
          <LegaSadness
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'guilt':
        return (
          <LegaGuilt
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'shame':
        return (
          <LegaShame
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'fear':
        return (
          <LegaFear
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'life-purpose':
        return (
          <LegaLifePurpose
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'spiritual-reflection':
        return (
          <LegaSpiritualReflection
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onAddJournal={handleAddJournal}
          />
        );
      case 'observer':
        return (
          <LegaObserver
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onOpenCrisis={() => setIsCrisisOpen(true)}
          />
        );
      case 'body-awareness':
        return (
          <BodyAwareness
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onOpenCrisis={() => setIsCrisisOpen(true)}
          />
        );
      case 'breathing':
        return (
          <BreathingExercises
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onOpenCrisis={() => setIsCrisisOpen(true)}
          />
        );
      case 'emotional-release':
        return (
          <EmotionalRelease
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onOpenCrisis={() => setIsCrisisOpen(true)}
          />
        );
      case 'journal':
        return <JournalView journals={journals} onAddJournal={handleAddJournal} />;
      case 'ai-insights':
        return <AIInsights emotionLogs={emotionLogs} journals={journals} />;
      case 'audio-ai':
        return (
          <AudioPlayerView
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onOpenCrisis={() => setIsCrisisOpen(true)}
            userName={userProfile?.name}
          />
        );
      case 'articles':
        return <ArticlesView />;
      case 'mind-body':
        return (
          <MindBodyConnection
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onOpenCrisis={() => setIsCrisisOpen(true)}
          />
        );
      case 'progress':
        return (
          <ProgressStats
            userProfile={userProfile}
            emotionLogs={emotionLogs}
            journals={journals}
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
          />
        );
      case 'profile':
        return (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={(p) => setUserProfile(p)}
            onLogout={() => setFlowStage('landing')}
            demoState={demoState}
          />
        );
      case 'settings':
        return <SettingsView onOpenPwaModal={() => setIsPwaModalOpen(true)} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return (
          <Dashboard
            userProfile={userProfile}
            emotionLogs={emotionLogs}
            journals={journals}
            onSelectModule={(mod) => setCurrentModule(mod as ModuleType)}
            onQuickLogMood={handleQuickLogMood}
            onOpenPwaModal={() => setIsPwaModalOpen(true)}
          />
        );
    }
  };

  // Render based on top-level user journey flow: Landing -> Login -> Onboarding -> App
  if (flowStage === 'landing') {
    return (
      <LuxuryLandingPage
        onGetStarted={() => setFlowStage('login')}
        onLoginClick={() => setFlowStage('login')}
        onDirectAppAccess={() => setFlowStage('app')}
      />
    );
  }

  if (flowStage === 'login') {
    return (
      <LuxuryLoginView
        onLoginSuccess={(userData) => {
          if (userData?.name) {
            setUserProfile((prev) => ({ ...prev, name: userData.name }));
          }
          demoState.quickStartDemo(userData?.name, userData?.email);
          setFlowStage('onboarding');
        }}
        onBackToLanding={() => setFlowStage('landing')}
      />
    );
  }

  if (flowStage === 'onboarding') {
    return (
      <LuxuryOnboardingView
        initialUserName={userProfile.name}
        onCompleteOnboarding={(customData) => {
          setUserProfile((prev) => ({
            ...prev,
            name: customData.name || prev.name,
            reflectionGoal: customData.reflectionGoal || prev.reflectionGoal,
            preferredTone: customData.preferredTone || prev.preferredTone,
          }));
          if (customData.selectedVoice) {
            setStoredVoiceName(customData.selectedVoice);
          }
          if (typeof window !== 'undefined') {
            localStorage.setItem('lega_has_completed_onboarding', 'true');
          }
          setFlowStage('app');
        }}
        onBackToLogin={() => setFlowStage('login')}
      />
    );
  }

  // 4. MAIN CORE APPLICATION
  return (
    <div className="flex h-screen bg-stone-950 font-sans text-stone-100 overflow-hidden antialiased">
      {/* 24-Hour Expiration Blocker */}
      {demoState.isExpired && (
        <DemoExpirationScreen
          onRenewDemo={() => demoState.resetDemoSession()}
          onOpenLoginModal={() => setIsDemoModalOpen(true)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        isOpenMobile={isOpenMobile}
        onToggleMobile={() => setIsOpenMobile(!isOpenMobile)}
        onOpenCrisis={() => setIsCrisisOpen(true)}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
        onLogout={() => setFlowStage('landing')}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0 bg-stone-950">
        {/* TOP BRANDING BAR - SHAQILA DIGITAL 99 */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border-b border-amber-500/30 px-3 sm:px-4 py-1.5 flex items-center justify-between text-[11px] text-amber-200 shrink-0 shadow-sm z-40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
            <span className="font-black tracking-widest text-amber-300 uppercase text-[10px] sm:text-[11px] bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
              SHAQILA DIGITAL 99
            </span>
            <span className="text-stone-500 hidden md:inline">&bull;</span>
            <span className="text-stone-300 font-medium hidden md:inline text-[11px]">
              LEGA — Platform AI Kesadaran Diri & Audio Relaksasi Tenang
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold tracking-wider">
              PRODUKSI RESMI SHAQILA DIGITAL 99
            </span>
          </div>
        </div>

        {/* Top 24-Hour Demo Notification Status Bar */}
        <DemoBanner
          demoState={demoState}
          onOpenModal={() => setIsDemoModalOpen(true)}
        />

        <Header
          currentModule={currentModule}
          userProfile={userProfile}
          onToggleMobile={() => setIsOpenMobile(!isOpenMobile)}
          onOpenCrisis={() => setIsCrisisOpen(true)}
          onSelectModule={(mod) => setCurrentModule(mod)}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
          demoState={demoState}
          onOpenDemoModal={() => setIsDemoModalOpen(true)}
          onNavigateLanding={() => setFlowStage('landing')}
          onLogout={() => setFlowStage('landing')}
        />

        <main className="flex-1 pb-12">{renderModuleView()}</main>
      </div>

      {/* 24-Hour Demo Account Modal */}
      <DemoAuthModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        demoState={demoState}
      />

      {/* Crisis Psychological Support Modal */}
      <CrisisModal isOpen={isCrisisOpen} onClose={() => setIsCrisisOpen(false)} />

      {/* PWA Installation & Offline Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />

      {/* PWA Floating Notification & Offline Status Banner */}
      <PwaNotificationBanner
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
      />

      {/* Global AI Voice Guide Floating Controller */}
      <GlobalVoiceBar />
    </div>
  );
}
