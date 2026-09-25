import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSlideVariants } from "@/lib/motion";
import { Respira } from "@/components/pieces";
import { assetUrl } from "@/components/AssetSlot";
import { useSlideActive, useSlidePasso } from "@/components/SlideFrame";

/* ═══════════════════════════════════════════════════════════════════
   O gancho é matemático, não narrativo (slides 2 e 3).

   A plateia assistiu cinco aulas e cada uma deixou um número. Aqui os
   cinco entram um por clique e viram uma conta só. É a diferença entre
   "o evento valeu" dito por ele e "o evento valeu" somado na frente da
   sala: o segundo a plateia confere sozinha.

   Cada linha carrega a thumbnail REAL da aula que produziu o número.
   Sem ela a pilha seria cinco valores afirmados; com ela, cada valor
   aponta pra uma noite que a pessoa passou assistindo.
   ═══════════════════════════════════════════════════════════════════ */

const ALTURA = 128;
const ESPACO = 22;
/** Quanto o valor novo cresce antes de assentar. */
const ESCALA_GRANDE = 1.35;
const DESCE_GRANDE = 118;
const SOBE_PILHA = 52;
const MS_ATE_ASSENTAR = 1500;

export type ItemGancho = {
  id: string;
  label: string;
  valor: string;
  /** Id do asset da thumbnail da aula que produziu este número. */
  thumb: string;
};

const LARGURA_THUMB = 208;
const ALTURA_THUMB = 117;

/**
 * Miniatura da aula. Sem asset, um retângulo com o número do dia: a
 * pilha continua legível e o buraco aparece só pra quem sabe o que
 * deveria estar ali.
 */
function Thumb({ id, label }: { id: string; label: string }) {
  const url = assetUrl(id);
  return (
    <div
      style={{
        width: LARGURA_THUMB,
        height: ALTURA_THUMB,
        position: "relative",
        borderRadius: 10,
        overflow: "hidden",
        flex: "none",
        background: "var(--bg-2)",
        border: "1px solid var(--line)",
        display: "grid",
        placeItems: "center",
      }}
    >
      {url ? (
        <img src={url} alt={label} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span className="kicker" style={{ fontSize: 13, opacity: 0.6 }}>
          {label}
        </span>
      )}
    </div>
  );
}

/**
 * Uma linha da conta: thumbnail, assunto, valor.
 *
 * O valor é alinhado à direita numa coluna de largura fixa pra que os
 * cinco números fiquem na mesma vertical. Conta com os algarismos
 * dançando de linha em linha não lê como conta.
 */
function Linha({ item, tom }: { item: ItemGancho; tom: "novo" | "antigo" }) {
  const cor = tom === "novo" ? "var(--accent-display)" : "var(--fg-3)";
  return (
    <div style={{ height: ALTURA, display: "flex", alignItems: "center", gap: 40 }}>
      <Thumb id={item.thumb} label={item.label} />
      <span
        className="d-m"
        style={{ fontSize: 54, color: "var(--fg-3)", width: 520, textAlign: "left", fontWeight: 400 }}
      >
        {item.label}
      </span>
      <span className="num" style={{ fontSize: 80, color: cor, width: 360, textAlign: "right" }}>
        {item.valor}
      </span>
    </div>
  );
}

/**
 * Soma acumulada com thumbnail (slide 2).
 *
 * O passo do slide é o índice: um clique, um item. O valor novo entra
 * grande e assenta sozinho depois de 1,5s, sem gastar um clique — ao
 * vivo, cada clique tem que produzir informação nova, não terminar a
 * animação do clique anterior.
 */
export function SomaComThumb({ itens }: { itens: ItemGancho[] }) {
  const passo = useSlidePasso();
  const active = useSlideActive();
  const { item, reduce } = useSlideVariants();
  const [assentou, setAssentou] = useState(false);

  const index = Math.min(passo, itens.length - 1);

  /* Reinicia a cada passo: o item que acabou de entrar precisa crescer de
     novo. Sem `passo` na dependência, o segundo item nasceria já
     assentado porque o timer do primeiro já tinha vencido. */
  useEffect(() => {
    if (!active) {
      setAssentou(false);
      return;
    }
    if (reduce) {
      setAssentou(true);
      return;
    }
    setAssentou(false);
    const t = setTimeout(() => setAssentou(true), MS_ATE_ASSENTAR);
    return () => clearTimeout(t);
  }, [active, reduce, index]);

  const anteriores = itens.slice(0, index);
  const novo = itens[index];

  return (
    <motion.div
      animate={{ y: assentou ? 0 : -SOBE_PILHA }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      style={{ display: "flex", flexDirection: "column", gap: ESPACO }}
    >
      {anteriores.map((it) => (
        <motion.div key={it.id} variants={item}>
          <Linha item={it} tom="antigo" />
        </motion.div>
      ))}

      {novo ? (
        <motion.div
          key={novo.id}
          initial={false}
          animate={{ scale: assentou ? 1 : ESCALA_GRANDE, y: assentou ? 0 : DESCE_GRANDE }}
          transition={{ type: "spring", stiffness: 110, damping: 18 }}
          style={{ transformOrigin: "center center" }}
        >
          <Linha item={novo} tom="novo" />
        </motion.div>
      ) : null}
    </motion.div>
  );
}

/**
 * O total (slide 3).
 *
 * A pilha inteira converge pro centro e apaga; o total nasce no lugar
 * dela. É o mesmo gesto do deck da Aula 5, mas aqui as linhas que
 * colapsam carregam thumbnail, então o que some da tela é literalmente
 * a semana.
 */
export function TotalGancho({
  itens,
  valor,
  legenda,
}: {
  itens: ItemGancho[];
  valor: string;
  legenda: string;
}) {
  const active = useSlideActive();
  const { reduce } = useSlideVariants();
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
    const t = setTimeout(() => setSomou(true), 1300);
    return () => clearTimeout(t);
  }, [active, reduce]);

  const alturaPilha = itens.length * ALTURA + (itens.length - 1) * ESPACO;

  return (
    <div style={{ position: "relative", display: "grid", placeItems: "center", width: "100%", height: 720 }}>
      <motion.div
        aria-hidden={somou}
        animate={{ opacity: somou ? 0 : 1, scale: somou ? 0.82 : 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ position: "absolute", display: "flex", flexDirection: "column", gap: ESPACO }}
      >
        {itens.map((it, i) => (
          <motion.div
            key={it.id}
            initial={false}
            animate={somou ? { y: (itens.length / 2 - i - 0.5) * (ALTURA + ESPACO) } : { y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Linha item={it} tom="antigo" />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={false}
        animate={{ opacity: somou ? 1 : 0, scale: somou ? 1 : 0.72 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}
        aria-hidden={!somou}
      >
        <Respira escala={0.014} segundos={5}>
          <span className="num" style={{ fontSize: 200, whiteSpace: "nowrap", display: "block" }}>
            {valor}
          </span>
        </Respira>
        <span className="d-m" style={{ fontSize: 54, color: "var(--fg-3)", fontWeight: 400 }}>
          {legenda}
        </span>
      </motion.div>

      {/* Reserva a altura da pilha mesmo depois do colapso, senão o bloco
          encolhe e o total salta de posição no meio da animação. */}
      <div style={{ height: alturaPilha, width: 1, opacity: 0 }} aria-hidden />
    </div>
  );
}
