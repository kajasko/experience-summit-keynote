# Motion audit — Vizionář v době AI

75 stavů, 1920 × 1080. Obsah, fakta, zdroje, speaker notes i pořadí zachovány. Tento dokument popisuje implementovaný motion score, nikoli nový obsah prezentace.

## Aktuální art direction

Světlý Clientology editorial: šedomodrá plocha, bílé zaoblené plochy, petrolejový text, limetové akcenty. Kombinace fotografických řezů a výrazné typografie, bez celoplošných tmavých slidů. Historické kompozice 1945–1973 zachované, časová osa animuje postup. DNES propojuje zadání s výsledkem ve světlé zaoblené kompozici.

## Jazyk pohybu

- Orientace zůstává okamžitě dostupná v chrome; první význam přichází bez prodlevy nebo po 160ms u kapitoly.
- Odhalení pracuje s opacity a posunem 12 px. Hero obraz má konečnou masku 680 ms, žádný trvalý parallax.
- Data mají pevné finální hodnoty; čísla se nepřepočítávají z vymyšlených mezihodnot.
- Vztahy mají vlastní kresbu trasy podle skutečné délky SVG. Přesun objektů používá stejné uzly.
- Běžná sekvence končí do 1,4 s. Nový argument vždy vyžaduje zásah speakera.
- Tiché stavy: mapa keynote, PROVE IT., první věta finále, volitelný film.
- Reduced motion aplikuje finální stav synchronně.
- Jediná živá scéna odstranila závod mezi odchozí a příchozí vrstvou. Každý scene score má GSAP context s cleanup.

## Revize jednotlivých stavů

### 01 — AI mění svět (o1)

Speaker moment: Ticho. AI nemění jen technologii. Mění způsob, jak lidé rozhodují, nakupují, pracují a jak firmy navrhují zkušenost.

První pozornost: AI mění svět.

Zásah: nově vytvořit: tvrzení → fotografický řez → význam.

Odhalení: tvrzení (0 ms, reveal) → obraz změny (200 ms, mask) → význam (580 ms, fade)

Návaznost: Vstup do keynote → **AI mění svět** → 1945.

### 02 — 1945 (h1)

Speaker moment: V roce 1945 jsme stroji fyzicky připravovali data. Člověk se přizpůsoboval stroji.

První pozornost: 1945 → vstup pro stroj.

Zásah: ponechat kompozici; časová osa kreslí postup, obraz se otevírá ve směru času.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: AI mění svět → **1945** → 1964.

### 03 — 1964 (h2)

Speaker moment: Pak jsme se naučili jazyk počítače: příkazy, syntaxi a pravidla.

První pozornost: 1964 → jazyk počítače.

Zásah: plynulý posun po časové ose a směrové odhalení objektu.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: 1945 → **1964** → 1973.

### 04 — 1973 (h3)

Speaker moment: Grafické rozhraní přeložilo příkazy do objektů a akcí.

První pozornost: 1973 → grafické rozhraní.

Zásah: plynulý posun po časové ose a směrové odhalení objektu.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: 1964 → **1973** → Dnes.

### 05 — Dnes (h4)

Speaker moment: Dnes popisujeme výsledek. Rozhraní ustupuje záměru.

První pozornost: DNES → požadovaný výsledek.

Zásah: nově vytvořit: časová osa dojde do DNES, zadání se propojí s výsledkem.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: 1973 → **Dnes** → Rozhraní ustupuje záměru.

### 06 — Rozhraní ustupuje záměru (i1)

Speaker moment: Poprvé se stroj přizpůsobuje nám. Neučíme se jeho jazyk; říkáme, čeho chceme dosáhnout.

První pozornost: Co chcete zvládnout?.

Zásah: nově vytvořit: vstup → výsledek.

Odhalení: záměr (0 ms, reveal) → výsledek (580 ms, fade)

Návaznost: Dnes → **Rozhraní ustupuje záměru** → 72 %.

### 07 — 72 % (a1)

Speaker moment: 72 % Čechů už AI používá. AI už není okrajová technologie.

První pozornost: 72 %.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: Rozhraní ustupuje záměru → **72 %** → Rozhoduje a vybírá.

### 08 — Rozhoduje a vybírá (a2)

Speaker moment: 38 % evropských respondentů používá AI při hledání produktů a rozhodování. 63 % uživatelů AI s ní porovnává produkty a značky.

První pozornost: 38 % rozhoduje.

Zásah: odstranit přejezd; nově dva důkazy po sobě.

Odhalení: rozhodování (0 ms, reveal) → výběr (580 ms, reveal)

Návaznost: 72 % → **Rozhoduje a vybírá** → Adopce není hodnota.

### 09 — Adopce není hodnota (v1)

Speaker moment: Tady je napětí: AI používá skoro každý, ale významnou hodnotu ve velkém vytváří jen 5 %. 60 % organizací vidí malý nebo žádný přínos.

První pozornost: 5 % vytváří hodnotu.

Zásah: nově vytvořit: 5 % → 60 % → propast.

Odhalení: hodnota (0 ms, reveal) → bez přínosu (200 ms, reveal) → propast (580 ms, fade)

Návaznost: Rozhoduje a vybírá → **Adopce není hodnota** → Problém není AI.

### 10 — Problém není AI (tw1)

Speaker moment: Pauza. Problém není samotná technologie.

První pozornost: Problém není AI.

Zásah: nově vytvořit: nejprve věta, poté pračka.

Odhalení: tvrzení (0 ms, reveal) → pračka (580 ms, mask)

Návaznost: Adopce není hodnota → **Problém není AI** → Svět navržený bez ní.

### 11 — Svět navržený bez ní (tw2)

Speaker moment: Problém je, že AI jen přidáváme do světa, který jsme navrhli bez ní. Skutečná změna začíná změnou myšlení.

První pozornost: Svět navržený bez AI.

Zásah: ponechat pračku; nově odhalit systém kolem ní.

Odhalení: pointa (0 ms, reveal) → systém (580 ms, fade)

Návaznost: Problém není AI → **Svět navržený bez ní** → Budoucnost nemá jeden scénář.

### 12 — Budoucnost nemá jeden scénář (vi0)

Speaker moment: Velké vize ukazují čtyři směry: tělo, tempo, vědu a infrastrukturu. Nejsou to předpovědi; jsou to horizonty možností.

První pozornost: Budoucnost nemá jeden scénář.

Zásah: odstranit přelety; mapa jako klidná orientace.

Odhalení: horizont (0 ms, reveal) → mapa (200 ms, fade)

Návaznost: Svět navržený bez ní → **Budoucnost nemá jeden scénář** → AI dostává tělo.

### 13 — AI dostává tělo (vi1)

Speaker moment: Humanoidní robotika může měnit produktivitu a dostupnost služeb. Otázkou je kontrola.

První pozornost: Tělo → kontrola.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: Budoucnost nemá jeden scénář → **AI dostává tělo** → AI jako motor změny.

### 14 — AI jako motor změny (vi2)

Speaker moment: Pokrok v horizontu desetiletí se může odehrát během několika let. Otázkou je tempo společnosti.

První pozornost: Tempo → adaptace.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: AI dostává tělo → **AI jako motor změny** → AI se stává vědcem.

### 15 — AI se stává vědcem (vi3)

Speaker moment: AI může objevovat vztahy, které člověk sám nenajde. Otázkou je pochopení a řízení.

První pozornost: Věda → pochopení.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: AI jako motor změny → **AI se stává vědcem** → AI jako infrastruktura.

### 16 — AI jako infrastruktura (vi4)

Speaker moment: Agenti nebudou jen odpovídat. Budou vykonávat práci. Otázkou je odpovědnost.

První pozornost: Infrastruktura → odpovědnost.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: AI se stává vědcem → **AI jako infrastruktura** → Čtyři otázky.

### 17 — Čtyři otázky (c1)

Speaker moment: Místo spekulací o vzdálené budoucnosti budeme řešit čtyři praktické posuny, které začínají dnes.

První pozornost: 4 otázky.

Zásah: nově vytvořit: měřítko čísla → otázky.

Odhalení: počet (0 ms, reveal) → dnešek (580 ms, fade)

Návaznost: AI jako infrastruktura → **Čtyři otázky** → Mapa keynote.

### 18 — Mapa keynote (c2)

Speaker moment: Kdo experience používá a tvoří? Co má dostat? Proč tomu věřit? Jak musí fungovat firma?

První pozornost: Mapa keynote.

Zásah: ponechat: statický celek pro orientaci.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: Čtyři otázky → **Mapa keynote** → Kdo experience používá?.

### 19 — Kdo experience používá? (k1)

Speaker moment: První posun: od UX designu k designu pro lidi i AI.

První pozornost: Kdo experience používá?.

Zásah: zjednodušit: krátký klid, otázka, aktivní kapitola.

Odhalení: otázka (160 ms, reveal) → číslo kapitoly (100 ms, mask) → kapitola (580 ms, line)

Návaznost: Mapa keynote → **Kdo experience používá?** → Noví aktéři.

### 20 — Noví aktéři (tr1)

Speaker moment: 91 % designérů pracuje s AI týdně, 50 % spotřebitelů cíleně používá AI search a do roku 2028 má třetina interakcí využívat autonomní agenty.

První pozornost: Noví aktéři.

Zásah: nově vytvořit: kontext → designéři → spotřebitelé → agenti.

Odhalení: kontext (0 ms, fade) → designéři (200 ms, reveal) → spotřebitelé (420 ms, reveal) → agenti (640 ms, reveal)

Návaznost: Kdo experience používá? → **Noví aktéři** → AI vstupuje do experience.

### 21 — AI vstupuje do experience (tr2)

Speaker moment: AI mění, kdo experience vytváří, zprostředkovává a vykonává.

První pozornost: AI vytváří i vykonává.

Zásah: zjednodušit: tvrzení, pak měřítko.

Odhalení: tvrzení (0 ms, reveal) → vytváří (180 ms, mask) → zprostředkovává (380 ms, mask) → vykonává (580 ms, mask)

Návaznost: Noví aktéři → **AI vstupuje do experience** → Jedna služba. Dva uživatelé..

### 22 — Jedna služba. Dva uživatelé. (ux1)

Speaker moment: Služba má nově dva uživatele: člověka a agenta jednajícího jeho jménem.

První pozornost: Člověk → služba → agent.

Zásah: nově vytvořit: od známého uživatele k novému.

Odhalení: člověk (0 ms, fade) → služba (200 ms, fade) → agent (580 ms, reveal)

Návaznost: AI vstupuje do experience → **Jedna služba. Dva uživatelé.** → UX × AX.

### 23 — UX × AX (ux2)

Speaker moment: Pro člověka navrhujeme UI, UX a konverzaci. Pro agenta data, API, nástroje a guardrails. Kvalita vzniká v jejich propojení.

První pozornost: UX × AX.

Zásah: nově vytvořit: dvě strany, propojení poslední.

Odhalení: UX (0 ms, fade) → AX (200 ms, fade) → kvalita (580 ms, fade)

Návaznost: Jedna služba. Dva uživatelé. → **UX × AX** → Kvalita nezačíná u modelu.

### 24 — Kvalita nezačíná u modelu (un1)

Speaker moment: AI je tak chytrá, jak dobře rozumíte člověku, jeho potřebě a kontextu.

První pozornost: Člověk, potřeba, kontext.

Zásah: zjednodušit: jedna věta → model.

Odhalení: porozumění (0 ms, reveal) → model (580 ms, fade)

Návaznost: UX × AX → **Kvalita nezačíná u modelu** → Potřeba vede k výsledku.

### 25 — Potřeba vede k výsledku (un2)

Speaker moment: Need + Context vede k intentu, akci a výsledku. Buyer needs přivádějí; user needs dávají důvod zůstat.

První pozornost: Need + Context.

Zásah: nově vytvořit: příčina → intent → action → outcome; buyer/user nakonec.

Odhalení: potřeba (0 ms, fade) → intent (200 ms, fade) → akce (400 ms, fade) → výsledek (600 ms, fade) → buyer/user (820 ms, fade)

Návaznost: Kvalita nezačíná u modelu → **Potřeba vede k výsledku** → Od pochopení k jednání.

### 26 — Od pochopení k jednání (m1)

Speaker moment: AI přináší hodnotu ve čtyřech módech: pochopit, tvořit, rozhodnout se a konat.

První pozornost: Čtyři módy hodnoty.

Zásah: nově vytvořit: významové spektrum.

Odhalení: pochopit (0 ms, fade) → tvořit (180 ms, fade) → rozhodnout (360 ms, fade) → konat (540 ms, fade)

Návaznost: Potřeba vede k výsledku → **Od pochopení k jednání** → Roste míra autonomie.

### 27 — Roste míra autonomie (m2)

Speaker moment: Čím více se posouváme ke konání, tím důležitější jsou kontext, kontrola a odpovědnost.

První pozornost: Autonomie → odpovědnost.

Zásah: nově vytvořit: růst sloupců, odpovědnost jako důsledek.

Odhalení: autonomie (0 ms, mask) → odpovědnost (580 ms, fade)

Návaznost: Od pochopení k jednání → **Roste míra autonomie** → Začněte potřebou.

### 28 — Začněte potřebou (ex1)

Speaker moment: Cleo, Octopus a Lemonade ukazují, že need-first design nevylepšuje jen rozhraní. Vytváří nové produktové propozice.

První pozornost: Potřeba tvoří propozici.

Zásah: zjednodušit: tvrzení → příklady jako jeden celek.

Odhalení: pointa (0 ms, reveal) → příklady (580 ms, fade)

Návaznost: Roste míra autonomie → **Začněte potřebou** → Nejdřív sdílené porozumění.

### 29 — Nejdřív sdílené porozumění (p1)

Speaker moment: Před řešením potřebujeme design contract: jaký problém řešíme, pro koho, co má umět a jak poznáme úspěch. To je smysl PRD.

První pozornost: Co řešíme.

Zásah: nově vytvořit: problém → design contract.

Odhalení: problém (0 ms, fade) → kontrakt (580 ms, mask)

Návaznost: Začněte potřebou → **Nejdřív sdílené porozumění** → Co má zákazník dostat?.

### 30 — Co má zákazník dostat? (co1)

Speaker moment: Druhý posun: od personalizace k adaptaci v konkrétním okamžiku.

První pozornost: Co má zákazník dostat?.

Zásah: zjednodušit: krátký klid, otázka, aktivní kapitola.

Odhalení: otázka (160 ms, reveal) → číslo kapitoly (100 ms, mask) → kapitola (580 ms, line)

Návaznost: Nejdřív sdílené porozumění → **Co má zákazník dostat?** → AI vstupuje do celé cesty.

### 31 — AI vstupuje do celé cesty (j1)

Speaker moment: 64 % chce přizpůsobenou zkušenost, 25 miliard hledání přes Lens měsíčně a 87 % chce možnost přejít k člověku.

První pozornost: AI vstupuje do celé cesty.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: Co má zákazník dostat? → **AI vstupuje do celé cesty** → Kontext → objevování → obsluha.

### 32 — Kontext → objevování → obsluha (j2)

Speaker moment: AI mění pochopení situace, způsob hledání i to, kdo experience obsluhuje.

První pozornost: Kontext → objevování → obsluha.

Zásah: zjednodušit: odstranit bounce; kreslit skutečnou délku trasy.

Odhalení: kontext (0 ms, reveal)

Návaznost: AI vstupuje do celé cesty → **Kontext → objevování → obsluha** → Personalizace vybírá.

### 33 — Personalizace vybírá (ad1)

Speaker moment: Personalizace říká: vím, kdo jsi. Vyberu vhodnější variantu.

První pozornost: Personalizace vybírá.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: Kontext → objevování → obsluha → **Personalizace vybírá** → Adaptace skládá.

### 34 — Adaptace skládá (ad2)

Speaker moment: Adaptace říká: vím, co právě řešíš. Složím experience a další krok podle situace.

První pozornost: Adaptace skládá.

Zásah: odstranit mrtvé selektory a rotace; stejné moduly změní polohu.

Odhalení: adaptace (0 ms, reveal) → situace (580 ms, fade)

Návaznost: Personalizace vybírá → **Adaptace skládá** → Profil nestačí. Rozhoduje okamžik..

### 35 — Profil nestačí. Rozhoduje okamžik. (ad3)

Speaker moment: To je klíčový rozdíl: personalizace pracuje s profilem, adaptace s aktuálním kontextem.

První pozornost: Rozhoduje okamžik.

Zásah: nově vytvořit: uspořádání → kontextový bod.

Odhalení: okamžik (0 ms, reveal) → kontext (580 ms, fade)

Návaznost: Adaptace skládá → **Profil nestačí. Rozhoduje okamžik.** → Funnel.

### 36 — Funnel (f1)

Speaker moment: Klasická cesta předpokládá stejné lineární kroky.

První pozornost: Lineární funnel.

Zásah: ponechat tvar; potlačit neaktivní cestu.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: Profil nestačí. Rozhoduje okamžik. → **Funnel** → Pořadí mizí.

### 37 — Pořadí mizí (f2)

Speaker moment: AI může kroky měnit, přesouvat nebo přeskočit.

První pozornost: Pořadí mizí.

Zásah: zjednodušit: přeuspořádání bez náhodných rotací, poté trasa.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: Funnel → **Pořadí mizí** → Potřeby zůstávají.

### 38 — Potřeby zůstávají (f3)

Speaker moment: Design stále musí zajistit naplnění potřeb, které vedou člověka k výsledku.

První pozornost: Potřeby zůstávají.

Zásah: zjednodušit: původní model ustoupí, potřeby bez bounce.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: Pořadí mizí → **Potřeby zůstávají** → UI umí výstup. AI umí vstup..

### 39 — UI umí výstup. AI umí vstup. (ui1)

Speaker moment: Přehledné UI dobře ukazuje výsledek, ale nutí nás klikat. AI rozumí přirozenému vstupu, ale často vrací zeď textu.

První pozornost: UI výstup → AI vstup.

Zásah: nově vytvořit: dvě schopnosti odděleně.

Odhalení: UI (200 ms, fade) → AI (580 ms, fade)

Návaznost: Potřeby zůstávají → **UI umí výstup. AI umí vstup.** → Chat není cíl.

### 40 — Chat není cíl (ui2)

Speaker moment: Nutnost napsat perfektní prompt ukazuje, že rozhraní stále není dost intuitivní.

První pozornost: Chat není cíl.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: UI umí výstup. AI umí vstup. → **Chat není cíl** → Rozuměj mi. Ukaž mi výsledek..

### 41 — Rozuměj mi. Ukaž mi výsledek. (ui3)

Speaker moment: Budoucnost spojuje přirozený vstup s jasným vizuálním výstupem.

První pozornost: Přirozený vstup, jasný výstup.

Zásah: zjednodušit: propojení bez kolize panelů.

Odhalení: výsledek (0 ms, reveal)

Návaznost: Chat není cíl → **Rozuměj mi. Ukaž mi výsledek.** → Jistota potřebuje člověka. Rychlost AI..

### 42 — Jistota potřebuje člověka. Rychlost AI. (ha1)

Speaker moment: Nerozhoduje vyspělost technologie. Rozhoduje, co člověk v daném momentu potřebuje: jistotu, nebo rychlost.

První pozornost: Jistota a rychlost.

Zásah: odstranit demonstrativní otáčení ručičky; jemné odhalení rozhodovacího bodu.

Odhalení: potřeba (0 ms, fade) → kompas (580 ms, fade)

Návaznost: Rozuměj mi. Ukaž mi výsledek. → **Jistota potřebuje člověka. Rychlost AI.** → Proč tomu má zákazník věřit?.

### 43 — Proč tomu má zákazník věřit? (ve1)

Speaker moment: Třetí posun: od získání pozornosti k budování důvěry.

První pozornost: Proč tomu věřit?.

Zásah: zjednodušit: krátký klid, otázka, aktivní kapitola.

Odhalení: otázka (160 ms, reveal) → číslo kapitoly (100 ms, mask) → kapitola (580 ms, line)

Návaznost: Jistota potřebuje člověka. Rychlost AI. → **Proč tomu má zákazník věřit?** → Nedůvěra je nový default.

### 44 — Nedůvěra je nový default (d0)

Speaker moment: Ticho. Nedůvěra už není výjimka nebo téma pro odborníky.

První pozornost: Nedůvěra.

Zásah: zjednodušit: ticho, věta, porušený kruh.

Odhalení: default (160 ms, fade) → porušení (580 ms, mask)

Návaznost: Proč tomu má zákazník věřit? → **Nedůvěra je nový default** → Pochybnost se stala zkušeností.

### 45 — Pochybnost se stala zkušeností (d1)

Speaker moment: 60 % lidí více zpochybňuje autenticitu obsahu, 39 % narazilo na falešné recenze a 33 % už zažilo deepfake útok nebo scam.

První pozornost: 60 % pochybuje.

Zásah: nově vytvořit: pochybnost → recenze → deepfake.

Odhalení: pochybnost (0 ms, reveal) → recenze (250 ms, reveal) → scam (500 ms, reveal)

Návaznost: Nedůvěra je nový default → **Pochybnost se stala zkušeností** → Slib nestačí.

### 46 — Slib nestačí (pr1)

Speaker moment: Značka může říkat, že má nejlepší péči. Pro zákazníka i AI je to neověřitelné.

První pozornost: Slib nestačí.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: Pochybnost se stala zkušeností → **Slib nestačí** → Prove it..

### 47 — Prove it. (pr2)

Speaker moment: AI potřebuje konkrétní důvod, proč vás doporučit.

První pozornost: PROVE IT..

Zásah: odstranit automatický fly-in; ponechat statický tvrdý střih.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: Slib nestačí → **Prove it.** → Důvěra potřebuje důkazy.

### 48 — Důvěra potřebuje důkazy (pr3)

Speaker moment: 24/7 podpora, odpověď do dvou minut, zrušení do 30 dnů, řešení do 24 hodin. Konkrétní, dohledatelné, ověřitelné.

První pozornost: Dohledatelné důkazy.

Zásah: nově vytvořit: čas jako důkaz, skupiny postupně.

Odhalení: podpora (0 ms, fade) → odpověď (200 ms, fade) → zrušení (400 ms, fade) → řešení (600 ms, fade)

Návaznost: Prove it. → **Důvěra potřebuje důkazy** → AI musí důvod najít.

### 49 — AI musí důvod najít (fi1)

Speaker moment: Konzistence, answer-first obsah a důvěryhodnost mimo vlastní web tvoří jeden systém.

První pozornost: AI musí důvod najít.

Zásah: nově vytvořit: podklady → ověření → doporučení.

Odhalení: podklady (0 ms, fade) → ověření (250 ms, fade) → doporučení (600 ms, fade)

Návaznost: Důvěra potřebuje důkazy → **AI musí důvod najít** → Značka se přesouvá do zážitku.

### 50 — Značka se přesouvá do zážitku (fi2)

Speaker moment: GEO/AEO není trik na algoritmus. Jde o správnou reprezentaci značky v odpovědi a zkušenosti.

První pozornost: Správná reprezentace značky.

Zásah: ponechat vstupy; změnit pouze výsledek.

Odhalení: reprezentace (200 ms, reveal)

Návaznost: AI musí důvod najít → **Značka se přesouvá do zážitku** → Značka musí být v systému.

### 51 — Značka musí být v systému (xp1)

Speaker moment: Experience principy propojí produkt, chování lidí, AI osobnost a digitální design.

První pozornost: Experience principy.

Zásah: nově vytvořit: střed systému → pilíře.

Odhalení: pilíře (580 ms, fade)

Návaznost: Značka se přesouvá do zážitku → **Značka musí být v systému** → Slib se musí projevit v rozhodnutí.

### 52 — Slib se musí projevit v rozhodnutí (xp2)

Speaker moment: Princip není slogan. Je to konkrétní pravidlo pro každodenní rozhodování lidí i AI.

První pozornost: Slib → rozhodnutí.

Zásah: nově vytvořit: pravidlo, pak jeho aplikace.

Odhalení: pravidlo (0 ms, fade) → aplikace (580 ms, mask)

Návaznost: Značka musí být v systému → **Slib se musí projevit v rozhodnutí** → AI násobí naši historii.

### 53 — AI násobí naši historii (bi1)

Speaker moment: AI je dokonalým studentem naší nedokonalé historie. Naše chyby dostávají větší rychlost a měřítko.

První pozornost: Jedna chyba.

Zásah: nově vytvořit: dokument → opakované důsledky; žádný nekonečný pohyb.

Odhalení: tvrzení (0 ms, fade) → chyba (200 ms, fade) → měřítko (600 ms, fade)

Návaznost: Slib se musí projevit v rozhodnutí → **AI násobí naši historii** → Tři podmínky důvěry.

### 54 — Tři podmínky důvěry (ts1)

Speaker moment: Spolehlivost. Kontrola. Náprava. Žádná z nich sama nestačí.

První pozornost: Spolehlivost, kontrola, náprava.

Zásah: nově vytvořit: trojúhelník jako nedělitelná podmínka.

Odhalení: podmínky (0 ms, fade) → trojúhelník (300 ms, fade)

Návaznost: AI násobí naši historii → **Tři podmínky důvěry** → Důvěra vzniká až průnikem.

### 55 — Důvěra vzniká až průnikem (ts2)

Speaker moment: Lidé musí vědět, že AI funguje, že ji mohou zastavit a že existuje cesta k nápravě.

První pozornost: Důvěra v průniku.

Zásah: ponechat trojúhelník; nově odhalit střed.

Odhalení: důvěra (580 ms, reveal)

Návaznost: Tři podmínky důvěry → **Důvěra vzniká až průnikem** → AI pracuje.

### 56 — AI pracuje (hi1)

Speaker moment: AI může udělat většinu práce rychleji.

První pozornost: AI pracuje.

Zásah: nově vytvořit: cíl → práce → návrh.

Odhalení: cíl (0 ms, fade) → práce (250 ms, fade) → návrh (500 ms, fade)

Návaznost: Důvěra vzniká až průnikem → **AI pracuje** → Člověk rozhoduje v kritickém bodě.

### 57 — Člověk rozhoduje v kritickém bodě (hi2)

Speaker moment: Kritické kroky vracíme člověku. Ověřuje směr, kvalitu a rizika; odpovědnost nemizí.

První pozornost: Člověk v kritickém bodě.

Zásah: nově vytvořit: kontrolní bod → bezpečné možnosti.

Odhalení: člověk (200 ms, reveal) → rozhodnutí (580 ms, fade)

Návaznost: AI pracuje → **Člověk rozhoduje v kritickém bodě** → Jak musí fungovat firma?.

### 58 — Jak musí fungovat firma? (ja1)

Speaker moment: Čtvrtý posun: od kanálů k orchestraci výsledku.

První pozornost: Jak musí fungovat firma?.

Zásah: zjednodušit: krátký klid, otázka, aktivní kapitola.

Odhalení: otázka (160 ms, reveal) → číslo kapitoly (100 ms, mask) → kapitola (580 ms, line)

Návaznost: Člověk rozhoduje v kritickém bodě → **Jak musí fungovat firma?** → Firma vidí spojení. Zákazník ne..

### 59 — Firma vidí spojení. Zákazník ne. (or1)

Speaker moment: 78 % firem věří, že dodává propojenou zkušenost. Souhlasí jen 25 % zákazníků.

První pozornost: 78 % firem.

Zásah: nově vytvořit: pohled firem → pohled zákazníků → rozdíl.

Odhalení: firmy (0 ms, reveal) → zákazníci (320 ms, reveal) → rozdíl (720 ms, fade)

Návaznost: Jak musí fungovat firma? → **Firma vidí spojení. Zákazník ne.** → Handoff je symptom systému.

### 60 — Handoff je symptom systému (or2)

Speaker moment: 75 % zákazníků odrazuje předávání mezi týmy. Propojený zážitek vyžaduje propojenou firmu.

První pozornost: 75 % odmítá handoff.

Zásah: nově vytvořit: důkaz → rozbitý systém.

Odhalení: důkaz (0 ms, reveal) → systém (580 ms, fade)

Návaznost: Firma vidí spojení. Zákazník ne. → **Handoff je symptom systému** → Pět kanálů.

### 61 — Pět kanálů (ca1)

Speaker moment: Web, app, call centrum, pobočka, e-mail. Zákazník si dnes cestu skládá sám.

První pozornost: Pět kanálů.

Zásah: ponechat kanály jako celek; nově pojmenovat pět začátků.

Odhalení: pět začátků (580 ms, fade)

Návaznost: Handoff je symptom systému → **Pět kanálů** → Jeden výsledek.

### 62 — Jeden výsledek (ca2)

Speaker moment: Zákazník nechce kanál. Chce výsledek. Agent může být jediným vstupem do celého systému.

První pozornost: Jeden vstup.

Zásah: nově vytvořit: propojení kanálů → agent → výsledek.

Odhalení: agent (500 ms, reveal)

Návaznost: Pět kanálů → **Jeden výsledek** → Jeden záměr.

### 63 — Jeden záměr (mo1)

Speaker moment: Chci refinancovat hypotéku. Člověk neřeší strukturu firmy.

První pozornost: Chci refinancovat hypotéku.

Zásah: ponechat záměr; budoucí kroky čekají na speakera.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: Jeden výsledek → **Jeden záměr** → Jeden agent.

### 64 — Jeden agent (mo2)

Speaker moment: Agent převezme odpovědnost za koordinaci cesty.

První pozornost: Agent koordinuje.

Zásah: nově vytvořit: záměr → agent; firma ještě čeká.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: Jeden záměr → **Jeden agent** → Celá firma.

### 65 — Celá firma (mo3)

Speaker moment: Agent propojí data, produkty, procesy, lidi a systémy.

První pozornost: Celá firma.

Zásah: nově vytvořit: agent → vztahy → schopnosti; bez autoplay výsledku.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: Jeden agent → **Celá firma** → Jeden výsledek.

### 66 — Jeden výsledek (mo4)

Speaker moment: Mám nabídku, dokumenty i další krok. Tohle je orchestrace, ne další kanál.

První pozornost: Jeden výsledek.

Zásah: nově vytvořit: dokončení → nabídka, dokumenty, další krok.

Odhalení: výsledek (580 ms, reveal)

Návaznost: Celá firma → **Jeden výsledek** → BX + CX + EX.

### 67 — BX + CX + EX (bx1)

Speaker moment: Uvnitř firmy experience společně vytvářejí značka, zákaznická zkušenost, zaměstnanci a AI.

První pozornost: BX + CX + EX.

Zásah: nově vytvořit: vrstvy jako jeden systém.

Odhalení: vrstvy (0 ms, mask) → systém (580 ms, fade)

Návaznost: Jeden výsledek → **BX + CX + EX** → Zákazník vidí jednu zkušenost.

### 68 — Zákazník vidí jednu zkušenost (bx2)

Speaker moment: To, co dokážeme doručit ven, je omezené prostředím, nástroji a schopnostmi uvnitř.

První pozornost: Jedna zkušenost.

Zásah: nově vytvořit: vrstvy se zarovnají → experience.

Odhalení: experience (580 ms, reveal)

Návaznost: BX + CX + EX → **Zákazník vidí jednu zkušenost** → Hodnota se přesouvá.

### 69 — Hodnota se přesouvá (sk1)

Speaker moment: AI přebírá rutinu a mechanickou exekuci. Prémie se vrací k úsudku, kreativitě, kontextu a empatii.

První pozornost: Hodnota se přesouvá.

Zásah: nově vytvořit: titulek → obraz → význam; obraz se zastaví.

Odhalení: tvrzení (0 ms, reveal) → obraz (200 ms, mask) → význam (580 ms, fade)

Návaznost: Zákazník vidí jednu zkušenost → **Hodnota se přesouvá** → Technologie i lidskost rostou spolu.

### 70 — Technologie i lidskost rostou spolu (sk2)

Speaker moment: Roste technologická gramotnost i dovednosti, které nelze jednoduše naprogramovat.

První pozornost: Technologie i lidskost.

Zásah: zjednodušit: grafické důkazy jako dvě skupiny.

Odhalení: růst (0 ms, fade) → ústup (400 ms, fade)

Návaznost: Hodnota se přesouvá → **Technologie i lidskost rostou spolu** → AI nesnižuje hodnotu člověka.

### 71 — AI nesnižuje hodnotu člověka (he1)

Speaker moment: Dlouhá pauza. AI nesnižuje hodnotu člověka.

První pozornost: AI nesnižuje hodnotu člověka.

Zásah: ponechat: statická věta a dlouhá pauza speakera.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: Technologie i lidskost rostou spolu → **AI nesnižuje hodnotu člověka** → Přesouvá ji.

### 72 — Přesouvá ji (he2)

Speaker moment: Přesouvá ji od exekuce k úsudku. Čím chytřejší technologie, tím důležitější člověk.

První pozornost: Přesouvá ji.

Zásah: nově vytvořit: rozhodné odhalení → směr přesunu.

Odhalení: pointa (160 ms, reveal) → přesun (660 ms, fade)

Návaznost: AI nesnižuje hodnotu člověka → **Přesouvá ji** → Tři role. Jeden systém..

### 73 — Tři role. Jeden systém. (ro1)

Speaker moment: AI Experience Designer, Human + AI Workflow Designer a Experience Orchestrator propojují interakci, práci a systém.

První pozornost: Designovat celek.

Zásah: nově vytvořit: celek → role jako systém.

Odhalení: celek (0 ms, fade) → role (580 ms, fade)

Návaznost: Přesouvá ji → **Tři role. Jeden systém.** → AI nepotřebuje superhrdinu.

### 74 — AI nepotřebuje superhrdinu (le1)

Speaker moment: Potřebuje leadership pro změnu, platformu a hodnotu. Bezpečně, ve velkém a s měřitelným dopadem.

První pozornost: Leadership jako systém.

Zásah: zjednodušit: tvrzení → systém; žádné obíhání.

Odhalení: leadership (0 ms, fade) → systém (580 ms, fade)

Návaznost: Tři role. Jeden systém. → **AI nepotřebuje superhrdinu** → Volitelný závěrečný film.

### 75 — Volitelný závěrečný film (vd1)

Speaker moment: Pokud je k dispozici Customer Journey Guide video, spusťte ho. Jinak tento stav při živém vystoupení přeskočte.

První pozornost: Volitelný film.

Zásah: ponechat: statický slot bez autoplay.

Odhalení: Vlastní stavová transformace nebo záměrně statický stav podle zásahu výše.

Návaznost: AI nepotřebuje superhrdinu → **Volitelný závěrečný film** → Konec; bez autoplay.

## Assety a omezení

Aktuální dodaný hero brief předepisuje u 17 pozic existující fotografie nebo grafické kompozice. Všechny tyto kompozice zůstávají v EditorialHero. Volitelný imageSrc umožňuje dodat finální obraz do stejné masky. Nové placené nebo generované assety nebyly přidány. Jediný explicitně chybějící asset je závěrečný film ve stavu 75.

Původní obsahové PDF (46 stran) i vizuální PDF (32 stran) byly dostupné a přečtené. Hlavní zdroj aktuálních 75 stavů zůstává deck.ts a REDESIGN_STORYBOARD.md.
