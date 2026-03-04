import { NextRequest, NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

function getSessionToken(request: NextRequest): string | null {
  const cookieToken = request.cookies.get('session_token')?.value;

  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.slice('Bearer '.length).trim() || null;
}

function isSessionValid(token: string | null): boolean {
  const expectedToken = process.env.APP_SESSION_TOKEN;
  return Boolean(token && expectedToken && token === expectedToken);
}

export async function GET(request: NextRequest) {
  const token = getSessionToken(request);

  if (!isSessionValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('documentos')
    .select('*')
    .order('id', { ascending: false });

  if (error) {
    return NextResponse.json(
      {
        error: 'Database query failed',
        details: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 200 });
}
