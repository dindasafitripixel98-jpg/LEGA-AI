/**
 * Firebase Context & Realtime Sync Provider
 * LEGA SHAQILA DIGITAL 99
 */

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import {
  auth,
  db,
  signInWithGoogle as fbSignInWithGoogle,
  logOutFirebase as fbLogOut,
  saveUserProfileToFirestore,
  saveEmotionLogToFirestore,
  saveJournalEntryToFirestore,
  deleteJournalEntryFromFirestore,
  recordAudioSessionToFirestore,
  handleFirestoreError,
  OperationType,
  testFirestoreConnection
} from '../lib/firebase';
import { UserProfile, EmotionLog, JournalEntry } from '../types';
import { INITIAL_EMOTION_LOGS, INITIAL_JOURNALS } from '../data/initialData';

interface FirebaseContextType {
  currentUser: User | null;
  isAuthLoading: boolean;
  isFirestoreConnected: boolean;
  isCloudSynced: boolean;
  signInWithGoogle: () => Promise<User | null>;
  logOut: () => Promise<void>;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  emotionLogs: EmotionLog[];
  setEmotionLogs: React.Dispatch<React.SetStateAction<EmotionLog[]>>;
  journals: JournalEntry[];
  setJournals: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  saveEmotionLog: (log: EmotionLog) => Promise<void>;
  addJournal: (entry: JournalEntry) => Promise<void>;
  deleteJournal: (id: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  recordAudioPlay: (title: string, category: string, durationSeconds?: number) => Promise<void>;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Teman LEGA',
  email: 'teman@lega.app',
  avatar: 'lotus',
  bio: 'Menemukan keheningan di tengah riuh dunia, menyayangi diri seutuhnya.',
  reflectionGoal: 'Mengenal diri lebih dalam, mengelola cemas kerja, dan membangun ketenangan batin.',
  preferredTone: 'tenang',
  preferredVoice: 'Noiz Rina',
  primaryEmotionFocus: 'overthinking',
  dailyReminderTime: '21:00',
  enableSoundscapes: true,
  streakDays: 4,
  totalReflections: 12,
  registeredDate: new Date().toISOString().split('T')[0],
};

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(false);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Core App States
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lega_user_profile');
        if (stored) return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
      } catch (e) {
        console.warn('Profile parse warn:', e);
      }
    }
    return DEFAULT_PROFILE;
  });

  const [emotionLogs, setEmotionLogs] = useState<EmotionLog[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lega_emotion_logs');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Emotion logs parse warn:', e);
      }
    }
    return INITIAL_EMOTION_LOGS;
  });

  const [journals, setJournals] = useState<JournalEntry[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('lega_journals');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.warn('Journals parse warn:', e);
      }
    }
    return INITIAL_JOURNALS;
  });

  // Local storage sync backup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lega_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lega_emotion_logs', JSON.stringify(emotionLogs));
    }
  }, [emotionLogs]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lega_journals', JSON.stringify(journals));
    }
  }, [journals]);

  // Check initial connection
  useEffect(() => {
    testFirestoreConnection().then((connected) => {
      setIsFirestoreConnected(connected);
    });
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        // Update user profile info from Auth
        setUserProfile((prev) => ({
          ...prev,
          name: user.displayName || prev.name || 'Teman LEGA',
          email: user.email || prev.email || '',
          avatar: prev.avatar || 'lotus'
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Realtime Firestore Sync when User is Authenticated
  useEffect(() => {
    if (!currentUser) {
      setIsCloudSynced(false);
      return;
    }

    const userId = currentUser.uid;
    let unsubProfile = () => {};
    let unsubEmotions = () => {};
    let unsubJournals = () => {};

    try {
      // 1. Sync Profile
      const profileDocRef = doc(db, 'users', userId);
      unsubProfile = onSnapshot(
        profileDocRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserProfile((prev) => ({
              ...prev,
              ...data,
              userId
            } as UserProfile));
            setIsCloudSynced(true);
          } else {
            // First time user: save initial profile to Firestore
            saveUserProfileToFirestore(userId, {
              ...userProfile,
              name: currentUser.displayName || userProfile.name,
              email: currentUser.email || userProfile.email
            }).catch(console.warn);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${userId}`);
        }
      );

      // 2. Sync Emotion Logs
      const emotionsColRef = collection(db, 'users', userId, 'emotion_logs');
      unsubEmotions = onSnapshot(
        emotionsColRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const logs: EmotionLog[] = [];
            snapshot.forEach((docSnap) => {
              logs.push(docSnap.data() as EmotionLog);
            });
            // Sort by timestamp desc
            logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setEmotionLogs(logs);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${userId}/emotion_logs`);
        }
      );

      // 3. Sync Journals
      const journalsColRef = collection(db, 'users', userId, 'journals');
      unsubJournals = onSnapshot(
        journalsColRef,
        (snapshot) => {
          if (!snapshot.empty) {
            const list: JournalEntry[] = [];
            snapshot.forEach((docSnap) => {
              list.push(docSnap.data() as JournalEntry);
            });
            list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setJournals(list);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${userId}/journals`);
        }
      );
    } catch (err) {
      console.warn('Realtime sync setup note:', err);
    }

    return () => {
      unsubProfile();
      unsubEmotions();
      unsubJournals();
    };
  }, [currentUser]);

  // Auth Functions
  const signInWithGoogle = async () => {
    try {
      const user = await fbSignInWithGoogle();
      if (user) {
        const initialProf: UserProfile = {
          ...userProfile,
          name: user.displayName || userProfile.name,
          email: user.email || userProfile.email
        };
        setUserProfile(initialProf);
        await saveUserProfileToFirestore(user.uid, initialProf);
      }
      return user;
    } catch (error) {
      console.error('Google Sign In failed:', error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await fbLogOut();
      setCurrentUser(null);
      setIsCloudSynced(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Data Mutation Handlers (Local Optimistic + Firestore Persistence)
  const saveEmotionLog = async (log: EmotionLog) => {
    setEmotionLogs((prev) => [log, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      totalReflections: prev.totalReflections + 1
    }));

    if (currentUser) {
      try {
        await saveEmotionLogToFirestore(currentUser.uid, log);
        await saveUserProfileToFirestore(currentUser.uid, {
          ...userProfile,
          totalReflections: userProfile.totalReflections + 1
        });
      } catch (err) {
        console.warn('Failed to save emotion log to Firestore:', err);
      }
    }
  };

  const addJournal = async (entry: JournalEntry) => {
    setJournals((prev) => [entry, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      totalReflections: prev.totalReflections + 1
    }));

    if (currentUser) {
      try {
        await saveJournalEntryToFirestore(currentUser.uid, entry);
        await saveUserProfileToFirestore(currentUser.uid, {
          ...userProfile,
          totalReflections: userProfile.totalReflections + 1
        });
      } catch (err) {
        console.warn('Failed to save journal to Firestore:', err);
      }
    }
  };

  const deleteJournal = async (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
    if (currentUser) {
      try {
        await deleteJournalEntryFromFirestore(currentUser.uid, id);
      } catch (err) {
        console.warn('Failed to delete journal from Firestore:', err);
      }
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    if (currentUser) {
      try {
        await saveUserProfileToFirestore(currentUser.uid, updated);
      } catch (err) {
        console.warn('Failed to update profile in Firestore:', err);
      }
    }
  };

  const recordAudioPlay = async (title: string, category: string, durationSeconds?: number) => {
    if (currentUser) {
      try {
        await recordAudioSessionToFirestore(currentUser.uid, { title, category, durationSeconds });
      } catch (err) {
        console.warn('Failed to record audio session:', err);
      }
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        currentUser,
        isAuthLoading,
        isFirestoreConnected,
        isCloudSynced,
        signInWithGoogle,
        logOut,
        userProfile,
        setUserProfile,
        emotionLogs,
        setEmotionLogs,
        journals,
        setJournals,
        saveEmotionLog,
        addJournal,
        deleteJournal,
        updateProfile,
        recordAudioPlay
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
