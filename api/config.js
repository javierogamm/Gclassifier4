export default function handler(request, response) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, CDC_CATALOG } = process.env;
  const envPayload = {
    SUPABASE_URL: SUPABASE_URL || '',
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY || '',
    CDC_CATALOG: CDC_CATALOG || '',
  };

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.status(200).json(envPayload);
}
