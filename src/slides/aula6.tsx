import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Icon } from "@phosphor-icons/react";
import { useSlideVariants } from "@/lib/motion";
import { Flutua, IconeGrande, PESO_ICONE, Respira } from "@/components/pieces";
import { useSlideActive, useSlidePasso } from "@/components/SlideFrame";
import { AssetSlot } from "@/components/AssetSlot";
import { BASE } from "@/lib/base";

/* ═══ Número com linhas de apoio (slide 12) ════════════════════════
   Currículo é seco de propósito: o número entra com peso, as linhas
   entram atrás dele e nada se mexe depois.
   ═══════════════════════════════════════════════════════════════════ */
export function NumeroComLinhas({ numero, linhas }: { numero: string; linhas: string[] }) {
  const v = useSlideVariants();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
      <motion.span variants={v.peso} className="d-hero" style={{ fontSize: 190 }}>
        {numero}
      </motion.span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        {linhas.map((l) => (
          <motion.span key={l} variants={v.item} className="legenda" style={{ fontSize: 36 }}>
            {l}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/* ═══ Ícone com tremor (slide 14) ══════════════════════════════════
   A mão que dói. Sem texto: o tremor quase imperceptível carrega a
   ideia, e escrever a frase mataria a sugestão.
   ═══════════════════════════════════════════════════════════════════ */
export function IconeTremendo({ glyph }: { glyph: Icon }) {
  const { item, reduce } = useSlideVariants();
  return (
    <motion.div variants={item}>
      <motion.div
        animate={reduce ? {} : { x: [0, 1.6, -1.4, 0.9, 0], rotate: [0, 0.35, -0.3, 0.2, 0] }}
        transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <IconeGrande glyph={glyph} size={230} />
      </motion.div>
    </motion.div>
  );
}

/* ═══ Frase com símbolo destacado (slide 19) ═══════════════════════ */
export function FraseComSimbolo({
  antes,
  simbolo,
  depois,
}: {
  antes: string;
  simbolo: string;
  depois: string;
}) {
  const { item, reduce } = useSlideVariants();
  const active = useSlideActive();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
        flexWrap: "wrap",
      }}
    >
      <motion.span variants={item} className="d-l">
        {antes}
      </motion.span>
      {/* Pulsa UMA vez ao entrar, sem loop: o símbolo é o argumento, mas
          um loop aqui viraria tique. */}
      <motion.span
        variants={item}
        animate={active && !reduce ? { scale: [1, 1.28, 1] } : {}}
        transition={{ delay: 0.55, duration: 0.6, ease: "easeOut" }}
        className="d-l"
        style={{ color: "var(--accent-display)", display: "inline-block" }}
      >
        {simbolo}
      </motion.span>
      <motion.span variants={item} className="d-l">
        {depois}
      </motion.span>
    </div>
  );
}

/* ═══ Ícone + seta pra causa (slide 20) ════════════════════════════ */
export function IconeComSeta({
  glyph,
  seta,
  rotulo,
}: {
  glyph: Icon;
  seta: Icon;
  rotulo: string;
}) {
  const { item } = useSlideVariants();
  const S = seta;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
      <motion.div variants={item}>
        <IconeGrande glyph={glyph} size={190} />
      </motion.div>
      <motion.div variants={item} style={{ display: "flex", alignItems: "center", gap: 26 }}>
        <S size={72} weight={PESO_ICONE} color="var(--accent-display)" aria-hidden />
        <span className="d-m" style={{ color: "var(--accent-display)" }}>
          {rotulo}
        </span>
      </motion.div>
    </div>
  );
}

/* ═══ Ícones esmaecidos (slide 21) ═════════════════════════════════
   Lista de tentativas que não funcionaram: stagger mais lento que o do
   slide 8 e nada de vida contínua. O cansaço é o recado.
   ═══════════════════════════════════════════════════════════════════ */
export function IconesEsmaecidos({ glyphs }: { glyphs: Icon[] }) {
  const { item } = useSlideVariants();
  return (
    <ul style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 96 }}>
      {glyphs.map((G, i) => (
        <motion.li key={i} variants={item} style={{ opacity: 0.42 }}>
          <G size={124} weight={PESO_ICONE} color="var(--fg-3)" aria-hidden />
        </motion.li>
      ))}
    </ul>
  );
}

/* ═══ Três etapas conectadas (slide 23) ════════════════════════════
   A linha cresce ATRÁS dos blocos e só termina quando os três estão na
   tela. A construção da entrada é o gatilho; não precisa de loop.
   ═══════════════════════════════════════════════════════════════════ */
export function TresEtapas({ etapas }: { etapas: string[] }) {
  const { item, reduce } = useSlideVariants();
  const active = useSlideActive();
  const ALTURA = 132;
  const total = etapas.length * ALTURA + (etapas.length - 1) * 46;

  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 46 }}>
      {/* A linha vive atrás e cresce de cima pra baixo. scaleY, nunca height. */}
      <motion.span
        aria-hidden
        initial={{ scaleY: 0 }}
        animate={active && !reduce ? { scaleY: 1 } : { scaleY: 1 }}
        transition={{ duration: reduce ? 0 : 2.4, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "absolute",
          left: 54,
          top: 40,
          width: 3,
          height: total - 80,
          background: "var(--accent-display)",
          transformOrigin: "top center",
          opacity: 0.55,
        }}
      />
      {etapas.map((e) => (
        <motion.div
          key={e}
          variants={item}
          style={{ position: "relative", display: "flex", alignItems: "center", gap: 42, height: ALTURA }}
        >
          <span
            aria-hidden
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "var(--accent-display)",
              marginLeft: 42,
              flex: "none",
            }}
          />
          <span className="d-m">{e}</span>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══ Frase riscada (slide 38) ═════════════════════════════════════ */
export function FraseRiscada({ texto }: { texto: string }) {
  const { item, reduce } = useSlideVariants();
  const active = useSlideActive();
  return (
    <motion.div variants={item} style={{ position: "relative", display: "inline-block" }}>
      <span className="d-l">{texto}</span>
      {/* O risco desenha DEPOIS da frase entrar: primeiro ele lê, depois
          vê a negação. Ao contrário, o risco chegaria antes do sentido. */}
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        animate={active && !reduce ? { scaleX: 1 } : { scaleX: 1 }}
        transition={{ delay: 0.7, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          left: -14,
          right: -14,
          top: "52%",
          height: 7,
          background: "var(--accent-display)",
          borderRadius: 4,
          transformOrigin: "left center",
        }}
      />
    </motion.div>
  );
}

/* ═══ Grade de objeções riscadas (slide 26) ════════════════════════
   As quatro desculpas que o roteiro nomeia, cada uma riscada logo
   depois de entrar. Riscar as quatro de uma vez transformaria em
   piada; uma por vez, com o risco atrasado, cada linha é lida antes de
   ser negada — que é o que ele faz falando.
   ═══════════════════════════════════════════════════════════════════ */
export function GradeRiscada({ frases }: { frases: string[] }) {
  const { item, reduce } = useSlideVariants();
  const active = useSlideActive();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, auto)",
        gap: "68px 130px",
        placeItems: "center",
      }}
    >
      {frases.map((f, i) => (
        <motion.div key={f} variants={item} style={{ position: "relative", display: "inline-block" }}>
          <span className="d-l" style={{ fontSize: 84, color: "var(--fg-3)" }}>
            {f}
          </span>
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={active && !reduce ? { scaleX: 1 } : { scaleX: 1 }}
            transition={{ delay: 0.55 + i * 0.24, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              left: -10,
              right: -10,
              top: "52%",
              height: 6,
              background: "var(--accent-display)",
              borderRadius: 4,
              transformOrigin: "left center",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

/* ═══ Multiplicação visual (slide 43) ══════════════════════════════
   O número anterior vira este por multiplicação na tela: o "x6" acontece
   em vez de só aparecer o resultado.
   ═══════════════════════════════════════════════════════════════════ */
export function Multiplicacao({
  de,
  fator,
  para,
}: {
  de: string;
  fator: string;
  para: string;
}) {
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
    const a = setTimeout(() => setFase(1), 800);
    const b = setTimeout(() => setFase(2), 1650);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [active, reduce]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 40 }}>
      <motion.span
        variants={item}
        className="num"
        style={{ fontSize: 76, color: "var(--fg-3)" }}
        animate={{ opacity: fase >= 2 ? 0.45 : 1 }}
      >
        {de}
      </motion.span>

      <motion.span
        initial={false}
        animate={{ opacity: fase >= 1 ? 1 : 0, scale: fase >= 1 ? 1 : 0.6 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="num"
        style={{ fontSize: 64 }}
      >
        {fator}
      </motion.span>

      <motion.div
        initial={false}
        animate={{ opacity: fase >= 2 ? 1 : 0, scale: fase >= 2 ? 1 : 0.7 }}
        transition={{ type: "spring", stiffness: 140, damping: 18 }}
      >
        {/* Pico de ancoragem do bloco: brilho pulsante contínuo. */}
        <Respira escala={0.022} segundos={3.6}>
          <span className="num" style={{ fontSize: 190, whiteSpace: "nowrap" }}>
            {para}
          </span>
        </Respira>
      </motion.div>
    </div>
  );
}

/* ═══ Comparação de horários (slide 53) ════════════════════════════ */
export function Comparacao({
  a,
  b,
  diferenca,
}: {
  a: string;
  b: string;
  diferenca: string;
}) {
  const { item, reduce } = useSlideVariants();
  const active = useSlideActive();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 64 }}>
      <motion.span variants={item} className="num" style={{ fontSize: 150, color: "var(--accent-display)" }}>
        {a}
      </motion.span>

      <motion.div
        variants={item}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
      >
        <motion.span
          aria-hidden
          initial={{ scaleX: 0 }}
          animate={active && !reduce ? { scaleX: 1 } : { scaleX: 1 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 180,
            height: 5,
            background: "var(--accent-display)",
            borderRadius: 3,
            transformOrigin: "left center",
          }}
        />
        <motion.span
          initial={{ opacity: 0 }}
          animate={active && !reduce ? { opacity: 1 } : { opacity: 1 }}
          transition={{ delay: 1.05, duration: 0.4 }}
          className="legenda"
          style={{ fontSize: 32, color: "var(--accent)" }}
        >
          {diferenca}
        </motion.span>
      </motion.div>

      <motion.span variants={item} className="num" style={{ fontSize: 150, color: "var(--fg-3)" }}>
        {b}
      </motion.span>
    </div>
  );
}

/* ═══ Escada de 3 etapas (slide 51) ════════════════════════════════
   O anterior permanece na tela e reduz: a escada crescendo é o gatilho.
   ═══════════════════════════════════════════════════════════════════ */
export function Escada({ degraus }: { degraus: string[] }) {
  const { item } = useSlideVariants();
  return (
    <ul style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      {degraus.map((d, i) => (
        <motion.li
          key={d}
          variants={item}
          className="d-m"
          style={{
            /* O primeiro fica menor e mais apagado que o último: a escada
               se lê de cima pra baixo mesmo parada. */
            fontSize: 58 + i * 14,
            color: i === degraus.length - 1 ? "var(--accent-display)" : "var(--fg-3)",
          }}
        >
          {d}
        </motion.li>
      ))}
    </ul>
  );
}

/* ═══ Pilha que cresce por passo (slide 40) ════════════════════════
   Reaproveita a ideia da soma acumulada da Aula 5, mas aqui os valores
   entram por PASSO dentro do mesmo slide, não um slide por valor.
   ═══════════════════════════════════════════════════════════════════ */
export function PilhaPorPasso({ valores }: { valores: string[] }) {
  const passo = useSlidePasso();
  const { reduce } = useSlideVariants();
  const visiveis = valores.slice(0, passo + 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
      {visiveis.map((v, i) => {
        const novo = i === passo;
        return (
          <motion.span
            key={v + i}
            initial={{ opacity: 0, scale: reduce ? 1 : 1.9, y: reduce ? 0 : 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 130, damping: 18 }}
            className="num"
            style={{
              fontSize: 84,
              color: novo ? "var(--accent-display)" : "var(--fg-3)",
              whiteSpace: "nowrap",
            }}
          >
            {v}
          </motion.span>
        );
      })}
    </div>
  );
}

/* ═══ Duas linhas separadas (slide 56) ═════════════════════════════ */
export function DuasLinhas({ linhas }: { linhas: ReactNode[] }) {
  const { item } = useSlideVariants();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
      {linhas.map((l, i) => (
        <motion.span key={i} variants={item} className="d-l">
          {l}
        </motion.span>
      ))}
    </div>
  );
}

/* ═══ Frase em duas linhas com contraste (slide 10) ════════════════ */
export function ContrastePergunta({ fraco, forte }: { fraco: string; forte: string }) {
  const { item } = useSlideVariants();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
      <motion.span variants={item} className="d-l" style={{ color: "var(--fg-4)" }}>
        {fraco}
      </motion.span>
      <motion.span variants={item} className="d-l" style={{ color: "var(--accent-display)" }}>
        {forte}
      </motion.span>
    </div>
  );
}

/* ═══ Balde furado pingando (slide 4) ══════════════════════════════ */
export function BaldePingando({ texto, glyph }: { texto: string; glyph: Icon }) {
  const { item, reduce } = useSlideVariants();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 60 }}>
      <motion.div variants={item} style={{ position: "relative" }}>
        <Flutua px={8}>
          <IconeGrande glyph={glyph} size={215} />
        </Flutua>
        {!reduce ? (
          <div aria-hidden style={{ position: "absolute", left: "50%", top: "100%", width: 0 }}>
            {[0, 1].map((i) => (
              <motion.span
                key={i}
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: [-8, 70], opacity: [0, 1, 0] }}
                /* ~1 gota a cada 2s: lento o bastante pra não competir
                   com a fala e o bastante pra tela não morrer. */
                transition={{ duration: 2, delay: i * 2, repeat: Infinity, repeatDelay: 2, ease: "easeIn" }}
                style={{
                  position: "absolute",
                  left: -7,
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
      <motion.h2 variants={item} className="d-l">
        {texto}
      </motion.h2>
    </div>
  );
}

/* ═══ Quatro ícones flutuando fora de fase (slide 8) ═══════════════
   Fases diferentes de propósito: sincronizados, quatro ícones subindo
   junto lê como "piscando", não como vida.
   ═══════════════════════════════════════════════════════════════════ */
export function QuatroIcones({ glyphs }: { glyphs: Icon[] }) {
  const { item } = useSlideVariants();
  return (
    <ul style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 100 }}>
      {glyphs.map((G, i) => (
        <motion.li key={i} variants={item}>
          <Flutua px={9 + (i % 3) * 3} segundos={4.4 + i * 0.9}>
            <IconeGrande glyph={G} size={150} />
          </Flutua>
        </motion.li>
      ))}
    </ul>
  );
}

/* ═══ Mídia em quadro (slides 13, 29 a 35, 50) ═════════════════════
   O AssetSlot é o mesmo dos decks das Aulas 2 e 5, já validado: solta o
   arquivo em src/assets/<id>.<ext>, rebuilda, o placeholder some.

   `fit="contain"` sempre: os assets reais são captura de tela 4:3 e print
   de celular em retrato; num quadro 16:9 o `cover` cortaria 30% da altura
   de um vídeo ou quase toda a conversa de um print (medido no deck da
   Aula 2).
   ═══════════════════════════════════════════════════════════════════ */
export function Midia({
  id,
  label,
  kind,
  legenda,
}: {
  id: string;
  label: string;
  kind: "video" | "print";
  /** Legenda pequena sobreposta no canto (slide 32). */
  legenda?: string;
}) {
  const { item } = useSlideVariants();
  /* `data-bleed`: sangra até perto da borda de propósito. No slide de
     demonstração o quadro É o conteúdo, então ele não obedece a área
     segura de texto, e o verificador precisa saber disso. */
  return (
    <motion.div data-bleed variants={item} style={{ position: "absolute", inset: 64 }}>
      <AssetSlot id={id} label={label} kind={kind} fit="contain" />
      {legenda ? (
        <span
          style={{
            position: "absolute",
            left: 30,
            bottom: 26,
            padding: "12px 22px",
            borderRadius: "var(--r-chip)",
            background: "rgba(16,18,24,0.82)",
            color: "#F2F4F8",
            fontFamily: "var(--font-sans)",
            fontSize: 28,
            fontWeight: 600,
          }}
        >
          {legenda}
        </span>
      ) : null}
    </motion.div>
  );
}

/* ═══ Slide-mapa dos 6 movimentos (slides 36 e 55) ═════════════════
   Mesmo desenho do deck da Aula 2. Serve de âncora visual parada: a
   plateia reconhece o quadro e o 55 reaproveita como fundo neutro
   enquanto ele responde objeções.
   ═══════════════════════════════════════════════════════════════════ */
export function MapaMovimentos({ itens }: { itens: { n: number; label: string; icon: Icon }[] }) {
  const { item } = useSlideVariants();
  return (
    <ul
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: 38,
        height: 620,
        width: "100%",
        padding: "0 14px",
        boxSizing: "border-box",
      }}
    >
      {itens.map(({ n, label, icon: G }) => (
        <motion.li key={n} variants={item} style={{ minWidth: 0 }}>
          <div
            style={{
              height: "100%",
              borderRadius: "var(--r-card)",
              background: "var(--bg-2)",
              border: "1px solid var(--line)",
              padding: 34,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="num" style={{ fontSize: 104 }}>
                {n}
              </span>
              <G size={46} weight={PESO_ICONE} color="var(--accent)" aria-hidden />
            </div>
            <span className="d-s" style={{ fontSize: 36, textAlign: "left", color: "var(--fg-2)" }}>
              {label}
            </span>
          </div>
        </motion.li>
      ))}
    </ul>
  );
}

/* ═══ Faixa de valores contada (slide 42) ══════════════════════════
   O roteiro pede "contagem rápida de 0 até o valor", mas o valor é uma
   FAIXA. Os dois extremos contam juntos, senão a contagem não teria o
   que fazer com "4 a 8".
   ═══════════════════════════════════════════════════════════════════ */
export function FaixaContada({ de, ate, sufixo }: { de: number; ate: number; sufixo: string }) {
  const active = useSlideActive();
  const { item, reduce } = useSlideVariants();
  const [p, setP] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!active) {
      setP(0);
      return;
    }
    if (reduce) {
      setP(1);
      return;
    }
    let ini = 0;
    const passo = (t: number) => {
      if (!ini) ini = t;
      const x = Math.min((t - ini) / 1100, 1);
      setP(1 - Math.pow(1 - x, 3));
      if (x < 1) raf.current = requestAnimationFrame(passo);
    };
    raf.current = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf.current);
  }, [active, reduce]);

  return (
    <motion.div variants={item} style={{ display: "flex", alignItems: "baseline", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
      <span className="num" style={{ fontSize: 158, whiteSpace: "nowrap" }}>
        R$ {Math.round(de * p)} a {Math.round(ate * p)} mil
      </span>
      <span className="d-m" style={{ fontSize: 62, color: "var(--fg-3)" }}>
        {sufixo}
      </span>
    </motion.div>
  );
}

/* ═══ Tela de marca (slide 11) ═════════════════════════════════════
   O único slide pensado pra não competir com o rosto dele. Sem texto,
   sem animação: só a marca bem apagada pra tela não parecer quebrada.
   ═══════════════════════════════════════════════════════════════════ */
export function TelaDeMarca() {
  const { item } = useSlideVariants();
  return (
    <motion.div variants={item} style={{ opacity: 0.07 }}>
      <img src={`${BASE}images/eagle.png`} alt="" width={420} height={420} style={{ width: 420, height: 420, objectFit: "contain" }} />
    </motion.div>
  );
}
