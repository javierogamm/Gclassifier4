/**
 * ANTES (inseguro en frontend):
 *
 * import { createClient } from '@supabase/supabase-js';
 *
 * const supabase = createClient(
 *   process.env.NEXT_PUBLIC_SUPABASE_URL!,
 *   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
 * );
 *
 * const { data, error } = await supabase.from('documentos').select('*');
 */

/**
 * DESPUÉS (seguro):
 *
 * El frontend no conoce ninguna key de Supabase.
 * Solo consume la API Route interna.
 */
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
