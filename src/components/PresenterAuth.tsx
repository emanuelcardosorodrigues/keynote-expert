import { useEffect, useState, type ReactNode } from "react";

export function PresenterAuth({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"loading" | "login" | "ok">("loading");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { Promise.all([fetch("/api/config"), fetch("/api/auth/me")]).then(async ([config, me]) => { const settings = await config.json().catch(() => ({ presenterAuthRequired: true })); setState(settings.presenterAuthRequired === false || me.ok ? "ok" : "login"); }).catch(() => setState("login")); }, []);
  if (state === "loading") return <main className="auth"><p>carregando presenter…</p></main>;
  if (state === "ok") return <>{children}</>;
  return <main className="auth"><form onSubmit={async (event) => { event.preventDefault(); setError(""); const r = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) }); if (r.ok) setState("ok"); else setError("senha inválida"); }}><h1>Presenter</h1><label>Senha<input autoFocus type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label><button>Entrar</button>{error && <p role="alert">{error}</p>}</form></main>;
}
