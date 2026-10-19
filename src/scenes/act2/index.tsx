import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { EASE } from "../../engine/motion";
import { SlideChrome } from "../../components/SlideChrome";
import { GlassStats } from "../../components/GlassStats";
import { AdaptPair } from "./AdaptPair";
import { FunnelPair } from "./FunnelPair";
import { ChatPrompt } from "./ChatPrompt";
import { UiInterface } from "./UiInterface";
import { UiResult } from "./UiResult";
import { UiWall } from "./UiWall";
import { asset } from "../../engine/assets";

const clampStep = (step: number, max: number) => Math.max(0, Math.min(step, max));

const JOURNEY_TITLE = [
  ["Zákazník", "čeká", "adaptaci."],
  ["Dostává", "průměr."],
];

const JOURNEY_STATS = [
  { id: "65", value: 65, unit: "%", cap: "čeká, že se firma přizpůsobí jeho měnícím se potřebám" },
  { id: "61", value: 61, unit: "%", cap: "říká, že s ním většina firem jedná jako s číslem" },
  { id: "pad", value: 0, unit: "%", cap: "" },
] as const;

export function Journey({ step, reduced }: SceneProps) {
  const activeStep = clampStep(step, 1);
  return (
    <GlassStats
      step={activeStep}
      reduced={reduced}
      layout="two"
      chrome={{
        kicker: "CO? · ZMĚNA CHOVÁNÍ",
        page: "32 / 75",
        caption: activeStep === 0 ? "Zákazník čeká adaptaci" : "Dostává průměr",
      }}
      title={JOURNEY_TITLE}
      stats={[JOURNEY_STATS[0], JOURNEY_STATS[1], JOURNEY_STATS[2]]}
      source="Zdroj: Salesforce, State of the Connected Customer, 2023"
    />
  );
}

export function Adapt({ step, reduced }: SceneProps) {
  const activeStep = clampStep(step, 1);
  const chrome = [
    { kicker: "CO? · PERSONALIZACE", caption: "Personalizace využívá to, co o mně ví" },
    { kicker: "CO? · ADAPTACE", caption: "Adaptace reaguje na to, co se děje teď" },
  ] as const;

  return (
    <div className="scene is-adapt-pair">
      <SlideChrome
        kicker={chrome[activeStep].kicker}
        page={`${33 + activeStep} / 75`}
        caption={chrome[activeStep].caption}
        captionDot
      />
      <AdaptPair step={activeStep} reduced={reduced} />
    </div>
  );
}

export function Funnel({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const activeStep = clampStep(step, 1);
  const captions = ["Obrazovka jako jednotka designu přestává fungovat", "Jednotkou designu se stává potřeba"];

  return (
    <div ref={root} className="scene is-funnel-pair">
      <SlideChrome
        kicker="CO? · LOGIKA POTŘEB"
        page={`${36 + activeStep} / 75`}
        caption={captions[activeStep]}
        captionDot
      />
      <FunnelPair step={activeStep} reduced={reduced} />
    </div>
  );
}

const CONV_NODES = [
  { id: "talk", label: "Řeč", img: "conv-talk.png" },
  { id: "symbols", label: "Symboly", img: "conv-symbols.png" },
  { id: "text", label: "Text", img: "conv-text.png" },
  { id: "messages", label: "Zprávy", img: "conv-messages.png" },
  { id: "aidialog", label: "AI Dialog", img: "conv-aidialog.png" },
] as const;

export function Conversation({ reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-conv-title]");
    const sub = el.querySelector<HTMLElement>("[data-conv-sub]");
    const rail = el.querySelector<HTMLElement>("[data-conv-rail]");
    const nodes = gsap.utils.toArray<HTMLElement>("[data-conv-node]", el);
    const caption = el.querySelector<HTMLElement>("[data-conv-caption]");
    const settle = () => {
      gsap.set([title, sub, caption, nodes], { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(rail, { scaleX: 1 });
    };
    if (reduced) {
      settle();
      return;
    }
    gsap.set(title, { autoAlpha: 0, y: 18 });
    gsap.set(sub, { autoAlpha: 0, y: 12 });
    gsap.set(rail, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(nodes, { autoAlpha: 0, y: 22, scale: 0.86 });
    gsap.set(caption, { autoAlpha: 0, y: 14 });
    const tl = gsap.timeline();
    tl.to(title, { autoAlpha: 1, y: 0, duration: 0.46, ease: EASE.enter }, 0);
    tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.38, ease: EASE.enter }, 0.18);
    tl.to(rail, { scaleX: 1, duration: 0.72, ease: EASE.move }, 0.42);
    tl.to(nodes, { autoAlpha: 1, y: 0, scale: 1, duration: 0.44, stagger: 0.14, ease: EASE.enter }, 0.58);
    tl.to(nodes[nodes.length - 1], { scale: 1.06, duration: 0.22, yoyo: true, repeat: 1, ease: EASE.move }, 1.42);
    tl.to(caption, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 1.52);
    return () => {
      tl.kill();
      settle();
    };
  }, [reduced]);

  return (
    <div ref={root} className="scene is-conversation">
      <SlideChrome
        kicker="CO? · ROZHRANÍ"
        page="38 / 75"
        caption="Proč se chat stal výchozím"
        captionDot
      />
      <div className="conv-copy">
        <div data-conv-title className="conv-title">
          Vyslovit potřebu
          <br />
          je jednoduché
        </div>
        <div data-conv-sub className="conv-sub">Proto se chat stal výchozí podobou mnoha AI řešení.</div>
      </div>
      <div className="conv-stage">
        {CONV_NODES.map((node, i) => (
          <article key={node.id} data-conv-node className={`conv-node${i === CONV_NODES.length - 1 ? " is-now" : ""}`}>
            <div className="conv-orb">
              <img data-art src={asset(node.img)} alt="" />
            </div>
            <div className="conv-dot" />
            <div className="conv-label">{node.label}</div>
          </article>
        ))}
        <div data-conv-rail className="conv-rail" />
      </div>
      <div data-conv-caption className="conv-caption">
        Konverzace je přirozené lidské rozhraní.
      </div>
    </div>
  );
}

export function Chat({ step, reduced }: SceneProps) {
  return (
    <div className="scene is-chat-prompt">
      <SlideChrome
        kicker="CO? · ROZHRANÍ"
        page="39 / 75"
        caption="Chat není vždy nejlepší rozhraní"
        captionDot
      />
      <ChatPrompt reduced={reduced} step={step} />
    </div>
  );
}

export function Partner({ reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const photo = el.querySelector<HTMLElement>("[data-partner-photo]");
    const kicker = el.querySelector<HTMLElement>("[data-partner-kicker]");
    const lines = gsap.utils.toArray<HTMLElement>("[data-partner-line]", el);
    const settle = () => {
      gsap.set(photo, { scale: 1 });
      gsap.set([kicker, ...lines], { autoAlpha: 1, y: 0 });
    };
    if (reduced) {
      settle();
      return;
    }
    gsap.set(photo, { scale: 1.12, transformOrigin: "68% 58%" });
    gsap.set(kicker, { autoAlpha: 0, y: 12 });
    gsap.set(lines, { autoAlpha: 0, y: 22 });
    const tl = gsap.timeline();
    tl.to(photo, { scale: 1, duration: 1.35, ease: EASE.move }, 0);
    tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0.28);
    tl.to(lines, { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.12, ease: EASE.enter }, 0.46);
    return () => {
      tl.kill();
      settle();
    };
  }, [reduced]);

  return (
    <div ref={root} className="scene is-dark is-cinematic is-partner">
      <img data-art data-partner-photo className="partner-photo" src={asset("ai-partner.webp")} alt="" />
      <div className="partner-veil" />
      <SlideChrome kicker="CO? · VOLBA" page="43 / 75" caption="Ne každá chvíle patří AI" captionDot mark={false} />
      <div className="partner-copy">
        <div data-partner-kicker className="partner-kicker">NE PODLE TECHNOLOGIE</div>
        <div className="partner-title">
          <span data-partner-line>AI není parťák</span>
          <span data-partner-line>pro každou příležitost</span>
        </div>
      </div>
    </div>
  );
}

export function UiAi({ step, reduced }: SceneProps) {
  // 0 · slide 39 (filters unchecked) · 1 · slide 39 clicking beat · 2 · slide 40 · 3 · slide 41
  const activeStep = clampStep(step, 3);
  const chrome = [
    { page: "39 / 75", caption: "Lidé milují přehledné rozhraní" },
    { page: "39 / 75", caption: "Lidé milují přehledné rozhraní" },
    { page: "40 / 75", caption: "AI řeší vstup. Výstup už ne." },
    { page: "41 / 75", caption: "Výsledek, který jde použít" },
  ] as const;

  return (
    <div className="scene is-ui-pair">
      <SlideChrome
        kicker="CO? · ROZHRANÍ"
        page={chrome[activeStep].page}
        caption={chrome[activeStep].caption}
        captionDot
      />
      <UiInterface active={activeStep <= 1} clicking={activeStep === 1} reduced={reduced} />
      <UiWall active={activeStep === 2} reduced={reduced} />
      <UiResult active={activeStep === 3} reduced={reduced} />
    </div>
  );
}

export function HumanAi({ step, reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  // Step 0: 87 % shown big, already anchored at its final top-right corner.
  // Step 1 (click): it shrinks IN PLACE (scale only, origin top-right) → minimal shift,
  // then copy + compass come in. The compass keeps swaying left/right afterwards.
  const docked = step >= 1;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const last = prev.current;
    prev.current = step;
    const kicker = el.querySelector<HTMLElement>("[data-autonomy-kicker]");
    const title = el.querySelector<HTMLElement>("[data-autonomy-title]");
    const sub = el.querySelector<HTMLElement>("[data-autonomy-sub]");
    const compass = el.querySelector<HTMLElement>("[data-autonomy-compass]");
    const needle = el.querySelector<HTMLElement>("[data-autonomy-needle]");
    const middle = el.querySelector<HTMLElement>("[data-autonomy-middle]");
    const modes = gsap.utils.toArray<HTMLElement>("[data-autonomy-mode]", el);
    const proof = el.querySelector<HTMLElement>("[data-autonomy-proof]");
    const count = el.querySelector<HTMLElement>("[data-autonomy-count]");
    const unit = el.querySelector<HTMLElement>("[data-autonomy-unit]");
    const cap = el.querySelector<HTMLElement>("[data-autonomy-cap]");
    const BIG = 2.1; // featured scale of the docked card
    const rest = [kicker, title, sub, compass, middle, ...modes];

    gsap.set(proof, { transformOrigin: "100% 0%", force3D: true });
    gsap.set(needle, { transformOrigin: "50% 86%" });

    let sway: gsap.core.Tween | null = null;
    const startSway = (delay = 0) => {
      if (reduced || !needle) return;
      gsap.set(needle, { rotation: -26 });
      sway = gsap.to(needle, { rotation: 26, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: -1, delay });
    };
    const countTo = (to: number, duration: number) => {
      const obj = { n: 0 };
      if (count) count.textContent = "0";
      return gsap.to(obj, { n: to, duration, ease: "power2.out", onUpdate() { if (count) count.textContent = String(Math.round(obj.n)); } });
    };
    const settle = () => {
      gsap.set(proof, { scale: docked ? 1 : BIG, autoAlpha: 1, x: 0, y: 0 });
      gsap.set([unit, cap], { autoAlpha: 1, y: 0 });
      if (count) count.textContent = "87";
      gsap.set(rest, { autoAlpha: docked ? 1 : 0, y: 0, scale: 1 });
      gsap.set(needle, { rotation: 0 });
      if (docked) startSway();
    };

    const tl = gsap.timeline();
    if (reduced || (last === null && docked) || (last !== null && step < last)) {
      settle();
    } else if (!docked) {
      // Entry: number counts up big, top-right.
      gsap.set(rest, { autoAlpha: 0, y: 14 });
      gsap.set(compass, { scale: 0.76 });
      gsap.set(proof, { scale: BIG * 0.9, autoAlpha: 0 });
      gsap.set(unit, { autoAlpha: 0 });
      gsap.set(cap, { autoAlpha: 0, y: 10 });
      tl.to(proof, { scale: BIG, autoAlpha: 1, duration: 0.58, ease: "power3.out" }, 0.12);
      tl.add(countTo(87, 0.72), 0.4);
      tl.to(unit, { autoAlpha: 1, duration: 0.3, ease: EASE.enter }, 0.6);
      tl.to(cap, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.9);
    } else {
      // Click: shrink in place, then the rest of the slide.
      gsap.set(proof, { scale: BIG, autoAlpha: 1 });
      if (count) count.textContent = "87";
      gsap.set([unit, cap], { autoAlpha: 1, y: 0 });
      gsap.set(rest, { autoAlpha: 0, y: 14 });
      gsap.set(compass, { scale: 0.76 });
      tl.to(proof, { scale: 1, duration: 0.6, ease: EASE.move }, 0);
      tl.to(kicker, { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE.enter }, 0.2);
      tl.to(title, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.enter }, 0.3);
      tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0.55);
      tl.to(compass, { autoAlpha: 1, y: 0, scale: 1, duration: 0.54, ease: "back.out(1.35)" }, 0.7);
      tl.to(middle, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: EASE.enter }, 1.2);
      tl.to(modes, { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.24, ease: EASE.enter }, 1.4);
      tl.call(() => startSway(), undefined, 1.0);
    }
    return () => {
      tl.kill();
      sway?.kill();
    };
  }, [reduced, docked, step]);

  return (
    <div ref={root} className="scene is-human-ai">
      <SlideChrome
        kicker="CO? · AUTONOMIE"
        page="44 / 75"
        caption="Potřeba × riziko × důsledek"
        captionDot
      />
      <div className="slide-source">Zdroj: Gartner, Customers Using GenAI for Customer Service Must Have Access to a Human Agent, 08/2026</div>
      <aside data-autonomy-proof className="autonomy-proof">
        <div data-autonomy-num className="autonomy-proof-num">
          <span data-autonomy-count>87</span>
          <span data-autonomy-unit>%</span>
        </div>
        <div data-autonomy-cap className="autonomy-proof-cap">chce možnost přejít z AI k člověku</div>
      </aside>
      <div className="autonomy-copy">
        <div data-autonomy-kicker className="autonomy-kicker">NE MAXIMUM AI. SPRÁVNÁ MÍRA AUTONOMIE.</div>
        <div data-autonomy-title className="autonomy-title">
          Míra autonomie není vlastnost technologie.
        </div>
        <div data-autonomy-sub className="autonomy-sub">Je to rozhodnutí podle situace.</div>
      </div>
      <div className="autonomy-compass-stage">
        <article data-autonomy-mode className="autonomy-mode is-human">
          <div className="autonomy-level">Vysoký důsledek</div>
          <h3>Člověk vede.<br />AI podporuje.</h3>
          <div className="autonomy-examples">
            <span>Obava o zdraví</span>
            <span>Eskalovaná stížnost v hotelu</span>
          </div>
        </article>

        <div className="autonomy-dial-block">
          <div data-autonomy-compass className="autonomy-dial-core">
            <div className="autonomy-ask">Jaká míra autonomie?</div>
            <div className="autonomy-compass">
              <div className="autonomy-glow" aria-hidden="true" />
              <div className="autonomy-rim" aria-hidden="true" />
              <div className="autonomy-bevel" aria-hidden="true" />
              <div className="autonomy-face" aria-hidden="true" />
              <div className="autonomy-ring" aria-hidden="true" />
              <i className="autonomy-tick is-n" />
              <i className="autonomy-tick is-w" />
              <i className="autonomy-tick is-e" />
              <i className="autonomy-tick is-s" />
              <span className="autonomy-mark" aria-hidden="true" />
              <span className="autonomy-pole is-human">Člověk</span>
              <span className="autonomy-pole is-ai">AI</span>
              <div data-autonomy-needle className="autonomy-needle">
                <span className="autonomy-needle-glow" />
              </div>
              <div className="autonomy-hub" />
            </div>
          </div>
          <div data-autonomy-middle className="autonomy-middle">
            <div className="autonomy-level">Střední riziko</div>
            <strong>AI navrhne. Člověk potvrdí.</strong>
          </div>
        </div>

        <article data-autonomy-mode className="autonomy-mode is-ai">
          <div className="autonomy-level">Nízký důsledek</div>
          <h3>AI jedná</h3>
          <div className="autonomy-examples">
            <span>Stav doručení</span>
            <span>Běžný samoobslužný nákup</span>
          </div>
        </article>
      </div>
    </div>
  );
}
