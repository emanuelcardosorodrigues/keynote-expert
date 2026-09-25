export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  ADMIN_PASSWORD_SHA256: string;
  SESSION_DAYS?: string;
}

const COOKIE = "lps_session";
const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
const id = () => crypto.randomUUID();

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function cookie(request: Request) {
  return request.headers.get("cookie")?.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`))?.[1];
}

async function user(request: Request, env: Env) {
  const token = cookie(request);
  if (!token) return null;
  return env.DB.prepare("SELECT u.id, u.email, u.role FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND u.active=1 AND s.expires_at > datetime('now')").bind(await digest(token)).first<{ id: string; email: string; role: string }>();
}

async function login(request: Request, env: Env) {
  const body = await request.json().catch(() => null) as { password?: string } | null;
  if (!body?.password || (await digest(body.password)).toLowerCase() !== env.ADMIN_PASSWORD_SHA256.toLowerCase()) return json({ error: "invalid_credentials" }, 401);
  const token = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  const days = Number(env.SESSION_DAYS || 90);
  const expires = new Date(Date.now() + days * 86400000).toISOString().replace("T", " ").replace("Z", "");
  const existing = await env.DB.prepare("SELECT id FROM users WHERE email='admin' LIMIT 1").first<{ id: string }>();
  const uid = existing?.id || id();
  await env.DB.batch([
    env.DB.prepare("INSERT OR IGNORE INTO users (id,email,role) VALUES (?,?,'admin')").bind(uid, "admin"),
    env.DB.prepare("INSERT OR REPLACE INTO sessions (token_hash,user_id,expires_at) VALUES (?,?,?)").bind(await digest(token), uid, expires),
  ]);
  return new Response(JSON.stringify({ user: { id: uid, email: "admin", role: "admin" } }), { headers: { ...JSON_HEADERS, "set-cookie": `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${days * 86400}` } });
}

async function api(request: Request, env: Env, url: URL) {
  if (url.pathname === "/api/auth/login" && request.method === "POST") return login(request, env);
  if (url.pathname === "/api/auth/logout" && request.method === "POST") return new Response(null, { status: 204, headers: { "set-cookie": `${COOKIE}=; Path=/; Max-Age=0` } });
  const current = await user(request, env);
  if (!current) return json({ error: "unauthorized" }, 401);
  if (url.pathname === "/api/auth/me") return json({ user: current });
  if (current.role !== "admin") return json({ error: "forbidden" }, 403);
  if (url.pathname === "/api/admin/users" && request.method === "GET") return json(await env.DB.prepare("SELECT id,email,role,active,created_at FROM users ORDER BY created_at DESC").all());
  if (url.pathname === "/api/admin/users" && request.method === "POST") {
    const b = await request.json() as { email?: string; role?: string };
    if (!b.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.email)) return json({ error: "invalid_email" }, 400);
    await env.DB.prepare("INSERT INTO users (id,email,role) VALUES (?,?,?)").bind(id(), b.email.toLowerCase(), b.role === "admin" ? "admin" : "presenter").run();
    return json({ ok: true }, 201);
  }
  const userMatch = url.pathname.match(/^\/api\/admin\/users\/([^/]+)$/);
  if (userMatch && request.method === "DELETE") { await env.DB.prepare("UPDATE users SET active=0 WHERE id=?").bind(userMatch[1]).run(); return json({ ok: true }); }
  if (url.pathname === "/api/admin/slides" && request.method === "GET") return json(await env.DB.prepare("SELECT * FROM slides WHERE deck_slug=? ORDER BY position").bind("lps-slide-aula06").all());
  const slideMatch = url.pathname.match(/^\/api\/admin\/slides\/([^/]+)$/);
  if (slideMatch && request.method === "PUT") {
    const b = await request.json() as { cue?: string; tone?: string; next_cue?: string };
    await env.DB.prepare("UPDATE slides SET cue=?, tone=?, next_cue=?, updated_at=datetime('now') WHERE id=?").bind(b.cue || "", b.tone || "", b.next_cue || "", slideMatch[1]).run();
    return json({ ok: true });
  }
  if (url.pathname === "/api/metrics/time" && request.method === "POST") {
    const b = await request.json() as { slide?: number; seconds?: number };
    if (!Number.isInteger(b.slide) || !Number.isFinite(b.seconds) || (b.seconds || 0) < 0) return json({ error: "invalid_metric" }, 400);
    await env.DB.prepare("INSERT INTO slide_time (user_id,deck_slug,slide_position,seconds) VALUES (?,?,?,?) ON CONFLICT(user_id,deck_slug,slide_position) DO UPDATE SET seconds=seconds+excluded.seconds, viewed_at=datetime('now')").bind(current.id, "lps-slide-aula06", b.slide, Math.round(b.seconds || 0)).run();
    return json({ ok: true });
  }
  if (url.pathname === "/api/admin/metrics" && request.method === "GET") return json(await env.DB.prepare("SELECT slide_position, SUM(seconds) seconds FROM slide_time WHERE deck_slug=? GROUP BY slide_position ORDER BY slide_position").bind("lps-slide-aula06").all());
  return json({ error: "not_found" }, 404);
}

export default { async fetch(request: Request, env: Env) { const url = new URL(request.url); if (url.pathname.startsWith("/api/")) return api(request, env, url); return env.ASSETS.fetch(request); } };
