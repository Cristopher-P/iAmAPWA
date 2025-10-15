import { useEffect, useState } from "react";
import "./App.css";
import { ActivityList } from './components/ActivityList';
import { ConnectionStatus } from './components/ConnectionStatus';
import { OfflineForm } from './components/OfflineForm';
import { useConnectionStatus } from './hooks/useConnectionStatus';
import { useIndexedDB } from './hooks/useIndexedDB';
import appIcon from "/icons/icon-192.png";

// Tipos para BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { activities, loading, addActivity, syncActivities } = useIndexedDB();
  const isOnline = useConnectionStatus();

  // Escucha el evento de instalación PWA
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    
    window.addEventListener("beforeinstallprompt", handler as EventListener);

    return () => window.removeEventListener("beforeinstallprompt", handler as EventListener);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log("User choice:", choiceResult.outcome);
      setDeferredPrompt(null);
    }
  };

  const handleActivityAdded = async (activity: {
    name: string;
    description: string;
    date: string;
    time: number;
  }) => {
    return await addActivity(activity);
  };

  const handleSync = async () => {
    await syncActivities();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <img src={appIcon} className="logo" alt="App logo" />
          <div className="header-text">
            <h1>iAmAPWA 🚀</h1>
            <p>Reporte de Actividades del Alumno</p>
          </div>
        </div>
        <div className="header-controls">
          <ConnectionStatus />
          {deferredPrompt && (
            <button 
              className="install-button" 
              onClick={handleInstallClick}
            >
              📲 Instalar App
            </button>
          )}
        </div>
      </header>

      <main className="app-main">
        {/* Sección del formulario */}
        <section className="form-section">
          <OfflineForm onActivityAdded={handleActivityAdded} />
        </section>

        {/* Sección de actividades */}
        <section className="activities-section">
          <ActivityList
            activities={activities}
            loading={loading}
            onSync={handleSync}
            isOnline={isOnline}
          />
        </section>

        {/* Información PWA */}
        <section className="pwa-info">
          <div className="card">
            <h3>✨ Funcionalidades PWA Implementadas</h3>
            <ul>
              <li>✅ Formulario offline con IndexedDB</li>
              <li>✅ Sincronización en segundo plano</li>
              <li>✅ Estrategias de cache avanzadas</li>
              <li>✅ Detección de conexión</li>
              <li>✅ Instalación como app nativa</li>
              <li>✅ Service Worker registrado</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Progressive Web App con React + Vite + TypeScript</p>
        <small>Modo: {isOnline ? 'En línea' : 'Offline'}</small>
      </footer>
    </div>
  );
}

export default App;