'use client';

import { useState, useEffect } from 'react';
import { Zap, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

interface Capture {
  id: string;
  type: string;
  content: string;
  priority: string;
  source: string;
  createdAt: string;
  processed: boolean;
}

export default function CapturesWidget() {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCaptures = async () => {
    try {
      const response = await fetch('/api/captures');
      const data = await response.json();
      if (data.status === 'ok') setCaptures(data.captures);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCapture = async (id: string) => {
    await fetch('/api/captures?id=' + id, { method: 'DELETE' });
    setCaptures(captures.filter(c => c.id !== id));
  };

  useEffect(() => {
    fetchCaptures();
    const interval = setInterval(fetchCaptures, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return '✅';
      case 'idea': return '💡';
      case 'reference': return '📚';
      default: return '📝';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="bg-gray-900/50 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold text-white">Capturas Telegram</h2>
          <span className="text-sm text-gray-400">({captures.length})</span>
        </div>
        <button onClick={fetchCaptures} className="p-2 hover:bg-gray-700 rounded">
          <RefreshCw className={"w-4 h-4 text-gray-400 " + (loading ? "animate-spin" : "")} />
        </button>
      </div>
      <div className="p-4 max-h-80 overflow-y-auto">
        {captures.length === 0 ? (
          <div className="text-center py-6 text-gray-400">
            <p>Nenhuma captura</p>
            <p className="text-sm mt-1">Use /captura no Telegram!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {captures.map(c => (
              <div key={c.id} className="p-2 bg-gray-800/50 rounded border border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="mr-2">{getTypeIcon(c.type)}</span>
                    <span className="text-white text-sm">{c.content}</span>
                    <p className="text-xs text-gray-500 mt-1">
                      {c.source === 'telegram' ? '📱' : '🌐'} {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <button onClick={() => deleteCapture(c.id)} className="text-red-400 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
