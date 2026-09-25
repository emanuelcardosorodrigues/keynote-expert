import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useSlideVariants } from "@/lib/motion";
import { Respira } from "@/components/pieces";
import { assetUrl, assetEhVideo } from "@/components/AssetSlot";
import { useSlideActive } from "@/components/SlideFrame";

/* ═══════════════════════════════════════════════════════════════════
   Fundo de mídia (slides 1, 22, 68).

   Categoria nova deste deck. A mídia entra em opacidade baixa JUNTO
   com o texto, nunca depois: fundo que aparece atrasado lê como erro
   de carregamento na projeção, não como camada.

   A imagem fica atrás de um véu da cor do tema, não de um preto
   genérico. Sem o véu, o texto serifado de 150px perde a borda em
   cima de qualquer foto com detalhe.
   ═══════════════════════════════════════════════════════════════════ */

export function ComFundo({
  id,
  opacidade = 0.22,
  objectPosition = "center",
  children,
}: {
  id: string;
  opacidade?: number;
  objectPosition?: string;
  children: ReactNode;
}) {
  const active = useSlideActive();
  const { reduce } = useSlideVariants();
  const url = assetUrl(id);
  const video = assetEhVideo(id);

  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      {url ? (
        <motion.div
          aria-hidden
          data-decor
          initial={false}
          animate={{ opacity: active ? opacidade : 0, scale: active && !reduce ? 1.06 : 1 }}
          transition={{
            opacity: { duration: reduce ? 0 : 0.9, ease: "linear" },
            scale: active && !reduce ? { duration: 40, ease: "linear" } : { duration: 0 },
          }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        >
          {video ? (
            <video
              src={url}
              muted
              loop
              playsInline
              autoPlay
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition }}
            />
          ) : (
            <img
              src={url}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition }}
            />
          )}
        </motion.div>
      ) : null}

      {/* Véu na cor do tema: preserva a temperatura do slide e devolve
          contraste ao texto sem escurecer um deck creme. */}
      {url ? (
        <div
          aria-hidden
          data-decor
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 22%, var(--bg) 88%)",
            pointerEvents: "none",
          }}
        />
      ) : null}

      {/* maxWidth explícito: sem ele o wrapper se dimensiona pelo conteúdo
          e uma frase longa sai numa linha só, muito além da área segura. */}
      <div style={{ position: "relative", display: "grid", placeItems: "center", maxWidth: 1640 }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Mosaico das cinco aulas (slide 1).
 *
 * Substitui o vídeo de ambiente que não existe. É melhor que um vídeo
 * genérico de sala: "cinco dias depois" fica literalmente escrito no
 * fundo, com as cinco thumbnails que essa plateia passou a semana
 * vendo. Desfocado e em opacidade baixa, é textura reconhecível, não
 * leitura.
 */
export function MosaicoAulas({ ids, children }: { ids: string[]; children: ReactNode }) {
  const active = useSlideActive();
  const { reduce } = useSlideVariants();

  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <motion.div
        aria-hidden
        data-decor
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.9, ease: "linear" }}
        style={{
          position: "absolute",
          inset: "-8%",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 34,
          filter: "blur(15px) saturate(0.7)",
          pointerEvents: "none",
        }}
      >
        {/* Seis células pra fechar a grade 3×2: a primeira aula repete no
            fim, que é justamente a que a plateia viu há mais tempo. */}
        {[...ids, ids[0]].slice(0, 6).map((id, i) => {
          const url = assetUrl(id);
          if (!url) return <div key={i} />;
          return (
            <motion.div
              key={i}
              animate={
                reduce || !active
                  ? {}
                  : { y: [0, i % 2 ? 16 : -16, 0], scale: [1, 1.03, 1] }
              }
              transition={{ duration: 22 + i * 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ overflow: "hidden", borderRadius: 14, opacity: 0.34 }}
            >
              <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </motion.div>
          );
        })}
      </motion.div>

      <div
        aria-hidden
        data-decor
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, var(--bg) 8%, transparent 62%), linear-gradient(var(--bg), transparent 30%, transparent 70%, var(--bg))",
          pointerEvents: "none",
        }}
      />

      {/* maxWidth explícito: sem ele o wrapper se dimensiona pelo conteúdo
          e a frase de 122px sai numa linha só, 200px além da área segura.
          Com o limite, o `text-wrap: balance` quebra em duas linhas e o
          corpo de fonte não precisa encolher. */}
      <div style={{ position: "relative", display: "grid", placeItems: "center", maxWidth: 1640 }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Tira de fotos do currículo (slide 12).
 *
 * Três fotos e um número. As fotos entram em stagger DEPOIS do número
 * porque o número é o argumento e elas são a nota de rodapé: trinta
 * anos, e aqui está a prova, em três imagens que ele não comenta.
 */
export function TiraFotos({
  numero,
  fotos,
}: {
  numero: string;
  fotos: { id: string; label: string }[];
}) {
  const { item } = useSlideVariants();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 66 }}>
      <motion.h2 variants={item} className="d-hero" style={{ fontSize: 168 }}>
        <Respira escala={0.008} segundos={7}>
          <span style={{ display: "block" }}>{numero}</span>
        </Respira>
      </motion.h2>

      <div style={{ display: "flex", gap: 30 }}>
        {fotos.map((f) => {
          const url = assetUrl(f.id);
          return (
            <motion.div
              key={f.id}
              variants={item}
              style={{
                position: "relative",
                width: 470,
                height: 330,
                borderRadius: 16,
                overflow: "hidden",
                background: "var(--bg-2)",
                border: "1px solid var(--line)",
                display: "grid",
                placeItems: "center",
              }}
            >
              {url ? (
                /* `inset: 0` e não `height: 100%`: dentro de um grid de
                   linha implícita `auto`, o 100% não resolve e a razão de
                   aspecto do arquivo é que passa a ditar a altura. */
                <img
                  src={url}
                  alt={f.label}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span className="kicker" style={{ fontSize: 17, color: "var(--fg-4)", padding: "0 20px" }}>
                  {f.label}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Páginas de venda esmaecidas ao fundo (slide 17).
 *
 * Formas abstratas, não capturas de concorrentes: um print real de
 * outro produto na projeção é briga que o Leandro não precisa comprar,
 * e um print FALSO de produto que não existe é pior. O que a plateia
 * precisa reconhecer é o FORMATO de página de venda, e isso três
 * retângulos com hierarquia de bloco entregam.
 */
export function PaginasEsmaecidas({ children }: { children: ReactNode }) {
  const active = useSlideActive();
  const { reduce } = useSlideVariants();

  const paginas = [
    { x: -520, rot: -4, atraso: 0 },
    { x: 0, rot: 1.5, atraso: 0.8 },
    { x: 520, rot: 5, atraso: 1.6 },
  ];

  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
      <div aria-hidden data-decor style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        {paginas.map((p, i) => (
          <motion.div
            key={i}
            /* x e rotate como props do Motion, NUNCA `transform` inline: o
               Motion escreve a transform inteira a partir dos valores que
               ele controla, e a string inline é sobrescrita — as três
               páginas empilhavam no centro. */
            initial={false}
            animate={reduce || !active ? { x: p.x, rotate: p.rot } : { x: p.x, rotate: p.rot, y: [0, -14, 0] }}
            transition={{ duration: 12 + i * 2.5, delay: p.atraso, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: 460,
              height: 640,
              borderRadius: 14,
              border: "1px solid var(--line)",
              background: "var(--surface)",
              opacity: 0.34,
              padding: 38,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            {/* Hierarquia de página de venda em blocos: manchete, linha
                fina, corpo, botão. Reconhecível sem ser ninguém. */}
            <div style={{ height: 54, background: "var(--fg-4)", opacity: 0.4, borderRadius: 6 }} />
            <div style={{ height: 22, width: "70%", background: "var(--fg-4)", opacity: 0.28, borderRadius: 5 }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, marginTop: 14 }}>
              {Array.from({ length: 7 }, (_, k) => (
                <div
                  key={k}
                  style={{
                    height: 13,
                    width: `${94 - (k % 3) * 16}%`,
                    background: "var(--fg-4)",
                    opacity: 0.18,
                    borderRadius: 4,
                  }}
                />
              ))}
            </div>
            <div style={{ height: 58, background: "var(--accent)", opacity: 0.34, borderRadius: 8 }} />
          </motion.div>
        ))}
      </div>

      <div
        aria-hidden
        data-decor
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, var(--bg) 18%, transparent 72%)",
          pointerEvents: "none",
        }}
      />

      {/* maxWidth explícito: sem ele o wrapper se dimensiona pelo conteúdo
          e a frase de 122px sai numa linha só, 200px além da área segura.
          Com o limite, o `text-wrap: balance` quebra em duas linhas e o
          corpo de fonte não precisa encolher. */}
      <div style={{ position: "relative", display: "grid", placeItems: "center", maxWidth: 1640 }}>
        {children}
      </div>
    </div>
  );
}
