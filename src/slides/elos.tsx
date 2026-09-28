type Props = {
  number: number;
  title: string;
  copy: string;
  proof?: ElosProof;
  scene?: ElosScene;
};

export type ElosProof = { src: string; legenda: string };
export type ElosScene = "mulher" | "cama" | "mesa" | "casal" | "esperanca";

const POSICAO: Record<ElosScene, string> = {
  mulher: "0% 0%", cama: "50% 0%", mesa: "100% 0%", casal: "0% 100%", esperanca: "100% 100%",
};

function linhas(copy: string): string[] {
  const partes = copy.split(/ (?=(?:[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ]?[a-záàâãéêíóôõúç]+ ){0,4}[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ][^ ]+)/).filter(Boolean);
  return partes.length > 1 ? partes.slice(0, 4) : [copy];
}

export function ElosSlide({ number, title, copy, proof, scene }: Props) {
  const espera = number === 1;
  const censo = number === 3;
  const audio = number === 2;
  const aplicacao = number >= 100;
  return (
    <div className={`elos elos--${scene ? "com-cena" : "tipografico"}`}>
      {scene ? <div className="elos__cena" style={{ backgroundPosition: POSICAO[scene] }} aria-hidden /> : null}
      <div className="elos__velo" aria-hidden />
      <header className="elos__marca"><span>ELOS</span><i /> Programa de Acompanhamento de Casais</header>
      <div className="elos__conteudo">
        {espera ? <>
          <p className="elos__kicker">Webinar de aplicação</p>
          <h1>A aula começa<br />em instantes</h1>
          <div className="elos__contador">03:00</div>
        </> : censo ? <>
          <p className="elos__kicker">Antes de começar</p>
          <h1>Quem está aqui?</h1>
          <div className="elos__campos"><span>Nome</span><span>Cidade</span><span>Há quanto tempo você é casada</span></div>
        </> : audio ? <>
          <p className="elos__kicker">Vamos nos encontrar</p>
          <h1>Escreve <em>EU</em><br />no chat</h1>
        </> : proof ? <>
          <div className="elos__prova">
            <img src={`/pac-web01-slides/assets/elos/${proof.src}`} alt={proof.legenda} />
            <div><p className="elos__kicker">Prova real</p><h2>{copy}</h2><span>{proof.legenda}</span></div>
          </div>
        </> : <>
          <p className="elos__kicker">{title.replace(/^\d{3}\s*/, "")}</p>
          <h1 className={copy.length > 100 ? "elos__titulo elos__titulo--longo" : "elos__titulo"}>{linhas(copy).map((linha, i) => <span key={i}>{linha}</span>)}</h1>
          {number === 10 ? <div className="elos__seguranca">Em risco ou violência: ligue <strong>180</strong></div> : null}
          {aplicacao ? <div className="elos__cta">Preencher ficha de aplicação <b>→</b></div> : null}
        </>}
      </div>
      <footer className="elos__rodape"><span>{String(number).padStart(3, "0")}</span><span>Um começa. Do jeito certo.</span></footer>
    </div>
  );
}
