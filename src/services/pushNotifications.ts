export class PushManager {
  private publicVapidKey = 'BAxbB7w...'; // Reemplaza con tu clave VAPID

  async init(): Promise<PushSubscription | null> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // Verificar suscripción existente
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
          subscription = await this.subscribe(registration);
        }
        
        return subscription;
      } catch (error) {
        console.error('Error inicializando Push Manager:', error);
      }
    }
    return null;
  }

  async subscribe(registration: ServiceWorkerRegistration): Promise<PushSubscription> {
    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.publicVapidKey)
      });
      
      console.log('Suscripción Push creada:', subscription);
      return subscription;
    } catch (error) {
      console.error('Error suscribiéndose a push:', error);
      throw error;
    }
  }

  async sendTestNotification() {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Prueba de iAmAPWA', {
        body: '¡Esta es una notificación push de prueba!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        // vibrate: [200, 100, 200], // Removed because it's not part of NotificationOptions type
        tag: 'test-notification'
      });
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushManager = new PushManager();