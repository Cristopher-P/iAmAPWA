import { useEffect, useState } from 'react';
import { activityDB } from '../services/indexedDB';
import type { Activity } from '../utils/types';

export const useIndexedDB = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityDB.getAllActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id' | 'timestamp' | 'synced'>) => {
    try {
      await activityDB.addActivity(activity);
      await loadActivities(); // Recargar la lista
      return true;
    } catch (error) {
      console.error('Error adding activity:', error);
      return false;
    }
  };

  const syncActivities = async () => {
    try {
      const pendingActivities = await activityDB.getPendingSync();
      
      // Simular envío al servidor
      for (const activity of pendingActivities) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay
        console.log('Sincronizando actividad:', activity);
        await activityDB.markAsSynced(activity.id!);
      }
      
      await loadActivities();
      return true;
    } catch (error) {
      console.error('Error syncing activities:', error);
      return false;
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  return {
    activities,
    loading,
    addActivity,
    syncActivities,
    refreshActivities: loadActivities,
  };
};