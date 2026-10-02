import type { SceneDef, FlatStep } from "./types";

const allScenes: SceneDef[] = [
  {
    id: "opening", act: 0, actName: "ÚVOD", component: "Opening",
    steps: [
      { id: "o1", title: "AI mění svět", speakerNote: "Ticho. AI nemění jen technologii. Mění způsob, jak lidé rozhodují, nakupují, pracují a jak firmy navrhují zkušenost." },
    ],
  },
  {
    id: "history", act: 0, actName: "ÚVOD", component: "History",
    steps: [
      { id: "h1", title: "1945", speakerNote: "V roce 1945 jsme stroji fyzicky připravovali data. Člověk se přizpůsoboval stroji.", sourcePage: 2 },
      { id: "h2", title: "1964", speakerNote: "Pak jsme se naučili jazyk počítače: příkazy, syntaxi a pravidla.", sourcePage: 2 },
      { id: "h3", title: "1973", speakerNote: "Grafické rozhraní přeložilo příkazy do objektů a akcí.", sourcePage: 2 },
      { id: "h4", title: "Dnes", speakerNote: "Dnes. Kurzor. Poprvé říkáme stroji, co chceme, přirozeným jazykem.", sourcePage: 2 },
      { id: "h5", title: "Rozhraní ustupuje záměru", speakerNote: "Dnes popisujeme výsledek. Rozhraní ustupuje záměru.", sourcePage: 2 },
    ],
  },
  {
    id: "intent", act: 0, actName: "ÚVOD", component: "Intent",
    steps: [
      { id: "i1", title: "Poprvé se přizpůsobuje stroj nám", speakerNote: "Poprvé se stroj přizpůsobuje nám. Neučíme se jeho jazyk; říkáme, čeho chceme dosáhnout.", sourcePage: 2 },
      { id: "i2", title: "A lidé si na to rychle zvykají", speakerNote: "A lidé si na to rychle zvykají.", sourcePage: 2 },
      { id: "i3", title: "AI už je součástí každodenního života", speakerNote: "AI už je součástí každodenního života. To je nový výchozí stav, ne experiment.", sourcePage: 2 },
    ],
  },
  {
    id: "adoption", act: 0, actName: "ÚVOD", component: "Adoption",
    steps: [
      { id: "a1", title: "72 %", speakerNote: "72 % Čechů už AI používá. AI už není okrajová technologie.", sources: ["cvvm", "eurostat"], sourcePage: 4 },
      { id: "a2", title: "38 % rozhoduje", speakerNote: "38 % evropských respondentů používá AI při hledání produktů a rozhodování, co koupit.", sources: ["mckinseyAgentic"], sourcePage: 4 },
      { id: "a3", title: "63 % porovnává", speakerNote: "63 % uživatelů AI s ní porovnává produkty a značky.", sources: ["mckinseyAgentic"], sourcePage: 4 },
    ],
  },
  {
    id: "value-gap", act: 0, actName: "ÚVOD", component: "ValueGap",
    steps: [
      { id: "v1", title: "Adopce není hodnota", speakerNote: "Tady je napětí: AI používá skoro každý, ale významnou hodnotu ve velkém vytváří jen 5 %. 60 % organizací vidí malý nebo žádný přínos.", sources: ["bcg"], sourcePage: 5 },
    ],
  },
  {
    id: "twist", act: 0, actName: "ÚVOD", component: "Twist",
    steps: [
      { id: "tw1", title: "Problém není AI", speakerNote: "Pauza. Problém není samotná technologie.", sourcePage: 6 },
      { id: "tw2", title: "Svět navržený bez ní", speakerNote: "Problém je, že AI jen přidáváme do světa, který jsme navrhli bez ní. Skutečná změna začíná změnou myšlení.", sourcePage: 6 },
    ],
  },
  {
    id: "visions", act: 0, actName: "ÚVOD", component: "Visions",
    steps: [
      { id: "vt0", title: "Musíme změnit naše myšlení", speakerNote: "Musíme změnit naše myšlení. Problém není samotná AI. Je to, že ji přidáváme do světa, který jsme navrhli bez ní.", sourcePage: 7 },
      { id: "vi0", title: "Existuje několik velkolepých vizí budoucnosti", speakerNote: "Existuje několik velkolepých vizí budoucnosti. Nejsou to předpovědi; jsou to horizonty možností: tělo, tempo, věda a infrastruktura.", sourcePage: 7 },
      { id: "vi1", title: "AI dostává tělo", speakerNote: "Humanoidní robotika může měnit produktivitu a dostupnost služeb. Otázkou je kontrola.", sourcePage: 7 },
      { id: "vi2", title: "AI jako motor změny", speakerNote: "Pokrok v horizontu desetiletí se může odehrát během několika let. Otázkou je tempo společnosti.", sourcePage: 7 },
      { id: "vi3", title: "AI se stává vědcem", speakerNote: "AI může objevovat vztahy, které člověk sám nenajde. Otázkou je pochopení a řízení.", sourcePage: 7 },
      { id: "vi4", title: "AI jako infrastruktura", speakerNote: "Agenti nebudou jen odpovídat. Budou vykonávat práci. Otázkou je odpovědnost.", sourcePage: 7 },
    ],
  },
  {
    id: "challenges", act: 0, actName: "ÚVOD", component: "Challenges",
    steps: [
      { id: "c1", title: "Čtyři otázky", speakerNote: "Místo spekulací o vzdálené budoucnosti budeme řešit čtyři praktické posuny, které začínají dnes: od UX k lidem i AI, od personalizace k adaptaci, od pozornosti k důvěře, od kanálů k orchestraci.", sourcePage: 8 },
    ],
  },

  {
    id: "kdo", act: 1, actName: "KDO?", component: "Chapter",
    steps: [{ id: "k1", title: "Kdo experience používá?", speakerNote: "První posun: od UX designu k designu pro lidi i AI.", sourcePage: 9 }],
  },
  {
    id: "trend1", act: 1, actName: "KDO?", component: "Trend1",
    steps: [
      { id: "tr1", title: "91 % AI při designu", speakerNote: "AI mění, kdo experience vytváří, kdo pomáhá s výběrem a kdo vykonává. 91 % designérů pracuje s AI týdně.", sources: ["designerFund"], sourcePage: 10 },
      { id: "tr1b", title: "50 % AI-powered search", speakerNote: "50 % spotřebitelů cíleně používá AI search.", sources: ["mckinseySearch"], sourcePage: 10 },
      { id: "tr1c", title: "1 ze 3 interakcí", speakerNote: "Do roku 2028 má třetina interakcí s aplikacemi využívat autonomní agenty.", sources: ["gartnerAgents"], sourcePage: 10 },
    ],
  },
  {
    id: "uxax", act: 1, actName: "KDO?", component: "UxAx",
    steps: [
      { id: "ux1", title: "Jedna služba. Dva uživatelé.", speakerNote: "Služba má nově dva uživatele: člověka a agenta jednajícího jeho jménem.", sourcePage: 11 },
      { id: "ux2", title: "Člověk / UX", speakerNote: "Pro člověka navrhujeme UI, UX a konverzaci.", sourcePage: 11 },
      { id: "ux3", title: "Agent / AX", speakerNote: "Pro agenta data, API a MCP.", sourcePage: 11 },
    ],
  },
  {
    id: "understanding", act: 1, actName: "KDO?", component: "Understanding",
    steps: [
      { id: "un2", title: "Potřeba vede k výsledku", speakerNote: "Need + Context vede k intentu, akci a výsledku. Po dvou uživatelích hned cesta: potřeba → výsledek.", sourcePage: 13 },
      { id: "unb", title: "Jedny přivádějí. Druhé drží.", speakerNote: "Potřebu můžeme rozdělit do dvou světů. Buyer a chooser needs přivádějí zákazníky. User needs dávají důvod zůstat. Nákup nestačí, když selže používání.", sourcePage: 13 },
    ],
  },
  {
    id: "modes", act: 1, actName: "KDO?", component: "Modes",
    steps: [
      { id: "m1", title: "Pochopit", speakerNote: "První mód: pochopit. Najít vzorce a význam.", sourcePage: 15 },
      { id: "m1b", title: "Tvořit", speakerNote: "Druhý mód: tvořit. Navrhnout nový obsah.", sourcePage: 15 },
      { id: "m1c", title: "Rozhodnout", speakerNote: "Třetí mód: rozhodnout. Vybrat další krok.", sourcePage: 15 },
      { id: "m1d", title: "Konat", speakerNote: "Čtvrtý mód: konat. Provést akci za člověka.", sourcePage: 15 },
      { id: "m2", title: "Čtyři módy vedle sebe", speakerNote: "AI přináší hodnotu ve čtyřech módech: pochopit, tvořit, rozhodnout se a konat.", sourcePage: 15 },
    ],
  },
  {
    id: "examples", act: 1, actName: "KDO?", component: "Examples",
    steps: [
      { id: "ex1", title: "Začněte potřebou", speakerNote: "Cleo, Octopus a Lemonade ukazují, že need-first design nevylepšuje jen rozhraní. Vytváří nové produktové propozice.", sourcePage: 16 },
    ],
  },
  {
    id: "prd", act: 1, actName: "KDO?", component: "Prd",
    steps: [
      { id: "p0", title: "Vibe coding bez PRDu je na prd", speakerNote: "Než začneme navrhovat řešení, musíme se shodnout na tom, co vlastně řešíme. PRD není zadání pro vývoj. Je to sdílené porozumění celého týmu.", sourcePage: 17 },
    ],
  },

  {
    id: "co-map", act: 2, actName: "CO?", component: "CoMap",
    steps: [{ id: "cm1", title: "Od KDO k CO", speakerNote: "Vrátíme se ke čtyřem otázkám. První posun jsme uzavřeli. Teď přecházíme k druhé: co má zákazník v tomto okamžiku skutečně dostat?", sourcePage: 8 }],
  },
  {
    id: "co", act: 2, actName: "CO?", component: "Chapter",
    steps: [{ id: "co1", title: "Správná zkušenost pro konkrétní situaci", speakerNote: "Druhý posun: zákazník nemá dostat jen jednu z předem připravených variant. Má dostat zkušenost složenou pro konkrétní situaci.", sourcePage: 18 }],
  },
  {
    id: "journey", act: 2, actName: "CO?", component: "Journey",
    steps: [
      { id: "j1", title: "Roste očekávání relevance", speakerNote: "64 % spotřebitelů preferuje zkušenost přizpůsobenou jejich potřebám. Nejde ještě o důkaz adaptace, ale o jasné očekávání relevance.", sources: ["qualtrics"], sourcePage: 19 },
      { id: "j1b", title: "Mění se způsob hledání", speakerNote: "25 miliard vizuálních vyhledávání přes Google Lens měsíčně ukazuje, že hledání už nezačíná jen textovým dotazem.", sources: ["googleLens"], sourcePage: 19 },
    ],
  },
  {
    id: "adapt", act: 2, actName: "CO?", component: "Adapt",
    steps: [
      { id: "ad1", title: "Pro mě.", speakerNote: "Personalizace: produkt, obsah nebo nabídka se přizpůsobují tomu, kdo jsem. Na jednom produktu vidíme vrstvy — doporučení, varianta, konfigurace, detail. Pozor: když si jméno napíšu nebo barvu vyberu sám, technicky jde spíš o customizaci než o čistou personalizaci (zdroj: ScienceDirect).", sourcePage: 20 },
      { id: "ad2", title: "Podle mě. Právě teď.", speakerNote: "Adaptace: celá zkušenost reaguje na to, kdo jsem, co dělám a v jaké jsem situaci. Rodina s dětmi, let zpožděn 3 h — systém změní transfer, check-in, pokoj, aktivitu i komunikaci. Adaptace není jen „co dostanu“; systém průběžně mění, co se má stát dál. Odpovídá to akademickému pohledu na adaptivní systémy, které se dynamicky přizpůsobují aktuálnímu kontextu použití.", sourcePage: 20 },
    ],
  },
  {
    id: "funnel", act: 2, actName: "CO?", component: "Funnel",
    steps: [
      { id: "f1", title: "Obrazovka jako jednotka designu přestává fungovat", speakerNote: "Obrazovka jako jednotka designu přestává fungovat. Klasická cesta předpokládá stejné pořadí kroků pro každého.", sourcePage: 21 },
      { id: "f2", title: "Jednotkou designu se stává potřeba", speakerNote: "Jednotkou designu se stává potřeba. Pokud se zkušenost skládá podle situace, nemůže každého vést stejným pořadím kroků.", sourcePage: 21 },
    ],
  },
  {
    id: "conversation", act: 2, actName: "CO?", component: "Conversation",
    steps: [
      { id: "cv1", title: "Konverzace je přirozené rozhraní", speakerNote: "Chat staví na formě komunikace, kterou lidé už znají: řeč, symboly, text a zprávy. Proto se stal výchozím rozhraním mnoha AI řešení.", sourcePage: 22 },
    ],
  },
  {
    id: "chat", act: 2, actName: "CO?", component: "Chat",
    steps: [
      { id: "f3", title: "Chat ale není produktová strategie", speakerNote: "Nelineární cesta neznamená, že všechno zavřeme do chatovacího okna. Bariérou může být už samotná nutnost přesně formulovat zadání.", sourcePage: 23 },
    ],
  },
  {
    id: "uiai", act: 2, actName: "CO?", component: "UiAi",
    steps: [
      { id: "ui1", title: "Lidé milují přehledné rozhraní", speakerNote: "Lidé milují přehledný výstup. Nechtějí ale klikat, než se k němu dostanou.", sourcePage: 24 },
      { id: "ui1k", title: "Peklo klikání", speakerNote: "A teď to zkusme jako zákazník: výrobce, rozlišení, úhlopříčka, frekvence, panel… Klik, klik, klik, než se vůbec dostanu k výsledku.", sourcePage: 24 },
      { id: "ui2", title: "AI řeší vstup. Výstup už ne.", speakerNote: "AI rozumí přirozenému jazyku. Výsledkem ale bývá zeď textu, ve které se nejde vyznat.", sourcePage: 24 },
      { id: "ui3b", title: "To nejlepší z obou světů", speakerNote: "Adaptivní experience spojuje vstup, který rozumí záměru, s výstupem, ve kterém se člověk orientuje. Stejný dotaz může vrátit kartu doporučené televize, srovnání vybraných modelů nebo výkladové video. Ne zeď textu.", sourcePage: 26 },
    ],
  },
  {
    id: "partner", act: 2, actName: "CO?", component: "Partner",
    steps: [
      { id: "pa1", title: "AI není parťák pro každou příležitost", speakerNote: "AI není správná volba v každé situaci. Nejdřív pauza. Pak: rozhoduje, co člověk v daném momentu potřebuje.", sourcePage: 27 },
    ],
  },
  {
    id: "human-ai", act: 2, actName: "CO?", component: "HumanAi",
    steps: [
      { id: "ha1", title: "Míra autonomie je rozhodnutí podle situace", speakerNote: "Volíme mezi třemi režimy: AI jedná; AI navrhne a člověk potvrdí; člověk vede a AI podporuje. Rozhoduje důsledek, vratnost, nejistota a emoce. Čím více autonomie AI dostává, tím důležitější je, aby zákazník rozuměl, co se děje a proč tomu může věřit.", sources: ["gartnerHuman"], sourcePage: 28 },
    ],
  },

  {
    id: "verit-map", act: 3, actName: "PROČ VĚŘIT?", component: "CoMap",
    steps: [{ id: "vm1", title: "Od CO k PROČ VĚŘIT", speakerNote: "Vrátíme se ke čtyřem otázkám. Druhý posun jsme uzavřeli. Teď třetí: proč má zákazník věřit tomu, co mu nabízíme a co za něj uděláme?", sourcePage: 8 }],
  },
  {
    id: "verit", act: 3, actName: "PROČ VĚŘIT?", component: "Chapter",
    steps: [{ id: "ve1", title: "Proč tomu má zákazník věřit?", speakerNote: "Třetí posun: od získání pozornosti k budování důvěry.", sourcePage: 29 }],
  },
  {
    id: "distrust", act: 3, actName: "PROČ VĚŘIT?", component: "Distrust",
    steps: [
      { id: "d0", title: "Nedůvěra je nový default", speakerNote: "Ticho. Nedůvěra už není výjimka nebo téma pro odborníky.", sourcePage: 30 },
      { id: "d1", title: "60 % pochybuje o autenticitě", speakerNote: "60 % lidí více zpochybňuje autenticitu obsahu.", sources: ["accenture"], sourcePage: 30 },
      { id: "d1b", title: "39 % falešné recenze", speakerNote: "39 % narazilo na falešné recenze.", sources: ["accenture"], sourcePage: 30 },
      { id: "d1c", title: "33 % deepfake nebo scam", speakerNote: "33 % už zažilo deepfake útok nebo scam.", sources: ["accenture"], sourcePage: 30 },
    ],
  },
  {
    id: "prove", act: 3, actName: "PROČ VĚŘIT?", component: "Prove",
    steps: [
      { id: "pr1", title: "Značka se z billboardů přesouvá do zážitku", speakerNote: "Nejdřív slib na billboardu. Pak stejná značka v obýváku, v notebooku, v péči. Dřív lákala k nákupu reklamou. Dnes má provázet životem. Slib získává pozornost. Zkušenost buduje důvěru — a proto slib nestačí.", sourcePage: 32 },
      { id: "pr2", title: "AI musí mít důvod vás doporučit", speakerNote: "Nejdřív jen karta značky. Citát ještě ne.", sourcePage: 32 },
      { id: "pr2a", title: "Máme nejlepší zákaznickou péči", speakerNote: "Značka říká obecné tvrzení. Nechte to dopsat, pak klik.", sourcePage: 32 },
      { id: "pr2b", title: "Neověřitelné", speakerNote: "AI s tím neumí pracovat. Neříká, čím jste skutečně jiní.", sourcePage: 32 },
      { id: "pr2c", title: "AI vstupuje", speakerNote: "Teď se ptá za zákazníka.", sourcePage: 32 },
      { id: "pr2d", title: "AI se ptá", speakerNote: "Prázdná karta. Otázka až dalším klikem.", sourcePage: 32 },
      { id: "pr2f", title: "Proč bych vás měl doporučit?", speakerNote: "Zákazník i AI potřebují konkrétní, dohledatelné a ověřitelné informace o tom, pro koho jste vhodní a proč.", sourcePage: 32 },
      { id: "pr2e", title: "Potřebuje důkaz", speakerNote: "Slogan nestačí. Další klik: prove it.", sourcePage: 32 },
      { id: "pr3", title: "Prove it.", speakerNote: "AI potřebuje konkrétní důvod, proč vás doporučit. Ne slogan. Důkaz, který jde dohledat.", sourcePage: 32 },
      { id: "pr4", title: "Důvěra potřebuje důkazy", speakerNote: "Nejen technické SLA. I brandový důvod: protože naše pobyty prodlužují život. Konkrétní, dohledatelné, ověřitelné.", sourcePage: 32 },
      { id: "pr5", title: "AI musí vaše důvody najít a ověřit", speakerNote: "Slib na webu nestačí. AI musí ty důvody venku najít a ověřit. Najít a ověřit jsou dvě různé práce.", sourcePage: 33 },
      { id: "pr5b", title: "Důkaz musí jít hledat", speakerNote: "Jeden zelený blok na prezentaci nestačí. AI hledá stopy mimo váš slajd.", sourcePage: 33 },
      { id: "pr6", title: "Konzistence, odpověď-first, důvěryhodnost", speakerNote: "Tři podmínky, bez kterých nemá co ověřovat: stejná fakta, dohledatelné odpovědi, důvěra mimo vlastní web.", sourcePage: 33 },
      { id: "pr6b", title: "Kde to AI hledá", speakerNote: "Web, Wikipedia, recenze, katalogy. FAQ, podmínky, nadpisy, ceny. PR, média, recenze, komunity.", sourcePage: 33 },
      { id: "pr7", title: "Ověření", speakerNote: "Až když se stopy sejdou, má AI co ověřit.", sourcePage: 33 },
      { id: "pr8", title: "AI najde důvod vás doporučit", speakerNote: "GEO/AEO je práce na dohledatelnosti a správné reprezentaci značky — ne nový trik na algoritmus.", sourcePage: 33 },
    ],
  },
  {
    id: "principles", act: 3, actName: "PROČ VĚŘIT?", component: "Principles",
    steps: [
      { id: "xp1", title: "Dodat značku do zážitku", speakerNote: "Nejdřív věta. Experience principy jsou to, co značku dostane z manuálu do zážitku.", sourcePage: 35 },
      { id: "xp1b", title: "Produkt", speakerNote: "Je naše značka v tom, co nabízíme — nejen na obalu a ve slibech.", sourcePage: 35 },
      { id: "xp1c", title: "Chování lidí", speakerNote: "Pozná nás člověk podle toho, jak se k němu chováme na pobočce i na lince.", sourcePage: 35 },
      { id: "xp1d", title: "AI Soul & Identity", speakerNote: "AI musí mluvit a jednat jako naše značka. Osobnost, humor, hranice.", sourcePage: 35 },
      { id: "xp1e", title: "Digitální design", speakerNote: "Chybová hláška, flow, pattern — totéž, jen v rozhraní.", sourcePage: 35 },
      { id: "xp1f", title: "Experience principy propojují systém", speakerNote: "Principy jsou střed. Stejné pravidlo pro produkt, lidi, AI i digitál. Když je v systému nemáme, AI se učí z toho, co tam reálně je.", sourcePage: 35 },
    ],
  },
  {
    id: "bias", act: 3, actName: "PROČ VĚŘIT?", component: "Bias",
    steps: [
      { id: "bi1", title: "Naše chyby dostávají větší sílu", speakerNote: "Principy nejsou slogan. Když je v systému nemáme, AI se učí z naší historie. I z té špatné.", sources: ["nist"], sourcePage: 36 },
      { id: "bi1b", title: "Dokonalý student naší historie", speakerNote: "Nebezpečí AI spočívá v tom, že je dokonalým studentem naší vlastní nedokonalé historie. Učí se z minulých rozhodnutí plných předsudků a chyb a automatizuje je.", sources: ["nist"], sourcePage: 36 },
      { id: "bi1c", title: "Rychleji a ve větším měřítku", speakerNote: "Lidé jsou složité. AI dokáže lidské předsudky šířit mnohem rychleji a ve větším měřítku. Proto další krok: důvěra potřebuje spolehlivost, kontrolu a nápravu.", sources: ["nist"], sourcePage: 36 },
    ],
  },
  {
    id: "trust", act: 3, actName: "PROČ VĚŘIT?", component: "Trust",
    steps: [
      { id: "ts1", title: "Tři podmínky, které musí fungovat, aby lidé AI věřili", speakerNote: "Jen nadpis. První klik: otázka se napíše na středu — Mohu se na AI spolehnout?", sourcePage: 37 },
      { id: "ts1q", title: "Mohu se na AI spolehnout?", speakerNote: "Otázka zůstává na středu. Další klik: přesune se do karty Spolehlivost.", sourcePage: 37 },
      { id: "ts1a", title: "Spolehlivost", speakerNote: "Mohu se na AI spolehnout? To je spolehlivost.", sourcePage: 37 },
      { id: "ts1r", title: "Mám nad AI kontrolu?", speakerNote: "Otázka na středu. Další klik: karta Kontrola.", sourcePage: 37 },
      { id: "ts1b", title: "Kontrola", speakerNote: "Mám nad AI kontrolu? Kontrola.", sourcePage: 37 },
      { id: "ts1s", title: "Co když se něco pokazí?", speakerNote: "Otázka na středu. Další klik: karta Náprava.", sourcePage: 37 },
      { id: "ts1c", title: "Náprava", speakerNote: "Co když se něco pokazí? Náprava. Další klik zoomuje do Kontroly.", sourcePage: 37 },
      { id: "ts2", title: "Kontrola", speakerNote: "Zoom do Kontroly. Cyklus Human in the Loop se složí sám. Až dohraje, další klik: čtyři otázky a přechod k JAK.", sourcePage: 38 },
    ],
  },
  {
    id: "jak-map", act: 4, actName: "JAK?", component: "CoMap",
    steps: [{ id: "jm1", title: "Od PROČ VĚŘIT k JAK", speakerNote: "Vrátíme se ke čtyřem otázkám. Třetí posun jsme uzavřeli. Teď čtvrtý: jak musí fungovat firma, aby zákazník dostal slíbený výsledek?", sourcePage: 8 }],
  },
  {
    id: "jak", act: 4, actName: "JAK?", component: "Chapter",
    steps: [{ id: "ja1", title: "Jak musí fungovat firma?", speakerNote: "Čtvrtý posun: od kanálů k orchestraci výsledku.", sourcePage: 39 }],
  },
  {
    id: "orch", act: 4, actName: "JAK?", component: "Orch",
    steps: [
      { id: "or1", title: "78 % firem", speakerNote: "78 % firem věří, že dodává propojenou zkušenost.", sources: ["sap"], sourcePage: 40 },
      { id: "or1b", title: "25 % zákazníků", speakerNote: "Souhlasí jen 25 % zákazníků.", sources: ["sap"], sourcePage: 40 },
      { id: "or1c", title: "85 % vedoucích péče", speakerNote: "85 % vedoucích zákaznické péče rozšiřuje odpovědnosti pracovníků v souvislosti s AI.", sources: ["gartnerCx"], sourcePage: 40 },
      { id: "or2", title: "Handoff je symptom systému", speakerNote: "75 % zákazníků odrazuje předávání mezi týmy. Propojený zážitek vyžaduje propojenou firmu.", sources: ["gartnerCx"], sourcePage: 40 },
    ],
  },
  {
    id: "channels", act: 4, actName: "JAK?", component: "Channels",
    steps: [
      { id: "ca1", title: "Lidé s AI neřeší kanály", speakerNote: "Lidé s AI neřeší kanály. Chtějí vyřešit problém.", sourcePage: 41 },
      { id: "ca1b", title: "Dříve", speakerNote: "Dříve si zákazník cestu skládal sám.", sourcePage: 41 },
      { id: "ca1c", title: "Pět kanálů", speakerNote: "Web, app, call centrum, pobočka, e-mail. Pět kanálů, pět začátků.", sourcePage: 41 },
      { id: "ca2", title: "Dnes", speakerNote: "Dnes nechce kanál. Pošle záměr a čeká. Agent to vezme za něj.", sourcePage: 41 },
      { id: "mo1", title: "Jeden záměr", speakerNote: "Potřeboval bych refinancovat hypotéku. Člověk neřeší strukturu firmy.", sourcePage: 41 },
      { id: "mo2", title: "Jeden agent", speakerNote: "Agent převezme odpovědnost za koordinaci cesty.", sourcePage: 41 },
      { id: "mo3", title: "Celá firma", speakerNote: "Agent propojí data, produkty, procesy, lidi a systémy.", sourcePage: 41 },
      { id: "mo4", title: "Jeden výsledek", speakerNote: "Výsledek se vrací zákazníkovi. Tohle je orchestrace, ne další kanál.", sourcePage: 41 },
    ],
  },
  {
    id: "bxcxex", act: 4, actName: "JAK?", component: "BxCxEx",
    steps: [
      { id: "bx0", title: "Spojení BX, CX a EX", speakerNote: "Spojení brand experience, customer experience a employee experience je dnes důležitější než dříve.", sourcePage: 42 },
      { id: "bx1", title: "Tři disciplíny. Jedna zkušenost.", speakerNote: "BX, CX a EX se uvnitř firmy propojí. Zákazník ale vidí jednu výslednou experience.", sourcePage: 42 },
    ],
  },

  {
    id: "video", act: 4, actName: "JAK?", component: "VideoEnd",
    steps: [
      { id: "vd1", title: "Závěrečné video", speakerNote: "Tady kapitola JAK končí. Spusťte Customer Journey Guide video, pokud je k dispozici.", sourcePage: 46 },
    ],
  },
];

const cutoffScene = import.meta.env.VITE_DECK_CUTOFF_SCENE;
const cutoffIndex = cutoffScene
  ? allScenes.findIndex((scene) => scene.id === cutoffScene)
  : -1;

export const scenes: SceneDef[] = cutoffIndex >= 0
  ? allScenes.slice(0, cutoffIndex + 1)
  : allScenes;

export const steps: FlatStep[] = scenes
  .flatMap((scene) =>
    scene.steps.map((step, local) => ({
      ...step,
      index: 0,
      act: scene.act,
      actName: scene.actName,
      sceneId: scene.id,
      local,
      sceneLength: scene.steps.length,
    })),
  )
  .map((step, index) => ({ ...step, index }));

export const TOTAL = steps.length;

export function findIndex(sceneId: string, local: number): number {
  const i = steps.findIndex((s) => s.sceneId === sceneId && s.local === local);
  return i < 0 ? 0 : i;
}
