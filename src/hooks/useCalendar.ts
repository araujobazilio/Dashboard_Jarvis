'use client';

import { useState, useCallback, useEffect } from 'react';

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string };
  end: { dateTime: string };
  location?: string;
  colorId?: string;
}

interface UseCalendarReturn {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (eventData: Partial<CalendarEvent>) => Promise<void>;
}

export function useCalendar(): UseCalendarReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/calendar');
      const data = await response.json();
      
      if (data.status === 'success' && Array.isArray(data.events)) {
        // Normalizar eventos para garantir que todos os campos existam
        const normalizedEvents = data.events.map((event: any) => ({
          id: event.id || 'event-' + Date.now() + Math.random(),
          summary: event.summary || 'Sem título',
          description: event.description || '',
          start: {
            dateTime: event.start?.dateTime || event.start?.date || new Date().toISOString(),
          },
          end: {
            dateTime: event.end?.dateTime || event.end?.date || new Date(Date.now() + 3600000).toISOString(),
          },
          location: event.location || '',
          colorId: event.colorId || '1',
        }));
        
        setEvents(normalizedEvents);
      } else if (data.demo) {
        // Se for modo demo, usar os mock events retornados
        const normalizedEvents = (data.events || []).map((event: any) => ({
          id: event.id || 'demo-' + Date.now(),
          summary: event.summary || 'Sem título',
          description: event.description || '',
          start: {
            dateTime: event.start?.dateTime || event.start?.date || new Date().toISOString(),
          },
          end: {
            dateTime: event.end?.dateTime || event.end?.date || new Date(Date.now() + 3600000).toISOString(),
          },
          location: event.location || '',
          colorId: event.colorId || '1',
        }));
        setEvents(normalizedEvents);
      } else {
        setError(data.message || 'Erro ao carregar eventos');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: Partial<CalendarEvent>) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        await fetchEvents();
      } else {
        setError(data.message || 'Erro ao criar evento');
      }
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setIsLoading(false);
    }
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    isLoading,
    error,
    fetchEvents,
    createEvent,
  };
}

export default useCalendar;
