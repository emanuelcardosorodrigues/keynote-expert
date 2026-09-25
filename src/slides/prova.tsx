import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { useSlideVariants } from "@/lib/motion";
import { PESO_ICONE, Respira } from "@/components/pieces";
import { assetUrl } from "@/components/AssetSlot";
import { useSlideActive, useSlidePasso } from "@/components/SlideFrame";

/* ═══════════════════════════════════════════════════════════════════
   Prova (slides 14, 28, 29, 30).

   O tratamento é o mesmo da página do Alex Barreira: foto grande do
   dentista, o "antes" em cinza, a seta dourada, o "depois" contando
   até o número, e a barra com o marcador de onde ele estava. Não é
   depoimento em vídeo — é o card animado que já está validado em
   produção, trazido pro palco.

   O "depois" não existe na tela até o passo 1. Enquanto ele fala, o
   slide é uma frase pela metade, e a tecla fecha. A pergunta que fica
   no ar é o que segura a sala.

   O estado NÃO mora aqui: vem do `passo`, que viaja pelo
   BroadcastChannel. Com estado local, a projeção revelaria e o
   presenter não.
   ═══════════════════════════════════════════════════════════════════ */

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

const milReais = (v: number) => `R$ ${Math.round(v)} mil`;

/* Medido, não estimado: com foto de 660 e o "depois" a 152px, a coluna
   direita pedia 1064px e tinha 780 — o número era CORTADO pelo
   overflow:hidden do card. Estes valores deixam ~75px de folga com o
   maior string do deck ("R$ 22 mil"). */
const LARGURA_CARD = 1620;
const ALTURA_CARD = 828;
const LARGURA_FOTO = 540;
const PX_ANTES = 76;
const PX_DEPOIS = 128;

/**
 * Foto do dentista. Sem arquivo, uma inicial grande no lugar: o card
 * mantém a proporção e a coluna dos números não se mexe quando a foto
 * chegar.
 */
function Foto({ id, nome }: { id: string; nome: string }) {
  const active = useSlideActive();
  const { reduce } = useSlideVariants();
  const url = assetUrl(id);

  return (
    <div
      style={{
        position: "relative",
        width: LARGURA_FOTO,
        height: "100%",
        flex: "none",
        overflow: "hidden",
        background: "var(--bg-2)",
        display: "grid",
        placeItems: "center",
      }}
    >
      {url ? (
        /* Ken Burns lento: o card fica no ar o tempo inteiro da história
           e foto parada por dois minutos mata a tela. Só transform. */
        <motion.img
          src={url}
          alt={nome}
          animate={active && !reduce ? { scale: 1.07 } : { scale: 1 }}
          transition={active && !reduce ? { duration: 26, ease: "linear" } : { duration: 0 }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 22%" }}
        />
      ) : (
        <span className="d-hero" style={{ fontSize: 220, color: "var(--fg-4)" }}>
          {nome.charAt(0)}
        </span>
      )}
    </div>
  );
}

/**
 * Card antes/depois de um caso.
 *
 * `comReveal` false entrega os dois valores de uma vez: quando o mesmo
 * caso volta pela segunda vez no deck, repetir a tensão viraria
 * maneirismo.
 */
export function CasoProva({
  nome,
  cidade,
  foto,
  antes,
  depois,
  nota,
  comReveal = true,
}: {
  nome: string;
  cidade?: string;
  /** Id do asset da foto. */
  foto: string;
  /** Em milhares de reais. */
  antes: number;
  depois: number;
  /** Uma linha de contexto abaixo da barra. */
  nota?: string;
  comReveal?: boolean;
}) {
  const { item, reduce } = useSlideVariants();
  const passo = useSlidePasso();
  const active = useSlideActive();
  const revelado = comReveal ? passo >= 1 : true;
  const v = useContagem(depois, revelado && active);

  /* Onde fica o marcador do "antes" na barra do "depois". A barra inteira
     é o depois; o traço mostra o quanto disso já existia. */
  const marcador = `${Math.round((antes / depois) * 100)}%`;

  return (
    <motion.div
      variants={item}
      style={{
        display: "flex",
        width: LARGURA_CARD,
        height: ALTURA_CARD,
        borderRadius: 22,
        overflow: "hidden",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        textAlign: "left",
      }}
    >
      <Foto id={foto} nome={nome} />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: "58px 56px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 46,
        }}
      >
        <div className="legenda" style={{ fontSize: 36 }}>
          {nome}
          {cidade ? <span style={{ color: "var(--fg-4)" }}> · {cidade}</span> : null}
        </div>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 34 }}>
          <div>
            <div className="kicker" style={{ fontSize: 22, color: "var(--fg-4)", marginBottom: 14 }}>
              Lucro antes
            </div>
            <div className="num" style={{ fontSize: PX_ANTES, color: "var(--fg-4)", whiteSpace: "nowrap" }}>
              {milReais(antes)}
            </div>
          </div>

          {/* A seta só existe depois do reveal. Antes dela o card é uma
              frase interrompida, que é exatamente o ponto. */}
          <motion.span
            aria-hidden
            initial={false}
            animate={{ opacity: revelado ? 1 : 0, x: revelado ? 0 : -20 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", marginBottom: 16 }}
          >
            <ArrowRight size={50} weight={PESO_ICONE} color="var(--accent-display)" />
          </motion.span>

          <div>
            <div
              className="kicker"
              style={{ fontSize: 22, color: "var(--accent)", marginBottom: 14, opacity: revelado ? 1 : 0 }}
            >
              Lucro depois
            </div>
            <motion.div
              initial={false}
              animate={{ opacity: revelado ? 1 : 0, scale: revelado ? 1 : 0.84 }}
              transition={{ type: "spring", stiffness: 160, damping: 20 }}
              className="num"
              style={{ fontSize: PX_DEPOIS, whiteSpace: "nowrap", lineHeight: 1 }}
            >
              <Respira escala={revelado ? 0.012 : 0} segundos={6}>
                <span style={{ display: "block" }}>{milReais(v)}</span>
              </Respira>
            </motion.div>
          </div>
        </div>

        <div style={{ maxWidth: 700 }}>
          <div
            style={{
              position: "relative",
              height: 14,
              background: "var(--bg-2)",
              borderRadius: 99,
              overflow: "hidden",
            }}
          >
            {/* scaleX, nunca width: width relayouta a cada frame. */}
            <motion.div
              initial={false}
              animate={{ scaleX: revelado ? 1 : 0 }}
              transition={{ duration: reduce ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--accent-display)",
                transformOrigin: "left",
                borderRadius: 99,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: -4,
                bottom: -4,
                left: marcador,
                width: 3,
                background: "var(--fg)",
                opacity: 0.34,
              }}
              aria-hidden
            />
          </div>
          {nota ? (
            <div className="legenda" style={{ fontSize: 28, marginTop: 16, color: "var(--fg-4)" }}>
              {nota}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * As três caras juntas (slide 31).
 *
 * Entram antes do texto: a pergunta "qual desses parece com a sua
 * clínica?" só funciona depois que os três rostos já estão na tela pra
 * escolher.
 */
export function MiniaturasCasos({
  casos,
  pergunta,
}: {
  casos: { nome: string; foto: string; antes: number; depois: number }[];
  pergunta: string;
}) {
  const { item } = useSlideVariants();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 76 }}>
      <div style={{ display: "flex", gap: 60 }}>
        {casos.map((c) => {
          const url = assetUrl(c.foto);
          return (
            <motion.div
              key={c.nome}
              variants={item}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}
            >
              <div
                style={{
                  position: "relative",
                  width: 218,
                  height: 218,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid var(--line-strong)",
                  background: "var(--bg-2)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {url ? (
                  <img
                    src={url}
                    alt={c.nome}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 24%" }}
                  />
                ) : (
                  <span className="d-l" style={{ fontSize: 88, color: "var(--fg-4)" }}>
                    {c.nome.charAt(0)}
                  </span>
                )}
              </div>
              <span
                className="num"
                style={{ fontSize: 46, whiteSpace: "nowrap" }}
              >
                {milReais(c.antes)} → {milReais(c.depois)}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.h2 variants={item} className="d-l" style={{ fontSize: 92, maxWidth: "20ch" }}>
        {pergunta}
      </motion.h2>
    </div>
  );
}
