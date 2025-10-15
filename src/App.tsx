import { useEffect, useState } from "react";
import "./App.css";
import { ActivityList } from './components/ActivityList';
import { ConnectionStatus } from './components/ConnectionStatus';
import { OfflineForm } from './components/OfflineForm';
import { useConnectionStatus } from './hooks/useConnectionStatus';
import { useIndexedDB } from './hooks/useIndexedDB';
import { pushManager } from './services/pushNotifications';
import appIcon from "/icons/icon-192.png";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { activities, loading, addActivity, syncActivities } = useIndexedDB();
  const isOnline = useConnectionStatus();

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    
    window.addEventListener("beforeinstallprompt", handler as EventListener);
    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    // Inicializar notificaciones push
    pushManager.init();

    return () => {
      window.removeEventListener("beforeinstallprompt", handler as EventListener);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleTestNotification = async () => {
    try {
      await pushManager.sendTestNotification();
    } catch (error) {
      console.error('Error enviando notificación:', error);
      alert('Error al enviar notificación. Asegúrate de haber permitido las notificaciones.');
    }
  };

  const handleActivityAdded = async (activity: {
    name: string;
    description: string;
    date: string;
    time: number;
  }) => {
    const success = await addActivity(activity);
    if (success) {
      // Enviar notificación cuando se guarda una actividad
      pushManager.sendActivityNotification(activity.name);
    }
    return success;
  };

  const handleSync = async () => {
    await syncActivities();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img src={appIcon} className="logo" alt="App logo" />
            <div className="header-text">
              <h1>iAmAPWA</h1>
              <p>Informe de actividades del alumno</p>
            </div>
          </div>
          <div className="header-controls">
            <ConnectionStatus />
            {isInstallable && (
              <button 
                className="install-button" 
                onClick={handleInstallClick}
              >
                📲 Descargar Página
              </button>
            )}
            <button 
              className="notification-button" 
              onClick={handleTestNotification}
            >
              🔔 Probar Notificación
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Formulario */}
        <div className="form-container">
          <div className="section-header">
            <h2>Nueva actividad</h2>
          </div>
          <div className="section-content">
            <OfflineForm onActivityAdded={handleActivityAdded} />
          </div>
        </div>

        {/* Lista de actividades */}
        <div className="activities-container">
          <div className="section-header">
            <h2>Actividades guardadas ({activities.length})</h2>
          </div>
          <div className="section-content">
            <ActivityList
              activities={activities}
              loading={loading}
              onSync={handleSync}
              isOnline={isOnline}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Progressive Web App con React + Vite</p>
      </footer>
    </div>
  );
}

export default App;