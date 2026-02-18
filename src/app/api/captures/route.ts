import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'captures.json');

interface Capture {
  id: string;
  type: string;
  content: string;
  tags: string[];
  priority: string;
  source: string;
  createdAt: string;
  processed: boolean;
}

async function getCaptures(): Promise<Capture[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveCaptures(captures: Capture[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(captures, null, 2));
}

export async function GET() {
  const captures = await getCaptures();
  captures.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ status: 'ok', count: captures.length, captures });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type = 'note', content, tags = [], source = 'api' } = body;

  if (!content) {
    return NextResponse.json({ status: 'error', message: 'Conteudo obrigatorio' }, { status: 400 });
  }

  const captures = await getCaptures();
  
  // Detectar tipo e prioridade
  let detectedType = type;
  let priority = 'media';
  const lower = content.toLowerCase();
  
  if (lower.includes('comprar') || lower.includes('fazer') || lower.includes('ligar')) {
    detectedType = 'task';
  } else if (lower.includes('ideia') || lower.includes('talvez')) {
    detectedType = 'idea';
  }
  
  if (lower.includes('urgente') || lower.includes('hoje')) {
    priority = 'alta';
  } else if (lower.includes('depois') || lower.includes('futuro')) {
    priority = 'baixa';
  }

  const newCapture: Capture = {
    id: 'capture-' + Date.now(),
    type: detectedType,
    content,
    tags,
    priority,
    source,
    createdAt: new Date().toISOString(),
    processed: false,
  };

  captures.push(newCapture);
  await saveCaptures(captures);

  return NextResponse.json({ status: 'ok', message: 'Captura salva', capture: newCapture });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ status: 'error', message: 'ID obrigatorio' }, { status: 400 });
  }

  const captures = await getCaptures();
  const filtered = captures.filter(c => c.id !== id);
  await saveCaptures(filtered);

  return NextResponse.json({ status: 'ok', message: 'Captura removida' });
}
