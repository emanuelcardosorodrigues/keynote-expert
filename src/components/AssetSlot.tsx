import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { FilmSlate, ImageSquare } from "@phosphor-icons/react";
import { useSlideActive } from "./SlideFrame";

/**
 * Registro de mídia resolvido em tempo de build.
 *
 * Basta soltar o arquivo em src/assets/<id>.<ext> e rebuildar: o glob
 * encontra, o placeholder desaparece e nenhum componente de slide muda.
 * Fica em src/assets (e não em public/) de propósito, porque assim o
 * Vite versiona o arquivo com hash e o build FALHA se o nome não casar
 * com nada, em vez de servir um 404 silencioso no meio do pitch.
 */
const REGISTRY = import.meta.glob("../assets/*.{mp4,webm,mov,png,jpg,jpeg,webp,avif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const BY_ID: Record<string, { url: string; ext: string }> = {};
for (const [path, url] of Object.entries(REGISTRY)) {
  const file = path.split("/").pop()!;
  const dot = file.lastIndexOf(".");
  BY_ID[file.slice(0, dot)] = { url, ext: file.slice(dot + 1).toLowerCase() };
}

const VIDEO_EXT = new Set(["mp4", "webm", "mov"]);

export type AssetKind = "video" | "print";

/**
 * Como a mídia preenche o quadro.
 *
 * `cover` corta pra preencher: certo pra foto de pessoa, onde o
 * enquadramento é o assunto.
 * `contain` mostra o arquivo inteiro: obrigatório pra captura de tela e
 * print de celular. Os assets reais desta aula são 4:3 (1252x948) e
 * retrato (577x963), e num quadro 16:9 o `cover` cortaria 30% da altura
 * de um vídeo de tela ou quase toda a conversa de um print de WhatsApp.
 */
export type AssetFit = "cover" | "contain";

export function AssetSlot({
  id,
  label,
  kind,
  note,
  blur = false,
  fit = "cover",
  objectPosition = "center",
  className,
}: {
  /** Nome do arquivo (sem extensão) esperado em src/assets/. */
  id: string;
  /** Nome humano do ativo, mostrado no placeholder. */
  label: string;
  kind: AssetKind;
  /** Instrução de produção, aparece só no placeholder. */
  note?: string;
  /** Slide 7: teaser, nítido em cima e borrado descendo. */
  blur?: boolean;
  fit?: AssetFit;
  objectPosition?: string;
  className?: string;
}) {
  const active = useSlideActive();
  const reduce = useReducedMotion();
  const found = BY_ID[id];

  return (
    <div className={className ? `frame ${className}` : "frame"} style={{ width: "100%", height: "100%" }}>
      {found ? (
        <motion.div
          /* Ken Burns. O quadro nunca fica parado, mesmo quando o clipe já
             tem movimento de cursor: 6% em 20s é lento demais pra competir
             com a fala e o bastante pra tela não morrer. Só transform. */
          animate={active && !reduce ? { scale: 1.06 } : { scale: 1 }}
          transition={active && !reduce ? { duration: 20, ease: "linear" } : { duration: 0 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Media found={found} label={label} objectPosition={objectPosition} blur={blur} fit={fit} />
        </motion.div>
      ) : (
        <div className="pending">
          {kind === "video" ? (
            <FilmSlate size={64} weight="regular" color="var(--accent)" aria-hidden />
          ) : (
            <ImageSquare size={64} weight="regular" color="var(--accent)" aria-hidden />
          )}
          <span className="kicker">Asset pendente</span>
          <span className="pending__name">{label}</span>
          <span className="pending__hint">
            {note ? `${note} ` : ""}
            Soltar em <code>src/assets/{id}.{kind === "video" ? "mp4" : "png"}</code> e rebuildar.
          </span>
        </div>
      )}
    </div>
  );
}

function Media({
  found,
  label,
  objectPosition,
  blur,
  fit,
}: {
  found: { url: string; ext: string };
  label: string;
  objectPosition: string;
  blur: boolean;
  fit: AssetFit;
}) {
  const active = useSlideActive();
  const ref = useRef<HTMLVideoElement>(null);
  const isVideo = VIDEO_EXT.has(found.ext);

  /* O clipe reinicia a cada entrada no slide, então no ensaio o Leandro
     nunca cai num vídeo parado no último frame. Em loop porque ele fala
     por cima por muito mais tempo que a duração da gravação. */
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      v.currentTime = 0;
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [active]);

  const box = {
    width: "100%",
    height: "100%",
    objectFit: fit,
    objectPosition,
  };

  if (isVideo) {
    return (
      <video
        ref={ref}
        src={found.url}
        muted /* o áudio do print de tela competiria com a fala ao vivo */
        loop
        playsInline
        preload="auto"
        aria-label={label}
        style={box}
      />
    );
  }

  if (!blur) return <img src={found.url} alt={label} style={box} />;

  /* Teaser: a mesma imagem duas vezes, a de cima borrada e mascarada, pra
     revelar o topo e deixar o resto ilegível. Sem cortar informação do
     arquivo original. */
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <img src={found.url} alt={label} style={box} />
      <img
        src={found.url}
        alt=""
        aria-hidden
        style={{
          ...box,
          position: "absolute",
          inset: 0,
          filter: "blur(14px)",
          maskImage: "linear-gradient(to bottom, transparent 0%, transparent 11%, #000 26%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, transparent 11%, #000 26%)",
        }}
      />
    </div>
  );
}

/**
 * Vazio de copy, não de arquivo. Slides 31 e 32 chegaram no roteiro com a
 * coluna de texto descrevendo o formato ("lista curta em tela", "nome +
 * resultado") em vez de trazer o texto. Preencher por conta própria seria
 * inventar copy de pitch, então o slide fica navegável e o buraco fica
 * visível.
 */
export function CopyPending({ label, note }: { label: string; note?: string }) {
  return (
    <div className="pending">
      <span className="kicker">Copy pendente</span>
      <span className="pending__name">{label}</span>
      {note ? <span className="pending__hint">{note}</span> : null}
    </div>
  );
}

/** Inventário de mídia, usado pelo HUD do apresentador. */
export function assetStatus(id: string) {
  return BY_ID[id] ? "ok" : "pendente";
}

/**
 * URL resolvida do asset, ou `null` se o arquivo ainda não chegou.
 *
 * Existe pros componentes que compõem a mídia dentro de um layout próprio
 * (miniatura na pilha do gancho, foto do caso, fundo esmaecido) em vez de
 * preencher um quadro inteiro. Quem chama trata o `null` com o próprio
 * fallback: um placeholder de quadro cheio ali dentro quebraria o layout.
 */
export function assetUrl(id: string): string | null {
  return BY_ID[id]?.url ?? null;
}

/** `true` quando o asset é vídeo, pra quem monta a tag na mão. */
export function assetEhVideo(id: string) {
  const f = BY_ID[id];
  return f ? VIDEO_EXT.has(f.ext) : false;
}
