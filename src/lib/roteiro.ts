/* ═══════════════════════════════════════════════════════════════════
   Edições do roteiro do apresentador.

   O deck é estático num Worker: não existe backend pra guardar texto. As
   edições ficam em localStorage, que é exatamente onde elas precisam
   estar — no notebook em que o presenter roda.

   O preço disso é que limpar o navegador leva as edições junto. Por isso
   existe o `exportar()`: o que ele ajustou ao vivo vira JSON, volta pro
   deck.tsx e passa a ser código. localStorage é o rascunho; o código é o
   original.

   Só os campos do presenter são editáveis. O texto público não: ele é
   literal do roteiro e mudar ali muda o que a plateia lê.
   ═══════════════════════════════════════════════════════════════════ */

/* A chave carrega o slug E uma versão do deck.
   O slug porque ela nasceu copiada do deck da Aula 5 e ficou apontando
   pra lá: o presenter da Aula 6 lia e gravava as edições da Aula 5.
   A versão porque as edições são indexadas por número de slide — quando
   o deck é refeito, o que estava salvo no slide 14 antigo apareceria no
   14 novo, que é outro assunto. Refez o deck, bumpa a versão. */
const CHAVE = "deck-lps-slide-aula06:roteiro:v2";

export type Campo = "diz" | "tom" | "proximo";
export type Edicoes = Record<number, Partial<Record<Campo, string>>>;

export function carregar(): Edicoes {
  if (typeof localStorage === "undefined") return {};
  try {
    const cru = localStorage.getItem(CHAVE);
    if (!cru) return {};
    const v = JSON.parse(cru);
    return v && typeof v === "object" ? (v as Edicoes) : {};
  } catch {
    /* JSON corrompido não pode derrubar a aula: cai pro original. */
    return {};
  }
}

function gravar(e: Edicoes) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(e));
  } catch {
    /* Cota cheia ou modo privativo: a edição vale só nesta sessão. */
  }
}

/** Texto vazio ou igual ao original não vira edição: apaga a entrada. */
export function editar(atual: Edicoes, n: number, campo: Campo, valor: string, original: string): Edicoes {
  const proximo: Edicoes = { ...atual, [n]: { ...atual[n] } };
  if (valor.trim() === "" || valor === original) {
    delete proximo[n][campo];
    if (Object.keys(proximo[n]).length === 0) delete proximo[n];
  } else {
    proximo[n][campo] = valor;
  }
  gravar(proximo);
  return proximo;
}

export function restaurarSlide(atual: Edicoes, n: number): Edicoes {
  const proximo = { ...atual };
  delete proximo[n];
  gravar(proximo);
  return proximo;
}

export function restaurarTudo(): Edicoes {
  gravar({});
  return {};
}

/** O que ele ajustou ao vivo, pronto pra virar código. */
export function exportar(e: Edicoes): string {
  return JSON.stringify(e, null, 2);
}

export function quantasEdicoes(e: Edicoes): number {
  return Object.keys(e).length;
}
