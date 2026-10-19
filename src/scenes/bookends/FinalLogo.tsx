import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { SceneProps } from "../../deck/types";

const CUT = "M 48.8789 42.8305 C 52.1072 38.4252 54.015 32.9915 54.015 27.1113 C 54.015 21.2311 52.1075 15.7968 48.8789 11.3921 L 39.9826 20.2883 C 41.0844 22.3168 41.7101 24.6406 41.7101 27.1113 C 41.7101 29.5814 41.0842 31.9058 39.9826 33.9343 L 48.8789 42.8305 Z";
const RING = "M 27.3911 0.4875 C 12.6872 0.4875 0.7673 12.4074 0.7673 27.1113 C 0.7673 41.8152 12.6872 53.7352 27.3911 53.7352 C 33.2713 53.7352 38.7056 51.8274 43.1104 48.5991 L 34.2141 39.7028 C 32.1856 40.8043 29.8618 41.4299 27.3911 41.4299 C 19.4833 41.4299 13.0725 35.0191 13.0725 27.1113 C 13.0725 19.2032 19.4833 12.7924 27.3911 12.7924 C 29.8615 12.7924 32.1856 13.4183 34.2141 14.5198 L 43.1104 5.6233 C 38.705 2.3952 33.2713 0.4875 27.3911 0.4875 Z";

function Shine() {
  return (
    <svg viewBox="-1 -1 56 56" aria-hidden="true">
      <defs>
        <clipPath id="fl-shine-clip"><path d={RING} /><path d={CUT} /></clipPath>
        <linearGradient id="fl-shine-g" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g clipPath="url(#fl-shine-clip)">
        <rect className="fl-shine-bar" x="-30" y="-20" width="22" height="100" fill="url(#fl-shine-g)" transform="rotate(18 27 27)" />
      </g>
    </svg>
  );
}

function Mark({ variant }: { variant: "cl" | "es" }) {
  const id = `fl-${variant}`;
  return (
    <svg viewBox="-1 -1 56 56" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1">
          {variant === "cl" ? (<><stop offset="0" stopColor="#ffffff" /><stop offset="1" stopColor="#e3ece9" /></>)
            : (<><stop offset="0" stopColor="#2aa6ad" /><stop offset=".55" stopColor="#0b7a83" /><stop offset="1" stopColor="#005860" /></>)}
        </linearGradient>
        <linearGradient id={`${id}-cut`} x1="0" y1="0" x2="0" y2="1">
          {variant === "cl" ? (<><stop offset="0" stopColor="#d6e46a" /><stop offset="1" stopColor="#c3d552" /></>)
            : (<><stop offset="0" stopColor="#cf4a58" /><stop offset="1" stopColor="#a32f3b" /></>)}
        </linearGradient>
      </defs>
      <path d={RING} fill={`url(#${id}-ring)`} />
      <path d={CUT} fill={`url(#${id}-cut)`} />
    </svg>
  );
}

/** Úplný závěr · logo Clientology jemně zazáří a přelije se do barev Experience Summitu. */
export function FinalLogo({ reduced }: SceneProps) {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const ctx = gsap.context((self) => {
      const end = () => {
        gsap.set(q(".fl-cl, .fl-glow-cl, .fl-amb-cl, .fl-shine"), { opacity: 0 });
        gsap.set(q(".fl-es, .fl-amb-es"), { opacity: 1 });
        gsap.set(q(".fl-glow-es"), { opacity: 0.4 });
        gsap.set(q(".fl-mark"), { opacity: 1, scale: 0.84, y: -80 });
        gsap.set(q(".fl-word > *"), { opacity: 1, y: 0 });
      };
      if (reduced) { end(); return; }
      gsap.set(q(".fl-es, .fl-glow-es, .fl-glow-cl, .fl-amb-es, .fl-shine"), { opacity: 0 });
      gsap.set(q(".fl-mark"), { opacity: 0, scale: 0.94, y: 0 });
      gsap.set(q(".fl-word > *"), { opacity: 0, y: 24 });
      const tl = gsap.timeline({ defaults: { ease: "sine.inOut" } });
      tl.to(q(".fl-mark"), { opacity: 1, scale: 1, duration: 1.6, ease: "power2.out" }, 0.2)
        .to(q(".fl-glow-cl"), { opacity: 0.7, duration: 1.8 }, 0.5)
        .to(q(".fl-glow-cl"), { opacity: 0.45, duration: 1.2 }, 2.3)
        // recolor: Clientology → Experience Summit gradient
        .to(q(".fl-es"), { opacity: 1, duration: 2.2 }, 3.0)
        .set(q(".fl-cl"), { opacity: 0 }, 5.3)
        .to(q(".fl-glow-es"), { opacity: 0.6, duration: 2.2 }, 3.0)
        .to(q(".fl-glow-cl"), { opacity: 0, duration: 2.0 }, 3.2)
        .to(q(".fl-amb-es"), { opacity: 1, duration: 2.6 }, 3.0)
        .to(q(".fl-amb-cl"), { opacity: 0, duration: 2.6 }, 3.0)
        .to(q(".fl-mark"), { scale: 0.84, y: -80, duration: 1.6, ease: "power2.inOut" }, 5.4)
        .to(q(".fl-word > *"), { opacity: 1, y: 0, duration: 1.2, stagger: 0.25, ease: "power2.out" }, 6.0)
        .to(q(".fl-glow-es"), { opacity: 0.4, duration: 1.6 }, 6.2)
        .add(() => self.add(() => {
          // Infinite idle loop: glow breathes (clearly visible on a projector), mark swells ~3 %,
          // a soft light sheen crosses the mark every few breaths.
          const breathe = gsap.timeline({ repeat: -1, yoyo: true, defaults: { duration: 1.8, ease: "sine.inOut" } });
          breathe.fromTo(q(".fl-glow-es"), { opacity: 0.32, scale: 1.02 }, { opacity: 0.95, scale: 1.14 }, 0)
            .fromTo(q(".fl-mark"), { scale: 0.84 }, { scale: 0.865 }, 0)
            .fromTo(q(".fl-amb-es"), { opacity: 0.75 }, { opacity: 1 }, 0);
          gsap.set(q(".fl-shine"), { opacity: 1 });
          gsap.timeline({ repeat: -1, repeatDelay: 4.4, delay: 0.6 })
            .fromTo(q(".fl-shine-bar"), { x: 0 }, { x: 92, duration: 2.6, ease: "sine.inOut" });
        }));
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div ref={root} className={`scene is-dark fl-scene${reduced ? " is-reduced" : ""}`}>
      <div className="fl-amb fl-amb-cl" aria-hidden="true" />
      <div className="fl-amb fl-amb-es" aria-hidden="true" />
      <div className="fl-center">
        <div className="fl-mark">
          <div className="fl-layer fl-glow fl-glow-cl"><Mark variant="cl" /></div>
          <div className="fl-layer fl-glow fl-glow-es"><Mark variant="es" /></div>
          <div className="fl-layer fl-cl"><Mark variant="cl" /></div>
          <div className="fl-layer fl-es"><Mark variant="es" /></div>
          <div className="fl-layer fl-shine"><Shine /></div>
        </div>
        <div className="fl-word" aria-label="Experience Summit by Clientology">
          <div className="fl-word-main">Experience Summit</div>
          <div className="fl-word-by">by Clientology</div>
        </div>
      </div>
    </div>
  );
}
