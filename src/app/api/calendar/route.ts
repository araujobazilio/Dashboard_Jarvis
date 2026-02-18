import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CALENDAR_API_URL = 'https://www.googleapis.com/calendar/v3';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

// Credenciais Google Calendar via variáveis de ambiente
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || '';
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';

// Cache do access token
let accessTokenCache: { token: string; expiresAt: number } | null = null;

// Mock events para fallback
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

// Função para obter access token usando refresh token
async function getAccessToken(): Promise<string> {
  // Verificar se tem token em cache válido
  if (accessTokenCache && accessTokenCache.expiresAt > Date.now()) {
    return accessTokenCache.token;
  }

  // Verificar se credenciais estão configuradas
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error('Credenciais Google Calendar não configuradas');
  }

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    const data = await response.json();
    const accessToken = data.access_token;
    const expiresIn = data.expires_in || 3600;

    // Cachear token (com margem de segurança de 5 minutos)
    accessTokenCache = {
      token: accessToken,
      expiresAt: Date.now() + (expiresIn - 300) * 1000,
    };

    return accessToken;
  } catch (error) {
    console.error('Erro ao obter access token:', error);
    throw error;
  }
}

// GET - Buscar eventos do Google Calendar
export async function GET() {
  try {
    // Verificar se credenciais estão configuradas
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      console.warn('Credenciais Google Calendar não configuradas, usando mock data');
      return NextResponse.json({
        status: 'success',
        events: mockEvents,
        message: 'Eventos de demonstração (configure as credenciais)',
        demo: true,
      });
    }

    const accessToken = await getAccessToken();

    // Buscar eventos dos próximos 30 dias
    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const url = `${GOOGLE_CALENDAR_API_URL}/calendars/${encodeURIComponent(CALENDAR_ID)}/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&orderBy=startTime&singleEvents=true`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Google Calendar API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      events: data.items || [],
      message: 'Eventos carregados do Google Calendar',
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    
    // Fallback para mock events em caso de erro
    return NextResponse.json({
      status: 'error',
      events: mockEvents,
      message: 'Erro ao buscar eventos, mostrando dados de demonstração',
      error: String(error),
      demo: true,
    }, { status: 200 });
  }
}

// POST - Criar evento no Google Calendar
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { summary, description, start, end, location } = body;

    // Verificar se credenciais estão configuradas
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
      return NextResponse.json({
        status: 'error',
        message: 'Credenciais Google Calendar não configuradas',
      }, { status: 400 });
    }

    const accessToken = await getAccessToken();

    const eventData = {
      summary: summary || 'Novo Evento',
      description: description || '',
      start: {
        dateTime: start?.dateTime || new Date().toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: end?.dateTime || new Date(Date.now() + 3600000).toISOString(),
        timeZone: 'America/Sao_Paulo',
      },
      location: location || '',
    };

    const url = `${GOOGLE_CALENDAR_API_URL}/calendars/${encodeURIComponent(CALENDAR_ID)}/events`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Google Calendar API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    return NextResponse.json({
      status: 'success',
      event: data,
      message: 'Evento criado no Google Calendar',
    });
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao criar evento no Google Calendar',
      error: String(error),
    }, { status: 500 });
  }
}
