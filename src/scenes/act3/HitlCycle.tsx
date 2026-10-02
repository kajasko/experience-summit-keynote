import { useLayoutEffect, useRef } from "react";

const NODES = [
  { label: <>1. Zadání cíle</> },
  { label: <>2. AI agent<br />pracuje</> },
  { label: <>3. Kontrolní bod</> },
  { label: <>4. Člověk ověří</> },
  { label: <>5. Pokračovat /<br />upravit</> },
] as const;

export function HitlCycle({ active, reduced }: { active: boolean; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const hub = el.querySelector<HTMLElement>("[data-hub]");
    const cards = [...el.querySelectorAll<HTMLElement>(".hitl-cycle-node[data-i]")];
    const shafts = [0, 1, 2, 3, 4].map((i) => el.querySelector<SVGPathElement>(`#hitl-p${i}`));
    const heads = [0, 1, 2, 3, 4].map((i) => el.querySelector<SVGGElement>(`#hitl-h${i}`));
    if (!hub || shafts.some((p) => !p) || heads.some((h) => !h)) return;

    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
      return id;
    };
    const pose = (beat: number) => ({
      nodeCount: beat <= 0 ? 0 : Math.min(5, Math.ceil(beat / 2)),
      arrowCount: beat <= 0 ? 0 : Math.min(5, Math.floor(beat / 2)),
    });

    const placeHeads = () => {
      shafts.forEach((p, i) => {
        if (!p || !heads[i]) return;
        const len = p.getTotalLength();
        const a = p.getPointAtLength(Math.max(0, len - 12));
        const b = p.getPointAtLength(len);
        const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
        heads[i]!.setAttribute("transform", `translate(${b.x},${b.y}) rotate(${ang})`);
      });
    };
    const measure = () => {
      shafts.forEach((p) => {
        if (!p) return;
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        if (!p.classList.contains("is-on")) p.style.strokeDashoffset = String(len);
      });
      placeHeads();
    };
    const hideArrow = (i: number) => {
      const p = shafts[i];
      if (!p) return;
      p.classList.remove("is-on");
      p.style.transition = "none";
      p.style.strokeDashoffset = String(p.getTotalLength());
      heads[i]?.classList.remove("is-on");
    };
    const showArrow = (i: number, animate: boolean) => {
      const p = shafts[i];
      if (!p) return;
      p.classList.add("is-on");
      if (!animate || reduced) {
        p.style.transition = "none";
        p.style.strokeDashoffset = "0";
        heads[i]?.classList.add("is-on");
        return;
      }
      p.style.transition = "none";
      p.style.strokeDashoffset = String(p.getTotalLength());
      void p.getBoundingClientRect();
      p.style.transition = "stroke-dashoffset 520ms cubic-bezier(0.16, 1, 0.3, 1)";
      p.style.strokeDashoffset = "0";
      later(() => heads[i]?.classList.add("is-on"), 420);
    };

    const apply = (beat: number, animate: boolean) => {
      const { nodeCount, arrowCount } = pose(beat);
      cards.forEach((c, i) => {
        const visible = i < nodeCount;
        c.classList.toggle("is-in", visible);
        c.classList.toggle("is-on", visible && i === nodeCount - 1);
      });
      shafts.forEach((_, i) => {
        if (i < arrowCount) showArrow(i, animate && !shafts[i]!.classList.contains("is-on"));
        else hideArrow(i);
      });
    };

    measure();
    if (!active) {
      hub.classList.remove("is-in");
      apply(-1, false);
      return () => timers.splice(0).forEach(clearTimeout);
    }

    if (reduced) {
      hub.classList.add("is-in");
      apply(10, false);
      return () => timers.splice(0).forEach(clearTimeout);
    }

    hub.classList.remove("is-in");
    apply(0, false);
    later(() => hub.classList.add("is-in"), 480);
    for (let beat = 1; beat <= 10; beat += 1) {
      later(() => apply(beat, true), 1100 + (beat - 1) * 560);
    }

    return () => timers.splice(0).forEach(clearTimeout);
  }, [active, reduced]);

  return (
    <div ref={root} data-hitl-cycle className="hitl-cycle">
      <div className="hitl-cycle-stage" data-hitl-ring>
        <svg width="0" height="0" aria-hidden="true">
          <defs>
            <radialGradient id="hitl-tealBall" cx="32%" cy="26%" r="74%">
              <stop offset="0%" stopColor="#9ad8dc" />
              <stop offset="42%" stopColor="#3d8f95" />
              <stop offset="100%" stopColor="#0c454a" />
            </radialGradient>
            <radialGradient id="hitl-tealDeep" cx="30%" cy="24%" r="76%">
              <stop offset="0%" stopColor="#5eb0b6" />
              <stop offset="100%" stopColor="#0a3f44" />
            </radialGradient>
            <radialGradient id="hitl-greenBall" cx="32%" cy="26%" r="74%">
              <stop offset="0%" stopColor="#cce87c" />
              <stop offset="48%" stopColor="#7bab47" />
              <stop offset="100%" stopColor="#456e22" />
            </radialGradient>
            <radialGradient id="hitl-limeBall" cx="32%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#e5f08a" />
              <stop offset="55%" stopColor="#b3c84a" />
              <stop offset="100%" stopColor="#6a9a2e" />
            </radialGradient>
            <radialGradient id="hitl-face" cx="34%" cy="28%" r="72%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="62%" stopColor="#f4f7f7" />
              <stop offset="100%" stopColor="#cdd6d6" />
            </radialGradient>
            <radialGradient id="hitl-head3d" cx="30%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#7ec8cd" />
              <stop offset="55%" stopColor="#3a8b91" />
              <stop offset="100%" stopColor="#1a5c61" />
            </radialGradient>
          </defs>
        </svg>

        <svg className="hitl-cycle-arrows" viewBox="0 0 1000 1000" aria-hidden="true">
          <g className="arr"><path id="hitl-p0" className="shaft" d="M 611.9 145.2 A 372 372 0 0 1 801.0 281.3" /></g>
          <g className="arr"><path id="hitl-p1" className="shaft" d="M 871.9 509.7 A 372 372 0 0 1 806.9 710.2" /></g>
          <g className="arr"><path id="hitl-p2" className="shaft" d="M 593.1 858.8 A 372 372 0 0 1 406.9 858.8" /></g>
          <g className="arr"><path id="hitl-p3" className="shaft" d="M 193.1 710.2 A 372 372 0 0 1 128.1 509.7" /></g>
          <g className="arr"><path id="hitl-p4" className="shaft" d="M 199.0 281.3 A 372 372 0 0 1 388.1 145.2" /></g>
          <g id="hitl-h0" className="head"><path d="M-2,-13 L24,0 L-2,13 Z" fill="url(#hitl-head3d)" /></g>
          <g id="hitl-h1" className="head"><path d="M-2,-13 L24,0 L-2,13 Z" fill="url(#hitl-head3d)" /></g>
          <g id="hitl-h2" className="head"><path d="M-2,-13 L24,0 L-2,13 Z" fill="url(#hitl-head3d)" /></g>
          <g id="hitl-h3" className="head"><path d="M-2,-13 L24,0 L-2,13 Z" fill="url(#hitl-head3d)" /></g>
          <g id="hitl-h4" className="head"><path d="M-2,-13 L24,0 L-2,13 Z" fill="url(#hitl-head3d)" /></g>
        </svg>

        <article className="hitl-cycle-node hub" data-hub>
          <div className="ico">
            <svg viewBox="0 0 120 120">
              <ellipse cx="52" cy="112" rx="28" ry="5" fill="#000" opacity=".12" />
              <circle cx="50" cy="34" r="22" fill="url(#hitl-greenBall)" />
              <ellipse cx="43" cy="27" rx="10" ry="7" fill="#fff" opacity=".38" />
              <path d="M16 110c2-38 18-56 34-56s32 18 34 56" fill="url(#hitl-greenBall)" />
              <ellipse cx="42" cy="72" rx="12" ry="16" fill="#fff" opacity=".12" />
              <g className="sh spin-origin">
                <path d="M76 48c16 5 27 10 31 12v23c0 20-13 34-31 42-18-8-31-22-31-42V59c8-5 19-9 31-11z" fill="url(#hitl-tealBall)" />
                <path d="M70 66c10 2 17 5 21 6v16c0 11-7 20-21 26" fill="#fff" opacity=".16" />
                <path d="M70 76l8 8 15-17" fill="none" stroke="#eef6b8" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
        </article>

        <article className="hitl-cycle-node n1" data-i="0">
          <div className="ico">
            <svg viewBox="0 0 100 100">
              <ellipse cx="48" cy="90" rx="22" ry="4.5" fill="#000" opacity=".1" />
              <circle cx="46" cy="58" r="26" fill="none" stroke="url(#hitl-tealBall)" strokeWidth="11.5" />
              <circle cx="46" cy="58" r="13" fill="none" stroke="url(#hitl-tealBall)" strokeWidth="9.5" />
              <ellipse cx="38" cy="48" rx="10" ry="6" fill="#fff" opacity=".22" />
              <g className="dart">
                <g transform="translate(46,58) rotate(46)">
                  <rect x="-2.2" y="-28" width="4.4" height="22" rx="2" fill="url(#hitl-limeBall)" />
                  <polygon points="0,3 -5,-8 5,-8" fill="url(#hitl-limeBall)" />
                  <polygon points="-2.2,-26 -10.5,-36 -2.2,-18" fill="#d4e36a" />
                  <polygon points="2.2,-26 10.5,-36 2.2,-18" fill="#7bab47" />
                </g>
              </g>
            </svg>
          </div>
          <div className="lbl">{NODES[0].label}</div>
        </article>

        <article className="hitl-cycle-node n2" data-i="1">
          <div className="ico">
            <svg viewBox="0 0 100 100">
              <ellipse cx="50" cy="92" rx="24" ry="4.5" fill="#000" opacity=".1" />
              <g className="ant">
                <rect x="47.5" y="5" width="5" height="16" rx="2.5" fill="url(#hitl-tealDeep)" />
                <circle cx="50" cy="8" r="7.4" fill="url(#hitl-limeBall)" />
                <ellipse cx="47.6" cy="6" rx="3.2" ry="2.1" fill="#fff" opacity=".45" />
              </g>
              <rect x="5" y="44" width="16" height="30" rx="8" fill="url(#hitl-tealBall)" />
              <rect x="79" y="44" width="16" height="30" rx="8" fill="url(#hitl-tealBall)" />
              <rect x="15" y="24" width="70" height="60" rx="30" fill="url(#hitl-face)" />
              <ellipse cx="38" cy="38" rx="16" ry="10" fill="#fff" opacity=".35" />
              <rect x="25" y="44" width="50" height="24" rx="12" fill="url(#hitl-tealDeep)" />
              <circle className="eye" cx="39" cy="56" r="6.2" fill="#c3d552" />
              <circle className="eye" cx="61" cy="56" r="6.2" fill="#c3d552" />
              <circle cx="37.5" cy="54.4" r="1.6" fill="#fff" />
              <circle cx="59.5" cy="54.4" r="1.6" fill="#fff" />
              <rect x="42" y="73" width="16" height="5.5" rx="2.7" fill="url(#hitl-limeBall)" />
            </svg>
          </div>
          <div className="lbl">{NODES[1].label}</div>
        </article>

        <article className="hitl-cycle-node n3" data-i="2">
          <div className="ico">
            <svg viewBox="0 0 100 100">
              <ellipse cx="50" cy="92" rx="20" ry="4" fill="#000" opacity=".1" />
              <rect x="21" y="14" width="56" height="72" rx="11" fill="url(#hitl-tealBall)" />
              <rect x="38" y="7" width="24" height="14" rx="5" fill="url(#hitl-tealDeep)" />
              <rect x="44" y="10" width="12" height="6" rx="3" fill="#9ad8dc" />
              <rect x="27" y="28" width="44" height="50" rx="6" fill="#f7f9f8" />
              <g className="tick spin-origin">
                <circle cx="36" cy="43" r="7.2" fill="url(#hitl-limeBall)" />
                <path d="M32.4 43l2.6 2.6 5.2-5.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
              </g>
              <g className="tick spin-origin" style={{ animationDelay: ".12s" }}>
                <circle cx="36" cy="60" r="7.2" fill="url(#hitl-limeBall)" />
                <path d="M32.4 60l2.6 2.6 5.2-5.6" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
              </g>
              <rect x="47" y="40" width="17" height="5" rx="2.5" fill="#3a8b91" />
              <rect x="47" y="57" width="15" height="5" rx="2.5" fill="#3a8b91" />
              <g className="tick spin-origin" style={{ animationDelay: ".22s" }}>
                <circle cx="78" cy="80" r="15.5" fill="url(#hitl-limeBall)" />
                <ellipse cx="73" cy="74" rx="5" ry="3.2" fill="#fff" opacity=".32" />
                <path d="M71 80l5 5 10.5-12" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
          <div className="lbl">{NODES[2].label}</div>
        </article>

        <article className="hitl-cycle-node n4" data-i="3">
          <div className="ico">
            <svg viewBox="0 0 120 120">
              <ellipse cx="52" cy="112" rx="28" ry="5" fill="#000" opacity=".12" />
              <circle cx="50" cy="34" r="22" fill="url(#hitl-greenBall)" />
              <ellipse cx="43" cy="27" rx="10" ry="7" fill="#fff" opacity=".38" />
              <path d="M16 110c2-38 18-56 34-56s32 18 34 56" fill="url(#hitl-greenBall)" />
              <ellipse cx="42" cy="72" rx="12" ry="16" fill="#fff" opacity=".12" />
              <g className="sh spin-origin">
                <path d="M76 48c16 5 27 10 31 12v23c0 20-13 34-31 42-18-8-31-22-31-42V59c8-5 19-9 31-11z" fill="url(#hitl-tealBall)" />
                <path d="M70 66c10 2 17 5 21 6v16c0 11-7 20-21 26" fill="#fff" opacity=".16" />
                <path d="M70 76l8 8 15-17" fill="none" stroke="#eef6b8" strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
          <div className="lbl">{NODES[3].label}</div>
        </article>

        <article className="hitl-cycle-node n5" data-i="4">
          <div className="ico">
            <svg viewBox="0 0 100 100">
              <ellipse cx="48" cy="90" rx="22" ry="4" fill="#000" opacity=".1" />
              <g className="gear spin-origin">
                <g transform="translate(46,44)">
                  <circle r="16.5" fill="url(#hitl-tealBall)" />
                  <rect x="-5.4" y="-25.5" width="10.8" height="12" rx="3.2" fill="url(#hitl-tealBall)" />
                  <rect x="-5.4" y="-25.5" width="10.8" height="12" rx="3.2" fill="url(#hitl-tealBall)" transform="rotate(45)" />
                  <rect x="-5.4" y="-25.5" width="10.8" height="12" rx="3.2" fill="url(#hitl-tealBall)" transform="rotate(90)" />
                  <rect x="-5.4" y="-25.5" width="10.8" height="12" rx="3.2" fill="url(#hitl-tealBall)" transform="rotate(135)" />
                  <rect x="-5.4" y="-25.5" width="10.8" height="12" rx="3.2" fill="url(#hitl-tealBall)" transform="rotate(180)" />
                  <rect x="-5.4" y="-25.5" width="10.8" height="12" rx="3.2" fill="url(#hitl-tealBall)" transform="rotate(225)" />
                  <rect x="-5.4" y="-25.5" width="10.8" height="12" rx="3.2" fill="url(#hitl-tealBall)" transform="rotate(270)" />
                  <rect x="-5.4" y="-25.5" width="10.8" height="12" rx="3.2" fill="url(#hitl-tealBall)" transform="rotate(315)" />
                  <circle r="10.5" fill="#f4f7f7" />
                  <circle r="5.8" fill="url(#hitl-tealDeep)" />
                  <ellipse cx="-2.2" cy="-2.4" rx="3" ry="2.1" fill="#fff" opacity=".4" />
                </g>
              </g>
              <g className="tick spin-origin">
                <circle cx="76" cy="76" r="16.5" fill="url(#hitl-limeBall)" />
                <ellipse cx="71" cy="70" rx="5.2" ry="3.4" fill="#fff" opacity=".35" />
                <path d="M68 76l6 6 12.5-13.5" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
          <div className="lbl">{NODES[4].label}</div>
        </article>
      </div>
    </div>
  );
}
