// Netlify Function: free real-time facts (no keys): geocoding, weather, exchange rates, driving distance, US gas price (optional EIA key).
const J = { 'Content-Type': 'application/json' };
const get = async (url, ms = 8000, headers = {}) => {
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
  try { const r = await fetch(url, { signal: c.signal, headers }); if (!r.ok) return null; return await r.json(); } catch { return null; } finally { clearTimeout(t); }
};
const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
async function geocode(q) {
  const parts = q.split(',').map(s => s.trim()).filter(Boolean);
  const name = parts[0] || q, rest = parts.slice(1).map(norm);
  const d = await get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=10&language=en`);
  const res = d?.results || [];
  if (res.length) {
    const hit = res.find(r => rest.length && rest.some(x => norm(r.country).includes(x) || norm(r.admin1).includes(x) || norm(r.country_code) === x || x.includes(norm(r.admin1)) && r.admin1)) || res[0];
    return { lat: hit.latitude, lon: hit.longitude, cc: hit.country_code, country: hit.country, tz: hit.timezone };
  }
  const n = await get(`https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&q=${encodeURIComponent(q)}`, 8000, { 'User-Agent': 'Ready2Travel/1.0' });
  if (n?.[0]) return { lat: +n[0].lat, lon: +n[0].lon, cc: (n[0].address?.country_code || '').toUpperCase(), country: n[0].address?.country || '' };
  return null;
}
const CC = {US:'USD',PR:'USD',VI:'USD',GU:'USD',EC:'USD',SV:'USD',PA:'USD',MX:'MXN',CA:'CAD',GB:'GBP',CH:'CHF',JP:'JPY',CN:'CNY',KR:'KRW',IN:'INR',AU:'AUD',NZ:'NZD',BR:'BRL',AR:'ARS',CL:'CLP',CO:'COP',PE:'PEN',UY:'UYU',PY:'PYG',BO:'BOB',VE:'VES',CR:'CRC',GT:'GTQ',HN:'HNL',NI:'NIO',DO:'DOP',CU:'CUP',JM:'JMD',BS:'BSD',BB:'BBD',TT:'TTD',HT:'HTG',AW:'AWG',TH:'THB',VN:'VND',ID:'IDR',MY:'MYR',SG:'SGD',PH:'PHP',TR:'TRY',EG:'EGP',MA:'MAD',ZA:'ZAR',KE:'KES',NG:'NGN',AE:'AED',SA:'SAR',IL:'ILS',JO:'JOD',QA:'QAR',RU:'RUB',UA:'UAH',PL:'PLN',CZ:'CZK',HU:'HUF',RO:'RON',BG:'BGN',DK:'DKK',SE:'SEK',NO:'NOK',IS:'ISK',HR:'EUR',FR:'EUR',DE:'EUR',ES:'EUR',IT:'EUR',PT:'EUR',NL:'EUR',BE:'EUR',AT:'EUR',IE:'EUR',GR:'EUR',FI:'EUR',LU:'EUR',MT:'EUR',CY:'EUR',SK:'EUR',SI:'EUR',EE:'EUR',LV:'EUR',LT:'EUR'};
const iso = d => d.toISOString().slice(0, 10);
async function weather(g, start, end) {
  if (!g || !start || !end) return null;
  const s = new Date(start + 'T12:00:00Z'), e = new Date(end + 'T12:00:00Z'), now = new Date();
  const daysAhead = (s - now) / 864e5;
  let daily, kind;
  if (daysAhead <= 14 && daysAhead > -1) {
    const e2 = new Date(Math.min(e, new Date(now.getTime() + 15 * 864e5)));
    const d = await get(`https://api.open-meteo.com/v1/forecast?latitude=${g.lat}&longitude=${g.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&temperature_unit=fahrenheit&timezone=auto&start_date=${iso(s)}&end_date=${iso(e2)}`);
    daily = d?.daily; kind = 'forecast';
  }
  if (!daily) {
    const sy = new Date(s), ey = new Date(e); sy.setUTCFullYear(sy.getUTCFullYear() - 1); ey.setUTCFullYear(ey.getUTCFullYear() - 1);
    const d = await get(`https://archive-api.open-meteo.com/v1/archive?latitude=${g.lat}&longitude=${g.lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&temperature_unit=fahrenheit&timezone=auto&start_date=${iso(sy)}&end_date=${iso(ey)}`);
    daily = d?.daily; kind = 'same dates last year (typical)';
  }
  if (!daily?.temperature_2m_max?.length) return null;
  const avg = a => a.filter(x => x != null).reduce((x, y) => x + y, 0) / Math.max(1, a.filter(x => x != null).length);
  const hi = Math.round(avg(daily.temperature_2m_max)), lo = Math.round(avg(daily.temperature_2m_min));
  const c = f => Math.round((f - 32) * 5 / 9);
  const rain = daily.precipitation_probability_max
    ? `rain chance up to ${Math.round(Math.max(...daily.precipitation_probability_max.filter(x => x != null)))}%`
    : `${daily.precipitation_sum.filter(x => x > 1).length} of ${daily.precipitation_sum.length} days with rain`;
  return `${kind}: highs ~${hi}°F/${c(hi)}°C, lows ~${lo}°F/${c(lo)}°C, ${rain}`;
}
async function currency(cc, rates) {
  const code = CC[cc]; if (!code) return null;
  const rate = code === 'USD' ? 1 : rates?.[code];
  return { code, perUSD: rate ? +Number(rate).toFixed(4) : null };
}
async function leg(a, b) {
  if (!a || !b) return null;
  const d = await get(`https://router.project-osrm.org/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false`, 10000);
  const r = d?.routes?.[0]; if (!r) return null;
  return { miles: Math.round(r.distance / 1609.34), hours: +(r.duration / 3600).toFixed(1) };
}
export default async (req) => {
  if (req.method === 'GET') return new Response(JSON.stringify({ function: 'ok', eia: !!process.env.EIA_API_KEY }), { headers: J });
  let p; try { p = await req.json(); } catch { return new Response('bad json', { status: 400 }); }
  const names = [...new Set((p.places || []).map(s => String(s).slice(0, 120)).filter(Boolean))].slice(0, 8);
  const [ratesD, ...geos] = await Promise.all([get('https://open.er-api.com/v6/latest/USD'), ...names.map(geocode)]);
  const geo = {}; names.forEach((n, i) => geo[n] = geos[i]);
  const out = { geo, weather: {}, fx: {}, legs: [], gas: null };
  await Promise.all(names.map(async n => {
    const g = geo[n]; if (!g) return;
    const [w, c] = await Promise.all([weather(g, p.start, p.end), currency(g.cc, ratesD?.rates)]);
    if (w) out.weather[n] = w; if (c) out.fx[n] = c;
  }));
  const pairs = (p.legs || []).slice(0, 8);
  const lg = await Promise.all(pairs.map(async ([a, b]) => {
    const ga = geo[a] || await geocode(a), gb = geo[b] || await geocode(b);
    const l = await leg(ga, gb); return l ? { from: a, to: b, ...l } : null;
  }));
  out.legs = lg.filter(Boolean);
  const k = process.env.EIA_API_KEY;
  if (k) {
    const d = await get(`https://api.eia.gov/v2/petroleum/pri/gnd/data/?api_key=${k}&frequency=weekly&data[0]=value&facets[series][]=EMM_EPMR_PTE_NUS_DPG&sort[0][column]=period&sort[0][direction]=desc&length=1`);
    const v = d?.response?.data?.[0]; if (v) out.gas = { usd: +v.value, period: v.period };
  }
  return new Response(JSON.stringify(out), { headers: J });
};
