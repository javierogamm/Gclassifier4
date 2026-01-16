export default function handler(request, response) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, CDC_CATALOG } = process.env;
  const envPayload = {
    SUPABASE_URL: SUPABASE_URL || '',
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY || '',
    CDC_CATALOG: CDC_CATALOG || '',
  };

  response.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.status(200).send(`window.ENV = ${JSON.stringify(envPayload)};`);
}
