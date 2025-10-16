import React from 'react';
import { Activity } from '../utils/types';
import './ActivityList.css';

interface ActivityListProps {
  activities: Activity[];
  loading: boolean;
  isOnline: boolean;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  loading,
  isOnline,
}) => {
  const pendingCount = activities.filter(activity => !activity.synced).length;

  if (loading) {
    return <div className="loading">Cargando actividades...</div>;
  }

  return (
    <div className="activities-content">
      {!isOnline && pendingCount > 0 && (
        <div className="sync-message">
          ⚡ {pendingCount} actividad(es) se sincronizarán automáticamente cuando recuperes la conexión
        </div>
      )}

      {activities.length === 0 ? (
        <p className="no-activities">No hay actividades guardadas.</p>
      ) : (
        <div className="activities-list">
          {activities
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(activity => (
              <div
                key={activity.id}
                className={`activity-item ${activity.synced ? '' : 'pending'}`}
              >
                <h3>{activity.name}</h3>
                <div className="activity-meta">
                  <strong>Fecha:</strong> {activity.date} | 
                  <strong> Tiempo:</strong> {activity.time} hora(s) |
                  <strong> Estado:</strong> {activity.synced ? '✅ Sincronizado' : '⏳ Pendiente'}
                </div>
                <p>{activity.description}</p>
                <small>
                  Guardado: {new Date(activity.timestamp).toLocaleString()}
                </small>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};