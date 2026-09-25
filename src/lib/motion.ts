import { useReducedMotion, type Transition, type Variants } from "motion/react";
import { useMemo } from "react";

/* Curva única do deck, herdada de pda-proposta-alex-barreira. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/* Spring pra tudo que se move no espaço; duração só pra opacidade e cor
   (regra 2 da skill motion-ui). Calibrados pra assentar perto dos ~0.6s
   que o roteiro pede, sem o toque mecânico de um tween. */
export const SPRING_TEXT: Transition = { type: "spring", stiffness: 190, damping: 26 };
export const SPRING_SOFT: Transition = { type: "spring", stiffness: 90, damping: 20 };
export const SPRING_POP: Transition = { type: "spring", stiffness: 320, damping: 24 };

export const FADE: Transition = { duration: 0.42, ease: EASE };

/* Crossfade entre slides. Saída mais curta que a entrada pra não abrir um
   vale vazio no meio da troca. */
export const OUT: Transition = { duration: 0.2, ease: "linear" };
export const IN: Transition = { duration: 0.28, ease: EASE };

/**
 * Variants de entrada do conteúdo de um slide.
 *
 * Container e item existem pra orquestrar por herança: o container troca
 * de estado e os filhos herdam, então nenhum slide repete `animate`.
 */
export function useSlideVariants(stagger = 0.09, delayChildren = 0.06) {
  const reduce = useReducedMotion();

  return useMemo(() => {
    const container: Variants = {
      hide: {},
      show: {
        transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: reduce ? 0 : delayChildren },
      },
    };

    /* Com reduced motion o conteúdo ainda entra, só que em opacidade:
       cortar a entrada deixaria o slide chapado sem motivo. */
    const item: Variants = {
      hide: { opacity: 0, y: reduce ? 0 : 24 },
      show: { opacity: 1, y: 0, transition: reduce ? FADE : SPRING_TEXT },
    };

    /* Entrada com mais peso, pro clímax lógico (slide 27). */
    const peso: Variants = {
      hide: { opacity: 0, scale: reduce ? 1 : 0.84 },
      show: { opacity: 1, scale: 1, transition: reduce ? FADE : { type: "spring", stiffness: 220, damping: 18 } },
    };

    /* Slide 7: só fade, lento, sem movimento nenhum. O vazio é o
       argumento; qualquer deslocamento transformaria comentário de
       passagem em ênfase. */
    const soFade: Variants = {
      hide: { opacity: 0 },
      show: { opacity: 1, transition: { duration: reduce ? 0 : 1.4, ease: "linear" } },
    };

    const rule: Variants = {
      hide: { opacity: 0, scaleX: reduce ? 1 : 0 },
      show: { opacity: 1, scaleX: 1, transition: { duration: reduce ? 0 : 0.6, ease: EASE } },
    };

    return { container, item, peso, soFade, rule, reduce };
  }, [reduce, stagger, delayChildren]);
}

/** Formata em reais sem centavos, do jeito que a plateia lê. */
export function brl(v: number) {
  return `R$ ${Math.round(v).toLocaleString("pt-BR")}`;
}
