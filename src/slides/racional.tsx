import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowRight, type Icon } from "@phosphor-icons/react";
import { useSlideVariants } from "@/lib/motion";
import { IconeGrande, Item, PESO_ICONE, Respira } from "@/components/pieces";
import { useSlideActive } from "@/components/SlideFrame";

/**
 * Objeção respondida (slides 22 e 23).
 *
 * Duas etapas automáticas dentro do mesmo slide, um clique só: a pergunta
 * entra esmaecida e depois a resposta acende em ouro com um leve
 * deslocamento lateral. As duas ficam na tela; a pergunta não some,
 * porque é ela que dá sentido à resposta pra quem chegou agora.
 */
export function ObjecaoRespondida({ pergunta, resposta }: { pergunta: string; resposta: string }) {
  const active = useSlideActive();
  const { item, reduce } = useSlideVariants();
  const [acendeu, setAcendeu] = useState(false);

  useEffect(() => {
    if (!active) {
      setAcendeu(false);
      return;
    }
    if (reduce) {
      setAcendeu(true);
      return;
    }
    const t = setTimeout(() => setAcendeu(true), 1300);
    return () => clearTimeout(t);
  }, [active, reduce]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 58 }}>
      <motion.span
        variants={item}
        className="d-m"
        style={{ fontSize: 68, color: "var(--fg-2)", opacity: 0.35 }}
      >
        {pergunta}
      </motion.span>

      <motion.div
        initial={false}
        animate={{ opacity: acendeu ? 1 : 0, x: acendeu ? 0 : -46 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <Respira escala={0.01} segundos={6}>
          <span className="d-l" style={{ color: "var(--accent-display)" }}>
            {resposta}
          </span>
        </Respira>
      </motion.div>
    </div>
  );
}

/**
 * Lógica do vazamento (slides 24 a 26).
 *
 * 24 e 25 têm gotas caindo em loop curto. O 26 quebra o padrão: ícone
 * estático, sem gota, porque ali a ideia é dinheiro PARADO, não dinheiro
 * vazando. A quebra comunica sozinha, e é por isso que ela não pode ser
 * "consertada" com uma animação qualquer.
 */
export function LogicaVazamento({
  causa,
  consequencia,
  glyph,
  vazando,
}: {
  causa: string;
  consequencia: string;
  glyph: Icon;
  vazando: boolean;
}) {
  const { item, reduce } = useSlideVariants();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 92 }}>
      <motion.div variants={item} style={{ position: "relative" }}>
        <IconeGrande glyph={glyph} size={170} halo={vazando} />

        {vazando && !reduce ? (
          <div aria-hidden style={{ position: "absolute", left: "50%", top: "100%", width: 0 }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: [-10, 58], opacity: [0, 1, 0] }}
                transition={{ duration: 1.6, delay: i * 0.5, repeat: Infinity, ease: "easeIn" }}
                style={{
                  position: "absolute",
                  left: -7 + (i - 1) * 22,
                  width: 14,
                  height: 18,
                  borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                  background: "var(--accent-display)",
                }}
              />
            ))}
          </div>
        ) : null}
      </motion.div>

      {/* A seta do roteiro ("causa → consequência") vira forma: um `→` de
          76px no meio de uma frase projetada some. As palavras e a ordem
          são as mesmas. */}
      <motion.div
        variants={item}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 30, flexWrap: "wrap" }}
      >
        <span className="d-m" style={{ fontSize: 62, color: "var(--fg-2)" }}>
          {causa}
        </span>
        <ArrowRight size={48} weight={PESO_ICONE} color="var(--accent-display)" aria-hidden style={{ flex: "none" }} />
        <span className="d-m" style={{ fontSize: 62, color: "var(--accent-display)" }}>
          {consequencia}
        </span>
      </motion.div>
    </div>
  );
}

/**
 * Seeding do bônus (slide 29).
 *
 * O slide inteiro é sobre o que NÃO está sendo mostrado, então o cadeado
 * só respira um brilho lento. Nada mais acontece de propósito.
 */
export function BonusTravado({
  texto,
  selo,
  glyph,
}: {
  texto: string;
  selo: string;
  glyph: Icon;
}) {
  const { item, reduce } = useSlideVariants();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
      <motion.div variants={item}>
        <motion.div
          animate={reduce ? {} : { opacity: [0.68, 1, 0.68] }}
          transition={reduce ? { duration: 0 } : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <IconeGrande glyph={glyph} size={162} />
        </motion.div>
      </motion.div>

      <motion.h2 variants={item} className="d-l" style={{ fontSize: 96 }}>
        {texto}
      </motion.h2>

      <motion.span
        variants={item}
        className="kicker"
        style={{
          border: "1px solid var(--line-strong)",
          borderRadius: "var(--r-pill)",
          padding: "14px 26px",
          fontSize: 22,
        }}
      >
        {selo}
      </motion.span>
    </div>
  );
}

export { Item };
