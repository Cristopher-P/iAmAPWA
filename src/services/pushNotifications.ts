export class PushManager {
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'Notification' in window;
  }

  // Verificar si las notificaciones están soportadas
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  // Verificar permiso actual
  getPermissionStatus(): string {
    return Notification.permission;
  }

  // Inicializar notificaciones
  async init(): Promise<boolean> {
    if (!this.isSupported) {
      return false;
    }

    try {
      // Si no hay permiso, solicitarlo
      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }

      return Notification.permission === 'granted';
    } catch (error) {
      console.error('Error initializing notifications:', error);
      return false;
    }
  }

  // Enviar notificación de prueba
  async sendTestNotification(): Promise<void> {
    if (!this.isSupported) {
      throw new Error('Las notificaciones no están soportadas en este navegador');
    }

    const permission = this.getPermissionStatus();
    
    if (permission === 'default') {
      const newPermission = await Notification.requestPermission();
      if (newPermission !== 'granted') {
        throw new Error('Permiso de notificación denegado');
      }
    } else if (permission !== 'granted') {
      throw new Error('Permiso de notificación denegado');
    }

    try {
      // Usar Service Worker para notificaciones
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('¡Prueba de iAmAPWA! 🚀', {
        body: 'Esta es una notificación push de prueba. ¡Tu PWA funciona correctamente!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        tag: 'test-notification',
        requireInteraction: true
      });
    } catch (error) {
      console.error('Error with service worker notification, using fallback:', error);
      // Fallback a Notification API
      const notification = new Notification('¡Prueba de iAmAPWA! 🚀', {
        body: 'Esta es una notificación push de prueba. ¡Tu PWA funciona correctamente!',
        icon: '/icons/icon-192.png'
      });

      setTimeout(() => {
        notification.close();
      }, 5000);
    }
  }

  // Enviar notificación de actividad
  async sendActivityNotification(activityName: string): Promise<void> {
    if (!this.isSupported || this.getPermissionStatus() !== 'granted') {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('📝 Actividad Guardada', {
        body: `Nueva actividad: "${activityName}"`,
        icon: '/icons/icon-192.png',
        tag: 'activity-notification'
      });
    } catch (error) {
      console.error('Error sending activity notification:', error);
      // Fallback
      const notification = new Notification('📝 Actividad Guardada', {
        body: `Nueva actividad: "${activityName}"`,
        icon: '/icons/icon-192.png'
      });

      setTimeout(() => {
        notification.close();
      }, 4000);
    }
  }
}

export const pushManager = new PushManager();