import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { TrendUp, type Icon } from "@phosphor-icons/react";
import { useSlideVariants } from "@/lib/motion";
import { PESO_ICONE, Respira } from "@/components/pieces";
import { useSlideActive, useSlidePasso } from "@/components/SlideFrame";

/* ═══════════════════════════════════════════════════════════════════
   Reveal: o gatilho estrutural do deck (slides 3, 15, 24, 26).

   O "depois" não existe na tela até o passo 1. Isso cria uma pergunta
   que só a fala responde, no tempo dele.

   O estado NÃO mora aqui: vem do `passo` do slide, que viaja pelo
   BroadcastChannel. Com estado local, a projeção revelaria e o presenter
   não — as duas janelas ficariam contando histórias diferentes.
   ═══════════════════════════════════════════════════════════════════ */

/** Conta de 0 até o valor quando o reveal acontece, não quando o slide entra. */
function useContagem(ate: number, ligado: boolean, ms = 900) {
  const { reduce } = useSlideVariants();
  const [v, setV] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!ligado) {
      setV(0);
      return;
    }
    if (reduce) {
      setV(ate);
      return;
    }
    let ini = 0;
    const passo = (t: number) => {
      if (!ini) ini = t;
      const p = Math.min((t - ini) / ms, 1);
      setV(ate * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf.current = requestAnimationFrame(passo);
    };
    raf.current = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf.current);
  }, [ligado, reduce, ate, ms]);

  return v;
}

function milReais(v: number) {
  return `R$ ${Math.round(v)} mil`;
}

/**
 * Card antes/depois (slides 15, 24, 25, 26).
 *
 * `comReveal` false = os dois valores desde o início (slide 25: a tensão
 * já foi usada no 15, repetir viraria maneirismo).
 */
export function CardAntesDepois({
  nome,
  antes,
  depois,
  comReveal = true,
}: {
  nome: string;
  /** Em milhares de reais. */
  antes: number;
  depois: number;
  comReveal?: boolean;
}) {
  const { item, reduce } = useSlideVariants();
  const passo = useSlidePasso();
  const active = useSlideActive();
  const revelado = comReveal ? passo >= 1 : true;
  const v = useContagem(depois, revelado && active);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
      <motion.span variants={item} className="legenda" style={{ fontSize: 34, color: "var(--fg-3)" }}>
        {nome}
      </motion.span>

      <div style={{ display: "flex", alignItems: "center", gap: 76 }}>
        <motion.span variants={item} className="num" style={{ fontSize: 128, color: "var(--fg-3)" }}>
          {milReais(antes)}
        </motion.span>

        {/* A seta só existe depois do reveal: antes dela, o slide é uma
            frase pela metade, que é o ponto. */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ opacity: revelado ? 1 : 0, x: revelado ? 0 : -22 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex" }}
        >
          <TrendUp size={72} weight={PESO_ICONE} color="var(--accent-display)" />
        </motion.span>

        <motion.span
          initial={false}
          animate={{ opacity: revelado ? 1 : 0, scale: revelado ? 1 : 0.82 }}
          transition={{ type: "spring", stiffness: 160, damping: 20 }}
          className="num"
          style={{ fontSize: 168, whiteSpace: "nowrap" }}
        >
          <Respira escala={revelado ? 0.012 : 0} segundos={6}>
            <span>{milReais(v)}</span>
          </Respira>
        </motion.span>
      </div>
    </div>
  );
}

/**
 * Slide 3: o nome e a seta que para no meio.
 *
 * A seta entra desenhando e trava em 50% até o reveal. É o mesmo
 * mecanismo dos cards: a tela fica declaradamente incompleta enquanto
 * ele fala, e o clique fecha.
 */
export function NomeIncompleto({ nome, glyph = TrendUp }: { nome: string; glyph?: Icon }) {
  const { item, reduce } = useSlideVariants();
  const passo = useSlidePasso();
  const completo = passo >= 1;
  const G = glyph;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 54 }}>
      <motion.h2 variants={item} className="d-xl" style={{ color: "var(--fg-3)" }}>
        {nome}
      </motion.h2>

      {/* O "desenhar" é um clip que sobe: o ícone é de biblioteca, só a
          revelação dele é animada. */}
      <motion.div
        variants={item}
        style={{ overflow: "hidden", display: "flex" }}
        animate={{ height: completo ? 132 : 66 }}
        transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", height: 132 }}>
          <G size={132} weight={PESO_ICONE} color="var(--fg-4)" aria-hidden />
        </div>
      </motion.div>
    </div>
  );
}
