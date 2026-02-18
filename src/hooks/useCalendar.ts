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
      
      if (data.status === 'success') {
        setEvents(data.events || []);
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
        await fetchEvents(); // Recarrega lista
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
