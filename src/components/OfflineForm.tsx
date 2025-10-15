import React, { useState } from 'react';
import { useConnectionStatus } from '../hooks/useConnectionStatus';
import './OfflineForm.css';

interface OfflineFormProps {
  onActivityAdded: (activity: {
    name: string;
    description: string;
    date: string;
    time: number;
  }) => Promise<boolean>;
}

export const OfflineForm: React.FC<OfflineFormProps> = ({ onActivityAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: 0.5,
  });
  const [submitting, setSubmitting] = useState(false);
  const isOnline = useConnectionStatus();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const success = await onActivityAdded(formData);
      if (success) {
        setFormData({ name: '', description: '', date: '', time: 0.5 });
        alert(`Actividad guardada ${isOnline ? 'y sincronizada' : 'en modo offline'}`);
      } else {
        alert('Error guardando la actividad');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error guardando la actividad');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'time' ? parseFloat(value) : value,
    }));
  };

  return (
    <div className="form-section">
      <h2>Nueva Actividad</h2>
      {!isOnline && (
        <div className="offline-message">
          ⚠️ Modo offline - Las actividades se guardarán localmente
        </div>
      )}
      <form onSubmit={handleSubmit} className="activity-form">
        <div className="form-group">
          <label htmlFor="name">Nombre de la actividad:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Fecha:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="time">Tiempo dedicado (horas):</label>
          <input
            type="number"
            id="time"
            name="time"
            min="0.5"
            step="0.5"
            value={formData.time}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : 'Guardar Actividad'}
        </button>
      </form>
    </div>
  );
};