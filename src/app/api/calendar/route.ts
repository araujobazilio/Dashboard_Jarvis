import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3';

// Simulação de eventos para teste (até integrar com token real)
const mockEvents = [
  {
    id: '1',
    summary: 'Plantão ASE-450',
    description: 'Plantão de bombeiro',
    start: { dateTime: new Date(Date.now() + 86400000).toISOString() },
    end: { dateTime: new Date(Date.now() + 90000000).toISOString() },
    location: 'ASE-450',
    colorId: '11',
  },
  {
    id: '2',
    summary: 'Consulta Médica',
    description: 'Check-up rotina',
    start: { dateTime: new Date(Date.now() + 172800000).toISOString() },
    end: { dateTime: new Date(Date.now() + 176400000).toISOString() },
    location: 'Clínica Saúde',
    colorId: '6',
  },
];

export async function GET() {
  try {
    // TODO: Integrar com token real do Google Calendar
    // Por enquanto, retorna mock data
    return NextResponse.json({
      status: 'success',
      events: mockEvents,
      message: 'Eventos carregados (modo simulação)',
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao buscar eventos',
      error: String(error),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, description, start, end, location } = body;

    // TODO: Criar evento real no Google Calendar
    const newEvent = {
      id: Date.now().toString(),
      summary: summary || 'Novo Evento',
      description: description || '',
      start: { dateTime: start || new Date().toISOString() },
      end: { dateTime: end || new Date(Date.now() + 3600000).toISOString() },
      location: location || '',
      colorId: '1',
    };

    return NextResponse.json({
      status: 'success',
      event: newEvent,
      message: 'Evento criado (modo simulação)',
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao criar evento',
      error: String(error),
    }, { status: 500 });
  }
}
