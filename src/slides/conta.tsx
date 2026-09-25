import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, type Icon } from "@phosphor-icons/react";
import { brl, useSlideVariants } from "@/lib/motion";
import { Item, PESO_ICONE, Respira } from "@/components/pieces";
import { useSlideActive } from "@/components/SlideFrame";

/* Geometria do recibo. Constantes porque a animação de "assentar" é um
   transform exato entre dois estados conhecidos: nada aqui é medido em
   runtime, então não há layout thrash nem salto entre navegadores. */
const ALTURA_LINHA = 104;
const ESPACO = 24;
const ESCALA_GRANDE = 2.2;
const DESCE_GRANDE = 156;
const SOBE_PILHA = 44;
/** Quanto o valor novo fica grande antes de assentar. */
const MS_ATE_ASSENTAR = 1700;

export type ItemSoma = { id: string; valor: string; glyph: Icon };

/** Uma linha do recibo: ícone + valor, centralizados. */
function Linha({ valor, glyph: G, tom }: { valor: string; glyph: Icon; tom: "novo" | "antigo" }) {
  const cor = tom === "novo" ? "var(--accent-display)" : "var(--fg-3)";
  return (
    <div
      style={{
        height: ALTURA_LINHA,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 26,
      }}
    >
      <G size={64} weight={PESO_ICONE} color={cor} aria-hidden style={{ flex: "none" }} />
      <span className="num" style={{ fontSize: 68, color: cor, whiteSpace: "nowrap" }}>
        {valor}
      </span>
    </div>
  );
}

/**
 * Soma acumulada (slides 11 a 14).
 *
 * O valor novo entra grande e depois assenta no topo da pilha, reduzido,
 * abrindo espaço pro próximo. Quem entrou atrasado no slide 14 entende a
 * conta só de olhar o recibo.
 *
 * O "assentar" é o MESMO nó do DOM indo de um estado a outro por
 * transform (escala 2.5 e deslocamento pra baixo → escala 1 na própria
 * vaga). Não é crossfade entre dois elementos, então não existe momento
 * em que o valor aparece duplicado. E é transform puro: nada de animar
 * font-size, que faria relayout a cada frame.
 */
export function SomaAcumulada({ itens, index }: { itens: ItemSoma[]; index: number }) {
  const active = useSlideActive();
  const { item, reduce } = useSlideVariants();
  const [assentou, setAssentou] = useState(false);

  useEffect(() => {
    if (!active) {
      setAssentou(false);
      return;
    }
    if (reduce) {
      setAssentou(true);
      return;
    }
    const t = setTimeout(() => setAssentou(true), MS_ATE_ASSENTAR);
    return () => clearTimeout(t);
  }, [active, reduce]);

  const anteriores = itens.slice(0, index);
  const novo = itens[index];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* A pilha sobe um pouco enquanto o valor novo está grande, e volta
          quando ele assenta. Os dois movimentos juntos é que leem como
          "abrir espaço". */}
      <motion.div
        animate={{ y: assentou ? 0 : -SOBE_PILHA }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        style={{ display: "flex", flexDirection: "column", gap: ESPACO }}
      >
        {anteriores.map((it) => (
          <motion.div key={it.id} variants={item}>
            <Linha valor={it.valor} glyph={it.glyph} tom="antigo" />
          </motion.div>
        ))}

        {novo ? (
          <motion.div
            key={novo.id}
            initial={false}
            animate={{
              scale: assentou ? 1 : ESCALA_GRANDE,
              y: assentou ? 0 : DESCE_GRANDE,
            }}
            transition={{ type: "spring", stiffness: 110, damping: 18 }}
            style={{ transformOrigin: "center center" }}
          >
            <Linha valor={novo.valor} glyph={novo.glyph} tom="novo" />
          </motion.div>
        ) : null}
      </motion.div>
    </div>
  );
}

/**
 * Total (slide 15).
 *
 * O recibo inteiro colapsa numa animação de soma e o total aparece maior
 * que tudo que veio antes. As linhas convergem pro centro e somem; o
 * total nasce no lugar delas.
 */
export function Total({
  itens,
  valor,
  sufixo,
}: {
  itens: ItemSoma[];
  valor: string;
  sufixo: string;
}) {
  const active = useSlideActive();
  const { item, reduce } = useSlideVariants();
  const [somou, setSomou] = useState(false);

  useEffect(() => {
    if (!active) {
      setSomou(false);
      return;
    }
    if (reduce) {
      setSomou(true);
      return;
    }
    const t = setTimeout(() => setSomou(true), 1500);
    return () => clearTimeout(t);
  }, [active, reduce]);

  return (
    <div style={{ position: "relative", display: "grid", placeItems: "center", width: "100%", height: 620 }}>
      {/* Recibo colapsando: as linhas andam pro centro e apagam. */}
      <motion.div
        aria-hidden={somou}
        animate={{ opacity: somou ? 0 : 1, scale: somou ? 0.8 : 1 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ position: "absolute", display: "flex", flexDirection: "column", gap: ESPACO }}
      >
        {itens.map((it, i) => (
          <motion.div
            key={it.id}
            variants={item}
            animate={somou ? { y: (itens.length / 2 - i - 0.5) * (ALTURA_LINHA + ESPACO) } : undefined}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <Linha valor={it.valor} glyph={it.glyph} tom="antigo" />
          </motion.div>
        ))}
      </motion.div>

      {/* O total: maior que tudo que veio antes, em cor de acento. */}
      <motion.div
        initial={false}
        animate={{ opacity: somou ? 1 : 0, scale: somou ? 1 : 0.72 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        style={{ position: "absolute" }}
      >
        <Respira escala={0.012} segundos={6}>
          <span style={{ display: "flex", alignItems: "baseline", gap: 24, whiteSpace: "nowrap" }}>
            <span className="num" style={{ fontSize: 156 }}>
              {valor}
            </span>
            <span className="d-m" style={{ fontSize: 66, color: "var(--fg-3)" }}>
              {sufixo}
            </span>
          </span>
        </Respira>
      </motion.div>
    </div>
  );
}

/* ═══ Contagem ═════════════════════════════════════════════════════ */

function useContagem(ate: number, ms = 1200) {
  const active = useSlideActive();
  const { reduce } = useSlideVariants();
  const [v, setV] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!active) {
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
  }, [active, reduce, ate, ms]);

  return v;
}

/**
 * Base do cálculo (slide 10). O número sobe de 0 até o valor final já
 * formatado em reais durante a contagem: número cru subindo não lê como
 * dinheiro.
 */
export function Base({ valor, sufixo, legenda }: { valor: number; sufixo: string; legenda: string }) {
  const v = useContagem(valor);
  const { item } = useSlideVariants();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      <motion.div variants={item} style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
        <span className="num" style={{ fontSize: 172, whiteSpace: "nowrap" }}>
          {brl(v)}
        </span>
        <span className="d-m" style={{ fontSize: 64, color: "var(--fg-3)" }}>
          {sufixo}
        </span>
      </motion.div>
      <motion.span variants={item} className="legenda">
        {legenda}
      </motion.span>
    </div>
  );
}

/**
 * Ancoragem (slide 28). O segundo número nasce do primeiro: o `x12`
 * acontece na tela em vez de só aparecer o resultado.
 */
export function Ancoragem({ mes, ano, fator }: { mes: string; ano: string; fator: string }) {
  const active = useSlideActive();
  const { item, reduce } = useSlideVariants();
  const [fase, setFase] = useState(0);

  useEffect(() => {
    if (!active) {
      setFase(0);
      return;
    }
    if (reduce) {
      setFase(2);
      return;
    }
    const a = setTimeout(() => setFase(1), 900);
    const b = setTimeout(() => setFase(2), 1750);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [active, reduce]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44 }}>
      <motion.span variants={item} className="d-l" style={{ fontSize: 92, color: "var(--fg-2)" }}>
        {mes}
      </motion.span>

      {/* O multiplicador entra entre os dois, e é ele que explica o salto. */}
      <motion.div
        initial={false}
        animate={{ opacity: fase >= 1 ? 1 : 0, scale: fase >= 1 ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        style={{ display: "flex", alignItems: "center", gap: 18 }}
      >
        <ArrowRight size={54} weight={PESO_ICONE} color="var(--accent-display)" aria-hidden />
        <span className="num" style={{ fontSize: 76 }}>
          {fator}
        </span>
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: fase >= 2 ? 1 : 0, scale: fase >= 2 ? 1 : 0.78, y: fase >= 2 ? 0 : 18 }}
        transition={{ type: "spring", stiffness: 150, damping: 19 }}
      >
        <Respira escala={0.012} segundos={6}>
          <span className="num" style={{ fontSize: 150, whiteSpace: "nowrap" }}>
            {ano}
          </span>
        </Respira>
      </motion.div>
    </div>
  );
}

/** Reexport pra deck.tsx montar as linhas sem importar o arquivo todo. */
export { Item };
