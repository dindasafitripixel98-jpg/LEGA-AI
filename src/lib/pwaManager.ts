/**
 * LEGA - PWA Manager & Offline Detection
 * Platform Kesadaran Diri & Emosi AI Indonesia
 * SHAQILA DIGITAL 99
 */

import { useState, useEffect, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PwaState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  isIos: boolean;
  isSupported: boolean;
  storageEstimate: { usageMB: number; quotaMB: number } | null;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const installListeners = new Set<(prompt: BeforeInstallPromptEvent | null) => void>();

// Register global listener for beforeinstallprompt
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    installListeners.forEach((fn) => fn(deferredPrompt));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installListeners.forEach((fn) => fn(null));
    console.log('[PWA] LEGA installed successfully');
  });
}

export function registerServiceWorker(onUpdateFound?: () => void) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('[PWA] ServiceWorker registration successful with scope: ', registration.scope);

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New version available for LEGA');
              if (onUpdateFound) onUpdateFound();
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[PWA] ServiceWorker registration failed: ', err);
      });
  });
}

export function usePwa() {
  const [isInstallable, setIsInstallable] = useState<boolean>(Boolean(deferredPrompt));
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState<boolean>(false);
  const [storageEstimate, setStorageEstimate] = useState<{ usageMB: number; quotaMB: number } | null>(null);

  const isIos = typeof window !== 'undefined' && /iphone|ipad|ipod/i.test(window.navigator.userAgent);
  const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;

  // Detect standalone mode
  const checkStandalone = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const isStandaloneWindow = window.matchMedia('(display-mode: standalone)').matches;
    const isIosStandalone = (window.navigator as any).standalone === true;
    return isStandaloneWindow || isIosStandalone;
  }, []);

  const refreshStorageEstimate = useCallback(async () => {
    if (typeof navigator !== 'undefined' && 'storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const est = await navigator.storage.estimate();
        const usageMB = est.usage ? Math.round((est.usage / (1024 * 1024)) * 10) / 10 : 0;
        const quotaMB = est.quota ? Math.round((est.quota / (1024 * 1024)) * 10) / 10 : 0;
        setStorageEstimate({ usageMB, quotaMB });
      } catch {
        // Storage estimate not supported or denied
      }
    }
  }, []);

  useEffect(() => {
    setIsInstalled(checkStandalone());
    refreshStorageEstimate();

    const handlePromptChange = (prompt: BeforeInstallPromptEvent | null) => {
      setIsInstallable(Boolean(prompt));
    };
    installListeners.add(handlePromptChange);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register service worker with update hook
    registerServiceWorker(() => {
      setIsUpdateAvailable(true);
    });

    return () => {
      installListeners.delete(handlePromptChange);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkStandalone, refreshStorageEstimate]);

  const triggerInstall = async (): Promise<'accepted' | 'dismissed' | 'unsupported'> => {
    if (!deferredPrompt) {
      return 'unsupported';
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        deferredPrompt = null;
        setIsInstallable(false);
        setIsInstalled(true);
      }
      return choice.outcome;
    } catch (err) {
      console.warn('[PWA] Error during prompt:', err);
      return 'unsupported';
    }
  };

  const applyUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const clearPwaCache = async () => {
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await refreshStorageEstimate();
      console.log('[PWA] All caches cleared');
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    isIos,
    isSupported,
    storageEstimate,
    triggerInstall,
    applyUpdate,
    clearPwaCache,
    refreshStorageEstimate,
  };
}
