import React from 'react';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import './ConnectionStatus.css';

export const ConnectionStatus: React.FC = () => {
  const isOnline = useConnectionStatus();

  return (
    <div className={`connection-status ${isOnline ? 'online' : 'offline'}`}>
      <span className="status-indicator"></span>
      {isOnline ? 'Conectado' : 'Sin conexión'}
    </div>
  );
};