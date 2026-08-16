/**
 * Firebase Integration for LEGA SHAQILA DIGITAL 99
 * Persistent Firestore Database & Firebase Auth
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, EmotionLog, JournalEntry } from '../types';

// Operation types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with firestoreDatabaseId
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Standard Firestore Error Handler conforming to system specification
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentAuthUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentAuthUser?.uid,
      email: currentAuthUser?.email,
      emailVerified: currentAuthUser?.emailVerified,
      isAnonymous: currentAuthUser?.isAnonymous,
      tenantId: currentAuthUser?.tenantId,
      providerInfo: currentAuthUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  console.error('Firestore Error:', JSON.stringify(errInfo, null, 2));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Test Connection to Firestore on Boot
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('✅ Firebase Firestore connected successfully to database:', firebaseConfig.firestoreDatabaseId);
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('⚠️ Firebase client is offline or network is limited.');
    } else {
      console.info('Firebase connection test check completed.');
    }
    return false;
  }
}

// Trigger initial connection test
testFirestoreConnection();

/**
 * Sign In with Google Popup
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  }
}

/**
 * Sign Out
 */
export async function logOutFirebase() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase Signout Error:', error);
  }
}

// ----------------------------------------------------------------------
// FIRESTORE SYNC & DATA OPERATIONS
// ----------------------------------------------------------------------

/**
 * Save / Update User Profile in Firestore
 */
export async function saveUserProfileToFirestore(userId: string, profile: UserProfile): Promise<void> {
  const path = `users/${userId}`;
  try {
    await setDoc(doc(db, 'users', userId), {
      userId,
      name: profile.name || 'Teman LEGA',
      email: profile.email || '',
      avatar: profile.avatar || 'lotus',
      bio: profile.bio || '',
      reflectionGoal: profile.reflectionGoal || '',
      preferredTone: profile.preferredTone || 'tenang',
      preferredVoice: profile.preferredVoice || 'Noiz Rina',
      primaryEmotionFocus: profile.primaryEmotionFocus || 'overthinking',
      dailyReminderTime: profile.dailyReminderTime || '21:00',
      enableSoundscapes: profile.enableSoundscapes ?? true,
      streakDays: profile.streakDays || 0,
      totalReflections: profile.totalReflections || 0,
      registeredDate: profile.registeredDate || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Save Emotion Log to Firestore
 */
export async function saveEmotionLogToFirestore(userId: string, log: EmotionLog): Promise<void> {
  const safeId = log.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/emotion_logs/${safeId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'emotion_logs', safeId), {
      ...log,
      id: safeId,
      userId,
      timestamp: log.timestamp || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Save Journal Entry to Firestore
 */
export async function saveJournalEntryToFirestore(userId: string, journal: JournalEntry): Promise<void> {
  const safeId = journal.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/journals/${safeId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'journals', safeId), {
      ...journal,
      id: safeId,
      userId,
      date: journal.date || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Delete Journal Entry from Firestore
 */
export async function deleteJournalEntryFromFirestore(userId: string, journalId: string): Promise<void> {
  const safeId = journalId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/journals/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'journals', safeId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

/**
 * Record Audio Session History in Firestore
 */
export async function recordAudioSessionToFirestore(
  userId: string,
  session: { id?: string; title: string; category: string; durationSeconds?: number }
): Promise<void> {
  const sessionId = session.id || `session_${Date.now()}`;
  const safeId = sessionId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `users/${userId}/audio_sessions/${safeId}`;
  try {
    await setDoc(doc(db, 'users', userId, 'audio_sessions', safeId), {
      id: safeId,
      userId,
      title: session.title,
      category: session.category,
      durationSeconds: session.durationSeconds || 0,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
