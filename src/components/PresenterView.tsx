import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Slide } from "@/deck";
import { SlideAtivo } from "@/components/SlideFrame";
import { ehEditavel, mmss, useTique } from "@/lib/useDeck";
import {
  carregar,
  editar,
  exportar,
  quantasEdicoes,
  restaurarSlide,
  restaurarTudo,
  type Campo,
  type Edicoes,
} from "@/lib/roteiro";

/* ═══════════════════════════════════════════════════════════════════
   Presenter view. Só existe em ?presenter=1 e nunca aparece na URL
   pública.

   Hierarquia de leitura, de cima pra baixo, na ordem em que ele precisa:

     1. DIZ       o que ele fala agora. É a única coisa que ele precisa
                  bater o olho e captar em meio segundo, então ocupa a
                  maior parte da tela e nada compete com ela;
     2. TOM       como entrega, em ouro, menor;
     3. A SEGUIR  o que vem depois, no rodapé;
     4. relógios  contador exato e tempo, no canto oposto.

   Fundo navy sólido, nunca creme: a aula é às 7h e tela clara na cara
   cansa e reflete em quem está em câmera.

   O texto do roteiro é editável aqui (tecla E). As edições ficam em
   localStorage e as quebras de linha são preservadas, porque o ponto de
   editar é justamente quebrar o texto do jeito que ele lê.
   ═══════════════════════════════════════════════════════════════════ */

export function PresenterView({
  slide,
  proximoSlide,
  index,
  passo,
  total,
  inicioAula,
  entrouNoSlide,
  forcarSincronia,
}: {
  slide: Slide;
  proximoSlide: Slide | undefined;
  index: number;
  passo: number;
  total: number;
  inicioAula: number | null;
  entrouNoSlide: number;
  forcarSincronia: () => void;
}) {
  /* Um tique por segundo só aqui: a janela projetada não re-renderiza
     por causa de relógio. */
  useTique(true);
  const agora = Date.now();

  const [edicoes, setEdicoes] = useState<Edicoes>(() => carregar());
  const [editando, setEditando] = useState(false);
  const [aviso, setAviso] = useState("");
  const vistoEm = useRef(Date.now());
  const vistoSlide = useRef(slide.n);
  const [nota, setNota] = useState(() => {
    try { return localStorage.getItem(`deck-keynote-expert:nota:${slide.n}`) || ""; } catch { return ""; }
  });

  useEffect(() => { try { localStorage.setItem(`deck-keynote-expert:nota:${slide.n}`, nota); } catch { /* storage opcional */ } }, [slide.n, nota]);
  useEffect(() => {
    const anterior = vistoEm.current;
    vistoEm.current = Date.now();
    if (anterior === 0) return;
    const seconds = Math.max(0, Math.round((Date.now() - anterior) / 1000));
    const previousSlide = vistoSlide.current;
    vistoSlide.current = slide.n;
    if (seconds) void fetch("/api/metrics/time", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slide: previousSlide - 1, seconds }) });
  }, [slide.n]);

  /* O texto lido é o dele quando existe, senão o do roteiro. */
  const val = (campo: Campo) => edicoes[slide.n]?.[campo] ?? slide[campo];
  const mexido = Boolean(edicoes[slide.n]);

  const trocar = useCallback(
    (campo: Campo, valor: string) => {
      setEdicoes((e) => editar(e, slide.n, campo, valor, slide[campo]));
    },
    [slide]
  );

  /* `E` liga e desliga o editor, `Esc` sai. A guarda de campo de texto
     está no handler global do useDeck; aqui ela se repete porque este
     listener é outro. Sem isso, digitar um "e" no meio de uma palavra
     fecharia o editor. */
  useEffect(() => {
    function onKey(ev: KeyboardEvent) {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (ehEditavel(ev.target)) {
        if (ev.key === "Escape") (ev.target as HTMLElement).blur();
        return;
      }
      if (ev.key === "e" || ev.key === "E") {
        ev.preventDefault();
        setEditando((v) => !v);
        setAviso("");
      } else if (ev.key === "Escape") {
        setEditando(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function copiarExport() {
    const json = exportar(edicoes);
    try {
      await navigator.clipboard.writeText(json);
      setAviso(`${quantasEdicoes(edicoes)} slide(s) copiados pra área de transferência`);
    } catch {
      /* Sem permissão de clipboard: joga no console, que dá pra copiar. */
      console.log(json);
      setAviso("clipboard bloqueado; o JSON saiu no console do navegador");
    }
  }

  return (
    <div className={editando ? "pv pv--editando" : "pv"}>
      <div className="pv__topo">
        <div>
          <span className="pv__rotulo">
            Aula 6 · Imersão Lucro Clínico · Pitch
            {editando ? <span style={{ color: "#D4B96A" }}> · editando (E sai)</span> : null}
          </span>
          <div style={{ marginTop: 10, fontSize: 20, fontWeight: 600, color: "#8B93A3" }}>
            {`Bloco ${slide.bloco}`}
            {mexido ? <span className="pv__editado" title="texto ajustado por você" /> : null}
          </div>
        </div>

        {/* Miniatura da projeção: o slide de verdade escalado, não uma
            representação que pode divergir do que está no projetor. */}
        <div className="pv__mini" data-theme={slide.tema} style={{ background: "var(--bg)" }}>
          <div className="pv__mini-palco">
            <SlideAtivo passo={passo}>
              <div
                className="slide"
                data-theme={slide.tema}
                style={{ position: "absolute", inset: 0, background: "var(--bg)" }}
              >
                {slide.node}
              </div>
            </SlideAtivo>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 0, gap: 16 }}>
        {editando ? (
          <>
            <textarea
              className="pv__campo pv__diz"
              value={val("diz")}
              onChange={(e) => trocar("diz", e.target.value)}
              rows={5}
              spellCheck={false}
              aria-label="O que dizer neste slide"
            />
            <textarea
              className="pv__campo pv__tom"
              value={val("tom")}
              onChange={(e) => trocar("tom", e.target.value)}
              rows={2}
              spellCheck={false}
              style={{ marginTop: 0 }}
              aria-label="Tom da entrega"
            />
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button className="pv__botao" onClick={copiarExport}>
                exportar edições
              </button>
              <button className="pv__botao" onClick={() => setEdicoes((e) => restaurarSlide(e, slide.n))}>
                restaurar este slide
              </button>
              <button
                className="pv__botao"
                onClick={() => {
                  setEdicoes(restaurarTudo());
                  setAviso("tudo de volta ao roteiro original");
                }}
              >
                restaurar tudo
              </button>
              <span style={{ fontSize: 14, color: "#8B93A3" }}>
                {aviso || "Enter quebra linha. Salva sozinho, fica neste navegador."}
              </span>
            </div>
            <textarea className="pv__campo pv__nota" value={nota} onChange={(e) => setNota(e.target.value)} rows={3} placeholder="nota pessoal (só neste dispositivo)" aria-label="Nota pessoal" />
          </>
        ) : (
          /* O DIZ troca com um corte curto: no meio da fala, transição
             longa atrapalha mais do que ajuda. */
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.n}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {/* Palavras-chave, não frase pronta: ler frase pronta na
                  câmera aparece pro público. */}
              <div className="pv__diz">{val("diz")}</div>
              <div className="pv__tom">{val("tom")}</div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="pv__rodape">
        <div style={{ minWidth: 0 }}>
          {/* Quando o slide tem build, a próxima tecla NÃO troca de slide.
              Ele precisa saber disso antes de apertar. */}
          {passo < (slide.passos ?? 0) ? (
            <>
              <span className="pv__rotulo" style={{ color: "#D4B96A" }}>
                a próxima tecla revela
              </span>
              <div className="pv__proximo" style={{ marginTop: 8, color: "#D4B96A" }}>
                {slide.passoRotulo?.[passo] ?? `passo ${passo + 1} de ${slide.passos}`}
              </div>
            </>
          ) : (
            <>
          <span className="pv__rotulo">a seguir</span>
          {editando ? (
            <input
              className="pv__campo pv__proximo"
              value={val("proximo")}
              onChange={(e) => trocar("proximo", e.target.value)}
              spellCheck={false}
              style={{ marginTop: 8 }}
              aria-label="Próximo bloco"
            />
          ) : (
            <div className="pv__proximo" style={{ marginTop: 8 }}>
              {proximoSlide ? val("proximo") : "fim"}
            </div>
          )}
            </>
          )}
          <button className="pv__botao" onClick={forcarSincronia} data-nao-avanca>forçar sincronia</button>
        </div>

        <div className="pv__relogios">
          <div>
            <span className="pv__rotulo">slide</span>
            <div className="pv__numero" style={{ marginTop: 6 }}>
              {index + 1}
              <span style={{ color: "#6F7686", fontWeight: 600 }}>/{total}</span>
            </div>
          </div>
          <div>
            <span className="pv__rotulo">aula</span>
            <div className="pv__numero" style={{ marginTop: 6 }}>
              {inicioAula === null ? "--:--" : mmss(agora - inicioAula)}
            </div>
          </div>
          <div>
            <span className="pv__rotulo">neste slide</span>
            <div className="pv__numero" style={{ marginTop: 6, color: "#D4B96A" }}>
              {mmss(agora - entrouNoSlide)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
