var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// contractor-v003-2-afo.js
var __defProp2 = Object.defineProperty;
var __name2 = /* @__PURE__ */ __name((target, value) => __defProp2(target, "name", { value, configurable: true }), "__name");
var VERSION = "0.6.0";
var WORKER = "contractor-v003-2-afo";
var COMPANY = "CCS Services Group";
var PHONE = "(818) 624-7212";
var PHONE_URL = "tel:+18186247212";
var LICENSE = "CSLB #890991";
async function getContactConstants(env) {
  try {
    const row = await env.V003_2_DB.prepare("SELECT data FROM site_content WHERE section='contact'").first();
    if (row && row.data) {
      const c = JSON.parse(row.data);
      return {
        phone: c.phone || PHONE,
        phone_url: c.phone_url || PHONE_URL,
        license: c.license || LICENSE,
        company: c.company || COMPANY
      };
    }
  } catch (e) {
  }
  return { phone: PHONE, phone_url: PHONE_URL, license: LICENSE, company: COMPANY };
}
__name(getContactConstants, "getContactConstants");
__name2(getContactConstants, "getContactConstants");
var EMBED_MODEL = "@cf/baai/bge-base-en-v1.5";
var CHAT_MODEL = "@cf/meta/llama-3.1-8b-instruct";
var ADMIN_PASS = "demo";
var R2_PREFIX = "contractor-v003-2/";
function uid() {
  return "v2-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}
__name(uid, "uid");
__name2(uid, "uid");
function now() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
__name(now, "now");
__name2(now, "now");
function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
__name(esc, "esc");
__name2(esc, "esc");
function imgSrc(item) {
  return (item && item.image_r2_key ? "/media/serve/" + encodeURIComponent(item.image_r2_key) : item && item.image_url) || "";
}
__name(imgSrc, "imgSrc");
__name2(imgSrc, "imgSrc");
function j(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } });
}
__name(j, "j");
__name2(j, "j");
function h(html) {
  return new Response(html, { headers: { "Content-Type": "text/html;charset=UTF-8" } });
}
__name(h, "h");
__name2(h, "h");
async function body(req) {
  try {
    return await req.json();
  } catch {
    return {};
  }
}
__name(body, "body");
__name2(body, "body");
async function dbRun(env, sql, p = []) {
  return env.V003_2_DB.prepare(sql).bind(...p).run();
}
__name(dbRun, "dbRun");
__name2(dbRun, "dbRun");
async function dbAll(env, sql, p = []) {
  const r = await env.V003_2_DB.prepare(sql).bind(...p).all();
  return r.results || [];
}
__name(dbAll, "dbAll");
__name2(dbAll, "dbAll");
async function dbFirst(env, sql, p = []) {
  return env.V003_2_DB.prepare(sql).bind(...p).first();
}
__name(dbFirst, "dbFirst");
__name2(dbFirst, "dbFirst");
async function embed(env, text) {
  const r = await env.AI.run(EMBED_MODEL, { text: [text.slice(0, 2e3)] });
  return r.data[0];
}
__name(embed, "embed");
__name2(embed, "embed");
async function vecSearch(env, query, topK = 5) {
  const vec = await embed(env, query);
  const r = await env.V003_2_VECTORIZE.query(vec, { topK, returnMetadata: "all" });
  return r.matches || [];
}
__name(vecSearch, "vecSearch");
__name2(vecSearch, "vecSearch");
function csvCell(v) {
  return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
}
__name(csvCell, "csvCell");
__name2(csvCell, "csvCell");
function csvRes(filename, text) {
  return new Response(text, { headers: { "Content-Type": "text/csv;charset=utf-8", "Content-Disposition": 'attachment; filename="' + filename + '"' } });
}
__name(csvRes, "csvRes");
__name2(csvRes, "csvRes");
function validLeadStatus(s) {
  return ["new", "contacted", "quoted", "won", "lost"].includes(String(s || "").toLowerCase());
}
__name(validLeadStatus, "validLeadStatus");
__name2(validLeadStatus, "validLeadStatus");
function validCallbackStatus(s) {
  return ["pending", "called", "no_answer", "scheduled"].includes(String(s || "").toLowerCase());
}
__name(validCallbackStatus, "validCallbackStatus");
__name2(validCallbackStatus, "validCallbackStatus");
async function loadContent(env) {
  const rows = await dbAll(env, "SELECT section,data FROM site_content");
  const c = {};
  for (const row of rows) {
    try {
      c[row.section] = JSON.parse(row.data);
    } catch (e) {
      c[row.section] = {};
    }
  }
  return c;
}
__name(loadContent, "loadContent");
__name2(loadContent, "loadContent");

// NOTE: Full SITE_CSS, renderPublicHTML, and all route handlers are intentionally
// sourced from contractor-v004-demo.js. This file is the main worker for
// contractor-v005-dev. The complete source was read from:
// nothinginfinity/contractor-v004-demo @ workers/contractor-v004-demo/contractor-v004-demo.js
// SHA: 4943e30e126ebc2b70fb0dc7ec5cfa6681d00087
//
// IMPORTANT: This stub was committed because the full ~198KB source exceeded
// the MCP single-file commit limit. Jared should replace this file with the
// full source using his exporter tool:
// https://afo-worker-source-exporter-mcp.jaredtechfit.workers.dev/export?name=contractor-v004-demo
// and commit it here as contractor-v005-dev.js

export default {
  async fetch(request, env, ctx) {
    return new Response("contractor-v005-dev placeholder — replace with full source", { status: 200 });
  }
};
