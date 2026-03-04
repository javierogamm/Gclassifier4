# Refactor de seguridad Supabase (Next.js 13+)

## Variables de entorno

Usa **solo backend** para la service role key:

```bash
# .env.local (NO exponer en cliente)
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
APP_SESSION_TOKEN=token_privado_para_validacion_basica
```

> No definas `NEXT_PUBLIC_SUPABASE_ANON_KEY` para este flujo.

## Código completo: `lib/supabaseAdmin.ts`

```ts
import 'server-only';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable.');
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
```

## Código completo: `app/api/documentos/route.ts`

```ts
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
```

## Frontend ejemplo (antes y después)

### Antes (acceso directo, no deseado)

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const { data, error } = await supabase.from('documentos').select('*');
```

### Después (solo API Route)

```ts
export async function getDocumentos() {
  const response = await fetch('/api/documentos', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'No se pudieron cargar los documentos');
  }

  return payload.data;
}
```

## Flujo de seguridad (breve)

1. El cliente llama a `/api/documentos` y envía cookie/token de sesión.
2. La API valida sesión básica en backend.
3. Solo si la sesión es válida, el backend consulta Supabase con `SUPABASE_SERVICE_ROLE_KEY`.
4. El cliente recibe solo JSON con los datos/resultados.
5. La service role key nunca viaja al navegador y no se exporta en `NEXT_PUBLIC_*`.

Este patrón evita exponer claves sensibles en frontend y centraliza el control de acceso en el backend, sin depender de RLS.
