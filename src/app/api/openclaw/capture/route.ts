import { NextRequest, NextResponse } from 'next/server';

const OPENCLAW_API_KEY = process.env.OPENCLAW_API_KEY || 'VDKqeTP2fhcSRb80vktTriP7d8nl1Dgk';
const OPENCLAW_API_URL = process.env.NEXT_PUBLIC_OPENCLAW_API_URL || 'https://api.openclaw.ai';

// Análise inteligente local
function analyzeContent(content: string) {
  const contentLower = content.toLowerCase();
  
  // Detectar tipo
  let detected_type = 'idea';
  
  if (/\b(comprar|fazer|ligar|enviar|chamar)\b/.test(contentLower)) {
    detected_type = 'task';
  } else if (/\b(reunião|consulta|encontro)\b/.test(contentLower)) {
    detected_type = 'event';
  } else if (/\b(estudar|aprender|ler|pesquisar)\b/.test(contentLower)) {
    detected_type = 'study';
  } else if (/\b(projeto|criar|desenvolver|implementar)\b/.test(contentLower)) {
    detected_type = 'project';
  }
  
  // Detectar prioridade
  let priority = 'media';
  
  if (/\b(urgente|agora|hoje|importante|crítico)\b/.test(contentLower)) {
    priority = 'alta';
  } else if (/\b(quando puder|depois|futuro)\b/.test(contentLower)) {
    priority = 'baixa';
  }
  
  // Detectar categoria
  let category = 'geral';
  
  if (/\b(saúde|médico|exame|remédio|consulta)\b/.test(contentLower)) {
    category = 'saude';
  } else if (/\b(trabalho|bombeiro|plantão)\b/.test(contentLower)) {
    category = 'trabalho';
  } else if (/\b(biojoias|galvanoplastia|loja|venda)\b/.test(contentLower)) {
    category = 'negocio';
  } else if (/\b(katiane|família|casa)\b/.test(contentLower)) {
    category = 'pessoal';
  }
  
  return {
    detected_type,
    priority,
    category,
    suggested_action: `Transformar em ${detected_type} na categoria ${category}`
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, type } = body;
    
    if (!content) {
      return NextResponse.json({
        status: 'error',
        message: 'Conteúdo é obrigatório'
      }, { status: 400 });
    }
    
    // Análise local
    const analysis = analyzeContent(content);
    
    // Gerar sugestões
    const suggestions = [];
    
    if (analysis.detected_type === 'task') {
      suggestions.push({
        type: 'task',
        message: `Criar tarefa: "${content.substring(0, 30)}..."`,
        action: 'create_task',
        priority: analysis.priority
      });
    }
    
    if (analysis.category === 'saude') {
      suggestions.push({
        type: 'health',
        message: 'Adicionar ao arquivo de saúde?',
        action: 'add_to_health'
      });
    }
    
    if (analysis.detected_type === 'project') {
      suggestions.push({
        type: 'project',
        message: 'Criar novo projeto?',
        action: 'create_project'
      });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Captura processada pelo Jarvis',
      content,
      type: type || 'idea',
      analysis,
      suggestions,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao processar captura',
      error: String(error)
    }, { status: 500 });
  }
}
