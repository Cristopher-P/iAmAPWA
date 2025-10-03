import { useEffect, useState } from "react";
import "./App.css";
import appIcon from "/icons/icon-192.png";

function App() {
  const [count, setCount] = useState(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Escucha el evento de instalación PWA
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log("User choice:", choiceResult.outcome);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="app-container">
      <header>
        <img src={appIcon} className="logo" alt="App logo" />
        <h1>iAmAPWA 🚀</h1>
      </header>

      <main>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            Contador: {count}
          </button>
          <p>
            Edita <code>src/App.tsx</code> y guarda para probar HMR 
          </p>
        </div>

        {/* Botón para instalar la PWA */}
        <div className="card">
          <button onClick={handleInstallClick} disabled={!deferredPrompt}>
            Descargar Página
          </button>
        </div>
      </main>

      <footer>
        <p>Progressive Web App con React + Vite</p>
      </footer>
    </div>
  );
}

export default App;
