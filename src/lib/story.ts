export type CoverPage = {
  kind: "cover";
  title: string;
  subtitle: string;
  cta: string;
};

export type BackCoverPage = {
  kind: "back";
  kicker: string;
  body: string;
  promise: string;
  signature: string;
};

export type PascalSpot =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "rim-left"
  | "rim-right";

export type ChapterBeat =
  | { kind: "narration"; text: string }
  | { kind: "speech"; text: string }
  | { kind: "closing"; text: string; accent?: string };

export type ChapterPage = {
  kind: "chapter";
  id: string;
  chapter: string;
  title: string;
  body: string;
  beats?: ChapterBeat[];
  pascal?: PascalSpot;
  pascalPose?: "stand" | "lie";
};

export type LanternsPage = {
  kind: "lanterns";
  title: string;
  hint: string;
  cta: string;
};

export type VideoPage = {
  kind: "video";
  title: string;
  note: string;
};

export type Memory = {
  id: string;
  photo: string;
  caption: string;
  from?: string;
};

export type DedicationsPage = {
  kind: "dedications";
  title: string;
  hint: string;
  cta: string;
  items: Memory[];
};

export type MemoriesPage = {
  kind: "memories";
  title: string;
  hint: string;
  items: Memory[];
};

export type StoryPage =
  | CoverPage
  | ChapterPage
  | BackCoverPage
  | LanternsPage
  | VideoPage
  | DedicationsPage
  | MemoriesPage;

export const story: StoryPage[] = [
  {
    kind: "cover",
    title: "Para a princesa Lili",
    subtitle: "aos dezenove anos",
    cta: "Abrir o livro",
  },
  {
    kind: "chapter",
    id: "capitulo-i-1",
    chapter: "Capítulo I",
    title: "Como tudo começou",
    body: "Era uma vez uma princesa. Linda, charmosa, e com um temperamento que não se parecia com o das outras. Num certo dia, no seu castelo, havia um baile. Foi então que dois cavaleiros estranhos apareceram. Mal sabiam eles que, a partir daquele momento, uma nova história de amizade estava para começar.",
    pascal: "rim-right",
    pascalPose: "lie",
  },
  {
    kind: "chapter",
    id: "capitulo-i-2",
    chapter: "Capítulo I",
    title: "A festa",
    body: "Naquele dia, a festa só ficava melhor. Muitos amigos juntos, e as taças não paravam de se encher. Entre a princesa e aqueles cavaleiros perdidos havia uma coisa em comum: todos adoravam beber. Ficaram bêbados juntos, até o castelo girar. Daquele dia, quase não restou memória — só o começo de uma amizade.",
    pascal: "bottom-right",
    pascalPose: "stand",
  },
  {
    kind: "chapter",
    id: "capitulo-ii-1",
    chapter: "Capítulo II",
    title: "Saudade",
    body: "Os dias se passaram. Muitas coisas aconteceram, e a princesa e os cavaleiros não se encontraram mais. De ambos os lados, porém, restou a saudade e a lembrança daquela festa badalada. Os dois cavaleiros andavam sempre juntos, para cima e para baixo — até que um dia, num vilarejo vizinho, algo inesperado aconteceu.",
    pascal: "top-right",
    pascalPose: "stand",
  },
  {
    kind: "chapter",
    id: "capitulo-ii-2",
    chapter: "Capítulo II",
    title: "O reencontro",
    body: "Lá estavam os dois, como de costume: enchendo as taças e se divertindo. Até que a princesa Lili novamente cruzou o caminho deles — e com ela vinha sua melhor amiga, a princesa Dani. Os caminhos se cruzaram outra vez, e aquele dia ficou para a história da amizade desse grupo.",
    pascal: "bottom-right",
    pascalPose: "lie",
  },
  {
    kind: "chapter",
    id: "capitulo-ii-3",
    chapter: "Capítulo II",
    title: "Cem moedas",
    body: "Um dos cavaleiros se chamava Zamp: o mais doido e divertido da dupla. Saiu dizendo que daria moedas de ouro a todos que acreditassem no seu mais novo projeto. Já o outro, o cavaleiro Du, estava sempre ali para controlá-lo — o que era meio difícil.",
    beats: [
      {
        kind: "narration",
        text: "Um dos cavaleiros se chamava Zamp: o mais doido e divertido da dupla. Saiu dizendo que daria moedas de ouro a todos que acreditassem no seu mais novo projeto.",
      },
      {
        kind: "speech",
        text: "— Eu vou dar cem moedas de ouro para você, princesa Lili,",
      },
      {
        kind: "speech",
        text: "— e o mesmo para a princesa Dani! Eu prometo.",
      },
      {
        kind: "narration",
        text: "Já o outro, o cavaleiro Du, estava sempre ali para controlá-lo — o que era meio difícil.",
      },
      {
        kind: "speech",
        text: "— Tudo bem, meu amigo Zamp,",
      },
      {
        kind: "speech",
        text: "— mas fala baixo que todos estão ouvindo.",
      },
      {
        kind: "narration",
        text: "Dizia ele, com vergonha.",
      },
    ],
    pascal: "rim-right",
    pascalPose: "stand",
  },
  {
    kind: "chapter",
    id: "capitulo-ii-4",
    chapter: "Capítulo II",
    title: "Pela primeira vez",
    body: "E o esperado aconteceu. Naquele dia o cavaleiro Zamp passou dos limites, ficou bem embriagado, e tiveram que levá-lo carregado por todo aquele vilarejo. Até o caminho da estrada foram rindo e se divertindo — até que o cavaleiro Zamp sentou no chão e, de lá, soltou tudo o que tinha dentro. Todos riram daquele momento. E foi ali que a princesa Lili cuidou desse cavaleiro pela primeira vez.",
    pascal: "bottom-right",
    pascalPose: "lie",
  },
  {
    kind: "chapter",
    id: "capitulo-iii-1",
    chapter: "Capítulo III",
    title: "Aquele lar",
    body: "Desse dia em diante, nunca mais se separaram. Viraram uma grande família. Os cavaleiros frequentavam o castelo da princesa Lili sempre que podiam: lá se divertiam, colocavam o papo em dia e sempre estavam bebendo. Diziam que aquele lugar era próximo ao paraíso. A rainha do castelo, a rainha Ro, sempre os recebia de braços abertos, como filhos — e por isso eles sempre retornavam àquele lar.",
    pascal: "top-right",
    pascalPose: "stand",
  },
  {
    kind: "chapter",
    id: "capitulo-iii-2",
    chapter: "Capítulo III",
    title: "Irmãos",
    body: "A amizade se fortaleceu ainda mais com o passar do tempo. Hoje, esses quatro são como irmãos de sangue: sempre cuidando uns dos outros, prezando pelo bem-estar e pela felicidade. Não era o sangue que os fazia família. Era a escolha, feita todos os dias, de nunca deixar o outro no chão.",
    beats: [
      {
        kind: "narration",
        text: "A amizade se fortaleceu ainda mais com o passar do tempo. Hoje, esses quatro são como irmãos de sangue: sempre cuidando uns dos outros, prezando pelo bem-estar e pela felicidade.",
      },
      {
        kind: "closing",
        text: "Não era o sangue que os fazia família. Era a escolha, feita todos os dias, de nunca deixar o outro no chão.",
      },
    ],
    pascal: "rim-right",
    pascalPose: "lie",
  },
  {
    kind: "chapter",
    id: "capitulo-iv-1",
    chapter: "Capítulo IV",
    title: "O que você significa",
    body: "Sim: o escritor deste livro sou eu, o cavaleiro Zamp. Quero te dizer que, hoje, você é uma das pessoas mais importantes da minha vida. O cuidado, o carinho, o afeto — não são só palavras. Eu consigo sentir tudo de uma forma inexplicável, e espero do fundo do meu coração que você consiga sentir tudo de volta quando está comigo. Sempre que sentir que está mal, ou que precisar de algo para se distrair, volte a esta surpresa. Eu te amo hoje, amanhã e sempre, princesa Lili.",
    beats: [
      {
        kind: "narration",
        text: "Sim: o escritor deste livro sou eu, o cavaleiro Zamp. Quero te dizer que, hoje, você é uma das pessoas mais importantes da minha vida. O cuidado, o carinho, o afeto — não são só palavras. Eu consigo sentir tudo de uma forma inexplicável, e espero do fundo do meu coração que você consiga sentir tudo de volta quando está comigo.",
      },
      {
        kind: "narration",
        text: "Sempre que sentir que está mal, ou que precisar de algo para se distrair, volte a esta surpresa. Ela continua aqui.",
      },
      {
        kind: "closing",
        text: "Eu te amo hoje, amanhã e sempre, princesa Lili.",
        accent: "princesa Lili",
      },
    ],
    pascal: "bottom-right",
    pascalPose: "stand",
  },
  {
    kind: "back",
    kicker: "Dedicatória",
    body: "Este livro é dedicado à minha melhor amiga e parceira, princesa Lili. Ele continuará aqui para sempre, então sempre volte para ver a nossa coleção de momentos. Sempre conte comigo para tudo.",
    promise: "Ah, e melhor: não pense que acabou. Tem muitas surpresas boas e mágicas para você. Aproveite!",
    signature: "Com amor, Zamperlini",
  },
  {
    kind: "lanterns",
    title: "A festa das lanternas",
    hint: "Toque a lanterna.",
    cta: "Soltar a última lanterna",
  },
  {
    kind: "video",
    title: "Uma música para você",
    note: "Aqui entra o vídeo do violino. A cena final, como a festa de Corona.",
  },
  {
    kind: "dedications",
    title: "Dedicatórias",
    hint: "Toque a lanterna.",
    cta: "Soltar a lanterna",
    items: [
      { id: "d1", photo: "/assets/dedications/01.jpeg", from: "Zamp", caption: "Você apareceu do nada e mudou a minha forma de ver a vida, te amo muito gatona!" },
      { id: "d2", photo: "/assets/dedications/02.jpeg", from: "Dani", caption: "Entre risos,segredos e momentos que nunca vão se apagar, a nossa amizade se tornou uma das coisas mais bonitas que a vida me deu." },
      { id: "d3", photo: "/assets/dedications/03.jpg", caption: "A frase desta dedicatória entra aqui." },
      { id: "d4", photo: "/assets/dedications/04.jpg", caption: "A frase desta dedicatória entra aqui." },
      { id: "d5", photo: "/assets/dedications/05.jpg", caption: "A frase desta dedicatória entra aqui." },
      { id: "d6", photo: "/assets/dedications/06.jpg", caption: "A frase desta dedicatória entra aqui." },
    ],
  },
  {
    kind: "memories",
    title: "Nossa coleção de momentos",
    hint: "Toque uma lanterna.",
    items: [
      { id: "1", photo: "/assets/memories/01.jpeg", caption: "Sempre juntos e sempre loucões, amo isso em nós." },
      { id: "2", photo: "/assets/memories/02.jpeg", caption: "Acho que essa foto é uma das que mais estamos cafetas, todos nós." },
      { id: "3", photo: "/assets/memories/03.jpeg", caption: "Nessa hora aí, começou a subir a sensação de poder." },
      { id: "4", photo: "/assets/memories/04.jpeg", caption: "Foto icônica, simplesmente." },
      { id: "5", photo: "/assets/memories/05.jpeg", caption: "Eu te amo tanto, minha princesa Lili." },
      { id: "6", photo: "/assets/memories/06.jpeg", caption: "Não estamos nesse momento, mas aí você tá muito Drake." },
      { id: "7", photo: "/assets/memories/07.jpg", caption: "A frase desta foto entra aqui." },
      { id: "8", photo: "/assets/memories/08.jpg", caption: "A frase desta foto entra aqui." },
      { id: "9", photo: "/assets/memories/09.jpg", caption: "A frase desta foto entra aqui." },
      { id: "10", photo: "/assets/memories/10.jpg", caption: "A frase desta foto entra aqui." },
      { id: "11", photo: "/assets/memories/11.jpg", caption: "A frase desta foto entra aqui." },
      { id: "12", photo: "/assets/memories/12.jpg", caption: "A frase desta foto entra aqui." },
      { id: "13", photo: "/assets/memories/13.jpg", caption: "A frase desta foto entra aqui." },
      { id: "14", photo: "/assets/memories/14.jpg", caption: "A frase desta foto entra aqui." },
      { id: "15", photo: "/assets/memories/15.jpg", caption: "A frase desta foto entra aqui." },
      { id: "16", photo: "/assets/memories/16.jpg", caption: "A frase desta foto entra aqui." },
      { id: "17", photo: "/assets/memories/17.jpg", caption: "A frase desta foto entra aqui." },
      { id: "18", photo: "/assets/memories/18.jpg", caption: "A frase desta foto entra aqui." },
      { id: "19", photo: "/assets/memories/19.jpg", caption: "A frase desta foto entra aqui." },
    ],
  },
];
