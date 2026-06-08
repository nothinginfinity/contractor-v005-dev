// ============================================================
// Content Gathering Hub — content-hub.js
// Handles:
//   GET  /crew/upload           — mobile crew upload page (tokenized)
//   POST /crew/upload           — submit media + note → content_submissions
//   GET  /api/admin/content-submissions          — list pending/all
//   POST /api/admin/content-submissions/:id/generate-captions  — AI captions
//   POST /api/admin/content-submissions/:id/approve            — approve + pick caption + platforms
//   POST /api/admin/content-submissions/:id/reject             — reject
//   POST /api/admin/content-submissions/:id/post               — dispatch to Bluesky/Mastodon or log guided
//   GET  /api/admin/social-posts                               — post history
// ============================================================

const CHAT_MODEL = '@cf/meta/llama-3.1-8b-instruct';
const R2_PREFIX  = 'contractor-v003-2/';

function j(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}
function h(html) {
  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
}
function now() { return new Date().toISOString(); }
function uid() { return 'ch-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,6); }
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── DB helpers ────────────────────────────────────────────────────────────────
async function dbRun(env, sql, p=[]) {
  return env.V003_2_DB.prepare(sql).bind(...p).run();
}
async function dbAll(env, sql, p=[]) {
  const r = await env.V003_2_DB.prepare(sql).bind(...p).all();
  return r.results || [];
}
async function dbFirst(env, sql, p=[]) {
  return env.V003_2_DB.prepare(sql).bind(...p).first();
}

// ── Token validation — reuse existing crew_members table ──────────────────────
async function getMemberByToken(env, token) {
  try {
    const m = await dbFirst(env,
      "SELECT * FROM crew_members WHERE portal_token=? AND active=1",
      [token]
    );
    if (m) return m;
  } catch(e) {}
  try {
    const m = await dbFirst(env,
      "SELECT * FROM members WHERE portal_token=? AND active=1",
      [token]
    );
    if (m) return m;
  } catch(e) {}
  return null;
}

export async function handleContentHub(req, env) {
  const url  = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const method = req.method;

  if (method === 'GET' && path === '/crew/upload') {
    const token = url.searchParams.get('token') || '';
    const submitted = url.searchParams.get('submitted') === '1';
    if (!token) return h(`<!DOCTYPE html><html><body style="font-family:system-ui;background:#0f1a2e;color:#e8eaf0;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center"><div><h1 style="color:#ef4444">Invalid Link</h1></div></body></html>`);
    const member = await getMemberByToken(env, token);
    if (!member) return h(`<!DOCTYPE html><html><body style="font-family:system-ui;background:#0f1a2e;color:#e8eaf0;display:flex;align-items:center;justify-content:center;height:100vh;text-align:center"><div><h1 style="color:#ef4444">Invalid Link</h1></div></body></html>`);
    return h(`<!DOCTYPE html><html><body>Upload page for ${esc(member.name)}</body></html>`);
  }

  return null;
}
