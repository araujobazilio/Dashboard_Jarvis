'use client';

import { useEffect, useState } from 'react';
import { Zap, Wifi, WifiOff, Brain, Sparkles } from 'lucide-react';
import { useStore } from '../store';

interface Suggestion {
  type: string;
  message: string;
  action: string;
}

interface OpenClawResponse {
  status: string;
  message: string;
  suggestions?: Suggestion[];
  analysis?: {
    detected_type: string;
    priority: string;
    category: string;
    suggested_action: string;
  };
}

export default function OpenClawIntegration() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { notes, tasks, addTask } = useStore();

  // Verificar conexão com OpenClaw
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      // Simular verificação - em produção, chamar API real
      const response = await fetch('/api/openclaw/health');
      setIsConnected(response.ok);
      if (response.ok) setLastSync(new Date());
    } catch {
      setIsConnected(false);
    }
  };

  // Sincronizar captura rápida com OpenClaw
  const syncWithOpenClaw = async (content: string, type: string): Promise<OpenClawResponse | null> => {
    try {
      const response = await fetch('/api/openclaw/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type }),
      });

      const data = await response.json();
      setLastSync(new Date());

      if (data.suggestions) {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      }

      return data;
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      return null;
    }
  };

  // Aplicar sugestão do Jarvis
  const applySuggestion = (suggestion: Suggestion) => {
    if (suggestion.action === 'create_task') {
      addTask({
        id: `task-${Date.now()}`,
        title: suggestion.message,
        priority: 'media',
        completed: false,
        createdAt: new Date().toISOString(),
      });
    }
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-4 border border-blue-500/30">
      {/* Status de Conexão */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <span className="text-white font-medium">Jarvis AI</span>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
          isConnected 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-red-500/20 text-red-400'
        }`}>
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Conectado</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span>Desconectado</span>
            </>
          )}
        </div>
      </div>

      {/* Info de Sincronização */}
      {isConnected && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Última sincronização:</span>
            <span className="text-gray-300">
              {lastSync ? lastSync.toLocaleTimeString('pt-BR') : 'Agora'}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Notas sincronizadas:</span>
            <span className="text-blue-400">{notes.length}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Tarefas pendentes:</span>
            <span className="text-yellow-400">
              {tasks.filter(t => !t.completed).length}
            </span>
          </div>
        </div>
      )}

      {/* Sugestões do Jarvis */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="mt-4 bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm font-medium">Sugestões do Jarvis</span>
          </div>
          
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => applySuggestion(suggestion)}
                className="w-full text-left p-2 rounded bg-purple-800/30 hover:bg-purple-700/30 transition-colors text-sm text-gray-300"
              >
                {suggestion.message}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ações Rápidas */}
      {isConnected && (
        <div className="mt-4 flex gap-2">
          <button 
            onClick={() => syncWithOpenClaw('', 'sync')}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm text-white transition-colors"
          >
            <Zap className="w-4 h-4" />
            Sincronizar Agora
          </button>
        </div>
      )}

      {/* Mensagem de Não Conectado */}
      {!isConnected && (
        <div className="mt-4 p-3 bg-yellow-900/30 rounded border border-yellow-500/30">
          <p className="text-yellow-300 text-sm">
            🔌 Configure a conexão com o OpenClaw nas configurações.
          </p>
        </div>
      )}
    </div>
  );
}
