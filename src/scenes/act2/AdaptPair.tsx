import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { EASE, MOTION as T } from "../../engine/motion";

/* Slide 33 · Personalizace — one product, four layers of personalization. */
const LAYERS = [
  { id: "rec", n: "01", label: "Doporučení" },
  { id: "var", n: "02", label: "Varianta" },
  { id: "cfg", n: "03", label: "Konfigurace" },
  { id: "det", n: "04", label: "Detail" },
] as const;

/* Slide 34 · Adaptace — one journey changing over time. */
const JOURNEY = ["Objevím", "Vyberu", "Koupím", "Používám", "Potřebuji pomoc"] as const;
const CHANGES = [
  { id: "transfer", label: "transfer" },
  { id: "checkin", label: "check-in" },
  { id: "room", label: "pokoj" },
  { id: "activity", label: "aktivitu" },
  { id: "comms", label: "komunikaci" },
] as const;

function Sneaker() {
  return (
    <svg className="adx-shoe" viewBox="0 0 600 300" aria-hidden="true">
      <defs>
        <linearGradient id="adxUpper" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b6d74" />
          <stop offset="1" stopColor="#03474d" />
        </linearGradient>
        <linearGradient id="adxSole" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e3e9e8" />
        </linearGradient>
        <linearGradient id="adxStripe" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d6e46a" />
          <stop offset="1" stopColor="#b5c93a" />
        </linearGradient>
        <radialGradient id="adxShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(3,56,61,0.28)" />
          <stop offset="1" stopColor="rgba(3,56,61,0)" />
        </radialGradient>
      </defs>
      <ellipse cx="290" cy="268" rx="270" ry="18" fill="url(#adxShadow)" />
      {/* upper */}
      <path d="M40 208 C34 184 50 168 94 160 C142 152 186 138 226 114 C254 98 286 88 322 86 L368 84 C394 82 412 72 432 66 C456 60 482 64 498 84 C514 104 522 152 524 208 Z" fill="url(#adxUpper)" />
      {/* toe cap */}
      <path d="M40 208 C34 184 50 168 94 160 C116 157 130 162 136 174 C142 188 140 200 144 208 Z" fill="#0f7f86" />
      {/* collar opening */}
      <path d="M334 88 C364 76 402 66 432 66 C428 80 404 94 362 98 C350 98 340 94 334 88 Z" fill="#022a2e" />
      {/* tongue */}
      <path d="M300 92 C312 70 332 58 350 60 C356 70 352 82 340 90 Z" fill="#0f7f86" />
      {/* heel counter */}
      <path d="M444 70 C472 66 496 84 506 112 C516 142 520 178 522 208 L462 208 C464 162 458 112 444 70 Z" fill="#023c41" />
      {/* heel pull tab */}
      <path d="M470 64 C480 50 494 50 500 60 L506 86 C498 80 488 78 478 80 Z" fill="#c3d552" />
      {/* soft highlight */}
      <path d="M100 168 C150 160 196 146 232 124" stroke="rgba(255,255,255,0.28)" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* side stripe — "preferovaná barva" */}
      <path data-adx-colour d="M168 200 C238 152 330 120 432 110 C444 128 440 150 424 160 C344 172 262 188 192 206 Z" fill="url(#adxStripe)" />
      {/* eyelets + laces */}
      <g stroke="#f4f6f1" strokeWidth="5" strokeLinecap="round">
        <path d="M232 122 L250 106" />
        <path d="M252 116 L272 98" />
        <path d="M274 108 L294 92" />
        <path d="M296 100 L316 86" />
      </g>
      <g fill="#022a2e">
        <circle cx="228" cy="126" r="3.4" />
        <circle cx="250" cy="118" r="3.4" />
        <circle cx="272" cy="110" r="3.4" />
        <circle cx="294" cy="102" r="3.4" />
      </g>
      {/* heel name — "Anna" */}
      <text data-adx-name x="474" y="146" textAnchor="middle" transform="rotate(-6 474 146)" className="adx-shoe-name">Anna</text>
      {/* midsole + outsole */}
      <path d="M30 204 L530 204 C538 220 532 238 514 240 L62 240 C38 240 24 224 30 204 Z" fill="url(#adxSole)" stroke="#d3dcdb" strokeWidth="1.5" />
      <path d="M44 240 L512 240 C510 252 500 258 486 258 L76 258 C58 258 46 252 44 240 Z" fill="#2a3b3d" />
      <path d="M60 222 L510 222" stroke="#c9d3d2" strokeWidth="1.5" strokeDasharray="6 7" />
    </svg>
  );
}

function FamilyIcon() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
      <circle cx="10" cy="8" r="3.4" fill="currentColor" />
      <circle cx="22" cy="8" r="3.4" fill="currentColor" />
      <circle cx="16" cy="17" r="2.6" fill="currentColor" />
      <path d="M4 27c.6-6 3-9 6-9s4 1.4 4.6 3M28 27c-.6-6-3-9-6-9s-4 1.4-4.6 3M11.4 28c.5-3.4 2.3-5.4 4.6-5.4s4.1 2 4.6 5.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function DelayIcon() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" aria-hidden="true">
      <path d="M3 17.5 13 15l6-10h3l-3 9 7-1.5 2-3h2.5L29 15l1.5 2.4H28L26 20l-7-1 3 9h-3l-6-10-10-.5Z" fill="currentColor" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path d="M13 6.5A5.2 5.2 0 0 0 3.4 5M3 9.5A5.2 5.2 0 0 0 12.6 11M3 2.5V5.5H6M13 13.5V10.5H10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PersonalFace() {
  return (
    <div data-face="who" className="adx-face adx-who">
      <ol className="adx-layers">
        {LAYERS.map((layer, i) => (
          <li key={layer.id} data-who-layer className="adx-layer">
            <i>{layer.n}</i>
            <b>{layer.label}</b>
            {i < LAYERS.length - 1 ? <span className="adx-layer-arrow" aria-hidden="true">→</span> : null}
          </li>
        ))}
      </ol>

      <section data-who-card className="adx-product">
        <svg className="adx-leads" viewBox="0 0 1140 636" aria-hidden="true">
          <path data-who-lead d="M318 118 C 350 170, 340 260, 348 334" />
          <path data-who-lead d="M822 140 C 760 190, 660 260, 605 305" />
          <path data-who-lead d="M318 500 C 380 470, 430 420, 477 389" />
          <path data-who-lead d="M822 512 C 810 440, 800 380, 787 330" />
          <circle data-who-dot cx="348" cy="334" r="9" />
          <circle data-who-dot cx="605" cy="305" r="9" />
          <circle data-who-dot cx="477" cy="389" r="9" />
          <circle data-who-dot cx="787" cy="330" r="9" />
        </svg>

        <div data-who-shoe className="adx-shoe-wrap"><Sneaker /></div>

        <div data-who-note className="adx-note is-rec">
          <i>01 · Doporučení</i>
          <b>doporučený model</b>
        </div>
        <div data-who-note className="adx-note is-var">
          <i>02 · Varianta</i>
          <b>preferovaná barva</b>
          <span className="adx-swatches" aria-hidden="true">
            <em style={{ background: "#2c3e50" }} />
            <em className="is-on" style={{ background: "#c3d552" }} />
            <em style={{ background: "#ef6a5b" }} />
            <em style={{ background: "#f4f6f1" }} />
          </span>
        </div>
        <div data-who-note className="adx-note is-cfg">
          <i>03 · Konfigurace</i>
          <b>velikost 38</b>
          <span className="adx-sizes" aria-hidden="true">
            <em>37</em>
            <em className="is-on">38</em>
            <em>39</em>
          </span>
        </div>
        <div data-who-note className="adx-note is-det">
          <i>04 · Detail</i>
          <b>„Anna“</b>
        </div>
      </section>
    </div>
  );
}

function AdaptFace() {
  return (
    <div data-face="now" className="adx-face adx-now">
      <div className="adx-journey">
        <span data-now-rail className="adx-rail" />
        <span data-now-pulse className="adx-pulse" />
        {JOURNEY.map((label, i) => (
          <div key={label} data-now-node className={`adx-node${i >= 3 ? " is-ahead" : ""}${i === 3 ? " is-now" : ""}`}>
            <i>{String(i + 1).padStart(2, "0")}</i>
            <b>{label}</b>
          </div>
        ))}
      </div>

      <svg className="adx-drop" viewBox="0 0 40 60" aria-hidden="true">
        <path data-now-pin d="M20 0 V 60" />
      </svg>

      <section data-now-moment className="adx-moment">
        <div className="adx-moment-row">
          <span className="adx-moment-icon"><FamilyIcon /></span>
          <span><em>Persona:</em> rodina s dětmi</span>
        </div>
        <div className="adx-moment-row is-alert">
          <span className="adx-moment-icon"><DelayIcon /></span>
          <span><em>Kontext:</em> let zpožděn 3 h</span>
        </div>
      </section>

      <div data-now-arrow className="adx-arrow" aria-hidden="true">↓</div>

      <section data-now-system className="adx-system">
        <div className="adx-system-label">Systém změní:</div>
        <div className="adx-changes">
          {CHANGES.map((c, i) => (
            <div key={c.id} className="adx-change-slot">
              <div data-now-change className="adx-change">
                <span className="adx-change-ico"><RefreshIcon /></span>
                {c.label}
              </div>
              {i < CHANGES.length - 1 ? <span className="adx-change-arrow" aria-hidden="true">→</span> : null}
            </div>
          ))}
        </div>
      </section>

      <p data-now-claim className="adx-claim">
        Adaptace není jen <span>„co dostanu“</span>. Systém průběžně mění, co se má stát dál.
      </p>
    </div>
  );
}

export function AdaptPair({ step, reduced }: { step: number; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<number | null>(null);
  const adapt = step === 1;

  useLayoutEffect(() => {
    const last = prev.current;
    prev.current = step;
    const el = root.current;
    if (!el) return;

    const q = (s: string) => gsap.utils.toArray<HTMLElement>(s, el);
    const titleA = el.querySelector<HTMLElement>("[data-title-a]");
    const titleB = el.querySelector<HTMLElement>("[data-title-b]");
    const faceA = el.querySelector<HTMLElement>("[data-face='who']");
    const faceB = el.querySelector<HTMLElement>("[data-face='now']");

    const who = {
      layers: q("[data-who-layer]"),
      card: q("[data-who-card]"),
      shoe: q("[data-who-shoe]"),
      notes: q("[data-who-note]"),
      leads: q("[data-who-lead]") as unknown as SVGPathElement[],
      dots: q("[data-who-dot]"),
    };
    const now = {
      rail: q("[data-now-rail]"),
      pulse: q("[data-now-pulse]"),
      nodes: q("[data-now-node]"),
      pin: q("[data-now-pin]") as unknown as SVGPathElement[],
      moment: q("[data-now-moment]"),
      arrow: q("[data-now-arrow]"),
      system: q("[data-now-system]"),
      changes: q("[data-now-change]"),
      claim: q("[data-now-claim]"),
    };
    const ahead = q(".adx-node.is-ahead");

    const ctx = gsap.context(() => {
      const leadLen = who.leads.map((p) => p.getTotalLength());
      const pinLen = now.pin.map((p) => p.getTotalLength());

      const settleWho = () => {
        gsap.set([...who.layers, ...who.card, ...who.shoe, ...who.notes, ...who.dots], { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        who.leads.forEach((p) => gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 }));
      };
      const settleNow = () => {
        gsap.set([...now.nodes, ...now.moment, ...now.arrow, ...now.system, ...now.claim], { autoAlpha: 1, x: 0, y: 0, scale: 1 });
        gsap.set(now.rail, { scaleX: 1 });
        gsap.set(now.pulse, { autoAlpha: 1, left: "70%" });
        now.pin.forEach((p) => gsap.set(p, { strokeDasharray: "none", strokeDashoffset: 0 }));
        gsap.set(now.changes, { autoAlpha: 1, x: 0 });
        now.changes.forEach((c) => c.classList.add("is-updated"));
        ahead.forEach((n) => n.classList.add("is-updated"));
      };
      const show = (personal: boolean) => {
        gsap.set(titleA, { autoAlpha: personal ? 1 : 0, y: 0 });
        gsap.set(titleB, { autoAlpha: personal ? 0 : 1, y: 0 });
        gsap.set(faceA, { autoAlpha: personal ? 1 : 0, y: 0 });
        gsap.set(faceB, { autoAlpha: personal ? 0 : 1, y: 0 });
        settleWho();
        settleNow();
      };

      if (reduced) {
        show(step === 0);
        return;
      }

      const tl = gsap.timeline();
      const enterTitle = step === 0 ? titleA : titleB;
      const enterFace = step === 0 ? faceA : faceB;
      const leaveTitle = step === 0 ? titleB : titleA;
      const leaveFace = step === 0 ? faceB : faceA;
      const morph = last !== null && last !== step && Math.abs(last - step) === 1;

      gsap.set([leaveTitle, leaveFace], { autoAlpha: morph ? 1 : 0, y: 0 });
      gsap.set([enterTitle, enterFace], { autoAlpha: 0, y: 16 });
      if (morph) {
        if (step === 0) settleNow(); else settleWho();
        tl.to([leaveTitle, leaveFace], { autoAlpha: 0, y: -10, duration: 0.28, ease: EASE.move }, 0);
      }
      const at = morph ? 0.22 : 0;
      tl.to(enterTitle, { autoAlpha: 1, y: 0, duration: T.enter, ease: EASE.enter }, at);
      tl.to(enterFace, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, at + 0.08);

      if (step === 0) {
        now.changes.forEach((c) => c.classList.remove("is-updated"));
        gsap.set(who.layers, { autoAlpha: 0, x: -12 });
        gsap.set(who.card, { autoAlpha: 0, y: 18 });
        gsap.set(who.shoe, { autoAlpha: 0, y: 26, scale: 0.94 });
        gsap.set(who.notes, { autoAlpha: 0, y: 10 });
        gsap.set(who.dots, { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" });
        who.leads.forEach((p, i) => gsap.set(p, { strokeDasharray: leadLen[i], strokeDashoffset: leadLen[i] }));
        tl.to(who.card, { autoAlpha: 1, y: 0, duration: 0.46, ease: EASE.enter }, at + 0.16);
        tl.to(who.shoe, { autoAlpha: 1, y: 0, scale: 1, duration: 0.62, ease: EASE.enter }, at + 0.3);
        who.layers.forEach((layer, i) => {
          const t = at + 0.82 + i * 0.36;
          tl.to(layer, { autoAlpha: 1, x: 0, duration: 0.32, ease: EASE.enter }, t);
          if (who.leads[i]) tl.to(who.leads[i], { strokeDashoffset: 0, duration: 0.42, ease: EASE.move }, t + 0.04);
          if (who.dots[i]) tl.to(who.dots[i], { autoAlpha: 1, scale: 1, duration: 0.24, ease: EASE.enter }, t + 0.34);
          if (who.notes[i]) tl.to(who.notes[i], { autoAlpha: 1, y: 0, duration: 0.32, ease: EASE.enter }, t + 0.1);
        });
      } else {
        now.changes.forEach((c) => c.classList.remove("is-updated"));
        ahead.forEach((n) => n.classList.remove("is-updated"));
        gsap.set(now.rail, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(now.nodes, { autoAlpha: 0, y: 12 });
        gsap.set(now.pulse, { autoAlpha: 0, left: "10%" });
        now.pin.forEach((p, i) => gsap.set(p, { strokeDasharray: pinLen[i], strokeDashoffset: pinLen[i] }));
        gsap.set(now.moment, { autoAlpha: 0, y: -22, scale: 0.96 });
        gsap.set(now.arrow, { autoAlpha: 0, y: -10 });
        gsap.set(now.system, { autoAlpha: 0, y: 14 });
        gsap.set(now.changes, { autoAlpha: 1, x: -14 });
        gsap.set(now.claim, { autoAlpha: 0, y: 12 });

        tl.to(now.rail, { scaleX: 1, duration: T.line, ease: EASE.move }, at + 0.14);
        tl.to(now.nodes, { autoAlpha: 1, y: 0, duration: 0.34, stagger: 0.08, ease: EASE.enter }, at + 0.2);
        // Time passes: the journey reaches "Používám".
        tl.to(now.pulse, { autoAlpha: 1, duration: 0.16 }, at + 0.7);
        tl.to(now.pulse, { left: "70%", duration: 0.9, ease: EASE.move }, at + 0.74);
        // The moment drops into the journey.
        tl.to(now.pin, { strokeDashoffset: 0, duration: 0.3, ease: EASE.move }, at + 1.62);
        tl.to(now.moment, { autoAlpha: 1, y: 0, scale: 1, duration: 0.46, ease: EASE.enter }, at + 1.7);
        tl.to(now.arrow, { autoAlpha: 1, y: 0, duration: 0.3, ease: EASE.enter }, at + 2.2);
        tl.to(now.system, { autoAlpha: 1, y: 0, duration: 0.38, ease: EASE.enter }, at + 2.34);
        // Each next step is re-planned in sequence.
        now.changes.forEach((c, i) => {
          const t = at + 2.62 + i * 0.2;
          tl.to(c, { x: 0, duration: 0.34, ease: EASE.move }, t);
          tl.call(() => c.classList.add("is-updated"), undefined, t + 0.12);
        });
        tl.call(() => ahead.forEach((n) => n.classList.add("is-updated")), undefined, at + 3.5);
        tl.to(now.claim, { autoAlpha: 1, y: 0, duration: 0.44, ease: EASE.enter }, at + 3.72);
      }
    }, el);
    return () => ctx.revert();
  }, [step, reduced]);

  return (
    <div ref={root} className={`adapt-pair adx${adapt ? " is-adapt" : " is-personal"}`}>
      <div className="adx-copy">
        <div data-title-a className="adx-copy-block">
          <div className="adx-kicker">Personalizace</div>
          <div className="adx-title">Pro mě<span className="adapt-dot">.</span></div>
          <div className="adx-sub">Produkt, obsah nebo nabídka se přizpůsobují tomu, kdo jsem.</div>
        </div>
        <div data-title-b className="adx-copy-block">
          <div className="adx-kicker">Adaptace</div>
          <div className="adx-title">
            Podle mě.
            <br />
            Právě teď<span className="adapt-dot">.</span>
          </div>
          <div className="adx-sub">Celá zkušenost reaguje na to, kdo jsem, co dělám a v jaké jsem situaci.</div>
        </div>
      </div>

      <div className="adx-stage">
        <PersonalFace />
        <AdaptFace />
      </div>
    </div>
  );
}
