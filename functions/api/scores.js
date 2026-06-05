// Cloudflare Pages Function — /api/scores
// GET  → { scores: [{name,score,date},...] }  (top 100)
// POST → { rank, scores }  (submit score, returns updated board)
//
// KV binding "SCORES" must be created in the Pages dashboard:
//   Pages project → Settings → Functions → KV namespace bindings
//   Variable name: SCORES   KV namespace: <your namespace>

const LB_KEY     = 'lb';
const MAX_ENTRIES = 100;
const MAX_SCORE   = 100_000_000;

function resp(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function onRequest({ request, env }) {
  // CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }});
  }

  // ── GET ──────────────────────────────────────────────────────────────────────
  if (request.method === 'GET') {
    const raw = await env.SCORES.get(LB_KEY);
    return resp({ scores: raw ? JSON.parse(raw) : [] });
  }

  // ── POST ─────────────────────────────────────────────────────────────────────
  if (request.method === 'POST') {
    let body;
    try { body = await request.json(); }
    catch { return resp({ error: 'Invalid JSON' }, 400); }

    // Sanitize name: A-Z 0-9 only, 1-12 chars
    const name = String(body.name ?? '')
      .replace(/[^A-Za-z0-9]/g, '')
      .slice(0, 12)
      .toUpperCase() || 'PLAYER';

    // Validate score
    const score = Math.floor(Number(body.score));
    if (!Number.isFinite(score) || score < 0 || score > MAX_SCORE) {
      return resp({ error: 'Invalid score' }, 400);
    }

    // Read current board
    const raw    = await env.SCORES.get(LB_KEY);
    const scores = raw ? JSON.parse(raw) : [];

    // Insert
    const date  = new Date().toISOString().slice(0, 10);
    const entry = { name, score, date };
    scores.push(entry);
    scores.sort((a, b) => b.score - a.score);
    if (scores.length > MAX_ENTRIES) scores.splice(MAX_ENTRIES);

    // Rank: indexOf uses reference equality → correct even with duplicate scores
    const rank = scores.indexOf(entry) + 1; // 0 if trimmed out of top 100

    await env.SCORES.put(LB_KEY, JSON.stringify(scores));

    return resp({ rank, scores });
  }

  return resp({ error: 'Method not allowed' }, 405);
}
