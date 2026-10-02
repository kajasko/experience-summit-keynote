import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { EASE, MOTION as T } from "../../engine/motion";
import { asset } from "../../engine/assets";

/**
 * Slide 40 / 75 (uiai · ui2): "AI řeší vstup. Výstup už ne."
 * Same TV story as 39/41: the request is easy to say, the answer is a wall of text.
 */

const PROMPT = "Pomoz mi vybrat nejlepší televizi do obýváku do 20 tisíc.";

const WALL = [
  "Jasně — i když „nejlepší“ je vždycky trochu ošidné, protože hodně záleží na tom, jak velký je obývák, jak daleko od televize sedíte, jestli koukáte hlavně večer, nebo i přes den na slunci, a jestli hrajete hry. Do 20 000 Kč se obecně vyplatí dívat spíš na 55\" než na 65\", protože u větších úhlopříček za tu cenu často dostanete horší panel. OLED má perfektní černou a kontrast, ale bývá dražší a ve velmi světlé místnosti může působit méně jasně; QLED a Mini LED jsou jasnější, ale hodně záleží na počtu stmívacích zón, což se v parametrech špatně porovnává.",
  "1) LG OLED (řada B nebo C) — skvělý obraz a webOS, ale ověřte aktuální cenu, někdy se dostane přes rozpočet. 2) Samsung QLED (řada Q60–Q80) — bezpečná volba, Tizen je přehledný, ale levnější modely nemají 120 Hz. 3) TCL / Hisense Mini LED — nejlepší poměr cena/výkon, pozor na kvalitu zpracování a délku aktualizací systému.",
  "Když to zúžím bez toho, abych věděl, jak přesně bydlíte: berte 55\", 4K, HDR10+ nebo Dolby Vision, ideálně 120 Hz a HDMI 2.1, pokud hrajete. Můžu vám udělat tabulku podle toho, jestli víc řešíte obraz, cenu, nebo ovládání — ale stejně vám neřeknu jednu pravdu, spíš tři kompromisy, a vy si vyberete ten, který vám nejmíň vadí. Pokud chcete, můžeme projít i zvuk, montáž na zeď, rozdíly mezi Google TV, Tizen a webOS, energetickou třídu, vstupní zpoždění pro konzole a to, jestli se vyplatí prodloužená záruka.",
];

function Spark() {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
      <path d="M10 3.5 11.6 8 16 9.6l-4.4 1.6L10 15.7l-1.6-4.5L4 9.6 8.4 8ZM17.5 13l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z" fill="currentColor" />
    </svg>
  );
}

export function UiWall({ active, reduced }: { active: boolean; reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const prev = useRef<boolean | null>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const was = prev.current;
    prev.current = active;
    const ctx = gsap.context(() => {
      const q = (s: string) => gsap.utils.toArray<HTMLElement>(s, el);
      const log = el.querySelector<HTMLElement>("[data-uiw-log]");
      const view = el.querySelector<HTMLElement>("[data-uiw-view]");
      const thumb = el.querySelector<HTMLElement>("[data-uiw-thumb]");
      const overflow = log && view ? Math.max(0, log.scrollHeight - view.clientHeight + 24) : 0;
      const travel = thumb?.parentElement ? Math.max(0, thumb.parentElement.clientHeight - thumb.clientHeight) : 0;
      if (!active) {
        if (was && !reduced) {
          gsap.set(el, { autoAlpha: 1 });
          gsap.to(el, { autoAlpha: 0, duration: 0.42, ease: EASE.exit });
        } else gsap.set(el, { autoAlpha: 0 });
        return;
      }
      gsap.set(el, { autoAlpha: 1 });
      // Settled: the answer has scrolled past the visible area.
      gsap.set(log, { y: -overflow });
      gsap.set(thumb, { y: travel });
      if (reduced) return;

      const title = q("[data-uiw-title]");
      const sub = q("[data-uiw-sub]");
      const left = q('[data-uiw-card="left"]');
      const right = q('[data-uiw-card="right"]');
      const copy = q("[data-uiw-copy]");
      const photo = q(".uiw-photo");
      const composer = q(".uiw-composer");
      const chars = q("[data-uiw-ch]");
      const send = q(".uiw-send");
      const me = q(".uiw-me");
      const typing = q(".uiw-typing");
      const words = q("[data-uiw-w]");
      const fade = q(".uiw-fade");

      gsap.set(el, { autoAlpha: 0 });
      gsap.set(title, { autoAlpha: 0, y: 24 });
      gsap.set(sub, { autoAlpha: 0, y: 12 });
      gsap.set([...left, ...right], { autoAlpha: 0, y: 28 });
      gsap.set(copy, { autoAlpha: 0, y: 10 });
      gsap.set(photo, { autoAlpha: 0, scale: 1.14 });
      gsap.set(composer, { autoAlpha: 0, y: 16 });
      gsap.set(chars, { autoAlpha: 0 });
      gsap.set(me, { autoAlpha: 0, y: 12 });
      gsap.set(typing, { autoAlpha: 0 });
      gsap.set(words, { autoAlpha: 0 });
      gsap.set(fade, { autoAlpha: 0 });
      gsap.set(log, { y: 0 });
      gsap.set(thumb, { y: 0 });

      const tl = gsap.timeline();
      tl.to(el, { autoAlpha: 1, duration: was === false ? 0.3 : 0.01 }, 0);
      tl.to(title, { autoAlpha: 1, y: 0, duration: T.enter, stagger: 0.1, ease: EASE.enter }, 0.04);
      // Input: saying it is easy.
      tl.to(left, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.enter }, 0.36);
      tl.to(photo, { autoAlpha: 1, scale: 1.08, duration: 1.1, ease: EASE.move }, 0.44);
      tl.to(copy[0], { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, 0.56);
      tl.to(composer, { autoAlpha: 1, y: 0, duration: 0.4, ease: EASE.enter }, 0.8);
      tl.to(chars, { autoAlpha: 1, duration: 0.01, stagger: 0.03, ease: "none" }, 1.1);
      const sentAt = 1.1 + chars.length * 0.03 + 0.2;
      tl.to(send, { scale: 0.86, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, sentAt);
      // Output: the answer pours in and does not stop.
      tl.to(right, { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.enter }, sentAt - 0.3);
      tl.to(copy[1], { autoAlpha: 1, y: 0, duration: 0.36, ease: EASE.enter }, sentAt - 0.16);
      tl.to(me, { autoAlpha: 1, y: 0, duration: 0.34, ease: EASE.enter }, sentAt + 0.12);
      tl.to(typing, { autoAlpha: 1, duration: 0.2 }, sentAt + 0.4);
      tl.to(typing, { autoAlpha: 0, duration: 0.2 }, sentAt + 1.1);
      const streamAt = sentAt + 1.2;
      const stream = words.length * 0.012;
      tl.to(words, { autoAlpha: 1, duration: 0.01, stagger: 0.012, ease: "none" }, streamAt);
      tl.to(log, { y: -overflow, duration: stream * 0.62, ease: "none" }, streamAt + stream * 0.38);
      tl.to(thumb, { y: travel, duration: stream * 0.62, ease: "none" }, streamAt + stream * 0.38);
      tl.to(fade, { autoAlpha: 1, duration: 0.4 }, streamAt + 0.6);
      tl.to(sub, { autoAlpha: 1, y: 0, duration: 0.42, ease: EASE.enter }, streamAt + stream * 0.5);
    }, el);
    return () => ctx.revert();
  }, [active, reduced]);

  return (
    <div ref={root} data-uiw className="uiw">
      <div className="uiw-copy">
        <h2 className="uiw-title">
          <span data-uiw-title>AI řeší vstup.</span>
          <span data-uiw-title>Výstup už ne.</span>
        </h2>
        <p data-uiw-sub className="uiw-sub">Rozumí jazyku. Vrací zeď textu.</p>
      </div>

      <section data-uiw-card="left" className="uiw-card is-left">
        <img data-art className="uiw-photo" src={asset("need-user.jpg")} alt="" />
        <div className="uiw-veil" />
        <div data-uiw-copy className="uiw-card-copy">
          <div className="uiw-kicker">Vstup · silný</div>
          <div className="uiw-head">Přirozený jazyk</div>
          <div className="uiw-note">Řeknu, co chci.</div>
        </div>
        <div className="uiw-composer">
          <span className="uiw-composer-ico"><Spark /></span>
          <p className="uiw-prompt">
            {Array.from(PROMPT).map((ch, i) => <span key={i} data-uiw-ch>{ch}</span>)}
            <i className="uiw-caret" />
          </p>
          <span className="uiw-send" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 19V5M6 11l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
        </div>
      </section>

      <section data-uiw-card="right" className="uiw-card is-right">
        <div data-uiw-copy className="uiw-card-copy">
          <div className="uiw-kicker is-weak">Výstup · slabý</div>
          <div className="uiw-head">Zeď textu</div>
          <div className="uiw-note">Neumím se v tom vyznat.</div>
        </div>
        <div className="uiw-chat">
          <header className="uiw-chat-bar">
            <span className="uiw-chat-ico"><Spark /></span>
            <b>AI asistent</b>
          </header>
          <div data-uiw-view className="uiw-view">
            <div data-uiw-log className="uiw-log">
              <div className="uiw-me">{PROMPT}</div>
              <div className="uiw-typing"><i /><i /><i /></div>
              <div className="uiw-bot">
                {WALL.map((para, pi) => (
                  <p key={pi}>
                    {para.split(" ").map((w, wi) => <span key={wi} data-uiw-w>{w} </span>)}
                  </p>
                ))}
              </div>
            </div>
            <span className="uiw-fade" />
            <span className="uiw-scroll"><i data-uiw-thumb /></span>
          </div>
        </div>
      </section>
    </div>
  );
}
