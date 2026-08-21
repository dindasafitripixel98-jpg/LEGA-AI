/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * LEGA - AI Self Awareness Platform Indonesia
 * SHAQILA DIGITAL 99
 */

import React, { useState, useEffect } from 'react';
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
import { DemoBanner, ActiveAccountInfo } from './components/DemoBanner';
import { DemoAuthModal } from './components/DemoAuthModal';
import { DemoExpirationScreen } from './components/DemoExpirationScreen';
import { setStoredVoiceName } from './lib/voiceService';
import { FirebaseProvider, useFirebase } from './context/FirebaseContext';
import { getLocalCustomerAccounts, checkDemoAccountStatus } from './lib/developerService';
import { ShieldAlert, LogOut } from 'lucide-react';

export type AppFlowStage = 'landing' | 'login' | 'onboarding' | 'app';

const ACTIVE_ACCOUNT_KEY = 'lega_active_user_account';

function getStoredActiveAccount(): ActiveAccountInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_ACCOUNT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function saveStoredActiveAccount(acc: ActiveAccountInfo | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!acc) {
      localStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    } else {
      localStorage.setItem(ACTIVE_ACCOUNT_KEY, JSON.stringify(acc));
    }
  } catch (e) {}
}

function AppContent() {
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
  const [activeAccount, setActiveAccount] = useState<ActiveAccountInfo | null>(getStoredActiveAccount);

  // Demo Account 24-Hour Auth Hook
  const demoState = useDemoAuth();

  // Firebase Real-time Firestore State & Functions
  const {
    userProfile,
    setUserProfile,
    emotionLogs,
    journals,
    saveEmotionLog,
    addJournal,
    updateProfile,
    isCloudSynced
  } = useFirebase();

  // Real-time Check for Account Suspension in Customer Database
  const [isAccountSuspended, setIsAccountSuspended] = useState(false);
  const [suspensionReason, setSuspensionReason] = useState('');

  useEffect(() => {
    const checkSuspension = () => {
      if (!activeAccount) {
        setIsAccountSuspended(false);
        return;
      }

      if (activeAccount.isDemo) {
        const demoStatus = checkDemoAccountStatus();
        if (!demoStatus.allowed) {
          setIsAccountSuspended(true);
          setSuspensionReason(demoStatus.reason);
          return;
        }
      }

      const allAccounts = getLocalCustomerAccounts();
      const matched = allAccounts.find(
        (a) => a.email.toLowerCase() === activeAccount.email.toLowerCase()
      );

      if (matched && matched.status === 'SUSPENDED') {
        setIsAccountSuspended(true);
        setSuspensionReason(`Akun ${matched.name} (${matched.email}) telah ditangguhkan (SUSPENDED) oleh Administrator SHAQILA DIGITAL 99.`);
      } else {
        setIsAccountSuspended(false);
      }
    };

    checkSuspension();
    const interval = setInterval(checkSuspension, 2000);
    return () => clearInterval(interval);
  }, [activeAccount]);

  const handleDeveloperDirectLogin = (targetModule: ModuleType = 'dashboard') => {
    demoState.logoutDemo();
    const devAcc: ActiveAccountInfo = {
      name: 'Dinda Safitri (Owner & Developer)',
      email: 'dindasafitri.pixel98@gmail.com',
      role: 'DEVELOPER',
      plan: 'LIFETIME',
      isDemo: false,
      status: 'ACTIVE'
    };
    setUserProfile((prev) => ({
      ...prev,
      name: 'Dinda Safitri (Owner & Developer)',
      email: 'dindasafitri.pixel98@gmail.com'
    }));
    setActiveAccount(devAcc);
    saveStoredActiveAccount(devAcc);
    setIsAccountSuspended(false);
    setCurrentModule(targetModule);
    setFlowStage('app');
  };

  // URL Query Parameter Auto-Login Check for Developer
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isDevParam =
        params.get('dev') === 'true' ||
        params.get('mode') === 'developer' ||
        params.get('access') === 'developer' ||
        params.get('login') === 'developer' ||
        params.get('admin') === 'true';

      if (isDevParam) {
        const mod = (params.get('module') as ModuleType) || 'dashboard';
        handleDeveloperDirectLogin(mod);
      }
    }
  }, []);

  const handleSaveEmotionLog = (log: EmotionLog) => {
    saveEmotionLog(log);
  };

  const handleAddJournal = (entry: JournalEntry) => {
    addJournal(entry);
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
    saveEmotionLog(quickLog);
  };

  const handleLogoutAll = () => {
    demoState.logoutDemo();
    saveStoredActiveAccount(null);
    setActiveAccount(null);
    setIsAccountSuspended(false);
    setFlowStage('landing');
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
            onLogout={handleLogoutAll}
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
        onDeveloperDirectAccess={() => handleDeveloperDirectLogin('dashboard')}
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

          if (userData?.isDemo) {
            demoState.quickStartDemo(userData.name, userData.email);
            const newAcc: ActiveAccountInfo = {
              name: userData.name,
              email: userData.email,
              role: 'USER',
              plan: 'TRIAL',
              isDemo: true,
              status: 'ACTIVE'
            };
            setActiveAccount(newAcc);
            saveStoredActiveAccount(newAcc);
          } else {
            // Official / Developer / Member login - disable demo countdown
            demoState.logoutDemo();
            const newAcc: ActiveAccountInfo = {
              name: userData?.name || 'Teman LEGA',
              email: userData?.email || 'user@lega.id',
              role: userData?.role || 'DEVELOPER',
              plan: userData?.plan || 'LIFETIME',
              isDemo: false,
              status: 'ACTIVE'
            };
            setActiveAccount(newAcc);
            saveStoredActiveAccount(newAcc);
          }

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

  // Suspended Account Blocker Screen
  if (isAccountSuspended) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-950 flex items-center justify-center p-4 font-sans text-stone-100">
        <div className="w-full max-w-md bg-stone-900 border border-rose-800/80 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-700/80 flex items-center justify-center text-rose-400 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold uppercase tracking-wider">
              STATUS AKUN: DINONAKTIFKAN / DISUSPEND
            </span>
            <h3 className="text-lg font-bold text-white pt-1">
              Akses Akun Ditangguhkan
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {suspensionReason || 'Akun ini telah dinonaktifkan atau ditangguhkan oleh Administrator SHAQILA DIGITAL 99.'}
            </p>
          </div>
          <div className="pt-3 border-t border-stone-800 flex flex-col gap-2">
            <button
              onClick={handleLogoutAll}
              className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl border border-stone-700 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 text-stone-400" />
              <span>Keluar & Kembali ke Halaman Utama</span>
            </button>
            <p className="text-[11px] text-stone-500">
              Hubungi Administrator untuk mengaktifkan kembali akun Anda.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 4. MAIN CORE APPLICATION
  return (
    <div className="flex h-screen bg-stone-950 font-sans text-stone-100 overflow-hidden antialiased">
      {/* 24-Hour Expiration Blocker */}
      {demoState.isExpired && (!activeAccount || activeAccount.isDemo) && (
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
        onLogout={handleLogoutAll}
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

        {/* Top Account & Demo Notification Status Bar */}
        <DemoBanner
          demoState={demoState}
          activeAccount={activeAccount}
          onOpenModal={() => setIsDemoModalOpen(true)}
          onSelectModule={(mod) => setCurrentModule(mod)}
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
          onLogout={handleLogoutAll}
          isCloudSynced={isCloudSynced}
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

export default function App() {
  return (
    <FirebaseProvider>
      <AppContent />
    </FirebaseProvider>
  );
}
