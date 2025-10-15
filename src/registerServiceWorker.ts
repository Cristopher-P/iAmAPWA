export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      
      console.log('Service Worker registrado correctamente:', registration);
      
      // Solicitar permiso para notificaciones
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      
      return registration;
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
      return null;
    }
  }
  return null;
};