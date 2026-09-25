import type { ReactNode } from "react";
import {
  AirplaneTakeoff,
  Blueprint,
  CalendarCheck,
  ChatCircleDots,
  ChalkboardTeacher,
  Compass,
  FileText,
  Globe,
  GraduationCap,
  Headset,
  PaperPlaneTilt,
  Receipt,
  Sparkle,
  Timer,
  Users,
  UsersThree,
} from "@phosphor-icons/react";
import type { Theme } from "@/components/SlideFrame";
import { Chat, Isolada } from "@/slides/basicos";
import { SomaComThumb, TotalGancho, type ItemGancho } from "@/slides/gancho";
import { CasoProva, MiniaturasCasos } from "@/slides/prova";
import { ComFundo, MosaicoAulas, PaginasEsmaecidas, TiraFotos } from "@/slides/fundo";
import {
  BuildEtapas,
  GridChecklist,
  GradeInclusos,
  PrecoDoPrograma,
  SlideBonus,
  TresColunas,
  ValorComCondicao,
  type ItemOferta,
} from "@/slides/oferta";
import {
  Comparacao,
  DuasLinhas,
  FraseComSimbolo,
  GradeRiscada,
  MapaMovimentos,
  Midia,
  PilhaPorPasso,
} from "@/slides/aula6";

/* ═══════════════════════════════════════════════════════════════════
   Os 69 slides da Aula 6 da Imersão Lucro Clínico: o pitch final.

   Duas camadas no mesmo registro:
   - o que a PLATEIA vê (`node`): um elemento central, muito respiro,
     nunca bullet e nunca a frase que ele fala;
   - o que só o LEANDRO vê (`diz`/`tom`/`proximo`): batimento de fala, 4 a
     10 palavras, pra ler de relance sem tirar o olho da câmera.

   `passos` é o build DENTRO do slide. Os reveals de prova (14, 28, 29,
   30), a soma do gancho (2) e a pilha do lucro mensal (48) usam o mesmo
   gesto: a primeira tecla completa o slide, a seguinte troca de slide.

   Regra de mídia deste deck, mais agressiva que a dos anteriores:
   vídeo real > foto real > print real > ícone. Ícone só quando nenhum
   asset existe ou quando o vazio é o argumento (slides 4 e 51).

   O bloco "pra quem NÃO é" saiu: o Águia serve pro dentista de uma
   cadeira e pro de várias, e um slide riscando "só quer mais paciente"
   fecha porta que a oferta não fecha.
   ═══════════════════════════════════════════════════════════════════ */

export type Slide = {
  n: number;
  bloco: string;
  tema: Theme;
  /** Passos internos. 0 = o slide entra pronto. */
  passos?: number;
  /** O que cada passo faz, mostrado no presenter pra ele não ser pego de surpresa. */
  passoRotulo?: string[];
  stagger?: number;
  /** Troca instantânea, sem crossfade. Só o slide 4. */
  corteSeco?: boolean;
  diz: string;
  tom: string;
  proximo: string;
  node: ReactNode;
};

/* ── Temperatura ─────────────────────────────────────────────────────
   1 a 31 quente (gancho, autoridade, problema, prova), 32 a 57 frio
   (demonstração, ancoragem, preço, mecânica), 58 a 69 quente de novo
   (bônus, resumo, fechamento). Duas viradas, ambas em fronteira de
   bloco do roteiro, ambas lavadas por baixo em 800ms.
   ─────────────────────────────────────────────────────────────────── */

/* ── O gancho ───────────────────────────────────────────────────────
   Os cinco números da semana, na ordem das aulas. Cada um carrega a
   thumbnail da aula que o produziu: a conta não é afirmada, é
   rastreável até a noite em que a pessoa assistiu.
   ────────────────────────────────────────────────────────────────── */
const CONTA_DA_SEMANA: ItemGancho[] = [
  { id: "imposto", label: "Imposto", valor: "R$ 7.700", thumb: "aula-1" },
  { id: "precificacao", label: "Precificação", valor: "R$ 2.500", thumb: "aula-2" },
  { id: "parceiro", label: "Dentista parceiro", valor: "R$ 3.000", thumb: "aula-3" },
  { id: "reativacao", label: "Reativação", valor: "R$ 8.000", thumb: "aula-4" },
  { id: "redes", label: "Redes sociais", valor: "R$ 4.000", thumb: "aula-5" },
];

/* Os seis movimentos. A mesma lista alimenta o slide-mapa (40) e o
   fundo neutro do Q&A (67). */
const MOVIMENTOS = [
  { n: 1, label: "Decolagem", icon: AirplaneTakeoff },
  { n: 2, label: "GPS", icon: Compass },
  { n: 3, label: "Grupo", icon: UsersThree },
  { n: 4, label: "Tributário", icon: Receipt },
  { n: 5, label: "Didática", icon: GraduationCap },
  { n: 6, label: "Consultores", icon: Headset },
];

const CASOS = [
  { nome: "Ana Beatriz", foto: "caso-ana-beatriz", antes: 7, depois: 13 },
  { nome: "Maria Emília", foto: "caso-maria-emilia", antes: 6, depois: 16 },
  { nome: "José Ronaldo", foto: "caso-jose-ronaldo", antes: 4, depois: 22 },
];

/* ── Resumo da oferta (slide 63) ────────────────────────────────────
   Dezesseis, não quinze: o roteiro fecha a lista com "6 meses de
   acompanhamento próximo", e ele não é mais um item — é o que segura
   os quinze de cima. Entra como card atravessado no rodapé do grid.

   Sem thumbnail de fundo. Sete dos dezesseis apontavam pra um asset,
   mas seis desses são .mp4 e não renderizam num <img>: só o print do
   WhatsApp aparecia, e um card diferente dos outros quinze lê como
   defeito. Ou todos têm tela real, ou nenhum tem.
   ────────────────────────────────────────────────────────────────── */
const OFERTA: ItemOferta[] = [
  { label: "Ficha de decolagem", icone: AirplaneTakeoff },
  { label: "Teste DISC", icone: Blueprint },
  { label: "Copiloto Águia", icone: Compass },
  { label: "Reunião de diagnóstico comigo", icone: CalendarCheck },
  { label: "Reunião de precificação comigo", icone: Receipt },
  { label: "Central de Consultores", icone: Headset },
  { label: "Treinamento de secretárias", icone: ChalkboardTeacher },
  { label: "Treinamento de secretárias ao vivo", icone: Users },
  { label: "Contrato para dentista parceiro", icone: FileText },
  { label: "Contrato para colaboradores", icone: FileText },
  { label: "Consultoria tributária com a equipe", icone: Receipt },
  { label: "Campanha de reativação pronta", icone: PaperPlaneTilt },
  { label: "Painel de reativação de pacientes", icone: Blueprint },
  { label: "Grupo com até 10 dentistas", icone: UsersThree },
  { label: "Grupo de secretárias", icone: Users },
  { label: "6 meses de acompanhamento próximo", icone: Sparkle, destaque: true },
];

export const SLIDES: Slide[] = [
  /* ═══ Gancho ═══ */
  { n: 1, bloco: "Gancho", tema: "warm",
    diz: "Domingo à noite, cinco dias depois", tom: "fecha, não abre", proximo: "Soma ao vivo",
    node: (
      <MosaicoAulas ids={["aula-1", "aula-2", "aula-3", "aula-4", "aula-5"]}>
        <Isolada texto="DOMINGO. CINCO DIAS DEPOIS." tamanho="d-xl" px={122} />
      </MosaicoAulas>
    ) },

  { n: 2, bloco: "Gancho", tema: "warm", passos: 4,
    passoRotulo: ["+ Precificação", "+ Dentista parceiro", "+ Reativação", "+ Redes sociais"],
    diz: "Imposto, precificação, parceiro, reativação, redes", tom: "ritmo de conta, uma pausa por item", proximo: "Total",
    node: <SomaComThumb itens={CONTA_DA_SEMANA} /> },

  { n: 3, bloco: "Gancho", tema: "warm",
    diz: "Mais de vinte e cinco mil. Dentro da própria clínica", tom: "pico do gancho", proximo: "Tá pago?",
    node: <TotalGancho itens={CONTA_DA_SEMANA} valor="R$ 25.200" legenda="dentro da sua clínica, essa semana" /> },

  { n: 4, bloco: "Gancho", tema: "warm", corteSeco: true,
    diz: "O evento tá pago?", tom: "corte seco, silêncio depois", proximo: "CHAT",
    node: <Isolada texto="O EVENTO TÁ PAGO?" tamanho="d-hero" px={176} /> },

  { n: 5, bloco: "Gancho", tema: "warm",
    diz: "Comenta: pagou ou não pagou", tom: "espera reação", proximo: "Dinheiro mais fácil",
    node: <Chat texto="pagou ou não pagou?" glyph={ChatCircleDots} /> },

  /* ═══ Conexão + Autoridade ═══ */
  { n: 6, bloco: "Autoridade", tema: "warm",
    diz: "Esses vinte e cinco mil são o dinheiro mais fácil", tom: "ponte pro autoridade", proximo: "30 anos",
    node: <Isolada texto="O DINHEIRO MAIS FÁCIL DA SUA CLÍNICA" tamanho="d-xl" px={116} /> },

  { n: 7, bloco: "Autoridade", tema: "warm",
    diz: "Descobrir isso me custou trinta anos", tom: "seco", proximo: "A vela",
    node: <Isolada texto="30 ANOS" tamanho="d-hero" /> },

  { n: 8, bloco: "Autoridade", tema: "warm",
    diz: "Vendia vela de porta em porta", tom: "vulnerável, guarda a imagem", proximo: "A viagem",
    node: <Midia id="leandro-vela" label="Leandro na época das velas" kind="print" /> },

  { n: 9, bloco: "Autoridade", tema: "warm",
    diz: "Viajando, com a clínica funcionando sem mim", tom: "orgulho contido", proximo: "R$ 25 mil é só o começo",
    node: <Midia id="leandro-viagem" label="Leandro viajando, clínica rodando sem ele" kind="print" /> },

  { n: 10, bloco: "Autoridade", tema: "warm",
    diz: "Vinte e cinco mil é só o começo", tom: "vira a chave", proximo: "Dobrar o que sobra",
    node: <Isolada texto="R$ 25 MIL É SÓ O COMEÇO" tamanho="d-xl" px={132} /> },

  { n: 11, bloco: "Autoridade", tema: "warm",
    diz: "Dobrar o que sobra, sem trabalhar mais", tom: "planta a promessa cedo", proximo: "Currículo",
    node: <Isolada texto="DOBRAR O QUE SOBRA. SEM TRABALHAR MAIS." tamanho="d-xl" px={112} cor="var(--accent-display)" peso brilha /> },

  { n: 12, bloco: "Autoridade", tema: "warm", stagger: 0.16,
    diz: "Trinta anos, de novo. Clínica, palco, o começo", tom: "eco, seco de propósito", proximo: "A mão que dói",
    node: (
      <TiraFotos
        numero="30 ANOS"
        fotos={[
          { id: "curriculo-inicio", label: "o começo, no consultório" },
          { id: "curriculo-palco", label: "palco do OdontoSummit" },
          /* A mesma foto da viagem do slide 9, de propósito: a tira é
             começo → palco → a clínica rodando sem ele, e o eco da
             imagem que a sala viu três slides antes fecha o arco em vez
             de introduzir um quarto assunto. */
          { id: "leandro-viagem", label: "a clínica rodando sem ele" },
        ]}
      />
    ) },

  { n: 13, bloco: "Autoridade", tema: "warm",
    diz: "Já fui o dentista do balde furado", tom: "verdade incômoda", proximo: "Maria Emília",
    node: <Midia id="mao-atendimento" label="Mão em atendimento clínico" kind="print" /> },

  { n: 14, bloco: "Autoridade", tema: "warm", passos: 1, passoRotulo: ["revela R$ 16 mil"],
    diz: "Maria Emília, raio-X da clínica. Seis pra dezesseis", tom: "prova concreta", proximo: "Alguém do lado",
    node: <CasoProva nome="Maria Emília" foto="caso-maria-emilia" antes={6} depois={16} nota="Sem atender um paciente a mais." /> },

  { n: 15, bloco: "Autoridade", tema: "warm",
    diz: "Curso não muda clínica. Alguém do lado muda", tom: "firme, sem venda", proximo: "O mercado esqueceu",
    node: <Isolada texto="ALGUÉM DO LADO" tamanho="d-hero" cor="var(--accent-display)" peso /> },

  /* ═══ O Grande Problema ═══ */
  { n: 16, bloco: "Problema", tema: "warm",
    diz: "O mercado esqueceu que você é dentista", tom: "firme, abertura do bloco", proximo: "CHAT curso/mentoria",
    node: <Isolada texto="O MERCADO ESQUECEU QUE VOCÊ É DENTISTA" tamanho="d-xl" px={112} /> },

  { n: 17, bloco: "Problema", tema: "warm", stagger: 0.22,
    diz: "Curso, mentoria, protocolo, método. Comenta quem já tentou", tom: "convite", proximo: "Fatura vs lucra",
    node: (
      <PaginasEsmaecidas>
        <GradeRiscada frases={["curso", "mentoria", "protocolo", "método"]} />
      </PaginasEsmaecidas>
    ) },

  { n: 18, bloco: "Problema", tema: "warm",
    diz: "É mais fácil aumentar o lucro que o faturamento", tom: "didático", proximo: "Fatura cem, lucra cem",
    node: <FraseComSimbolo antes="AUMENTAR O LUCRO" simbolo=">" depois="AUMENTAR O FATURAMENTO" /> },

  { n: 19, bloco: "Problema", tema: "warm", stagger: 0.5,
    diz: "Fatura cem, paga pra faturar. Lucra cem, fica tudo", tom: "números, deixa assentar", proximo: "Apetite ao risco",
    node: <DuasLinhas linhas={["FATURA 100 → CUSTA PRA FATURAR", "LUCRA 100 → VAI TODO PRO BOLSO"]} /> },

  { n: 20, bloco: "Problema", tema: "warm",
    diz: "Risco de um combina com segurança de outro. Nunca é igual", tom: "virada de bloco", proximo: "Nunca priorizavam",
    node: <FraseComSimbolo antes="APETITE AO RISCO" simbolo="≠" depois="SEGURANÇA" /> },

  { n: 21, bloco: "Problema", tema: "warm", stagger: 0.5,
    diz: "Nunca priorizaram lucro, nunca personalizaram. Foi por isso que criei o Águia", tom: "veredito, fecha o bloco", proximo: "O que é o Águia",
    node: <DuasLinhas linhas={["NUNCA PRIORIZAVAM O LUCRO.", "NUNCA PERSONALIZAVAM."]} /> },

  /* ═══ O que é o Programa Águia ═══ */
  { n: 22, bloco: "O Águia", tema: "warm",
    diz: "Eu via colegas sendo enganados", tom: "emocional", proximo: "O que sobra no bolso",
    /* Foto pura, como os slides 8, 9 e 13 — não fundo esmaecido. O
       briefing pedia `fundoMidia` aqui, mas fundo a 22% sem texto por
       cima é foto lavada sem motivo: o tratamento de fundo existe pra
       dar contraste a um texto, e este slide não tem texto. */
    node: <Midia id="leandro-reflexivo" label="Leandro, retrato reflexivo" kind="print" /> },

  { n: 23, bloco: "O Águia", tema: "warm",
    diz: "O foco é o que sobra no seu bolso", tom: "definição", proximo: "Personalizado",
    node: <Isolada texto="O QUE SOBRA NO SEU BOLSO" tamanho="d-xl" cor="var(--accent-display)" peso /> },

  { n: 24, bloco: "O Águia", tema: "warm",
    diz: "Personalizado, exclusivo pra você", tom: "fecha definição", proximo: "De dentista pra dentista",
    node: <Isolada texto="PERSONALIZADO. EXCLUSIVO PRA VOCÊ." tamanho="d-l" px={98} /> },

  /* ═══ Mecanismo Único ═══ */
  { n: 25, bloco: "Mecanismo", tema: "warm",
    diz: "De dentista pra dentista", tom: "seco", proximo: "Sem tempo, sem dinheiro",
    node: <Isolada texto="DE DENTISTA PRA DENTISTA" tamanho="d-xl" px={138} /> },

  { n: 26, bloco: "Mecanismo", tema: "warm", stagger: 0.2,
    diz: "Sem tempo, sem dinheiro, poucas cadeiras, sem parceiro. Nada disso impede", tom: "reconhecimento, sem julgar", proximo: "Impossível não ter resultado",
    node: <GradeRiscada frases={["sem tempo", "sem dinheiro", "poucas cadeiras", "sem parceiro"]} /> },

  { n: 27, bloco: "Mecanismo", tema: "warm",
    diz: "Impossível não ter resultado", tom: "peso, sem exagero", proximo: "Ana Beatriz",
    node: <Isolada texto="IMPOSSÍVEL NÃO TER RESULTADO" tamanho="d-xl" px={122} peso brilha /> },

  /* ═══ Prova ═══ */
  { n: 28, bloco: "Prova", tema: "warm", passos: 1, passoRotulo: ["revela R$ 13 mil"],
    diz: "Ana Beatriz, guarda o antes", tom: "reveal chegando", proximo: "Maria Emília",
    node: <CasoProva nome="Ana Beatriz" foto="caso-ana-beatriz" antes={7} depois={13} nota="Mesma agenda, mesma equipe." /> },

  { n: 29, bloco: "Prova", tema: "warm", passos: 1, passoRotulo: ["revela R$ 16 mil"],
    diz: "Maria Emília, o antes de novo", tom: "reveal chegando", proximo: "José Ronaldo",
    node: <CasoProva nome="Maria Emília" foto="caso-maria-emilia" antes={6} depois={16} nota="Preço e parceiro, na ordem certa." /> },

  { n: 30, bloco: "Prova", tema: "warm", passos: 1, passoRotulo: ["revela R$ 22 mil"],
    diz: "José Ronaldo, guarda o antes", tom: "reveal chegando", proximo: "Qual parece com você",
    node: <CasoProva nome="José Ronaldo" foto="caso-jose-ronaldo" antes={4} depois={22} nota="Faturava 100 e ganhava menos que a secretária." /> },

  { n: 31, bloco: "Prova", tema: "warm", stagger: 0.16,
    diz: "Qual desses parece com sua clínica", tom: "convite", proximo: "Promessa do método",
    node: <MiniaturasCasos casos={CASOS} pergunta="QUAL DESSES PARECE COM SUA CLÍNICA?" /> },

  /* ═══ Promessa + Método · aqui o fundo vira frio ═══ */
  { n: 32, bloco: "Método", tema: "cold",
    diz: "Esquece faturar mais, o alvo é dobrar o que sobra. Seis movimentos agora", tom: "vira a chave pra demonstração", proximo: "Movimento 1",
    node: <Isolada texto="MAIS QUE DOBRAR O QUE SOBRA" tamanho="d-xl" px={126} /> },

  { n: 33, bloco: "Método", tema: "cold",
    diz: "Decolagem e DISC, o insumo das duas horas comigo", tom: "mostra a tela, sem pressa", proximo: "GPS",
    node: <Midia id="movimento-1-disc-proposta" label="Ficha de decolagem e teste DISC" kind="video" /> },

  { n: 34, bloco: "Método", tema: "cold",
    diz: "Seu GPS, espaço só seu", tom: "mostra a tela", proximo: "Grupo",
    node: <Midia id="movimento-2-copiloto" label="Navegação pelo GPS / Guia de Voo" kind="video" /> },

  { n: 35, bloco: "Método", tema: "cold",
    diz: "Grupo de no máximo dez, eu leio, eu respondo", tom: "mostra o print", proximo: "Tributário",
    node: <Midia id="movimento-3-grupo-whatsapp" label="Grupo de WhatsApp" kind="print" /> },

  { n: 36, bloco: "Método", tema: "cold",
    diz: "Fator R, já vi pagar a parcela sozinha", tom: "mostra a tela", proximo: "Área didática",
    node: <Midia id="movimento-4-tributario" label="Consultor Tributário e Financeiro" kind="video" legenda="Fator R + equipe de contabilidade" /> },

  { n: 37, bloco: "Método", tema: "cold",
    diz: "Aula de dez minutos, não curso de dez horas", tom: "mostra a tela", proximo: "Central completa",
    node: <Midia id="movimento-5a-area-didatica" label="Lista de aulas da área didática" kind="video" /> },

  { n: 38, bloco: "Método", tema: "cold",
    diz: "Central inteira, sem limite, tudo já pronto", tom: "orgulho de produto, deixa rodar", proximo: "Secretária",
    node: <Midia id="movimento-5b-central-consultores" label="Grid dos 13 consultores" kind="video" /> },

  { n: 39, bloco: "Método", tema: "cold",
    diz: "Treino sua secretária, ao vivo e gravado", tom: "mostra o print", proximo: "Slide-mapa",
    node: <Midia id="movimento-5c-treinamento-secretaria" label="Treinamento da secretária" kind="video" /> },

  { n: 40, bloco: "Método", tema: "cold", stagger: 0.1,
    diz: "Seis meses assim, do meu lado, não um PDF", tom: "fecha a demonstração", proximo: "Pra quem é",
    node: <MapaMovimentos itens={MOVIMENTOS} /> },

  { n: 41, bloco: "Método", tema: "cold",
    diz: "Dono de consultório ou clínica, cansado de trabalhar muito. Serve pros dois", tom: "direto, inclui — não exclui ninguém", proximo: "Especialização",
    node: <Isolada texto="DONO DE CONSULTÓRIO OU CLÍNICA" tamanho="d-xl" px={116} /> },

  /* ═══ Ancoragem ═══ */
  { n: 42, bloco: "Ancoragem", tema: "cold",
    diz: "Especialização de trinta, quarenta, sessenta mil", tom: "vira a chave pro ancoragem", proximo: "Ortodontia",
    node: <Isolada texto="ESPECIALIZAÇÃO" tamanho="d-hero" px={186} /> },

  { n: 43, bloco: "Ancoragem", tema: "cold",
    diz: "Ortodontia, dois mil duzentos e cinquenta por mês, trinta e seis meses", tom: "mostra o print", proximo: "Dentística",
    node: <Midia id="ancoragem-ortodontia" label="Especialização em Ortodontia · investimento" kind="print" /> },

  { n: 44, bloco: "Ancoragem", tema: "cold",
    diz: "Mestrado em Dentística, matrícula mais vinte e cinco vezes", tom: "mostra o print", proximo: "Duas especializações",
    node: <Midia id="ancoragem-dentistica" label="Mestrado em Dentística · investimento" kind="print" /> },

  { n: 45, bloco: "Ancoragem", tema: "cold",
    diz: "Duas especializações, mais de cento e trinta mil", tom: "pico da comparação", proximo: "Sem retorno",
    node: (
      <TotalGancho
        itens={[
          { id: "orto", label: "Ortodontia · 36x R$ 2.250", valor: "R$ 81.000", thumb: "ancoragem-ortodontia" },
          { id: "dent", label: "Dentística · 26x R$ 1.997", valor: "R$ 51.922", thumb: "ancoragem-dentistica" },
        ]}
        valor="R$ 132.922"
        legenda="em duas especializações"
      />
    ) },

  { n: 46, bloco: "Ancoragem", tema: "cold", stagger: 0.55,
    /* Não é "não trouxe retorno": é retorno que não compensa o que
       custou. Afirmação vira acusação ao esforço dele; pergunta devolve
       a conta pra quem investiu. */
    diz: "Não trouxe o retorno que faz sentido. Valeu a pena?", tom: "pergunta, não acusação — deixa pesar", proximo: "Vinte e cinco mil de novo",
    node: <DuasLinhas linhas={["TANTO DINHEIRO, TEMPO E ESFORÇO.", "PRA SOBRAR TÃO POUCO?"]} /> },

  { n: 47, bloco: "Ancoragem", tema: "cold",
    diz: "SÓ nessa imersão: mais de vinte e cinco mil. Prontos pra coletar", tom: "carrega o SÓ — é o que uma semana achou", proximo: "Lucro mensal",
    node: <Isolada texto="MAIS DE R$ 25.000,00" tamanho="d-hero" px={190} cor="var(--accent-display)" peso brilha /> },

  { n: 48, bloco: "Ancoragem", tema: "cold", passos: 2, passoRotulo: ["+ R$ 7 mil", "+ R$ 8 mil"],
    diz: "Seis, sete, oito mil de lucro todo santo mês pra trás", tom: "constrói a conta", proximo: "Três e seis meses",
    node: <PilhaPorPasso valores={["R$ 6 mil", "R$ 7 mil", "R$ 8 mil"]} /> },

  { n: 49, bloco: "Ancoragem", tema: "cold", stagger: 0.8,
    diz: "Em três meses, vinte e quatro. Em seis, quase cinquenta", tom: "ancoragem final do bloco", proximo: "CHAT quanto custa",
    node: (
      <BuildEtapas
        numerado={false}
        etapas={[
          { rotulo: "3 MESES = R$ 24 MIL", detalhe: "deixados pra trás" },
          { rotulo: "6 MESES = QUASE R$ 50 MIL", detalhe: "deixados pra trás", destaque: true },
        ]}
      />
    ) },

  { n: 50, bloco: "Ancoragem", tema: "cold",
    diz: "Quanto isso tá te custando? Comenta aí", tom: "pede reação forte", proximo: "Doze mil",
    node: <Chat texto="QUANTO ISSO TÁ TE CUSTANDO?" glyph={ChatCircleDots} forte /> },

  /* ═══ Preço ═══ */
  { n: 51, bloco: "Preço", tema: "cold",
    diz: "No mercado, doze mil", tom: "referência neutra", proximo: "Seis mil",
    /* Sem brilho, sem acento: se este número competir com o 56, o 56
       deixa de ser o alívio que a estrutura inteira preparou. */
    node: (
      <PrecoDoPrograma
        comMarca
        valor="R$ 12.000,00"
        condicao="Programa Águia de Aceleração de Clínicas"
        nota="o valor real do programa"
      />
    ) },

  { n: 52, bloco: "Preço", tema: "cold",
    diz: "Pra quem tá na imersão, seis mil em doze vezes", tom: "reveal, sem pressa", proximo: "Nem três restaurações",
    node: (
      <PrecoDoPrograma
        brilha
        valor="R$ 6.000,00"
        condicao="em até 12x no cartão"
        nota="valor especial de quem está na Imersão Lucro Clínico"
      />
    ) },

  /* ═══ Ancoragem para baixo ═══ */
  { n: 53, bloco: "Preço", tema: "cold",
    diz: "Isso no cartão nem dá três restaurações por mês", tom: "ancoragem pra baixo", proximo: "R$ 799",
    node: (
      <ComFundo id="restauracao-procedimento" opacidade={0.3} objectPosition="center 35%">
        <Isolada texto="NEM 3 RESTAURAÇÕES POR MÊS" tamanho="d-xl" px={128} />
      </ComFundo>
    ) },

  /* ═══ Como vai funcionar ═══ */
  { n: 54, bloco: "Mecânica", tema: "cold",
    diz: "Você não vai pagar doze, nem seis. Sim. Setecentos e noventa e nove", tom: "pausa antes do número, deixa ele pesar", proximo: "Trinta dias",
    node: <ValorComCondicao valor="R$ 799" brilha /> },

  { n: 55, bloco: "Mecânica", tema: "cold",
    diz: "Trinta dias de Águia, começando agora", tom: "seco", proximo: "Tudo incluso",
    node: <Isolada texto="30 DIAS DE ÁGUIA" tamanho="d-hero" px={182} /> },

  { n: 56, bloco: "Mecânica", tema: "cold", stagger: 0.3,
    diz: "Reunião de duas horas, precificação, consultores. Tudo", tom: "orgulho de produto", proximo: "Não fez sentido",
    node: (
      <GradeInclusos
        fecho="TUDO"
        itens={[
          { label: "Reunião de 2h comigo", icone: CalendarCheck },
          { label: "Reunião de precificação", icone: Receipt },
          { label: "Acesso aos consultores", icone: Headset },
        ]}
      />
    ) },

  { n: 57, bloco: "Mecânica", tema: "cold", stagger: 0.55,
    /* Vazio proposital: sem mídia de fundo, sem brilho, sem acento. E
       sem uma palavra de reembolso — a mecânica é entrada não
       reembolsável, e a tela não pode sugerir devolução. */
    diz: "Não fez sentido depois de trinta dias? Você escolhe", tom: "neutro, sem prometer devolução", proximo: "Bônus do site",
    node: <DuasLinhas linhas={["NO DIA 31, VOCÊ ESCOLHE.", "continuar com a gente ou seguir sozinho"]} /> },

  /* ═══ Bônus · volta ao quente ═══ */
  { n: 58, bloco: "Bônus", tema: "warm",
    diz: "Site pronto, no seu nome, aparecendo no Google", tom: "mostra o print", proximo: "Escada de bônus",
    node: <Midia id="bonus-site-google" label="Site entregue, posicionado no Google" kind="print" /> },

  { n: 59, bloco: "Bônus", tema: "warm", stagger: 0.34,
    diz: "Um dos cinco primeiros a se matricular leva o site pronto", tom: "escassez real, número pequeno de propósito", proximo: "Bônus 2",
    node: (
      <SlideBonus
        ordem={1} total={3} glyph={Globe}
        titulo="SITE PRONTO NO SEU DOMÍNIO"
        detalhe="Minha equipe constrói, com a sua marca e a metodologia que acelera o seu Google Meu Negócio."
        condicao="SÓ OS 5 PRIMEIROS"
      />
    ) },

  { n: 60, bloco: "Bônus", tema: "warm", stagger: 0.34,
    diz: "Até oito da manhã de segunda: prioridade na minha agenda", tom: "urgência de relógio, não de vaga", proximo: "Bônus 3",
    node: (
      <SlideBonus
        ordem={2} total={3} glyph={Timer}
        titulo="DIAGNÓSTICO ANTECIPADO"
        detalhe="A primeira reunião comigo com prioridade na agenda. Você começa a coletar o lucro já nos próximos dias."
        condicao="ATÉ 8H DE SEGUNDA"
      />
    ) },

  { n: 61, bloco: "Bônus", tema: "warm", stagger: 0.34,
    diz: "Até vinte e três e cinquenta e nove: a campanha implantada com você", tom: "último prazo, fecha a janela", proximo: "As três janelas",
    node: (
      <SlideBonus
        ordem={3} total={3} glyph={PaperPlaneTilt}
        titulo="REATIVAÇÃO IMPLANTADA COM VOCÊ"
        detalhe="Eu e minha equipe escrevemos cada mensagem, treinamos a sua secretária e acompanhamos a campanha. Lucro a custo zero."
        condicao="ATÉ 23H59 DE SEGUNDA"
      />
    ) },

  { n: 62, bloco: "Bônus", tema: "warm", stagger: 0.8,
    diz: "Três janelas, e cada uma fecha na hora marcada", tom: "recap, deixa o relógio pesar", proximo: "Resumo da oferta",
    node: (
      <BuildEtapas
        etapas={[
          { rotulo: "5 primeiros", detalhe: "site no seu domínio, com a sua marca" },
          { rotulo: "Até 8h de segunda", detalhe: "Diagnóstico Antecipado: prioridade na agenda" },
          { rotulo: "Até 23h59 de segunda", detalhe: "campanha de reativação implantada com você", destaque: true },
        ]}
      />
    ) },

  /* ═══ Resumo da Oferta ═══ */
  { n: 63, bloco: "Oferta", tema: "warm", stagger: 0.08,
    diz: "Ficha, DISC, copiloto, consultores, tributário, reativação. Tudo incluso", tom: "orgulho, deixa o grid preencher", proximo: "Três caminhos",
    node: <GridChecklist itens={OFERTA} /> },

  /* ═══ 3 Caminhos ═══ */
  { n: 64, bloco: "Oferta", tema: "warm", stagger: 0.6,
    diz: "Continuar como está, tentar sozinho, ou ter alguém do lado", tom: "contraste, sem pressa no terceiro", proximo: "Sete horas",
    node: (
      <TresColunas
        colunas={[
          { titulo: "Continuar como está", detalhe: "mais trabalho, menos lucro" },
          { titulo: "Tentar sozinho", detalhe: "risco, patinar, quebrar a cara" },
          { titulo: "Ter alguém do lado", detalhe: "quem já faz isso há anos, do seu lado", destaque: true },
        ]}
      />
    ) },

  /* ═══ CTA para a ficha ═══ */
  { n: 65, bloco: "CTA", tema: "warm",
    diz: "Ficha de interesse, dez minutos de vantagem antes de todo mundo", tom: "urgência real", proximo: "Toque no link",
    node: <Comparacao a="7H" b="6H50" diferenca="10 min antes" /> },

  { n: 66, bloco: "CTA", tema: "warm",
    diz: "Toque no link, preenche a ficha", tom: "CTA direto", proximo: "Perguntas e respostas",
    node: <Isolada texto="TOQUE NO LINK" tamanho="d-hero" px={186} cor="var(--accent-display)" peso /> },

  /* ═══ Perguntas e Respostas ═══ */
  { n: 67, bloco: "Q&A", tema: "warm", stagger: 0.1,
    /* Fundo neutro de propósito: a tela não pode competir com a resposta
       real. O slide-mapa já é conhecido da sala, então não puxa leitura
       nova enquanto ele responde objeção por objeção. */
    diz: "Objeção por objeção, sem repetir o produto", tom: "acolhedor, paciente", proximo: "Toque no link de novo",
    node: <MapaMovimentos itens={MOVIMENTOS} /> },

  /* ═══ Fechamento ═══ */
  { n: 68, bloco: "Fechamento", tema: "warm", stagger: 0.45,
    diz: "Hoje é ficha. Você garante os dez minutos", tom: "leve o peso da decisão", proximo: "Fechamento",
    node: <DuasLinhas linhas={["TOQUE NO LINK.", "PREENCHA A FICHA."]} /> },

  { n: 69, bloco: "Fechamento", tema: "warm",
    diz: "Você apareceu a semana inteira. Faturamento é vaidade, lucro é sanidade", tom: "emocional, fica parado no fim", proximo: "fim da aula",
    node: (
      <ComFundo id="leandro-retrato" opacidade={0.17} objectPosition="center 24%">
        <Isolada texto="FATURAMENTO É VAIDADE. LUCRO É SANIDADE." tamanho="d-xl" px={108} cor="var(--accent-display)" peso />
      </ComFundo>
    ) },
];

/** Passos por slide, na ordem. O useDeck precisa disso pra navegar. */
export const PASSOS = SLIDES.map((s) => s.passos ?? 0);
