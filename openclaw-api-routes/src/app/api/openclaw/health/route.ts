import { NextRequest, NextResponse } from 'next/server';

const OPENCLAW_API_KEY = process.env.OPENCLAW_API_KEY || 'VDKqeTP2fhcSRb80vktTriP7d8nl1Dgk';
const OPENCLAW_API_URL = process.env.NEXT_PUBLIC_OPENCLAW_API_URL || 'https://api.openclaw.ai';

export async function GET() {
  try {
    // Verificar conexão com OpenClaw
    return NextResponse.json({
      status: 'ok',
      message: 'Jarvis está online',
      timestamp: new Date().toISOString(),
      api_url: OPENCLAW_API_URL
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Não foi possível conectar ao OpenClaw',
      error: String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Enviar evento para OpenClaw
    const response = await fetch(`${OPENCLAW_API_URL}/api/dashboard/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENCLAW_API_KEY}`,
        'X-User-ID': 'rafael-bazilio'
      },
      body: JSON.stringify({
        ...body,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`OpenClaw API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      status: 'success',
      ...data
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Erro ao comunicar com OpenClaw',
      error: String(error)
    }, { status: 500 });
  }
}
