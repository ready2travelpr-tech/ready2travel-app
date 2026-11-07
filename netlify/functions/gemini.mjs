// Netlify Function: keeps the Gemini key server-side (env var GEMINI_API_KEY).
const ALLOWED = ['gemini-2.5-flash', 'gemini-2.0-flash'];
export default async (req) => {
  const key = (process.env.GEMINI_API_KEY || '').trim();
  if (req.method === 'GET') return new Response(JSON.stringify({ function: 'ok', hasKey: !!key }), { headers: { 'Content-Type': 'application/json' } });
  if (req.method !== 'POST') return new Response('method', { status: 405 });
  if (!key) return new Response('no key', { status: 501 });
  let p; try { p = await req.json(); } catch { return new Response('bad json', { status: 400 }); }
  const { model, body } = p || {};
  if (!ALLOWED.includes(model) || !body) return new Response('bad request', { status: 400 });
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body) });
  return new Response(r.body, { status: r.status, headers: { 'Content-Type': 'application/json' } });
};
