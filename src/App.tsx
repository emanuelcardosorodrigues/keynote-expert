import { motion } from "motion/react";
import { PASSOS, SLIDES } from "@/deck";
import { SlideFrame } from "@/components/SlideFrame";
import { PresenterView } from "@/components/PresenterView";
import { PresenterAuth } from "@/components/PresenterAuth";
import { IS_PRESENTER, cliqueNavega, useDeck, useStageScale } from "@/lib/useDeck";

/* Cor de letterbox por temperatura. Em 16:9 ela é invisível; em 16:10
   (notebook) as faixas leem como matte de propósito. */
const LETTERBOX: Record<string, string> = { warm: "#FAF9F7", cold: "#151922" };

export default function App() {
  const { index, passo, total, proximo, inicioAula, entrouNoSlide, forcarSincronia } = useDeck(SLIDES.length, PASSOS);
  const scale = useStageScale();
  const atual = SLIDES[index];

  /* As duas janelas rodam o MESMO useDeck e o mesmo canal, então avançar
     de qualquer uma move as duas. O presenter só troca o que desenha. */
  if (IS_PRESENTER) {
    return <PresenterAuth>
      <div
        onClick={(e) => {
          if (cliqueNavega(e.target)) proximo();
        }}
      >
        <PresenterView
          slide={atual}
          proximoSlide={SLIDES[index + 1]}
          index={index}
          passo={passo}
          total={total}
          inicioAula={inicioAula}
          entrouNoSlide={entrouNoSlide}
          forcarSincronia={forcarSincronia}
        />
      </div>
    </PresenterAuth>;
  }

  return (
    <div
      className="deck"
      style={{ background: LETTERBOX[atual.tema] }}
      /* Clique em qualquer ponto avança: é o caminho do clicker e do
         mouse. */
      onClick={(e) => {
        if (cliqueNavega(e.target)) proximo();
      }}
    >
      <div className="stage" style={{ transform: `translate(-50%, -50%) scale(${scale})` }}>
        {SLIDES.map((s, i) => (
          <SlideFrame
            key={s.n}
            theme={s.tema}
            active={i === index}
            near={Math.abs(i - index) <= 1}
            passo={passo}
            stagger={s.stagger}
            corteSeco={s.corteSeco}
          >
            {s.node}
          </SlideFrame>
        ))}

        {/* Grão por cima do conteúdo, dentro do palco pra escalar junto. */}
        <div className="grain" style={{ zIndex: 6 }} aria-hidden />

        {/* Barra de progresso: sem número, a plateia não precisa saber
            quanto falta. */}
        <div className="progresso" style={{ zIndex: 7 }} data-theme={atual.tema} aria-hidden>
          <motion.div
            className="progresso__fill"
            initial={false}
            animate={{ scaleX: (index + 1) / total }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
      </div>
    </div>
  );
}
