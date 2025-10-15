export class PushManager {
  async init(): Promise<PushSubscription | null> {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        
        // Verificar si ya tenemos permiso
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            console.log('Permiso de notificación denegado');
            return null;
          }
        }

        // Verificar suscripción existente
        let subscription = await registration.pushManager.getSubscription();
        
        if (!subscription) {
          // En un entorno real, aquí usarías tus claves VAPID
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: this.urlBase64ToUint8Array(this.getPublicKey())
          });
        }
        
        console.log('Push Manager inicializado:', subscription);
        return subscription;
      } catch (error) {
        console.error('Error inicializando Push Manager:', error);
      }
    }
    return null;
  }

  async sendTestNotification(): Promise<void> {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      throw new Error('Las notificaciones push no son soportadas en este navegador');
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permiso de notificación denegado por el usuario');
      }
    }

    const registration = await navigator.serviceWorker.ready;
    
    // Opciones de notificación con tipo correcto
    const options = {
      body: 'Esta es una notificación push de prueba. ¡Tu PWA funciona correctamente!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      tag: 'test-notification',
      requireInteraction: true,
      actions: [
        {
          action: 'view',
          title: 'Ver Actividades'
        },
        {
          action: 'close',
          title: 'Cerrar'
        }
      ],
      data: {
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    } as NotificationOptions & { actions?: Array<{ action: string; title: string }> };

    await registration.showNotification('¡Prueba de iAmAPWA! 🚀', options);
  }

  async sendActivityNotification(activityName: string): Promise<void> {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      return;
    }

    if (Notification.permission !== 'granted') {
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    
    const options: NotificationOptions = {
      body: `Nueva actividad guardada: ${activityName}`,
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-72.png',
      tag: 'activity-notification',
      data: {
        url: window.location.href,
        type: 'activity'
      }
    };

    await registration.showNotification('📝 Actividad Guardada', options);
  }

  private getPublicKey(): string {
    // Clave VAPID pública de prueba - En producción usa tus propias claves
    return 'BAxbB7w1g6L4cXk3V2Q8m9nJ5tR7yU0iH1aF4dG2sS5hE9zW3vC6pX8oM7lK0jN4rT1eB5qY9uI2fA3c';
  }

  private urlBase64ToUint8Array(base64String: string): BufferSource {
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