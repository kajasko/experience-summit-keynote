import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { EASE, MOTION as T } from "../../engine/motion";
import { asset } from "../../engine/assets";

/**
 * Slide 41 / 75 (uiai · ui3b): "To nejlepší z obou světů" — the result you can use.
 * Natural-language input (left) connected to a visual, usable output (right).
 * Replaces the former static screenshot (ui-41.jpg); built in HTML/CSS.
 */

const COMPARE = [
  { tone: "lg", name: "LG OLED 55C5", spec: "55\" | OLED", score: "4,8", price: "19 990,-", bars: [94, 48, 72], best: true },
  { tone: "sam", name: "Samsung QE65S85D", spec: "65\" | QLED", score: "4,6", price: "18 490,-", bars: [80, 38, 76] },
  { tone: "tcl", name: "TCL 55C805", spec: "55\" | Mini LED", score: "4,4", price: "15 990,-", bars: [82, 62, 46] },
] as const;

const GUIDES = [
  { icon: "screen", title: "Jak vybrat úhlopříčku?", time: "2 min" },
  { icon: "layers", title: "OLED nebo QLED?", time: "3 min" },
  { icon: "info", title: "Na co si dát pozor?", time: "2 min" },
] as const;

const CHECKS = ["Vynikající obraz (OLED)", "Jednoduché a rychlé ovládání", "Skvělý poměr cena / výkon"] as const;

function Icon({ name }: { name: "screen" | "layers" | "info" | "mic" | "send" | "user" | "spark" | "check" | "arrow" | "play" | "clock" }) {
  const c = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      {name === "screen" && <><rect x="3" y="5" width="18" height="12" rx="1.6" {...c} /><path d="M9 21h6M12 17v4M10.5 9.5l3 1.5-3 1.5Z" {...c} /></>}
      {name === "layers" && <path d="m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5" {...c} />}
      {name === "info" && <><circle cx="12" cy="12" r="9" {...c} /><path d="M12 11v6M12 7.5v.1" {...c} /></>}
      {name === "mic" && <><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" {...c} /></>}
      {name === "send" && <path d="M4 12 20 5l-5 15-3-6-8-2Zm8 2 3-3" {...c} />}
      {name === "user" && <><circle cx="12" cy="8.5" r="4" fill="currentColor" /><path d="M4.5 20c1.4-4 4.2-5.8 7.5-5.8s6.1 1.8 7.5 5.8Z" fill="currentColor" /></>}
      {name === "spark" && <path d="M10 3.5 11.6 8 16 9.6l-4.4 1.6L10 15.7l-1.6-4.5L4 9.6 8.4 8ZM17.5 13l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" {...c} strokeWidth={1.6} />}
      {name === "check" && <path d="m6.5 12.5 3.5 3.5 7.5-8" {...c} strokeWidth={2.6} />}
      {name === "arrow" && <path d="M5 12h14M13 6l6 6-6 6" {...c} />}
      {name === "play" && <path d="M8 5.5v13l10.5-6.5Z" fill="currentColor" />}
      {name === "clock" && <><circle cx="12" cy="12" r="9" fill="currentColor" /><path d="M12 7v5l3 2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></>}
    </svg>
  );
}

function Tv({ tone, big = false }: { tone: string; big?: boolean }) {
  return (
    <div className={`uir-tv is-${tone}${big ? " is-big" : ""}`}>
      <div className="uir-tv-screen">
        {big ? (
          <>
            <span className="uir-tv-brand">LG OLED <small>evo</small> <i>AI</i><br />2025</span>
            <span className="uir-tv-size">55"</span>
          </>
        ) : null}
      </div>
      <span className="uir-tv-stand" />
    </div>
  );
}

/** Main prompt, split into characters so it can be "spoken/typed" in. */
const PROMPT: { text: string; bold?: boolean; br?: boolean }[] = [
  { text: "Pomoz mi vybrat", br: true },
  { text: "nejlepší televizi", bold: true, br: true },
  { text: "do obýváku do 20 tisíc." },
];

function Typed() {
  return (
    <>
      {PROMPT.map((seg, si) => {
        const chars = Array.from(seg.text).map((ch, ci) => <span key={ci} data-uir-ch>{ch}</span>);
        return (
          <span key={si}>
            {seg.bold ? <b>{chars}</b> : chars}
            {seg.br ? <br /> : null}
          </span>
        );
      })}
    </>
  );
}

const WAVE = [6, 10, 16, 9, 22, 14, 28, 18, 34, 22, 30, 16, 24, 12, 20, 9, 14, 7, 10, 6, 8, 5];

export function UiResult({ active, reduced }: { active: boolean; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const was = prev.current;
    prev.current = active;
    const ctx = gsap.context(() => {
      if (!active) {
        if (was && !reduced) {
          gsap.set(el, { autoAlpha: 1 });
          gsap.to(el, { autoAlpha: 0, duration: 0.42, ease: EASE.exit });
        } else gsap.set(el, { autoAlpha: 0 });
        return;
      }
      gsap.set(el, { autoAlpha: 1 });
      const q = (s: string) => gsap.utils.toArray<HTMLElement>(s, el);
      const link = el.querySelector<SVGPathElement>("[data-uir-link]");
      if (reduced) return;
      const title = q("[data-uir-title]");
      const sub = q("[data-uir-sub]");
      const left = q('[data-uir-card="left"]');
      const right = q('[data-uir-card="right"]');
      const copy = q("[data-uir-copy]");
      const photo = q(".uir-photo");
      const avatar = q(".uir-avatar");
      const main = q(".uir-bubble.is-main");
      const chars = q("[data-uir-ch]");
      const follow = q(".uir-bubble.is-small");
      const voice = q(".uir-voice");
      const wave = q("[data-uir-wave] i");
      const dots = q("[data-uir-dot]");
      const pick = q(".uir-panel.is-pick");
      const pickBits = q(".uir-panel.is-pick > *");
      const checks = q(".uir-checks li");
      const compare = q(".uir-panel.is-compare");
      const models = q(".uir-model");
      const bars = q("[data-uir-bar]");
      const guide = q(".uir-panel.is-guide");
      const video = q(".uir-video");
      const guides = q(".uir-guide");

      gsap.set(el, { autoAlpha: 0 });
      gsap.set(title, { autoAlpha: 0, y: 24 });
      gsap.set(sub, { autoAlpha: 0, y: 12 });
      gsap.set([...left, ...right], { autoAlpha: 0, y: 28 });
      gsap.set(copy, { autoAlpha: 0, y: 10 });
      gsap.set(photo, { autoAlpha: 0, scale: 1.14 });
      gsap.set([...avatar, ...voice], { autoAlpha: 0, y: 12 });
      gsap.set(main, { autoAlpha: 0, y: 12, scale: 0.96, transformOrigin: "0% 50%" });
      gsap.set(chars, { autoAlpha: 0 });
      gsap.set(follow, { autoAlpha: 0, y: 12, scale: 0.96, transformOrigin: "0% 50%" });
      gsap.set(wave, { scaleY: 0.2, transformOrigin: "50% 50%" });
      gsap.set(dots, { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" });
      gsap.set([...pick, ...compare, ...guide], { autoAlpha: 0, y: 18 });
      gsap.set(pick, { scale: 0.92, transformOrigin: "50% 60%" });
      gsap.set(pickBits, { autoAlpha: 0, y: 8 });
      gsap.set(checks, { autoAlpha: 0, x: -10 });
      gsap.set(models, { autoAlpha: 0, x: 16 });
      gsap.set(bars, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(video, { autoAlpha: 0, scale: 0.94 });
      gsap.set(guides, { autoAlpha: 0, y: 10 });
      const len = link ? link.getTotalLength() : 0;
      if (link) gsap.set(link, { strokeDasharray: len, strokeDashoffset: len });

      const tl = gsap.timeline();
      tl.to(el, { autoAlpha: 1, duration: was === false ? 0.3 : 0.01 }, 0);
      // 1 · Title
      tl.to(title, { autoAlpha: 1, y: 0, duration: T.enter, stagger: 0.1, ease: EASE.enter }, 0.04);
      tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.3);
      // 2 · Input: the person, her voice, then her words
      tl.to(left, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.enter }, 0.4);
      tl.to(photo, { autoAlpha: 1, scale: 1.08, duration: 1.1, ease: EASE.move }, 0.5);
      tl.to(copy[0], { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0.62);
      tl.to(voice, { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 1.0);
      // Speaking: the waveform pulses a few times while the prompt appears (finite).
      wave.forEach((bar, i) => {
        tl.to(bar, { scaleY: 1, duration: 0.18, yoyo: true, repeat: 7, ease: "sine.inOut" }, 1.24 + (i % 5) * 0.05);
      });
      tl.to(avatar, { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE.enter }, 1.3);
      tl.to(main, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: EASE.enter }, 1.4);
      tl.to(chars, { autoAlpha: 1, duration: 0.01, stagger: 0.026, ease: "none" }, 1.56);
      const typedEnd = 1.56 + chars.length * 0.026;
      tl.to(wave, { scaleY: 1, duration: 0.24, ease: EASE.enter }, typedEnd);
      tl.to(follow, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: EASE.enter }, typedEnd + 0.24);
      // 3 · Connector to the output
      const linkAt = typedEnd + 0.82;
      tl.to(dots[0], { autoAlpha: 1, scale: 1, duration: 0.2 }, linkAt);
      if (link) tl.to(link, { strokeDashoffset: 0, duration: T.line, ease: EASE.move }, linkAt + 0.06);
      tl.to(dots[1], { autoAlpha: 1, scale: 1, duration: 0.2 }, linkAt + T.line);
      // 4 · Output builds: pick → comparison → explanation
      tl.to(right, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.enter }, linkAt + 0.3);
      tl.to(copy[1], { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, linkAt + 0.44);
      const outAt = linkAt + T.line + 0.06;
      tl.to(pick, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)" }, outAt);
      tl.to(pickBits, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.06, ease: EASE.enter }, outAt + 0.16);
      tl.to(checks, { autoAlpha: 1, x: 0, duration: 0.28, stagger: 0.1, ease: EASE.enter }, outAt + 0.62);
      tl.to(compare, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, outAt + 0.7);
      models.forEach((m, i) => {
        const at = outAt + 0.86 + i * 0.22;
        tl.to(m, { autoAlpha: 1, x: 0, duration: 0.32, ease: EASE.enter }, at);
        tl.to(bars.slice(i * 3, i * 3 + 3), { scaleX: 1, duration: 0.44, stagger: 0.06, ease: EASE.move }, at + 0.14);
      });
      tl.to(guide, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, outAt + 1.6);
      tl.to(video, { autoAlpha: 1, scale: 1, duration: 0.42, ease: EASE.enter }, outAt + 1.72);
      tl.to(guides, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.1, ease: EASE.enter }, outAt + 1.96);
    }, el);
    return () => ctx.revert();
  }, [active, reduced]);

  return (
    <div ref={root} data-uir className="uir">
      <div className="uir-copy">
        <h2 className="uir-title">
          <span data-uir-title>To nejlepší</span>
          <span data-uir-title>z obou světů</span>
        </h2>
        <p data-uir-sub className="uir-sub">Vstup rozumí záměru. Výstup dává přehled.</p>
      </div>

      <svg className="uir-link" viewBox="0 0 1920 1080" aria-hidden="true">
        <path data-uir-link d="M686 512 C 740 512, 744 596, 800 596 L 853 596" />
        <circle data-uir-dot cx="686" cy="512" r="8" />
        <circle data-uir-dot cx="853" cy="596" r="8" />
      </svg>

      <section data-uir-card="left" className="uir-card is-input">
        <img data-art className="uir-photo" src={asset("need-user.jpg")} alt="" />
        <div className="uir-veil" />
        <div data-uir-copy className="uir-card-copy">
          <div className="uir-kicker">Vstup, který rozumí</div>
          <div className="uir-head">Řeknu to lidsky</div>
          <div className="uir-note">Psaný i mluvený jazyk.</div>
        </div>
        <span data-uir-bubble className="uir-avatar"><Icon name="user" /></span>
        <div data-uir-bubble className="uir-bubble is-main">
          <Typed />
        </div>
        <div data-uir-bubble className="uir-bubble is-small">Chci hlavně dobrý obraz<br />a jednoduché ovládání.</div>
        <div data-uir-bubble className="uir-voice">
          <span className="uir-mic"><Icon name="mic" /></span>
          <span data-uir-wave className="uir-wave">
            {WAVE.map((h, i) => <i key={i} style={{ height: h }} />)}
          </span>
          <span className="uir-send"><Icon name="send" /></span>
        </div>
      </section>

      <section data-uir-card="right" className="uir-card is-output">
        <div data-uir-copy className="uir-card-copy">
          <div className="uir-kicker">Výstup, který máme rádi</div>
          <div className="uir-head">Vidím výsledek</div>
          <div className="uir-note">Karty, srovnání, video, přehled.</div>
        </div>

        <div className="uir-panels">
          <article data-uir-panel className="uir-panel is-pick">
            <span className="uir-pick-badge"><i><Icon name="spark" /></i>Doporučujeme pro vás</span>
            <Tv tone="lg" big />
            <strong className="uir-pick-name">LG OLED 55C5</strong>
            <span className="uir-pick-score"><em>★★★★★</em> 4,8 <small>(17)</small></span>
            <b className="uir-pick-price">19 990,-</b>
            <span className="uir-pick-btn">Zobrazit detail <i><Icon name="arrow" /></i></span>
            <ul className="uir-checks">
              {CHECKS.map((c) => (
                <li key={c} data-uir-row><i><Icon name="check" /></i>{c}</li>
              ))}
            </ul>
          </article>

          <article data-uir-panel className="uir-panel is-compare">
            <h3>Srovnání vybraných modelů</h3>
            {COMPARE.map((m) => (
              <div key={m.name} data-uir-row className={`uir-model${"best" in m && m.best ? " is-best" : ""}`}>
                <Tv tone={m.tone} />
                <div className="uir-model-info">
                  <b>{m.name}</b>
                  <span>{m.spec}</span>
                  <span className="uir-model-meta"><em>★</em> {m.score}<strong>{m.price}</strong></span>
                </div>
                <div className="uir-bars">
                  {["Obraz", "Cena", "Gaming"].map((label, i) => (
                    <span key={label} className="uir-bar-row">
                      <small>{label}</small>
                      <span className="uir-bar"><i data-uir-bar style={{ width: `${m.bars[i]}%` }} /></span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </article>

          <article data-uir-panel className="uir-panel is-guide">
            <h3>Vysvětlení a rádce</h3>
            <div className="uir-video">
              <span className="uir-video-art" />
              <b>OLED vs. Mini LED<br />za 60 sekund</b>
              <span className="uir-play"><Icon name="play" /></span>
            </div>
            {GUIDES.map((g) => (
              <div key={g.title} data-uir-row className="uir-guide">
                <i className="uir-guide-ico"><Icon name={g.icon} /></i>
                <span>
                  <b>{g.title}</b>
                  <small><i><Icon name="clock" /></i>{g.time}</small>
                </span>
                <i className="uir-guide-go"><Icon name="play" /></i>
              </div>
            ))}
          </article>
        </div>
      </section>
    </div>
  );
}
