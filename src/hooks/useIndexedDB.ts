import { useCallback, useEffect, useState } from 'react';
import { activityDB } from '../services/indexedDB';
import { Activity } from '../utils/types';

export const useIndexedDB = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const loadActivities = async () => {
    try {
      const data = await activityDB.getAllActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoSync = useCallback(async (): Promise<boolean> => {
    if (!navigator.onLine || isSyncing) {
      return false;
    }

    try {
      setIsSyncing(true);
      const pendingActivities = await activityDB.getPendingSync();
      
      if (pendingActivities.length === 0) {
        return true;
      }

      console.log(`Sincronizando ${pendingActivities.length} actividades...`);
      
      for (const activity of pendingActivities) {
        console.log('Sincronizando actividad:', activity.name);
        
        // Simular envío al servidor
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Marcar como sincronizado
        await activityDB.markAsSynced(activity.id!);
        console.log('✅ Actividad sincronizada:', activity.name);
      }
      
      await loadActivities();
      console.log('Sincronización completada');
      return true;
    } catch (error) {
      console.error('Error en sincronización automática:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]); // isSyncing como dependencia

  const addActivity = async (activity: Omit<Activity, 'id' | 'timestamp' | 'synced'>) => {
    try {
      await activityDB.addActivity(activity);
      await loadActivities();
      
      // Intentar sincronizar automáticamente si hay conexión
      if (navigator.onLine) {
        await autoSync();
      }
      
      return true;
    } catch (error) {
      console.error('Error adding activity:', error);
      return false;
    }
  };

  // Sincronizar automáticamente cuando hay conexión
  useEffect(() => {
    const syncIfNeeded = async () => {
      if (navigator.onLine && !isSyncing) {
        try {
          const pendingActivities = await activityDB.getPendingSync();
          if (pendingActivities.length > 0) {
            console.log('Conexión detectada, sincronizando...');
            await autoSync();
          }
        } catch (error) {
          console.error('Error al verificar actividades pendientes:', error);
        }
      }
    };

    syncIfNeeded();

    const handleOnline = () => {
      console.log('Conexión restaurada, iniciando sincronización...');
      syncIfNeeded();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [autoSync, isSyncing]); // Agregar las dependencias requeridas

  // Cargar actividades al inicializar
  useEffect(() => {
    loadActivities();
  }, []);

  return {
    activities,
    loading,
    addActivity,
    autoSync,
    isSyncing,
    refreshActivities: loadActivities,
  };
};