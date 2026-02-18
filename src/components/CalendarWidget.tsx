'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, RefreshCw } from 'lucide-react';
import { useCalendar } from '../hooks/useCalendar';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarWidgetProps {
  compact?: boolean;
}

export default function CalendarWidget({ compact = false }: CalendarWidgetProps) {
  const { events, isLoading, error, fetchEvents, createEvent } = useCalendar();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    summary: '',
    description: '',
    start: '',
    end: '',
    location: '',
  });

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await createEvent(newEvent);
    setShowAddModal(false);
    setNewEvent({ summary: '', description: '', start: '', end: '', location: '' });
  };

  // Cores dos eventos
  const getEventColor = (colorId?: string) => {
    const colors: Record<string, string> = {
      '1': 'bg-blue-500',
      '6': 'bg-green-500',
      '11': 'bg-red-500',
    };
    return colors[colorId || '1'] || 'bg-blue-500';
  };

  return (
    <div className={`bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-500/30 ${compact ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span className="text-white font-semibold">Google Calendar</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchEvents()}
            className="p-2 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 text-indigo-300 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {events.length === 0 && !isLoading && (
          <div className="text-center py-8 text-gray-400">
            <Calendar className="mx-auto mb-2 w-8 h-8" />
            <p className="text-sm">Nenhum evento próximo</p>
          </div>
        )}

        {events.map((event) => (
          <div
            key={event.id}
            className="bg-indigo-800/30 rounded-lg p-3 hover:bg-indigo-800/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className={`w-1 h-full min-h-[40px] rounded-full ${getEventColor(event.colorId)}`} />
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{event.summary}</h4>
                {event.description && (
                  <p className="text-gray-400 text-sm line-clamp-1">{event.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{format(parseISO(event.start.dateTime), 'dd/MM HH:mm', { locale: ptBR })}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Adicionar Evento */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-white font-semibold mb-4">Novo Evento</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <input
                type="text"
                placeholder="Título"
                value={newEvent.summary}
                onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500"
                required
              />
              <input
                type="text"
                placeholder="Descrição"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                  className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm"
                  required
                />
                <input
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                  className="px-3 py-2 bg-gray-800 rounded-lg text-white text-sm"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Local"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Criando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-500/20 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
