import type { ReactNode } from "react";
import type { Theme } from "@/components/SlideFrame";
import { ElosSlide, type ElosProof, type ElosScene } from "@/slides/elos";
import visualBrief from "./content/elos-visual.txt?raw";
import presenterBrief from "./content/elos-presenter.txt?raw";

export type Slide = {
  n: number;
  bloco: string;
  tema: Theme;
  passos?: number;
  passoRotulo?: string[];
  stagger?: number;
  corteSeco?: boolean;
  diz: string;
  tom: string;
  proximo: string;
  node: ReactNode;
};

type Visual = { n: number; titulo: string; tela: string };
type Presenter = { n: number; fala: string; palco: string };

const limpar = (texto: string) => texto.replace(/\s+/g, " ").trim();

function extrairVisuais(brief: string): Visual[] {
  return brief
    .split(/(?=^\d{3} )/m)
    .map((bloco) => {
      const cabecalho = bloco.match(/^(\d{3})\s+(.+)$/m);
      const tela = bloco.match(/\n\s*TELA\s+([\s\S]*?)(?=\n\s*COMPOSIÇÃO)/);
      if (!cabecalho || !tela) return null;
      return { n: Number(cabecalho[1]), titulo: limpar(cabecalho[2]), tela: limpar(tela[1]) };
    })
    .filter((slide): slide is Visual => Boolean(slide));
}

function extrairPresenter(brief: string): Map<number, Presenter> {
  const notas = new Map<number, Presenter>();
  for (const bloco of brief.split(/(?=^\d{3} )/m)) {
    const cabecalho = bloco.match(/^(\d{3})\s/m);
    const fala = bloco.match(/\n\s*FALA\s+([\s\S]*?)(?=\n\n\s*PALCO E AVANÇO)/);
    const palco = bloco.match(/\n\s*PALCO E AVANÇO\s+([\s\S]*?)(?=\n\n(?=\d{3} )|$)/);
    if (cabecalho && fala) notas.set(Number(cabecalho[1]), { n: Number(cabecalho[1]), fala: limpar(fala[1]), palco: limpar(palco?.[1] ?? "") });
  }
  return notas;
}

const PROVAS: Partial<Record<number, ElosProof>> = {
  27: { src: "prova-3-meses.png", legenda: "Depoimento autorizado" },
  29: { src: "prova-adulterio.jpeg", legenda: "Depoimento autorizado" },
  31: { src: "prova-ela-comeca.png", legenda: "Depoimento autorizado" },
  46: { src: "prova-parceria.png", legenda: "Depoimento autorizado" },
  53: { src: "prova-ela-comeca.png", legenda: "Depoimento autorizado" },
  59: { src: "prova-dialogo.png", legenda: "Depoimento autorizado" },
  65: { src: "prova-sentir-vista.png", legenda: "Depoimento autorizado" },
  66: { src: "prova-comeco.png", legenda: "Depoimento autorizado" },
  77: { src: "prova-origem.png", legenda: "Depoimento autorizado" },
  89: { src: "prova-parceria.png", legenda: "Depoimento autorizado" },
  109: { src: "prova-paz.png", legenda: "Depoimento autorizado" },
};

const CENAS: Partial<Record<number, ElosScene>> = {
  8: "mulher", 14: "esperanca", 16: "cama", 17: "cama", 18: "mesa", 20: "mulher", 21: "mesa", 26: "casal", 28: "casal", 39: "mulher", 42: "esperanca", 78: "esperanca", 113: "esperanca", 114: "mesa", 115: "casal", 129: "esperanca",
};

const ESCUROS = new Set([7, 15, 17, 35, 40, 41, 43, 47, 54, 60, 67, 79, 80, 81, 90, 97, 99, 100, 103, 105, 108, 110, 116, 126, 127, 129, 131, 132]);
const visuais = extrairVisuais(visualBrief);
const presenter = extrairPresenter(presenterBrief);

if (visuais.length !== 132 || visuais.some((slide, i) => slide.n !== i + 1)) {
  throw new Error(`Briefing ELOS inválido: esperados 132 slides sequenciais, recebidos ${visuais.length}.`);
}

export const SLIDES: Slide[] = visuais.map((visual, index) => {
  const nota = presenter.get(visual.n);
  const proximo = visuais[index + 1];
  return {
    n: visual.n,
    bloco: visual.titulo.replace(/^.*?\s/, ""),
    tema: ESCUROS.has(visual.n) ? "cold" : "warm",
    diz: nota?.fala ?? "",
    tom: nota?.palco ?? "",
    proximo: proximo?.titulo ?? "Encerramento",
    node: <ElosSlide number={visual.n} title={visual.titulo} copy={visual.tela} proof={PROVAS[visual.n]} scene={CENAS[visual.n]} />,
  };
});

export const PASSOS = SLIDES.map((slide) => slide.passos ?? 0);
