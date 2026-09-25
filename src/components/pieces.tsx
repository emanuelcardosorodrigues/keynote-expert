import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import { useSlideVariants } from "@/lib/motion";
import { BASE } from "@/lib/base";

/* Peso único de ícone no deck. "light" some no projetor; "regular" segura
   o traço a 12 metros. */
export const PESO_ICONE = "regular" as const;

/**
 * Respiração contínua.
 *
 * A aula é às 7h e cada slide fica de 1 a 3 minutos no ar enquanto ele
 * fala. Slide 100% parado por 3 minutos morre na tela. Isto é diferente
 * da animação de entrada e os dois convivem: a entrada acontece uma vez,
 * a respiração não para.
 *
 * Fica num wrapper próprio porque um `animate` explícito quebra a herança
 * de variants: quem tem `animate` não recebe mais o estado do container.
 * Por isso a entrada fica no pai e o laço aqui dentro.
 */
export function Respira({
  children,
  escala = 0.014,
  segundos = 6.5,
  style,
}: {
  children: ReactNode;
  escala?: number;
  segundos?: number;
  style?: React.CSSProperties;
}) {
  const { reduce } = useSlideVariants();
  if (reduce) return <div style={style}>{children}</div>;
  return (
    <motion.div
      style={style}
      animate={{ scale: [1, 1 + escala, 1] }}
      transition={{ duration: segundos, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Flutuação vertical lenta, pros ícones que precisam de vida própria. */
export function Flutua({
  children,
  px = 10,
  segundos = 5.5,
  style,
}: {
  children: ReactNode;
  px?: number;
  segundos?: number;
  style?: React.CSSProperties;
}) {
  const { reduce } = useSlideVariants();
  if (reduce) return <div style={style}>{children}</div>;
  return (
    <motion.div
      style={style}
      animate={{ y: [0, -px, 0] }}
      transition={{ duration: segundos, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

/** Bloco que entra como item do stagger do slide. */
export function Item({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  const { item } = useSlideVariants();
  return (
    <motion.div variants={item} style={style} className={className}>
      {children}
    </motion.div>
  );
}

/** Régua de ouro que se desenha da esquerda. scaleX, nunca width. */
export function Regua({ width = 96, height = 3 }: { width?: number; height?: number }) {
  const { rule } = useSlideVariants();
  return (
    <motion.div
      variants={rule}
      style={{
        width,
        height,
        background: "var(--accent-display)",
        borderRadius: 2,
        transformOrigin: "left center",
      }}
    />
  );
}

/**
 * Ícone grande do slide, dentro de um halo de acento.
 *
 * O halo é uma camada própria com opacidade animada em vez de
 * box-shadow animado: sombra animada repinta, opacidade compõe.
 */
export function IconeGrande({
  glyph: Glyph,
  size = 200,
  halo = true,
}: {
  glyph: Icon;
  size?: number;
  halo?: boolean;
}) {
  const { reduce } = useSlideVariants();
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      {halo ? (
        <motion.span
          aria-hidden
          animate={reduce ? { opacity: 0.5 } : { opacity: [0.32, 0.6, 0.32], scale: [1, 1.06, 1] }}
          transition={reduce ? { duration: 0 } : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            width: size * 1.7,
            height: size * 1.7,
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--accent-soft) 0%, transparent 68%)",
            pointerEvents: "none",
          }}
        />
      ) : null}
      <Glyph size={size} weight={PESO_ICONE} color="var(--accent-display)" aria-hidden style={{ position: "relative" }} />
    </div>
  );
}

/**
 * Lockup do programa: a águia e o nome.
 *
 * O PNG é bronze (#845C25). Sobre o tema frio ele vira um borrão, então
 * leva um filtro de brilho. Sobre o quente vai como é.
 */
export function MarcaPrograma({ nome, size = 118 }: { nome: string; size?: number }) {
  const { item } = useSlideVariants();
  return (
    <motion.div
      variants={item}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}
    >
      <Respira escala={0.014} segundos={7}>
        <img
          className="marca-aguia"
          src={`${BASE}images/eagle.png`}
          alt=""
          width={size}
          height={size}
          style={{ width: size, height: size, objectFit: "contain" }}
        />
      </Respira>
      <span
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 38,
          fontWeight: 700,
          color: "var(--accent)",
          letterSpacing: "-0.01em",
        }}
      >
        {nome}
      </span>
    </motion.div>
  );
}
