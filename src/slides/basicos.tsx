import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import { useSlideVariants } from "@/lib/motion";
import { Flutua, IconeGrande, Item, MarcaPrograma, Respira } from "@/components/pieces";
import { useSlideActive } from "@/components/SlideFrame";

/* ═══ Título com subtítulo (slide 1) ═══════════════════════════════ */
export function Titulo({ titulo, sub }: { titulo: string; sub: string }) {
  const { item } = useSlideVariants();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      <motion.h1 variants={item} className="d-hero" style={{ fontSize: 176 }}>
        {titulo}
      </motion.h1>
      <motion.p variants={item} className="d-m" style={{ fontSize: 58, color: "var(--fg-3)", fontWeight: 400 }}>
        {sub}
      </motion.p>
    </div>
  );
}

/* ═══ Palavra ou frase isolada (slides 9, 17, 20, 27) ══════════════
   Um elemento central, muito respiro. `peso` liga a entrada com mais
   força, pro clímax lógico do slide 27.
   ═══════════════════════════════════════════════════════════════════ */
export function Isolada({
  texto,
  tamanho = "d-hero",
  px,
  cor,
  peso = false,
  brilha = false,
}: {
  texto: string;
  tamanho?: "d-hero" | "d-xl" | "d-l";
  /** Override quando a frase é longa e a classe estoura a área segura. */
  px?: number;
  cor?: string;
  peso?: boolean;
  /** Brilho pulsante contínuo: só nos números que a sala precisa fixar. */
  brilha?: boolean;
}) {
  const v = useSlideVariants();
  return (
    <motion.h2 variants={peso ? v.peso : v.item} className={tamanho} style={{ color: cor, fontSize: px }}>
      <Respira escala={brilha ? 0.022 : 0.008} segundos={brilha ? 3.6 : 7.5}>
        <span>{texto}</span>
      </Respira>
    </motion.h2>
  );
}

/* ═══ Slide 7 ══════════════════════════════════════════════════════
   O único que quebra o padrão pra baixo: entrada só em fade lento, sem
   movimento nenhum, cinza claro, muito vazio ao redor. É quebra de
   objeção que precisa soar como comentário de passagem, não argumento.
   Não tem respiração, não tem halo, não tem ícone: o vazio é o recado.
   ═══════════════════════════════════════════════════════════════════ */
export function Sozinho({ texto }: { texto: string }) {
  const { soFade } = useSlideVariants();
  return (
    <motion.h2
      variants={soFade}
      className="d-hero"
      style={{ color: "var(--fg-4)", fontWeight: 700, letterSpacing: "-0.03em" }}
    >
      {texto}
    </motion.h2>
  );
}

/* ═══ Recap com ícone (slides 2 a 5) ═══════════════════════════════ */
export function IconeRecap({
  texto,
  glyph,
  furoFechando = false,
}: {
  texto: string;
  glyph: Icon;
  /** Slide 2: um furo dourado que se fecha ao entrar. */
  furoFechando?: boolean;
}) {
  const { item, reduce } = useSlideVariants();
  const active = useSlideActive();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 64 }}>
      <motion.div variants={item}>
        <Flutua px={12}>
          <div style={{ position: "relative" }}>
            <IconeGrande glyph={glyph} size={210} />
            {furoFechando ? (
              /* O furo some: escala 1 → 0 uma vez, ao entrar. É a única
                 animação narrativa do recap e vale porque o slide se
                 chama "furos do balde". */
              <motion.span
                aria-hidden
                initial={{ scale: 1, opacity: 1 }}
                animate={active && !reduce ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: "absolute",
                  left: "58%",
                  top: "62%",
                  width: 30,
                  height: 30,
                  marginLeft: -15,
                  marginTop: -15,
                  borderRadius: "50%",
                  background: "var(--bg)",
                  border: "3px solid var(--accent-display)",
                }}
              />
            ) : null}
          </div>
        </Flutua>
      </motion.div>

      <motion.h2 variants={item} className="d-l">
        {texto}
      </motion.h2>
    </div>
  );
}

/* ═══ Grade dos 4 furos (slide 6) ══════════════════════════════════
   Sem texto novo: só os quatro ícones formando o mapa da semana. O
   stagger é rápido (0.15) porque o mapa tem que fechar como uma
   imagem só, não como quatro entradas.
   ═══════════════════════════════════════════════════════════════════ */
export function Grade4({ glyphs }: { glyphs: Icon[] }) {
  const { item } = useSlideVariants();
  return (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 90,
        placeItems: "center",
      }}
    >
      {glyphs.map((G, i) => (
        <motion.li key={i} variants={item}>
          <Respira escala={0.02} segundos={5 + i * 0.6}>
            <IconeGrande glyph={G} size={168} />
          </Respira>
        </motion.li>
      ))}
    </ul>
  );
}

/* ═══ CHAT (slides 8, 16, 18) ══════════════════════════════════════
   Fica muito tempo no ar esperando resposta, então a micro-animação
   contínua aqui não é enfeite: é o que impede a tela de morrer. O pulso
   lento diz "estou esperando você".
   ═══════════════════════════════════════════════════════════════════ */
export function Chat({ texto, glyph, forte = false }: { texto: ReactNode; glyph: Icon; forte?: boolean }) {
  const { item, reduce } = useSlideVariants();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 62 }}>
      <motion.div variants={item}>
        <motion.div
          animate={reduce ? {} : { scale: forte ? [1, 1.12, 1] : [1, 1.05, 1], opacity: forte ? [0.7, 1, 0.7] : [0.85, 1, 0.85] }}
          transition={reduce ? { duration: 0 } : { duration: forte ? 1.7 : 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <IconeGrande glyph={glyph} size={150} />
        </motion.div>
      </motion.div>
      <motion.h2 variants={item} className="d-m" style={{ maxWidth: "18ch" }}>
        {texto}
      </motion.h2>
    </div>
  );
}

/* ═══ Chat enchendo (slide 19) ═════════════════════════════════════
   Sem texto. O único slide onde o movimento pode ser óbvio, porque ele
   é o assunto: o chat enchendo enquanto o Leandro olha.
   ═══════════════════════════════════════════════════════════════════ */
export function Particulas({ glyph }: { glyph: Icon }) {
  const { item, reduce } = useSlideVariants();
  const bolhas = Array.from({ length: 30 }, (_, i) => i);

  return (
    <div data-decor style={{ position: "relative", width: 1400, height: 760 }}>
      {!reduce
        ? bolhas.map((i) => {
            const x = (i * 149) % 1340;
            const atraso = (i % 6) * 0.55 + (i % 3) * 0.2;
            const dur = 4.4 + (i % 5) * 0.7;
            const tam = 12 + (i % 4) * 9;
            return (
              <motion.span
                key={i}
                aria-hidden
                initial={{ y: 700, opacity: 0 }}
                animate={{ y: -80, opacity: [0, 0.9, 0.9, 0] }}
                transition={{ duration: dur, delay: atraso, repeat: Infinity, ease: "linear" }}
                style={{
                  position: "absolute",
                  left: x,
                  bottom: 0,
                  width: tam,
                  height: tam,
                  borderRadius: "50%",
                  background: "var(--accent-display)",
                  opacity: 0.5,
                }}
              />
            );
          })
        : null}

      <motion.div
        variants={item}
        style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}
      >
        <Respira escala={0.03} segundos={3.2}>
          <IconeGrande glyph={glyph} size={190} />
        </Respira>
      </motion.div>
    </div>
  );
}

/* ═══ Três linhas em stagger (slide 21) ════════════════════════════ */
export function TresLinhas({ linhas, marca }: { linhas: string[]; marca?: string }) {
  const { item } = useSlideVariants();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      {marca ? <div style={{ marginBottom: 26 }}><MarcaPrograma nome={marca} /></div> : null}
      {linhas.map((l) => (
        <motion.span key={l} variants={item} className="d-l">
          {l}
        </motion.span>
      ))}
    </div>
  );
}

/* ═══ CTA (slide 30) ═══════════════════════════════════════════════
   Fica no ar até o fim da aula enquanto ele segue falando, então o
   bloco inteiro mantém um pulso muito suave.
   ═══════════════════════════════════════════════════════════════════ */
export function CTA({
  chamada,
  titulo,
  linha2,
  linha3,
}: {
  /** Linha de ação acima do título. */
  chamada?: string;
  titulo: string;
  linha2: string;
  linha3: string;
}) {
  const { item } = useSlideVariants();
  return (
    <Respira escala={0.01} segundos={5.5}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        {chamada ? (
          <motion.p variants={item} className="d-m" style={{ fontSize: 60 }}>
            {chamada}
          </motion.p>
        ) : null}
        <motion.h2 variants={item} className="d-xl" style={{ fontSize: 126, color: "var(--accent-display)" }}>
          {titulo}
        </motion.h2>
        <motion.p variants={item} className="d-m" style={{ fontSize: 62 }}>
          {linha2}
        </motion.p>
        <motion.p variants={item} className="legenda" style={{ fontSize: 34 }}>
          {linha3}
        </motion.p>
      </div>
    </Respira>
  );
}
