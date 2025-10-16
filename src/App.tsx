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
  const [notificationStatus, setNotificationStatus] = useState<string>('default');
  const { activities, loading, addActivity, autoSync, isSyncing } = useIndexedDB();
  
  // Usar el hook con callback para sincronización automática
  const isOnline = useConnectionStatus(async () => {
    console.log('🔄 App: Conexión restaurada, iniciando sincronización...');
    await autoSync();
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };
    
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Inicializar estado de notificaciones
    setNotificationStatus(pushManager.getPermissionStatus());

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido al instalar');
        console.error('Error installing app:', error);
      }
    }
  };

  const handleTestNotification = async () => {
    try {
      if (notificationStatus !== 'granted') {
        const success = await pushManager.init();
        setNotificationStatus(success ? 'granted' : 'denied');
        
        if (!success) {
          alert('Para recibir notificaciones, necesitas permitirlos en tu navegador.');
          return;
        }
      }
      
      await pushManager.sendTestNotification();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido al enviar notificación');
      console.error('Error sending notification:', error);
      alert('Error al enviar notificación: ' + error.message);
    }
  };

  const handleActivityAdded = async (activity: {
    name: string;
    description: string;
    date: string;
    time: number;
  }) => {
    try {
      const success = await addActivity(activity);
      if (success && notificationStatus === 'granted') {
        await pushManager.sendActivityNotification(activity.name);
      }
      return success;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido al agregar actividad');
      console.error('Error adding activity:', error);
      return false;
    }
  };

  // Función para forzar sincronización manual (por si acaso)
  const handleForceSync = async () => {
    if (isOnline) {
      await autoSync();
    }
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
            {isSyncing && <div className="syncing-indicator">🔄 Sincronizando...</div>}
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
              🔔 {notificationStatus === 'granted' ? 'Probar Notificación' : 'Activar Notificaciones'}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="form-container">
          <div className="section-header">
            <h2>Nueva actividad</h2>
          </div>
          <div className="section-content">
            <OfflineForm onActivityAdded={handleActivityAdded} />
          </div>
        </div>

        <div className="activities-container">
          <div className="section-header">
            <h2>Actividades guardadas ({activities.length})</h2>
            {!isOnline && activities.some(a => !a.synced) && (
              <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>
                {activities.filter(a => !a.synced).length} pendientes - Se sincronizarán automáticamente
              </div>
            )}
            {isOnline && activities.some(a => !a.synced) && !isSyncing && (
              <div 
                style={{ 
                  fontSize: '0.8rem', 
                  opacity: 0.8, 
                  marginTop: '0.5rem',
                  color: '#27ae60',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
                onClick={handleForceSync}
                title="Haz clic para sincronizar ahora"
              >
                {activities.filter(a => !a.synced).length} pendientes - Haz clic para sincronizar
              </div>
            )}
          </div>
          <div className="section-content">
            <ActivityList
              activities={activities}
              loading={loading}
              isOnline={isOnline}
            />
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Progressive Web App con React + Vite</p>
        {notificationStatus === 'granted' && <small>🔔 Notificaciones activas</small>}
        {!isOnline && <small>🌐 Modo offline - Sincronización automática cuando haya conexión</small>}
        {isOnline && activities.some(a => !a.synced) && <small>🔄 Sincronización automática activa</small>}
      </footer>
    </div>
  );
}

export default App;