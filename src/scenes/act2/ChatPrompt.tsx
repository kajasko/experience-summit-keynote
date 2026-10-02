import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { EASE, MOTION as T } from "../../engine/motion";
import { asset } from "../../engine/assets";

const PROMPT = "„Vygeneruj fotku čerstvého Caesara s krutony.“";
const RESULT_H = 431;

export function ChatPrompt({ reduced }: { reduced: boolean }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const title = el.querySelector<HTMLElement>("[data-chat-title]");
    const glass = el.querySelector<HTMLElement>("[data-chat-glass]");
    const bubble = el.querySelector<HTMLElement>("[data-chat-bubble]");
    const typed = el.querySelector<HTMLElement>("[data-chat-typed]");
    const caret = el.querySelector<HTMLElement>("[data-chat-caret]");
    const result = el.querySelector<HTMLElement>("[data-chat-result]");
    const load = el.querySelector<HTMLElement>("[data-chat-load]");
    const photo = el.querySelector<HTMLElement>("[data-chat-caesar]");
    const robot = el.querySelector<HTMLElement>("[data-chat-robot]");

    if (reduced) {
      if (typed) typed.textContent = PROMPT;
      gsap.set([title, glass, bubble, result, photo, robot], { autoAlpha: 1, x: 0, y: 0, scale: 1 });
      if (result) gsap.set(result, { height: RESULT_H, marginTop: 24 });
      gsap.set(load, { autoAlpha: 0 });
      gsap.set(caret, { autoAlpha: 0 });
      return;
    }

    if (typed) typed.textContent = "";
    caret?.classList.add("is-scripted");

    gsap.set(title, { autoAlpha: 0, y: T.y });
    gsap.set(glass, { autoAlpha: 0, y: 18 });
    gsap.set(bubble, { autoAlpha: 0, y: 8, scale: 0.96, transformOrigin: "100% 0%" });
    gsap.set(result, { height: 0, autoAlpha: 0, marginTop: 0 });
    gsap.set(load, { autoAlpha: 1 });
    gsap.set(photo, { autoAlpha: 0, scale: 0.98, transformOrigin: "50% 50%" });
    gsap.set(robot, { autoAlpha: 0, x: 48 });
    gsap.set(caret, { opacity: 0 });

    const cursor = { n: 0 };
    const blink = 0.26;
    const typeAt = 0.52;
    const typeDur = 2.1;
    const afterType = typeAt + blink * 4 + 0.06 + typeDur;
    const loadAt = afterType + 0.22;
    const photoAt = loadAt + 1.55;

    const tl = gsap.timeline();
    tl.to(title, { autoAlpha: 1, y: 0, duration: T.enter, ease: EASE.enter }, 0);
    tl.to(glass, { autoAlpha: 1, y: 0, duration: T.enter, ease: EASE.enter }, 0.08);
    tl.to(robot, { autoAlpha: 1, x: 0, duration: T.camera, ease: EASE.move }, 0.16);
    tl.to(bubble, { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: EASE.enter }, 0.36);
    tl.set(caret, { opacity: 1 }, typeAt);
    tl.set(caret, { opacity: 0 }, typeAt + blink);
    tl.set(caret, { opacity: 1 }, typeAt + blink * 2);
    tl.set(caret, { opacity: 0 }, typeAt + blink * 3);
    tl.set(caret, { opacity: 1 }, typeAt + blink * 4);
    tl.to(cursor, {
      n: PROMPT.length,
      duration: typeDur,
      ease: "none",
      onUpdate: () => {
        if (typed) typed.textContent = PROMPT.slice(0, Math.round(cursor.n));
      },
    }, typeAt + blink * 4 + 0.06);
    tl.set(caret, { autoAlpha: 0 }, loadAt);
    tl.to(result, { height: RESULT_H, autoAlpha: 1, marginTop: 24, duration: 0.36, ease: EASE.enter }, loadAt);
    tl.to(photo, { autoAlpha: 1, scale: 1, duration: 0.52, ease: EASE.enter }, photoAt);
    tl.to(load, { autoAlpha: 0, duration: 0.28, ease: EASE.exit }, photoAt);

    return () => { tl.kill(); };
  }, [reduced]);

  return (
    <div ref={root} className="chat-prompt">
      <div data-chat-title className="chat-prompt-title">
        Chat ale není
        <br />
        produktová strategie
        <div className="chat-prompt-sub">
          Nelineární cesta neznamená, že všechno zavřeme do chatovacího okna.
        </div>
      </div>
      <div className="chat-prompt-stage">
        <div data-chat-glass className="chat-glass">
          <div data-chat-bubble className="chat-bubble">
            <span data-chat-typed />
            <span data-chat-caret className="caret is-scripted" aria-hidden="true" />
          </div>
          <div data-chat-result className="chat-result">
            <div data-chat-load className="chat-load" aria-hidden="true">
              <span /><span /><span />
            </div>
            <img data-art data-chat-caesar className="chat-caesar" src={asset("caesar.webp?v=full")} alt="" />
          </div>
        </div>
        <img data-art data-chat-robot className="chat-robot" src={asset("chat-robot.png?v=hq")} alt="" />
      </div>
    </div>
  );
}
