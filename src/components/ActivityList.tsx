import React from 'react';
import type { Activity } from '../utils/types';
import './ActivityList.css';

interface ActivityListProps {
  activities: Activity[];
  loading: boolean;
  onSync: () => void;
  isOnline: boolean;
}

export const ActivityList: React.FC<ActivityListProps> = ({
  activities,
  loading,
  onSync,
  isOnline,
}) => {
  const pendingCount = activities.filter(activity => !activity.synced).length;

  if (loading) {
    return <div className="loading">Cargando actividades...</div>;
  }

  return (
    <div className="activities-section">
      <div className="activities-header">
        <h2>Actividades Guardadas</h2>
        {!isOnline && pendingCount > 0 && (
          <button className="sync-button" onClick={onSync}>
            Sincronizar ({pendingCount} pendientes)
          </button>
        )}
      </div>

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
                  <strong> Tiempo:</strong> {activity.time} horas |
                  <strong> Estado:</strong> {activity.synced ? 'Sincronizado' : 'Pendiente'}
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