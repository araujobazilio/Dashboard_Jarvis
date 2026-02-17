'use client';

import { useState, useCallback } from 'react';
import { useStore } from '../store';

interface JarvisSuggestion {
  type: 'task' | 'note' | 'project' | 'health' | 'event';
  message: string;
  action: string;
  priority?: 'baixa' | 'media' | 'alta' | 'urgente';
}

interface JarvisAnalysis {
  detected_type: string;
  priority: string;
  category: string;
  suggested_action: string;
}

interface UseJarvisReturn {
  isConnected: boolean;
  isProcessing: boolean;
  lastSync: Date | null;
  suggestions: JarvisSuggestion[];
  analyzeContent: (content: string) => Promise<JarvisAnalysis>;
  createSmartTask: (content: string) => Promise<void>;
  createSmartNote: (content: string) => Promise<void>;
  syncAll: () => Promise<void>;
  clearSuggestions: () => void;
}

export function useJarvis(): UseJarvisReturn {
  const [isConnected, setIsConnected] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(new Date());
  const [suggestions, setSuggestions] = useState<JarvisSuggestion[]>([]);

  const { addTask, addNote, notes, tasks } = useStore();

  const analyzeContent = useCallback(async (content: string): Promise<JarvisAnalysis> => {
    setIsProcessing(true);
    
    try {
      const analysis = analyzeLocally(content);
      
      const newSuggestions = generateSuggestions(content, analysis);
      setSuggestions(prev => [...prev, ...newSuggestions]);
      
      return analysis;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const createSmartTask = useCallback(async (content: string) => {
    setIsProcessing(true);
    
    try {
      const analysis = await analyzeContent(content);
      
      addTask({
        id: `task-${Date.now()}`,
        title: content,
        priority: analysis.priority as any,
        completed: false,
        dueDate: suggestDueDate(analysis.priority),
        category: analysis.category,
        createdAt: new Date().toISOString(),
      });
      
      setLastSync(new Date());
    } finally {
      setIsProcessing(false);
    }
  }, [addTask, analyzeContent]);

  const createSmartNote = useCallback(async (content: string) => {
    setIsProcessing(true);
    
    try {
      const analysis = await analyzeContent(content);
      
      addNote({
        id: `note-${Date.now()}`,
        title: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
        content: content,
        category: analysis.category,
        tags: [analysis.detected_type, analysis.category],
        pinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      setLastSync(new Date());
    } finally {
      setIsProcessing(false);
    }
  }, [addNote, analyzeContent]);

  const syncAll = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      console.log('Sincronizando com Jarvis:', {
        notes: notes.length,
        tasks: tasks.length,
        timestamp: new Date().toISOString(),
      });
      
      setLastSync(new Date());
    } finally {
      setIsProcessing(false);
    }
  }, [notes, tasks]);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    isConnected,
    isProcessing,
    lastSync,
    suggestions,
    analyzeContent,
    createSmartTask,
    createSmartNote,
    syncAll,
    clearSuggestions,
  };
}

function analyzeLocally(content: string): JarvisAnalysis {
  const contentLower = content.toLowerCase();
  
  let detected_type = 'idea';
  
  if (/\b(comprar|fazer|ligar|enviar|chamar)\b/.test(contentLower)) {
    detected_type = 'task';
  } else if (/\b(reunião|consulta|encontro|encontro)\b/.test(contentLower)) {
    detected_type = 'event';
  } else if (/\b(estudar|aprender|ler|pesquisar)\b/.test(contentLower)) {
    detected_type = 'study';
  } else if (/\b(projeto|criar|desenvolver|implementar)\b/.test(contentLower)) {
    detected_type = 'project';
  }
  
  let priority = 'media';
  
  if (/\b(urgente|agora|hoje|importante|crítico)\b/.test(contentLower)) {
    priority = 'alta';
  } else if (/\b(quando puder|depois|futuro|eventualmente)\b/.test(contentLower)) {
    priority = 'baixa';
  } else if (/\b(emergência|fire|fogo|socorro)\b/.test(contentLower)) {
    priority = 'urgente';
  }
  
  let category = 'geral';
  
  if (/\b(saúde|médico|exame|remédio|consulta|hospital)\b/.test(contentLower)) {
    category = 'saude';
  } else if (/\b(trabalho|bombeiro|plantão|corporação)\b/.test(contentLower)) {
    category = 'trabalho';
  } else if (/\b(biojoias|galvanoplastia|loja|venda|cliente)\b/.test(contentLower)) {
    category = 'negocio';
  } else if (/\b(katiane|família|casa|lar)\b/.test(contentLower)) {
    category = 'pessoal';
  } else if (/\b(código|programar|desenvolver|api|bug)\b/.test(contentLower)) {
    category = 'dev';
  }
  
  return {
    detected_type,
    priority,
    category,
    suggested_action: `Transformar em ${detected_type} na categoria ${category}`,
  };
}

function generateSuggestions(content: string, analysis: JarvisAnalysis): JarvisSuggestion[] {
  const suggestions: JarvisSuggestion[] = [];
  
  if (analysis.detected_type === 'task') {
    suggestions.push({
      type: 'task',
      message: `Criar tarefa: "${content.substring(0, 30)}..."`,
      action: 'create_task',
      priority: analysis.priority as any,
    });
  }
  
  if (analysis.category === 'saude') {
    suggestions.push({
      type: 'health',
      message: 'Adicionar ao arquivo de saúde?',
      action: 'add_to_health',
    });
  }
  
  if (analysis.detected_type === 'project') {
    suggestions.push({
      type: 'project',
      message: 'Criar novo projeto para isso?',
      action: 'create_project',
    });
  }
  
  return suggestions;
}

function suggestDueDate(priority: string): string | undefined {
  const now = new Date();
  
  switch (priority) {
    case 'urgente':
      return now.toISOString();
    case 'alta':
      now.setDate(now.getDate() + 1);
      return now.toISOString();
    case 'media':
      now.setDate(now.getDate() + 7);
      return now.toISOString();
    default:
      return undefined;
  }
}

export default useJarvis;
