import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";
import { SlideChrome } from "../../components/SlideChrome";
import { EASE, MOTION as T } from "../../engine/motion";
import { asset } from "../../engine/assets";

const CLAIM = "Lidé s AI neřeší kanály,\nchtějí vyřešit problém";
const INTENT = "Potřeboval bych refinancovat hypotéku";
const RESULT = "Nabídka. Dokumenty. Další krok.";

const CHANS = [
  { id: "web", label: "Web", icon: "web" },
  { id: "app", label: "App", icon: "app" },
  { id: "call", label: "Call centrum", icon: "call" },
  { id: "branch", label: "Pobočka", icon: "branch" },
  { id: "mail", label: "E-mail", icon: "mail" },
] as const;

const CARD = { w: 236, h: 228, gap: 20 };

function putRow(chan: HTMLElement, i: number) {
  const ico = chan.querySelector<HTMLElement>("[data-tn-ico]");
  const label = chan.querySelector<HTMLElement>("[data-tn-label]");
  gsap.set(chan, {
    transformOrigin: "0 0",
    x: i * (CARD.w + CARD.gap),
    y: 0,
    width: CARD.w,
    height: CARD.h,
    borderRadius: 28,
  });
  if (ico) gsap.set(ico, { transformOrigin: "0 0", x: 70, y: 38, width: 96, height: 96, borderRadius: 24 });
  if (label) gsap.set(label, { transformOrigin: "0 0", x: 8, y: 148, width: 220, fontSize: 24, textAlign: "center" });
}

const NODES = [
  { id: "data", label: "DATA" },
  { id: "produkty", label: "PRODUKTY" },
  { id: "procesy", label: "PROCESY" },
  { id: "lide", label: "LIDÉ" },
  { id: "systemy", label: "SYSTÉMY" },
] as const;

function NodeGlyph({ name, x, y }: { name: (typeof NODES)[number]["id"]; x: number; y: number }) {
  const s = {
    fill: "none" as const,
    stroke: "var(--teal)",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <g transform={`translate(${x} ${y}) scale(0.72)`} aria-hidden="true">
      {name === "data" && (
        <>
          <ellipse cx="22" cy="11" rx="12" ry="5" {...s} />
          <path d="M10 11v20c0 3.2 5.4 5.4 12 5.4s12-2.2 12-5.4V11" {...s} />
          <path d="M10 21c0 3.2 5.4 5.4 12 5.4s12-2.2 12-5.4" {...s} />
        </>
      )}
      {name === "produkty" && (
        <>
          <path d="M8 16l14-8 14 8v16l-14 8-14-8z" {...s} />
          <path d="M8 16l14 8 14-8" {...s} />
          <path d="M22 24v16" {...s} />
        </>
      )}
      {name === "procesy" && (
        <>
          <path d="M13 13a12 12 0 0 1 16 6" {...s} />
          <path d="M26 11l3 8 8-3" {...s} />
          <path d="M31 31a12 12 0 0 1-16-6" {...s} />
          <path d="M18 33l-3-8-8 3" {...s} />
        </>
      )}
      {name === "lide" && (
        <>
          <circle cx="16" cy="14" r="5" {...s} />
          <path d="M7 34c1.2-8 5-11 9-11s7.8 3 9 11" {...s} />
          <circle cx="30" cy="16" r="4" {...s} />
          <path d="M23 34c1-6.2 4-8.5 7-8.5s6 2.3 7 8.5" {...s} />
        </>
      )}
      {name === "systemy" && (
        <>
          <rect x="8" y="8" width="10" height="10" rx="2.5" {...s} />
          <rect x="26" y="8" width="10" height="10" rx="2.5" {...s} />
          <rect x="17" y="26" width="10" height="10" rx="2.5" {...s} />
          <path d="M18 13h8M13 18l9 8M31 18l-9 8" {...s} />
        </>
      )}
    </g>
  );
}

function typeOn(
  tl: gsap.core.Timeline,
  typed: HTMLElement | null,
  caret: HTMLElement | null,
  text: string,
  at: number,
  duration: number,
) {
  const cursor = { n: 0 };
  if (typed) typed.textContent = "";
  if (caret) {
    caret.classList.add("is-scripted");
    tl.set(caret, { opacity: 1, autoAlpha: 1 }, at);
  }
  tl.to(cursor, {
    n: text.length,
    duration,
    ease: "none",
    onUpdate: () => {
      if (typed) typed.textContent = text.slice(0, Math.round(cursor.n));
    },
  }, at);
  if (caret) tl.set(caret, { opacity: 0, autoAlpha: 0 }, at + duration + 0.04);
}

function ChanIcon({ name }: { name: (typeof CHANS)[number]["icon"] }) {
  const props = {
    width: 72,
    height: 72,
    viewBox: "0 0 44 44",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (name === "web") {
    return (
      <svg {...props}>
        <circle cx="22" cy="22" r="14" />
        <path d="M8 22h28" />
        <path d="M22 8c4.2 4.8 6.6 10.2 6.6 14S26.2 31.2 22 36c-4.2-4.8-6.6-10.2-6.6-14S17.8 12.8 22 8Z" />
      </svg>
    );
  }
  if (name === "app") {
    return (
      <svg {...props}>
        <rect x="14" y="7" width="16" height="30" rx="4" />
        <path d="M20 11h4" />
        <circle cx="22" cy="32.5" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === "call") {
    return (
      <svg {...props}>
        <path d="M12 24v-4a10 10 0 0 1 20 0v4" />
        <path d="M12 23h4v8h-2a2 2 0 0 1-2-2v-6Z" />
        <path d="M32 23h-4v8h2a2 2 0 0 0 2-2v-6Z" />
        <path d="M28 31v1.4a5 5 0 0 1-5 5h-2" />
      </svg>
    );
  }
  if (name === "branch") {
    return (
      <svg {...props}>
        <path d="M10 34V18l12-9 12 9v16" />
        <path d="M18 34v-8h8v8" />
        <path d="M8 34h28" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <path d="M10 14h24v16H10z" />
      <path d="M10 14l12 9 12-9" />
    </svg>
  );
}

function ThenNow({ beat, reduced }: { beat: number; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const page = beat < 3 ? 61 : beat + 59;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const last = prev.current;
    prev.current = beat;
    const adjacent = last !== null && Math.abs(last - beat) === 1;
    const animate = !reduced && (adjacent || (last === null && beat === 0));

    const claim = el.querySelector<HTMLElement>("[data-tn-claim]");
    const thenBlock = el.querySelector<HTMLElement>("[data-tn-then]");
    const chans = [...el.querySelectorAll<HTMLElement>("[data-tn-chan]")];
    const nowCol = el.querySelector<HTMLElement>("[data-tn-now]");
    const eraNow = el.querySelector<HTMLElement>("[data-tn-era-now]");
    const user = el.querySelector<HTMLElement>("[data-tn-user]");
    const wait = el.querySelector<HTMLElement>("[data-tn-wait]");
    const msg = el.querySelector<HTMLElement>("[data-tn-msg]");
    const typed = el.querySelector<HTMLElement>("[data-tn-typed]");
    const caret = el.querySelector<HTMLElement>("[data-tn-caret]");
    const agent = el.querySelector<HTMLElement>("[data-mortgage-agent]");
    const agentIntro = el.querySelector<HTMLElement>("[data-tn-agent-intro]");
    const hub = el.querySelector<SVGElement>("[data-tn-hub]");
    const nodes = [...el.querySelectorAll<SVGGElement>("[data-mortgage-node]")];
    const routes = [...el.querySelectorAll<SVGPathElement>("[data-mortgage-route]")];
    const result = el.querySelector<HTMLElement>("[data-mortgage-result]");
    const inLine = el.querySelector<SVGPathElement>("[data-tn-in]");
    const outLine = el.querySelector<SVGPathElement>("[data-tn-out]");
    const split = el.querySelector<HTMLElement>(".tn-split");
    const flow = el.querySelector<SVGSVGElement>(".tn-flow");

    const link = (path: SVGPathElement | null, from: Element | null, to: Element | null, fromEdge: "right" | "left", toEdge: "left" | "right") => {
      if (!path || !from || !to || !split || !flow) return;
      const box = split.getBoundingClientRect();
      flow.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      const a = from.getBoundingClientRect();
      const b = to.getBoundingClientRect();
      const x1 = fromEdge === "right" ? a.right - box.left : a.left - box.left;
      const y1 = a.top + a.height / 2 - box.top;
      const x2 = toEdge === "left" ? b.left - box.left : b.right - box.left;
      const y2 = b.top + b.height / 2 - box.top;
      const mx = (x1 + x2) / 2;
      path.setAttribute("d", `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`);
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.enter } });
      const was = last ?? -1;
      const vis = (node: Element | null, on: boolean, wasOn: boolean, at = 0) => {
        if (!node) return;
        if (!animate) {
          gsap.set(node, { autoAlpha: on ? 1 : 0 });
          return;
        }
        gsap.set(node, { autoAlpha: wasOn ? 1 : 0 });
        if (wasOn === on) return;
        tl.to(node, { autoAlpha: on ? 1 : 0, duration: on ? T.enter : T.exit, ease: on ? EASE.enter : EASE.exit }, at);
      };

      if (claim) {
        if (beat === 0 && last === null && animate) {
          tl.fromTo(claim, { autoAlpha: 0, y: T.y }, { autoAlpha: 1, y: 0, duration: T.enter, ease: EASE.enter }, 0);
        } else gsap.set(claim, { autoAlpha: 1, y: 0 });
      }

      const thenOn = beat >= 1 && beat < 3;
      const thenWas = was >= 1 && was < 3;
      const offX = -1580;
      if (thenBlock) {
        if (!animate) gsap.set(thenBlock, { autoAlpha: thenOn ? 1 : 0, x: thenOn ? 0 : beat >= 3 ? offX : 0 });
        else {
          gsap.set(thenBlock, { autoAlpha: thenWas ? 1 : 0, x: thenWas ? 0 : was >= 3 ? offX : 0 });
          if (thenOn && !thenWas) {
            gsap.set(thenBlock, { x: 0 });
            tl.to(thenBlock, { autoAlpha: 1, duration: T.enter, ease: EASE.enter }, 0);
          } else if (!thenOn && thenWas) {
            tl.to(thenBlock, { x: offX, autoAlpha: 0, duration: T.cameraVia, ease: EASE.move }, 0);
          }
        }
      }

      const showChans = beat >= 2;
      const shownChans = was >= 2;
      chans.forEach((chan, i) => {
        putRow(chan, i);
        if (!animate) gsap.set(chan, { autoAlpha: showChans ? 1 : 0, y: 0 });
        else if (showChans && !shownChans) {
          gsap.set(chan, { autoAlpha: 0, y: 18 });
          tl.to(chan, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, i * 0.1);
        } else gsap.set(chan, { autoAlpha: showChans ? 1 : 0, y: 0 });
      });

      vis(nowCol, beat >= 3, was >= 3, beat === 3 ? 0.58 : 0);
      vis(eraNow, beat >= 3, was >= 3, beat === 3 ? 0.58 : 0);
      vis(split, beat >= 3, was >= 3, beat === 3 ? 1.08 : 0);
      vis(user, beat >= 3, was >= 3, beat === 3 ? 1.12 : 0);
      vis(msg, beat >= 4, was >= 4);
      vis(wait, beat >= 4 && beat < 7, was >= 4 && was < 7, beat === 4 ? 1.62 : 0);

      if (typed && caret) {
        if (beat < 4) {
          typed.textContent = "";
          gsap.set(caret, { autoAlpha: 0 });
        } else if (beat > 4 || reduced || !animate) {
          typed.textContent = INTENT;
          gsap.set(caret, { autoAlpha: 0 });
        } else if (beat === 4) {
          typeOn(tl, typed, caret, INTENT, 0.12, 1.52);
        }
      }

      vis(agent, beat >= 5, was >= 5);
      vis(agentIntro, beat === 5, was === 5, beat === 5 ? 0.16 : 0);
      vis(hub, beat >= 6, was >= 6, beat === 6 ? 0.06 : 0);
      if (result) {
        if (!animate) {
          gsap.set(result, { autoAlpha: beat >= 7 ? 1 : 0, x: 0, scale: 1 });
        } else if (beat >= 7 && was < 7) {
          gsap.set(result, { autoAlpha: 0, x: 24, scale: 0.96, transformOrigin: "right center" });
          tl.to(result, { autoAlpha: 1, x: 0, scale: 1, duration: 0.44, ease: EASE.enter }, 0.72);
        } else if (beat < 7 && was >= 7) {
          tl.to(result, { autoAlpha: 0, x: 20, duration: T.exit, ease: EASE.exit }, 0);
        } else {
          gsap.set(result, { autoAlpha: beat >= 7 ? 1 : 0, x: 0, scale: 1 });
        }
      }
      if (beat >= 5) {
        const target = beat >= 6 ? hub : agent;
        link(inLine, msg, target, "right", "left");
        tl.call(() => link(inLine, msg, target, "right", "left"), [], beat === 5 ? 0.08 : 0.01);
      }
      vis(inLine, beat >= 5, was >= 5, beat === 5 ? 0.1 : 0);
      if (beat >= 7) {
        link(outLine, hub, result, "left", "right");
        tl.call(() => link(outLine, hub, result, "left", "right"), [], 0.02);
      }
      if (outLine) {
        const length = outLine.getTotalLength();
        gsap.set(outLine, { strokeDasharray: length });
        if (!animate) {
          gsap.set(outLine, { strokeDashoffset: beat >= 7 ? 0 : length, autoAlpha: beat >= 7 ? 1 : 0 });
          if (beat >= 7) outLine.setAttribute("marker-end", "url(#tn-arrow)");
          else outLine.removeAttribute("marker-end");
        } else if (beat >= 7 && was < 7) {
          outLine.removeAttribute("marker-end");
          gsap.set(outLine, { strokeDashoffset: length, autoAlpha: 1 });
          tl.to(outLine, { strokeDashoffset: 0, duration: T.line, ease: EASE.move }, 0.12);
          tl.call(() => outLine.setAttribute("marker-end", "url(#tn-arrow)"), [], 0.7);
        } else if (beat < 7 && was >= 7) {
          outLine.removeAttribute("marker-end");
          tl.to(outLine, { autoAlpha: 0, duration: T.exit, ease: EASE.exit }, 0);
        } else {
          gsap.set(outLine, { strokeDashoffset: beat >= 7 ? 0 : length, autoAlpha: beat >= 7 ? 1 : 0 });
          if (beat >= 7) outLine.setAttribute("marker-end", "url(#tn-arrow)");
          else outLine.removeAttribute("marker-end");
        }
      }

      nodes.forEach((node, i) => vis(node, beat >= 6, was >= 6, beat === 6 ? i * 0.08 : 0));
      routes.forEach((route, i) => {
        const length = route.getTotalLength();
        const on = beat >= 6;
        const shown = was >= 6;
        gsap.set(route, { strokeDasharray: length, autoAlpha: 1 });
        if (!animate) gsap.set(route, { strokeDashoffset: on ? 0 : length, autoAlpha: on ? 1 : 0 });
        else {
          gsap.set(route, { strokeDashoffset: shown ? 0 : length, autoAlpha: shown || on ? 1 : 0 });
          if (shown !== on) tl.to(route, { strokeDashoffset: on ? 0 : length, autoAlpha: on ? 1 : 0, duration: T.line, ease: EASE.move }, beat === 6 ? 0.06 + i * 0.08 : 0);
        }
      });
    }, el);

    return () => ctx.revert();
  }, [beat, reduced]);

  const captions = [
    "Zákazník neřeší kanál",
    "Dříve: pět začátků",
    "Pět kanálů, pět začátků",
    "Dnes: jeden vstup",
    "Zákazník pošle záměr a čeká",
    "AI agent přebírá",
    "Napojí se na celou firmu",
    "Výsledek se vrací zákazníkovi",
  ];

  return (
    <div ref={root} className={`scene tn-stage${beat === 5 ? " is-agent-intro" : ""}`}>
      <SlideChrome
        kicker="JAK? / ORCHESTRACE"
        page={`${page} / 75`}
        caption={captions[beat] ?? captions[0]}
        rail={beat >= 3 ? "DNES" : beat >= 1 ? "DŘÍVE" : undefined}
      />

      <div data-tn-claim className="tn-claim heading">
        {CLAIM.split("\n").map((line) => (
          <span key={line}>{line}</span>
        ))}
      </div>

      <div data-tn-then className="tn-then">
        <div data-tn-move className="tn-then-move">
          <div data-tn-era-then className="tn-era">Dříve</div>
          <div className="tn-chans">
            {CHANS.map((channel) => (
              <div key={channel.id} data-tn-chan className="tn-chan">
                <span data-tn-ico className="tn-chan-ico"><ChanIcon name={channel.icon} /></span>
                <span data-tn-label className="tn-chan-label">{channel.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div data-tn-now className="tn-now">
        <div data-tn-era-now className="tn-era">Dnes</div>
        <div className="tn-split">
          <svg className="tn-flow" viewBox="0 0 1000 700" aria-hidden="true">
            <defs>
              <marker id="tn-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto">
                <path d="M0 0L10 5L0 10Z" fill="var(--lime)" />
              </marker>
            </defs>
            <path data-tn-in fill="none" stroke="var(--lime)" strokeWidth="4" markerEnd="url(#tn-arrow)" />
            <path data-tn-out fill="none" stroke="var(--lime)" strokeWidth="4" />
          </svg>
          <div data-tn-user className="tn-user tn-glass">
            <div className="tn-user-cap">Zákazník</div>
            <img className="tn-user-fig" src={asset("tn-user.png")} alt="" />
            <div className="tn-user-copy">
              <div data-tn-msg className="tn-msg">
                <span data-tn-typed />
                <span data-tn-caret className="caret is-scripted" aria-hidden="true" />
              </div>
              <div data-tn-wait className="tn-wait">čeká na výsledek</div>
              <div data-mortgage-result className="tn-result">
                <span className="tn-result-cap">AI agent odpovídá</span>
                <span>{RESULT}</span>
              </div>
            </div>
          </div>

          <div className="tn-agent-col tn-glass">
            <div className="tn-agent-cap">AI agent</div>
            <div data-tn-agent-intro className="tn-agent-intro">
              <span className="tn-agent-intro-dot" aria-hidden="true" />
              Přebírám požadavek
            </div>
            <div data-mortgage-agent className="tn-agent-wrap">
              <span className="tn-agent-orbit tn-agent-orbit-a" aria-hidden="true" />
              <span className="tn-agent-orbit tn-agent-orbit-b" aria-hidden="true" />
              <img className="tn-agent" src={asset("chat-robot.png")} alt="" />
            </div>
            <svg className="tn-graph" viewBox="0 0 640 520" aria-label="Agent propojuje firmu">
              {NODES.map((node, i) => {
                const y = 36 + i * 90;
                return (
                  <g data-mortgage-node key={node.id}>
                    <path data-mortgage-route={i} d={`M210 248 C300 248, 320 ${y}, 368 ${y}`} fill="none" stroke="var(--lime)" strokeWidth="3" />
                    <rect x="368" y={y - 30} width="256" height="60" rx="18" fill="var(--bg)" stroke="var(--teal)" strokeWidth="2.5" />
                    <NodeGlyph name={node.id} x={380} y={y - 16} />
                    <text x="430" y={y + 7} fill="var(--teal)" fontSize="18" fontWeight="700" letterSpacing=".4" fontFamily="var(--font)">{node.label}</text>
                  </g>
                );
              })}
              <g data-tn-hub className="tn-agent-hub">
                <circle cx="210" cy="248" r="31" fill="rgba(195, 213, 82, 0.18)" />
                <circle cx="210" cy="248" r="20" fill="var(--bg)" stroke="var(--teal)" strokeWidth="2.5" />
                <circle cx="210" cy="248" r="7" fill="var(--lime)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Channels({ step, reduced }: SceneProps) {
  return <ThenNow beat={step} reduced={reduced} />;
}

export const Mortgage = Channels;
