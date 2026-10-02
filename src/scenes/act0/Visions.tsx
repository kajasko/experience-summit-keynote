import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { EASE, MOTION } from "../../engine/motion";
import { useAdjacentStep } from "../../engine/useAdjacentStep";
import { SlideChrome } from "../../components/SlideChrome";
import { asset } from "../../engine/assets";
import { FourQuestionCards, FourQuestionsIntro, QUESTION_IN, QUESTION_OPEN } from "../FourQuestions";

const VISIONS = [
  {
    key: "musk",
    img: asset("musk.webp"),
    who: "Elon Musk · Tesla · humanoidní robotika",
    title: "AI dostává tělo",
    statement: "Roboti mohou zásadně zvýšit produktivitu a dostupnost služeb.",
    number: "01",
  },
  {
    key: "amodei",
    img: asset("amodei.webp"),
    who: "Dario Amodei · Anthropic · pokročilá AI",
    title: "AI jako motor změny",
    statement: "Pokrok, který dříve trval desetiletí, může přijít během několika let.",
    number: "02",
  },
  {
    key: "hassabis",
    img: asset("hassabis.webp"),
    who: "Demis Hassabis · Google DeepMind · AI pro vědu",
    title: "AI se stává vědcem",
    statement: "AI může objevovat věci, které člověk sám nedokáže najít.",
    number: "03",
  },
  {
    key: "altman",
    img: asset("altman.webp"),
    who: "Sam Altman · OpenAI · AI agenti",
    title: "AI jako infrastruktura",
    statement: "Agenti nebudou jen odpovídat. Budou vykonávat práci.",
    number: "04",
  },
] as const;

export function Visions({ step, reduced }: SceneProps) {
  if (step < 2) return <VisionHorizon step={step} reduced={reduced} />;
  return <VisionPortrait step={step - 2} reduced={reduced} />;
}

function VisionHorizon({ step, reduced }: { step: number; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const lit = step === 1;

  useLayoutEffect(() => {
    const from = prev.current;
    const morph = !reduced && from !== null && Math.abs(from - step) === 1;
    const enter = !reduced && from === null && step === 0;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const coreNode = q("[data-beam-core]")[0] as unknown as SVGGElement | undefined;
      const stem = q("[data-beam-stem]");
      const origin = q("[data-beam-origin]");
      const glow = q("[data-beam-glow]");
      const fan = q("[data-beam-fan]");
      const axes = q("[data-beam-axes]");
      const rings = q("[data-beam-ring]");
      const dots = q("[data-beam-dot]");
      const ai = q("[data-beam-ai]");
      const labels = q("[data-beam-label]");
      const titleA = q("[data-title-a]");
      const titleB = q("[data-title-b]");
      const subA = q("[data-sub-a]");
      const subB = q("[data-sub-b]");
      if (!coreNode) return;

      const flashlight = { x: 348, y: 498, r: 11 };
      const compass = { x: 612, y: 360, r: 58 };
      const start = from === 1 ? compass : flashlight;
      const end = lit ? compass : flashlight;
      const pos = { x: start.x, y: start.y };
      const put = () => coreNode.setAttribute("transform", `translate(${pos.x} ${pos.y})`);
      put();

      const tl = gsap.timeline();
      const showB = lit;
      const copy = (nodes: gsap.TweenTarget, visible: boolean, animate: boolean, at = 0, shift = 10) => {
        if (!animate) {
          gsap.set(nodes, { autoAlpha: visible ? 1 : 0, y: 0, visibility: visible ? "inherit" : "hidden" });
          return;
        }
        if (visible) {
          gsap.set(nodes, { visibility: "inherit" });
          tl.fromTo(nodes, { autoAlpha: 0, y: shift }, { autoAlpha: 1, y: 0, duration: MOTION.enter, ease: EASE.enter }, at);
        } else {
          tl.to(nodes, {
            autoAlpha: 0,
            y: -8,
            duration: 0.28,
            ease: EASE.exit,
            onComplete: () => gsap.set(nodes, { visibility: "hidden", y: 0 }),
          }, at);
        }
      };

      if (enter) {
        gsap.set(origin, { attr: { r: 0 } });
        gsap.set(glow, { autoAlpha: 0 });
        gsap.set(stem, { attr: { x1: -8 } });
        gsap.set(fan, { autoAlpha: 0 });
        gsap.set([axes, rings, dots, ai, labels], { autoAlpha: 0, visibility: "hidden" });
        gsap.set(titleA, { autoAlpha: 1, y: 0, visibility: "inherit" });
        gsap.set(titleB, { autoAlpha: 0, visibility: "hidden" });
        gsap.set(subA, { autoAlpha: 1, y: 0, visibility: "inherit" });
        gsap.set(subB, { autoAlpha: 0, visibility: "hidden" });
        tl.to(stem, { attr: { x1: -210 }, duration: 0.42, ease: EASE.enter }, 0.08);
        tl.to(origin, { attr: { r: flashlight.r }, duration: 0.32, ease: EASE.enter }, 0.26);
        tl.to(glow, { autoAlpha: 0.85, duration: 0.4, ease: EASE.enter }, 0.3);
        tl.to(fan, { autoAlpha: 1, duration: 0.7, ease: EASE.enter }, 0.34);
        return;
      }

      gsap.set(origin, { attr: { r: start.r } });
      gsap.set(stem, { attr: { x1: -210 } });
      gsap.set(glow, { autoAlpha: from === 1 ? 0.45 : 0.85 });
      gsap.set(fan, { autoAlpha: from === 1 ? 0.2 : 1 });
      gsap.set(axes, { autoAlpha: from === 1 ? 1 : 0 });
      gsap.set(rings, { autoAlpha: from === 1 ? 1 : 0 });
      gsap.set(dots, { autoAlpha: from === 1 ? 1 : 0 });
      gsap.set(ai, { autoAlpha: from === 1 ? 1 : 0 });
      gsap.set(labels, { autoAlpha: from === 1 ? 1 : 0, visibility: from === 1 ? "inherit" : "hidden" });
      gsap.set(titleA, { autoAlpha: from === 1 ? 0 : 1, y: 0, visibility: from === 1 ? "hidden" : "inherit" });
      gsap.set(titleB, { autoAlpha: from === 1 ? 1 : 0, y: 0, visibility: from === 1 ? "inherit" : "hidden" });
      gsap.set(subA, { autoAlpha: from === 1 ? 0 : 1, y: 0, visibility: from === 1 ? "hidden" : "inherit" });
      gsap.set(subB, { autoAlpha: from === 1 ? 1 : 0, y: 0, visibility: from === 1 ? "inherit" : "hidden" });

      if (!morph) {
        pos.x = end.x;
        pos.y = end.y;
        put();
        gsap.set(origin, { attr: { r: end.r } });
        gsap.set(glow, { autoAlpha: showB ? 0.45 : 0.85 });
        gsap.set(fan, { autoAlpha: showB ? 0.2 : 1 });
        gsap.set(axes, { autoAlpha: showB ? 1 : 0 });
        gsap.set(rings, { autoAlpha: showB ? 1 : 0 });
        gsap.set(dots, { autoAlpha: showB ? 1 : 0 });
        gsap.set(ai, { autoAlpha: showB ? 1 : 0 });
        gsap.set(labels, { autoAlpha: showB ? 1 : 0, visibility: showB ? "inherit" : "hidden" });
        copy(titleA, !showB, false);
        copy(titleB, showB, false);
        copy(subA, !showB, false);
        copy(subB, showB, false);
        return;
      }

      copy(titleA, !showB, true, 0, showB ? -8 : 10);
      copy(subA, !showB, true, 0.04, showB ? -6 : 8);
      copy(titleB, showB, true, 0.22, showB ? 10 : -8);
      copy(subB, showB, true, 0.28, showB ? 8 : -6);
      tl.to(pos, { x: end.x, y: end.y, duration: MOTION.cameraVia, ease: EASE.move, onUpdate: put }, 0);
      tl.to(origin, { attr: { r: end.r }, duration: MOTION.cameraVia, ease: EASE.move }, 0);
      tl.to(glow, { autoAlpha: showB ? 0.45 : 0.85, duration: MOTION.cameraVia, ease: EASE.move }, 0);
      tl.to(fan, { autoAlpha: showB ? 0.2 : 1, duration: MOTION.cameraVia, ease: EASE.move }, 0);
      if (showB) {
        gsap.set(labels, { visibility: "inherit" });
        tl.to(axes, { autoAlpha: 1, duration: 0.5, ease: EASE.enter }, 0.18);
        tl.to(rings, { autoAlpha: 1, duration: 0.5, ease: EASE.enter }, 0.2);
        tl.to(dots, { autoAlpha: 1, duration: 0.36, ease: EASE.enter, stagger: 0.04 }, 0.28);
        tl.to(ai, { autoAlpha: 1, duration: 0.32, ease: EASE.enter }, 0.34);
        tl.to(labels, { autoAlpha: 1, duration: 0.36, ease: EASE.enter, stagger: 0.04 }, 0.4);
      } else {
        tl.to([axes, rings, dots, ai, labels], { autoAlpha: 0, duration: 0.28, ease: EASE.exit }, 0);
        tl.add(() => gsap.set(labels, { visibility: "hidden" }));
      }
    }, root);
    prev.current = step;
    return () => ctx.revert();
  }, [step, reduced, lit]);

  return (
    <div ref={root} className="scene">
      <SlideChrome
        kicker={lit ? "15 Přechod" : "14 Přechod"}
        page={lit ? "15 / 75" : "14 / 75"}
        caption={lit ? "Existuje několik velkolepých vizí budoucnosti" : "Musíme změnit naše myšlení"}
        captionDot
      />
      <div className="safe vision-horizon">
        <div className="vision-horizon-copy">
          <div className="hero vision-titles" data-hero-title style={{ fontSize: 88, fontWeight: 800, letterSpacing: "-.055em", lineHeight: 0.98, color: "var(--text-deep)" }}>
            <div data-title-a>
              <div>Musíme změnit</div>
              <div>naše myšlení<span style={{ color: "var(--lime)" }}>.</span></div>
            </div>
            <div data-title-b>
              <div>Existuje několik</div>
              <div>velkolepých vizí</div>
              <div>budoucnosti<span style={{ color: "var(--lime)" }}>.</span></div>
            </div>
          </div>
          <div className="thought vision-subs" data-hero-statement style={{ marginTop: 28, fontSize: 26, fontWeight: 600, lineHeight: 1.35, color: "var(--text)" }}>
            <div data-sub-a>Ne technologie. Způsob, jakým o ní přemýšlíme.</div>
            <div data-sub-b>Ne jeden scénář. Několik směrů najednou.</div>
          </div>
        </div>
      </div>
      <BeamField />
    </div>
  );
}

function BeamField() {
  return (
    <div data-vision-compass data-hero-visual className="vision-beam" aria-label="Od jednoho směru ke čtyřem vizím">
      <svg viewBox="0 0 1000 720" overflow="visible">
        <defs>
          <linearGradient id="vision-fan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#f4f8f8" stopOpacity="0.72" />
            <stop offset="62%" stopColor="#dce8e9" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#dce8e9" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="vision-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="28%" stopColor="#e8f0e4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c3d552" stopOpacity="0" />
          </radialGradient>
          <filter id="vision-soft" x="-8%" y="-70%" width="140%" height="240%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>
        <g data-beam-core transform="translate(348 498)">
          <circle data-beam-glow cx="0" cy="0" r="240" fill="url(#vision-glow)" />
          <g data-beam-fan>
            <g filter="url(#vision-soft)">
              <polygon points="0,0 820,-48 840,48" fill="url(#vision-fan)" />
              <polygon points="0,0 760,-190 810,-30" fill="url(#vision-fan)" />
              <polygon points="0,0 810,40 750,210" fill="url(#vision-fan)" />
              <polygon points="0,0 620,-330 730,-130" fill="url(#vision-fan)" opacity="0.75" />
              <polygon points="0,0 710,150 580,350" fill="url(#vision-fan)" opacity="0.6" />
            </g>
            <g opacity="0.22">
              <polygon points="0,0 780,-22 800,22" fill="#f7fbfb" />
              <polygon points="0,0 720,-150 760,-18" fill="#f7fbfb" />
              <polygon points="0,0 760,22 710,165" fill="#f7fbfb" />
            </g>
          </g>
          <g data-beam-ring>
            <circle cx="0" cy="0" r="168" fill="rgba(195,213,82,.12)" />
            <circle cx="0" cy="0" r="108" fill="rgba(195,213,82,.22)" />
          </g>
          <g data-beam-axes>
            <line x1="0" y1="-248" x2="0" y2="248" stroke="var(--lime)" strokeWidth="3" />
            <line x1="-248" y1="0" x2="248" y2="0" stroke="var(--lime)" strokeWidth="3" />
          </g>
          <circle data-beam-dot cx="0" cy="-248" r="10" fill="var(--lime)" />
          <circle data-beam-dot cx="248" cy="0" r="10" fill="var(--lime)" />
          <circle data-beam-dot cx="0" cy="248" r="10" fill="var(--lime)" />
          <circle data-beam-dot cx="-248" cy="0" r="10" fill="var(--lime)" />
          <line data-beam-stem x1="-210" y1="0" x2="-8" y2="0" stroke="var(--lime)" strokeWidth="3" />
          <circle data-beam-origin cx="0" cy="0" r="11" fill="var(--lime)" />
          <text data-beam-ai x="0" y="9" textAnchor="middle" fill="var(--text-deep)" fontSize="26" fontWeight="800" fontFamily="Montserrat, sans-serif">AI</text>
          <text data-beam-label x="0" y="-278" textAnchor="middle">Tělo</text>
          <text data-beam-label x="278" y="8" textAnchor="start">Agenti</text>
          <text data-beam-label x="0" y="298" textAnchor="middle">Tempo</text>
          <text data-beam-label x="-278" y="8" textAnchor="end">Věda</text>
        </g>
      </svg>
    </div>
  );
}

function VisionPortrait({ step, reduced }: { step: number; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const adjacent = useAdjacentStep(step);
  const vision = VISIONS[step];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const portrait = root.current?.querySelector<HTMLElement>("[data-hero-visual]");
      const soft = root.current?.querySelector<HTMLElement>("[data-vision-soft]");
      if (!portrait || !soft) return;
      const play = adjacent && !reduced;
      gsap.set([portrait, soft], { transformOrigin: "100% 100%" });
      if (!play) {
        gsap.set(portrait, { filter: "blur(0px)", autoAlpha: 1, scale: 1 });
        gsap.set(soft, { filter: "blur(22px)", autoAlpha: 0.22, scale: 1.1 });
        return;
      }
      gsap.fromTo(
        soft,
        { filter: "blur(8px)", autoAlpha: 0.5, scale: 1.03 },
        { filter: "blur(22px)", autoAlpha: 0.2, scale: 1.1, duration: MOTION.cameraVia, ease: EASE.move },
      );
      gsap.fromTo(
        portrait,
        { filter: "blur(14px)", autoAlpha: 0.35, scale: 1.05 },
        { filter: "blur(0px)", autoAlpha: 1, scale: 1, duration: MOTION.cameraVia, ease: EASE.enter },
      );
    }, root);
    return () => ctx.revert();
  }, [step, reduced, adjacent]);

  const portrait = {
    position: "absolute" as const,
    right: 0,
    top: 0,
    height: "100%",
    width: 780,
    objectFit: "contain" as const,
    objectPosition: "right bottom",
    pointerEvents: "none" as const,
  };
  return (
    <div ref={root} className="scene">
      <SlideChrome kicker={`${16 + step} Vize`} page={`${String(16 + step).padStart(2, "0")} / 75`} caption={`Vize ${vision.number} / 04`} captionDot />
      <img data-vision-soft src={vision.img} alt="" className="cutout vision-soft" style={portrait} />
      <img data-hero-visual src={vision.img} alt="" className="cutout vision-sharp" style={portrait} />
      <div className="safe" style={{ display: "flex", flexDirection: "column", justifyContent: "center", maxWidth: 920, paddingBottom: 20 }}>
        <div className="label" style={{ color: "var(--muted)", marginBottom: 22 }}>{vision.who}</div>
        <div data-hero-title style={{ fontSize: vision.title.length > 22 ? 72 : 84, fontWeight: 800, letterSpacing: "-.045em", lineHeight: 1.06, color: "var(--text-deep)", maxWidth: "12ch" }}>
          {vision.title}
        </div>
        <div data-hero-statement style={{ marginTop: 28, fontSize: 30, fontWeight: 650, lineHeight: 1.28, color: "var(--teal)", maxWidth: "22ch" }}>
          {vision.statement}
        </div>
      </div>
    </div>
  );
}

export function Challenges({ step, reduced }: SceneProps) {
  void step;
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const cards = gsap.utils.toArray<HTMLElement>("[data-question-card]", el);
    const titleA = el.querySelector<HTMLElement>("[data-challenge-title-a]");
    const box = (p: (typeof QUESTION_IN)[number] | (typeof QUESTION_OPEN)[number]) => ({
      left: p.left, top: p.top, width: p.width, height: p.height, rotation: p.rotation,
    });
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(titleA, { autoAlpha: 1, y: 0 });
        cards.forEach((card, i) => {
          gsap.set(card, { ...box(QUESTION_OPEN[i]), autoAlpha: 1, x: 0, scale: 1 });
          gsap.set(card.querySelector(".challenge-card-desc"), { autoAlpha: 1, y: 0 });
          gsap.set(card.querySelector(".challenge-card-line"), { scaleX: 1 });
        });
        return;
      }
      gsap.set(titleA, { autoAlpha: 0, y: 18 });
      cards.forEach((card, i) => {
        gsap.set(card, { ...box(QUESTION_IN[i]), autoAlpha: 0, x: 64, scale: 0.96 });
        gsap.set(card.querySelector(".challenge-card-desc"), { autoAlpha: 0, y: 10 });
        gsap.set(card.querySelector(".challenge-card-line"), { scaleX: 0, transformOrigin: "left center" });
      });
      const tl = gsap.timeline();
      tl.to(titleA, { autoAlpha: 1, y: 0, duration: 0.48, ease: EASE.enter }, 0);
      cards.forEach((card, i) => {
        const at = 0.48 + i * 0.14;
        tl.to(card, { autoAlpha: 1, x: 0, scale: 1, duration: 0.48, ease: EASE.enter }, at);
        tl.to(card, { ...box(QUESTION_OPEN[i]), duration: 0.55, ease: EASE.move }, at + 0.42);
        tl.to(card.querySelector(".challenge-card-desc"), { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, at + 0.58);
        tl.to(card.querySelector(".challenge-card-line"), { scaleX: 1, duration: 0.42, ease: EASE.move }, at + 0.7);
      });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className="scene is-challenges challenge-pair">
      <SlideChrome
        kicker="19 Výzvy"
        page="19 / 75"
        caption="Co musíme začít řešit dnes"
        captionDot
      />
      <div className="challenge-stage">
        <FourQuestionsIntro
          eyebrow="Co musíme začít řešit"
          sub="Než začneme navrhovat AI-native experience."
        />
        <FourQuestionCards positions={QUESTION_IN} coreTo={0} />
      </div>
    </div>
  );
}
