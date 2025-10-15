export interface Activity {
  id?: number;
  name: string;
  description: string;
  date: string;
  time: number;
  timestamp: number;
  synced: boolean;
}

// Tipos para eventos PWA
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Extender Window interface
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}