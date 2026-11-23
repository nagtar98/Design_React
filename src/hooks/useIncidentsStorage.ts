import { useState, useEffect, useCallback } from 'react';
import { Incident, IncidentPriority } from '../types/incident';

const STORAGE_KEY = 'smartlab_incidents_data';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-101',
    title: 'Fallo de enlace en Switch Rack B',
    location: 'Aula 204 - Redes',
    description: 'Pérdida intermitente de paquetes en puertos Gigabit 12 al 16.',
    priority: 'alta',
    status: 'pendiente',
    createdAt: '09:15',
  },
  {
    id: 'INC-102',
    title: 'Actualización de imágenes Docker',
    location: 'Laboratorio DAM 2',
    description: 'Desplegar imagen base Node 22 Alpine en estaciones de trabajo.',
    priority: 'media',
    status: 'pendiente',
    createdAt: '10:30',
  },
  {
    id: 'INC-103',
    title: 'Calibración de proyector láser',
    location: 'Aula Magna',
    description: 'Ajuste trapezoidal y verificación de entrada HDMI.',
    priority: 'baja',
    status: 'resuelta',
    createdAt: 'Ayer',
  },
];

/**
 * Custom Hook para la gestión y persistencia reactiva de incidencias en localStorage.
 * Cumple con RA 3 / CE 3.c (Persistencia de datos y sincronización de estado).
 */
export function useIncidentsStorage() {
  const [incidents, setIncidents] = useState<Incident[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.error('Error al leer incidencias de localStorage:', err);
    }
    return INITIAL_INCIDENTS;
  });

  // Guardar en localStorage cada vez que cambien las incidencias
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
    } catch (err) {
      console.error('Error al guardar incidencias en localStorage:', err);
    }
  }, [incidents]);

  // Sincronización entre pestañas/ventanas con evento de storage
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setIncidents(updated);
          }
        } catch (err) {
          console.error('Error al sincronizar localStorage:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addIncident = useCallback((newIncidentData: {
    title: string;
    location: string;
    description?: string;
    priority: IncidentPriority;
  }): Incident => {
    const newIncident: Incident = {
      id: `INC-${Math.floor(104 + Math.random() * 895)}`,
      title: newIncidentData.title.trim(),
      location: newIncidentData.location.trim(),
      description: newIncidentData.description?.trim() || 'Sin observaciones adicionales.',
      priority: newIncidentData.priority,
      status: 'pendiente',
      createdAt: new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setIncidents((prev) => [newIncident, ...prev]);
    return newIncident;
  }, []);

  const toggleIncidentStatus = useCallback((id: string) => {
    setIncidents((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'pendiente' ? 'resuelta' : 'pendiente' }
          : item
      )
    );
  }, []);

  const deleteIncident = useCallback((id: string) => {
    setIncidents((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateIncident = useCallback((id: string, updates: Partial<Incident>) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const getIncidentById = useCallback(
    (id: string): Incident | undefined => {
      return incidents.find((item) => item.id === id);
    },
    [incidents]
  );

  const resetToDefaults = useCallback(() => {
    setIncidents(INITIAL_INCIDENTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INCIDENTS));
  }, []);

  return {
    incidents,
    setIncidents,
    addIncident,
    toggleIncidentStatus,
    deleteIncident,
    updateIncident,
    getIncidentById,
    resetToDefaults,
  };
}
