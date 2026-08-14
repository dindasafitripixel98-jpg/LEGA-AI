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

export default function App() {
  const getInitialModule = (): ModuleType => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const mod = params.get('module');
      if (mod) return mod as ModuleType;
    }
    return 'dashboard';
  };

  const [currentModule, setCurrentModule] = useState<ModuleType>(getInitialModule);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState<boolean>(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState<boolean>(false);

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Teman LEGA',
    reflectionGoal: 'Mengenal diri lebih dalam, mengelola cemas kerja, dan membangun ketenangan batin.',
    preferredTone: 'tenang',
    streakDays: 4,
    totalReflections: 12,
    registeredDate: new Date().toISOString().split('T')[0],
  });

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
        return <SelfDiscovery />;
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

  return (
    <div className="flex h-screen bg-stone-950 font-sans text-stone-100 overflow-hidden antialiased">
      {/* Sidebar */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={(mod) => setCurrentModule(mod)}
        isOpenMobile={isOpenMobile}
        onToggleMobile={() => setIsOpenMobile(!isOpenMobile)}
        onOpenCrisis={() => setIsCrisisOpen(true)}
        onOpenPwaModal={() => setIsPwaModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto min-w-0 bg-stone-950">
        <Header
          currentModule={currentModule}
          userProfile={userProfile}
          onToggleMobile={() => setIsOpenMobile(!isOpenMobile)}
          onOpenCrisis={() => setIsCrisisOpen(true)}
          onSelectModule={(mod) => setCurrentModule(mod)}
          onOpenPwaModal={() => setIsPwaModalOpen(true)}
        />

        <main className="flex-1 pb-12">{renderModuleView()}</main>
      </div>

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
