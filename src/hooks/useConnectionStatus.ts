import { useEffect, useState } from 'react';

export const useConnectionStatus = (onOnline?: () => Promise<void> | void) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = async () => {
      console.log('✅ Conexión restaurada');
      setIsOnline(true);
      if (onOnline) {
        try {
          await onOnline(); // Ejecutar callback cuando vuelve la conexión
        } catch (error) {
          console.error('Error en callback online:', error);
        }
      }
    };
    
    const handleOffline = () => {
      console.log('❌ Sin conexión');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onOnline]);

  return isOnline;
};