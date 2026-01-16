export default function handler(request, response) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  const envPayload = {
    SUPABASE_URL: SUPABASE_URL || '',
    SUPABASE_ANON_KEY: SUPABASE_ANON_KEY || '',
     };

  response.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  response.status(200).send(`window.ENV = ${JSON.stringify(envPayload)};`);
}
