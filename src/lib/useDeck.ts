import { useCallback, useEffect, useRef, useState } from "react";
import { abrirCanal, mensagemValida } from "./sync";

/* Modo apresentador: lido uma vez, no load. A plateia nunca pode ver o
   presenter aparecer por acidente no meio da aula. */
/**
 * O alvo do evento é um campo de texto?
 *
 * Sem esta guarda, digitar um espaço no editor do roteiro AVANÇARIA o
 * slide, e um "r" zeraria o cronômetro. O handler de teclado é global,
 * então ele precisa saber quando calar a boca.
 */
export function ehEditavel(alvo: EventTarget | null): boolean {
  const el = alvo as HTMLElement | null;
  if (!el || !el.tagName) return false;
  return el.isContentEditable || /^(input|textarea|select)$/i.test(el.tagName);
}

/**
 * Este clique deve avançar o slide?
 *
 * O clique-pra-avançar é o caminho do clicker e do mouse, mas ele estava
 * engolindo TODO clique da janela: clicar dentro do campo do editor, ou
 * num botão de restaurar, avançava o slide junto. Medido: entrar no campo
 * pra editar pulava de 14 pra 15, e a projeção ia junto.
 *
 * Campo de texto, botão, link e qualquer coisa dentro do editor não
 * navegam. Com o editor aberto, clique nenhum navega: ali ele está
 * escrevendo, não apresentando.
 */
export function cliqueNavega(alvo: EventTarget | null): boolean {
  const el = alvo as HTMLElement | null;
  if (!el || typeof el.closest !== "function") return true;
  if (ehEditavel(el)) return false;
  return !el.closest("button, a, [data-nao-avanca], .pv--editando");
}

export const IS_PRESENTER =
  typeof window !== "undefined" && new URLSearchParams(window.location.search).get("presenter") === "1";

function hashIndex(total: number): number {
  if (typeof window === "undefined") return 0;
  const m = window.location.hash.match(/^#s(\d+)$/);
  if (!m) return 0;
  return Math.min(Math.max(Number(m[1]) - 1, 0), total - 1);
}

/**
 * Navegação do deck, sincronizada entre as duas janelas.
 *
 * A publicação no canal acontece dentro das funções de navegação, não num
 * efeito que observa `index`. Com efeito seria preciso um flag pra saber
 * se a mudança veio de fora e não republicar, e esse flag trava se o
 * React descartar um setState de valor igual: a partir daí o próximo
 * avanço local não seria publicado. Publicar na origem elimina o laço
 * sem flag nenhum.
 */
/**
 * Navegação com PASSOS dentro do slide.
 *
 * Os reveals (3, 15, 24, 26) e a pilha que cresce (40) são a mesma coisa:
 * o gesto de avançar primeiro completa o slide e só depois troca de
 * slide. É como um build de Keynote, e é o comportamento certo ao vivo:
 * ele não precisa acertar um botão no palco, é sempre a mesma tecla.
 *
 * Voltar de um slide entra nele COMPLETO (último passo), não no estado
 * inicial: quem volta quer rever o que já mostrou, não refazer o reveal
 * na frente da sala.
 */
export function useDeck(total: number, passosPorSlide: number[]) {
  const [index, setIndex] = useState(() => hashIndex(total));
  const [passo, setPasso] = useState(0);

  /* O canal responde `whereAreWe` de dentro do onmessage, que é criado
     uma vez só. Sem a ref ele responderia sempre com o índice do momento
     em que o efeito rodou. */
  const indexRef = useRef(index);
  indexRef.current = index;
  const passoRef = useRef(passo);
  passoRef.current = passo;
  const passosRef = useRef(passosPorSlide);
  passosRef.current = passosPorSlide;

  const canalRef = useRef<BroadcastChannel | null>(null);
  /* Vira true no primeiro avanço local OU ao adotar um estado remoto.
     Depois disso, um `here` atrasado não puxa mais esta janela. */
  const jaSeSituou = useRef(false);

  /* Cronômetros do presenter. Vivem aqui porque quem sabe a hora que o
     slide mudou é quem muda o slide. */
  const [inicioAula, setInicioAula] = useState<number | null>(null);
  const [entrouNoSlide, setEntrouNoSlide] = useState(() => Date.now());

  const limite = useCallback((n: number) => Math.min(Math.max(n, 0), total - 1), [total]);

  const aplicar = useCallback(
    (n: number, p: number) => {
      jaSeSituou.current = true;
      const v = limite(n);
      setIndex((atual) => {
        if (v !== atual) {
          setEntrouNoSlide(Date.now());
          setInicioAula((i) => i ?? Date.now());
        }
        return v;
      });
      setPasso(Math.max(0, Math.min(p, passosRef.current[v] ?? 0)));
    },
    [limite]
  );

  /* Mudança vinda de fora: aplica e NÃO republica. */
  const aplicarRemoto = aplicar;

  /* Mudança local: aplica e publica pras outras janelas. */
  const irPara = useCallback(
    (n: number, p = 0) => {
      aplicar(n, p);
      canalRef.current?.postMessage({ type: "goto", slide: limite(n), passo: p });
    },
    [aplicar, limite]
  );

  const proximo = useCallback(() => {
    const i = indexRef.current;
    const maxPasso = passosRef.current[i] ?? 0;
    if (passoRef.current < maxPasso) irPara(i, passoRef.current + 1);
    else irPara(i + 1, 0);
  }, [irPara]);

  const anterior = useCallback(() => {
    const i = indexRef.current;
    if (passoRef.current > 0) irPara(i, passoRef.current - 1);
    /* Entra no slide anterior COMPLETO. */
    else irPara(i - 1, passosRef.current[Math.max(0, i - 1)] ?? 0);
  }, [irPara]);

  const zerarCronometro = useCallback(() => {
    setInicioAula(null);
    setEntrouNoSlide(Date.now());
  }, []);

  const forcarSincronia = useCallback(() => {
    canalRef.current?.postMessage({ type: "whereAreWe" });
  }, []);

  /* ── Canal ── */
  useEffect(() => {
    const ch = abrirCanal();
    canalRef.current = ch;
    if (!ch) return;

    ch.onmessage = (e) => {
      const m = e.data;
      if (!mensagemValida(m)) return;
      if (m.type === "goto") {
        aplicarRemoto(m.slide, m.passo ?? 0);
      } else if (m.type === "whereAreWe") {
        ch.postMessage({ type: "here", slide: indexRef.current, passo: passoRef.current });
      } else if (m.type === "here" && !jaSeSituou.current) {
        aplicarRemoto(m.slide, m.passo ?? 0);
      }
    };

    /* Pergunta ao abrir. Se ninguém responder (é a primeira janela), fica
       no slide que veio da âncora. */
    ch.postMessage({ type: "whereAreWe" });

    return () => {
      ch.onmessage = null;
      ch.close();
      canalRef.current = null;
    };
  }, [aplicarRemoto]);

  /* ── Teclado ── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (ehEditavel(e.target)) return;

      const frente = ["ArrowRight", "ArrowDown", "PageDown", " ", "Spacebar", "Enter"];
      const tras = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"];

      if (frente.includes(e.key)) {
        e.preventDefault();
        proximo();
      } else if (tras.includes(e.key)) {
        e.preventDefault();
        anterior();
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        zerarCronometro();
      } else if (e.key === "f" || e.key === "F") {
        /* Fora da lista mínima do briefing, mantida por consistência com o
           deck da Aula 2: projetar do notebook exige tela cheia e ele já
           tem esse dedo. */
        e.preventDefault();
        if (document.fullscreenElement) void document.exitFullscreen();
        else void document.documentElement.requestFullscreen().catch(() => {});
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [proximo, anterior, zerarCronometro]);

  /* ── Âncora ──
     Espelha o slide na URL sem empilhar histórico. Serve de rede: se uma
     das janelas recarregar, ela volta no slide certo mesmo que o canal
     não exista. */
  useEffect(() => {
    const quer = `#s${index + 1}`;
    if (window.location.hash !== quer) window.history.replaceState(null, "", quer);
  }, [index]);

  /* Editar a âncora na barra de endereço pula pro slide, no passo ZERO.
     É o atalho de ensaio ("deixa eu ver o 40 de novo") e ensaiar um slide
     com build significa ver o build acontecer, não chegar nele pronto.
     Diferente de VOLTAR um slide, que entra completo porque ali ele já
     mostrou. Não faz laço com o efeito acima: replaceState não emite
     hashchange. */
  useEffect(() => {
    const onHash = () => irPara(hashIndex(total), 0);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [irPara, total]);

  return {
    index,
    passo,
    total,
    proximo,
    anterior,
    irPara,
    inicioAula,
    entrouNoSlide,
    zerarCronometro,
    forcarSincronia,
  };
}

/**
 * Escala o palco de 1920x1080 pra caber na viewport preservando o
 * aspecto. Deck projetado não pode reflowar: o que ele ensaiou no
 * notebook tem que ser exatamente o que a plateia vê no projetor.
 */
export function useStageScale(w = 1920, h = 1080) {
  const [scale, setScale] = useState(() =>
    typeof window === "undefined" ? 1 : Math.min(window.innerWidth / w, window.innerHeight / h)
  );
  useEffect(() => {
    const onResize = () => setScale(Math.min(window.innerWidth / w, window.innerHeight / h));
    onResize();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [w, h]);
  return scale;
}

/** Relógio de 1s. Só o presenter usa: a tela pública não re-renderiza à toa. */
export function useTique(ativo: boolean) {
  const [, setT] = useState(0);
  useEffect(() => {
    if (!ativo) return;
    const id = setInterval(() => setT((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [ativo]);
}

export function mmss(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
