import { motion } from "motion/react";
import type { Icon } from "@phosphor-icons/react";
import { useSlideVariants } from "@/lib/motion";
import { PESO_ICONE, Respira } from "@/components/pieces";
import { assetUrl } from "@/components/AssetSlot";
import { BASE } from "@/lib/base";

/* ═══════════════════════════════════════════════════════════════════
   Oferta (slides 61 a 64).

   O bloco onde o deck mais corre risco de virar slide de PowerPoint:
   dezesseis entregáveis, três caminhos, uma comparação. A regra do
   deck vale igual aqui — nunca `<ul>` de texto corrido. Cada item é um
   card que ACENDE, e o que a plateia lê é a tela preenchendo, não uma
   lista pra decorar.
   ═══════════════════════════════════════════════════════════════════ */

export type ItemOferta = {
  label: string;
  icone: Icon;
  /** Id do asset: quando existe, a tela real vira o fundo do card. */
  thumb?: string;
  /** Fecha o grid ocupando a largura inteira. */
  destaque?: boolean;
};

/**
 * Grid do resumo da oferta (slide 62).
 *
 * Quinze cards em 5×3 e o décimo sexto atravessado embaixo: os seis
 * meses de acompanhamento não são mais um item da lista, são o que
 * sustenta os quinze de cima. A hierarquia diz isso sem uma palavra a
 * mais na tela.
 *
 * Os cards nascem esmaecidos e acendem em sequência rápida (0.08s). O
 * gatilho é o grid preenchendo, não cada card individualmente.
 */
export function GridChecklist({ itens }: { itens: ItemOferta[] }) {
  const { item } = useSlideVariants();
  const grade = itens.filter((i) => !i.destaque);
  const fecho = itens.find((i) => i.destaque);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22, width: 1600 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 18 }}>
        {grade.map((it) => (
          <Card key={it.label} item={it} variants={item} />
        ))}
      </div>

      {fecho ? <Card item={fecho} variants={item} largo /> : null}
    </div>
  );
}

function Card({
  item: it,
  variants,
  largo = false,
}: {
  item: ItemOferta;
  variants: ReturnType<typeof useSlideVariants>["item"];
  largo?: boolean;
}) {
  const url = it.thumb ? assetUrl(it.thumb) : null;
  const G = it.icone;

  return (
    <motion.div
      variants={variants}
      style={{
        position: "relative",
        height: largo ? 132 : 168,
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${largo ? "var(--accent)" : "var(--line)"}`,
        background: largo ? "var(--accent-soft)" : "var(--surface)",
        display: "flex",
        flexDirection: largo ? "row" : "column",
        alignItems: "center",
        justifyContent: "center",
        gap: largo ? 26 : 16,
        padding: largo ? "0 40px" : "22px 18px",
      }}
    >
      {/* A tela real por baixo, esmaecida: prova que o item existe sem
          competir com a leitura do rótulo. */}
      {url ? (
        <img
          src={url}
          alt=""
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.24,
          }}
        />
      ) : null}

      <G
        size={largo ? 52 : 46}
        weight={PESO_ICONE}
        color="var(--accent-display)"
        aria-hidden
        style={{ position: "relative", flex: "none" }}
      />
      <span
        className={largo ? "d-m" : "legenda"}
        style={{
          position: "relative",
          fontSize: largo ? 46 : 25,
          color: largo ? "var(--fg)" : "var(--fg-2)",
          lineHeight: 1.25,
          textAlign: "center",
          fontWeight: largo ? 700 : 500,
          textShadow: url ? "0 1px 10px var(--bg)" : undefined,
        }}
      >
        {it.label}
      </span>
    </motion.div>
  );
}

/**
 * Os três caminhos (slide 63).
 *
 * As duas primeiras colunas entram esmaecidas e o terceiro caminho
 * entra por último, mais alto e em cor de acento. O contraste É o
 * argumento: ele não precisa dizer qual é o certo, a tela já disse.
 */
export function TresColunas({
  colunas,
}: {
  colunas: { titulo: string; detalhe: string; destaque?: boolean }[];
}) {
  const { item } = useSlideVariants();

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
      {colunas.map((c) => (
        <motion.div
          key={c.titulo}
          variants={item}
          style={{
            width: 490,
            height: c.destaque ? 620 : 500,
            borderRadius: 20,
            border: `1px solid ${c.destaque ? "var(--accent)" : "var(--line)"}`,
            background: c.destaque ? "var(--accent-soft)" : "var(--surface)",
            opacity: c.destaque ? 1 : 0.52,
            padding: "56px 46px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 32,
          }}
        >
          <span
            className="d-m"
            style={{
              fontSize: c.destaque ? 64 : 54,
              color: c.destaque ? "var(--accent-display)" : "var(--fg-3)",
              lineHeight: 1.12,
            }}
          >
            {c.titulo}
          </span>
          <span
            className="legenda"
            style={{ fontSize: 34, color: c.destaque ? "var(--fg-2)" : "var(--fg-4)", lineHeight: 1.4 }}
          >
            {c.detalhe}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Escada de bônus (slide 61) e projeção de lucro (slide 51).
 *
 * Cada degrau é prazo + prêmio. A versão anterior deste slide tinha só
 * os horários, e três horários sem nada dentro não são uma escada: são
 * um relógio. O stagger é lento (0.8s) porque cada degrau é um anúncio.
 */
export function BuildEtapas({
  etapas,
  numerado = true,
}: {
  etapas: { rotulo: string; detalhe?: string; destaque?: boolean }[];
  numerado?: boolean;
}) {
  const { item } = useSlideVariants();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 30, width: 1420 }}>
      {etapas.map((e, i) => (
        <motion.div
          key={e.rotulo}
          variants={item}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 44,
            padding: e.destaque ? "52px 54px" : "40px 54px",
            borderRadius: 18,
            border: `${e.destaque ? 2 : 1}px solid ${e.destaque ? "var(--accent)" : "var(--line)"}`,
            background: e.destaque ? "var(--accent-soft)" : "var(--surface)",
            /* Cada degrau entra um pouco mais pra dentro: a escada sobe
               visualmente, não só na lista. */
            marginLeft: i * 62,
            textAlign: "left",
          }}
        >
          {numerado ? (
            <span
              className="num"
              style={{ fontSize: 72, color: "var(--accent-display)", flex: "none", width: 76 }}
            >
              {i + 1}
            </span>
          ) : null}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
            {/* O degrau de destaque respira; os outros ficam parados. É a
                diferença entre "mais um item" e "é ESTE o número". */}
            <Respira escala={e.destaque ? 0.014 : 0} segundos={4.4}>
              <span
                className={e.destaque ? "num" : "d-m"}
                style={{ fontSize: e.destaque ? 92 : 56, lineHeight: 1.05, display: "block" }}
              >
                {e.rotulo}
              </span>
            </Respira>
            {e.detalhe ? (
              <span
                className="legenda"
                style={{ fontSize: e.destaque ? 36 : 32, color: e.destaque ? "var(--fg-2)" : "var(--fg-3)" }}
              >
                {e.detalhe}
              </span>
            ) : null}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * O que os 30 dias incluem (slide 58).
 *
 * Três itens concretos e "TUDO" por último, maior que os três. A
 * palavra sozinha não valeria nada; ela vale porque chega depois de a
 * plateia ter contado os itens.
 */
export function GradeInclusos({
  itens,
  fecho,
}: {
  itens: { label: string; icone: Icon }[];
  fecho: string;
}) {
  const { item } = useSlideVariants();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 64 }}>
      <div style={{ display: "flex", gap: 34 }}>
        {itens.map((it) => {
          const G = it.icone;
          return (
            <motion.div
              key={it.label}
              variants={item}
              style={{
                width: 430,
                height: 340,
                borderRadius: 20,
                border: "1px solid var(--line)",
                background: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 30,
                padding: "0 34px",
              }}
            >
              <G size={78} weight={PESO_ICONE} color="var(--accent-display)" aria-hidden />
              <span className="d-m" style={{ fontSize: 42, lineHeight: 1.2, fontWeight: 400 }}>
                {it.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={item}>
        <Respira escala={0.018} segundos={4.2}>
          <span className="num" style={{ fontSize: 172, display: "block" }}>
            {fecho}
          </span>
        </Respira>
      </motion.div>
    </div>
  );
}

/**
 * Um bônus por slide, com a condição que o trava.
 *
 * A escada de três degraus num slide só conta o que existe; ela não
 * consegue dar tempo de tela pra cada prêmio. Aqui cada bônus fica
 * sozinho no ar pelo tempo que ele leva pra explicar, e a condição
 * ("SÓ OS 5 PRIMEIROS", "ATÉ 8H DE SEGUNDA") entra por último, em
 * faixa própria, pulsando.
 *
 * O pulso é o único ponto do deck onde a animação contínua é
 * declaradamente de urgência e não de vida: a faixa é um relógio
 * correndo, e tem que incomodar um pouco.
 */
export function SlideBonus({
  ordem,
  total,
  titulo,
  detalhe,
  condicao,
  glyph,
}: {
  ordem: number;
  total: number;
  titulo: string;
  detalhe: string;
  /** O que trava o bônus. É o elemento de escassez, entra por último. */
  condicao: string;
  glyph: Icon;
}) {
  const { item, reduce } = useSlideVariants();
  const G = glyph;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 44, maxWidth: 1560 }}>
      <motion.div variants={item} style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <G size={54} weight={PESO_ICONE} color="var(--accent-display)" aria-hidden />
        <span className="kicker" style={{ fontSize: 26 }}>
          Bônus {ordem} de {total}
        </span>
      </motion.div>

      <motion.h2 variants={item} className="d-xl" style={{ fontSize: 116, lineHeight: 1.06 }}>
        {titulo}
      </motion.h2>

      <motion.p
        variants={item}
        className="d-m"
        style={{ fontSize: 46, color: "var(--fg-3)", fontWeight: 400, maxWidth: "30ch", lineHeight: 1.3 }}
      >
        {detalhe}
      </motion.p>

      <motion.div
        variants={item}
        animate={reduce ? {} : { scale: [1, 1.028, 1] }}
        transition={reduce ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          marginTop: 14,
          padding: "26px 56px",
          borderRadius: "var(--r-pill)",
          border: "2px solid var(--accent)",
          background: "var(--accent-soft)",
        }}
      >
        <span className="num" style={{ fontSize: 62, whiteSpace: "nowrap" }}>
          {condicao}
        </span>
      </motion.div>
    </div>
  );
}

/**
 * Preço com a marca do programa (slides 51 e 52).
 *
 * O número sozinho não diz de QUE programa é o preço. Com a águia em
 * cima e o nome embaixo, os R$ 12.000 param de ser um número solto e
 * viram o valor de uma coisa que a sala acabou de ver rodando por dez
 * slides.
 */
export function PrecoDoPrograma({
  valor,
  condicao,
  nota,
  brilha = false,
  comMarca = false,
}: {
  valor: string;
  condicao?: string;
  /** Linha pequena embaixo: o que ESTE número é. */
  nota?: string;
  brilha?: boolean;
  comMarca?: boolean;
}) {
  const v = useSlideVariants();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
      {comMarca ? (
        <motion.img
          variants={v.item}
          className="marca-aguia"
          src={`${BASE}images/eagle.png`}
          alt=""
          width={156}
          height={156}
          style={{ width: 156, height: 156, objectFit: "contain", marginBottom: 4 }}
        />
      ) : null}

      <motion.div variants={brilha ? v.peso : v.item}>
        <Respira escala={brilha ? 0.018 : 0.006} segundos={brilha ? 4 : 7}>
          <span
            className="num"
            style={{
              fontSize: 232,
              display: "block",
              whiteSpace: "nowrap",
              color: brilha ? undefined : "var(--fg-3)",
            }}
          >
            {valor}
          </span>
        </Respira>
      </motion.div>

      {condicao ? (
        <motion.span
          variants={v.item}
          className="d-m"
          style={{ fontSize: 58, color: "var(--fg-2)", fontWeight: 400 }}
        >
          {condicao}
        </motion.span>
      ) : null}

      {nota ? (
        <motion.span
          variants={v.item}
          className="legenda"
          /* 60ch e não 40: a 40 o nome do programa quebrava no meio
             ("...de Aceleração de Clínicas · o valor / real do programa"),
             e nome de marca partido ao meio lê como erro de layout. */
          style={{ fontSize: 34, maxWidth: "60ch", lineHeight: 1.4, marginTop: 2 }}
        >
          {nota}
        </motion.span>
      ) : null}
    </div>
  );
}

/**
 * Preço com condição (slide 54) e o número da entrada (slide 56).
 *
 * Duas linhas com pesos muito diferentes: o valor manda, a condição
 * acompanha. Separar em dois `Isolada` faria a condição competir.
 */
export function ValorComCondicao({
  valor,
  condicao,
  brilha = false,
}: {
  valor: string;
  condicao?: string;
  brilha?: boolean;
}) {
  const v = useSlideVariants();

  return (
    <motion.div
      variants={brilha ? v.peso : v.item}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}
    >
      <Respira escala={brilha ? 0.02 : 0.008} segundos={brilha ? 3.8 : 7}>
        <span className="num" style={{ fontSize: 264, display: "block", whiteSpace: "nowrap" }}>
          {valor}
        </span>
      </Respira>
      {condicao ? (
        <span className="d-m" style={{ fontSize: 62, color: "var(--fg-3)", fontWeight: 400 }}>
          {condicao}
        </span>
      ) : null}
    </motion.div>
  );
}
