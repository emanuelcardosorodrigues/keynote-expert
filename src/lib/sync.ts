/* ═══════════════════════════════════════════════════════════════════
   Sincronia entre a janela projetada e a do apresentador.

   BroadcastChannel: API nativa, mesma origem, sem backend e sem custo.
   Sem setup, sem pareamento, sem código de sessão. Abriu as duas URLs,
   funciona — que é o requisito de uso ao vivo.

   Protocolo, três mensagens:

     goto        alguém avançou; todo mundo vai pro slide n
     whereAreWe  janela nova perguntando em que slide a aula está
     here        resposta de quem já estava aberto

   O `here` existe pro caso de ele fechar e reabrir o presenter no meio
   da aula: sem ele, a janela nova entraria no slide 1 e a sincronia
   puxaria a projeção de volta pro começo na frente de todo mundo.
   ═══════════════════════════════════════════════════════════════════ */

export type Msg =
  | { type: "goto"; slide: number; passo?: number }
  | { type: "whereAreWe" }
  | { type: "here"; slide: number; passo?: number };

/** Um canal por deck: dois decks abertos na mesma origem não se cruzam. */
export const CANAL = "deck-lps-slide-aula06";

/**
 * Sem BroadcastChannel (navegador antigo, contexto sem suporte), retorna
 * null e cada janela funciona sozinha. Perde a sincronia, não quebra a
 * aula.
 */
export function abrirCanal(nome = CANAL): BroadcastChannel | null {
  if (typeof BroadcastChannel === "undefined") return null;
  try {
    return new BroadcastChannel(nome);
  } catch {
    return null;
  }
}

/** Descarta lixo de outras abas/extensões antes de aplicar. */
export function mensagemValida(m: unknown): m is Msg {
  if (!m || typeof m !== "object") return false;
  const t = (m as { type?: unknown }).type;
  if (t === "whereAreWe") return true;
  if (t === "goto" || t === "here") {
    const p = (m as { passo?: unknown }).passo;
    return Number.isInteger((m as { slide?: unknown }).slide) && (p === undefined || Number.isInteger(p));
  }
  return false;
}
