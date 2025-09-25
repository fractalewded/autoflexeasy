// app/api/debug-logs/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Simulamos una "base de datos" en memoria (solo para desarrollo)
let logs: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const logData = await request.json();
    logs.push(logData);
    
    // Mantener solo los últimos 100 logs
    if (logs.length > 100) {
      logs = logs.slice(-100);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error guardando log' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ logs });
}