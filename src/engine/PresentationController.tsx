import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import gsap from "gsap";
import { scenes, steps, TOTAL, findIndex } from "../deck/deck";
import { registry } from "../scenes/registry";
import { Stage } from "./Stage";
import { PresenterOverlay } from "./PresenterOverlay";
import { DeckNav, type DeckMode } from "./DeckNav";
import { SourceNote } from "../components/SourceNote";
import { bindKeyboard } from "./keyboard";
import { isDebug, parseHash, writeHash } from "./hash";
import { preloadAround } from "./preload";
import { SlideContext } from "./slideContext";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";
import { SceneMotion } from "./SceneMotion";
import { EASE, MOTION as T } from "./motion";
import { isColorDip, isClovekMove, isKdoCoreExpand } from "./colorDip";

export function PresentationController() {
  const reduced = usePrefersReducedMotion();
  const start = useMemo(() => {
    const h = parseHash();
    if (h.sceneId && h.local != null) return findIndex(h.sceneId, h.local);
    return 0;
  }, []);
  const [index, setIndex] = useState(start);
  const [viewIndex, setViewIndex] = useState(start);
  const [notes, setNotes] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [mode, setMode] = useState<DeckMode>("play");
  const debug = isDebug();
  const veil = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const morph = useRef<HTMLDivElement>(null);
  const viewIndexRef = useRef(start);
  const modeRef = useRef<DeckMode>("play");
  const dipTween = useRef<gsap.core.Timeline | null>(null);
  modeRef.current = mode;
  const pointerType = useRef<string>("mouse");
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const current = steps[index];
  const view = steps[viewIndex];
  const scene = scenes.find((s) => s.id === view.sceneId)!;
  const Scene = registry[scene.component];

  // Warm the images of the current and the next few scenes only (mobile-friendly first load).
  useEffect(() => {
    preloadAround(current.sceneId);
  }, [current.sceneId]);

  useEffect(() => {
    writeHash(current.sceneId, current.local, current.act);
  }, [current]);

  useLayoutEffect(() => {
    viewIndexRef.current = viewIndex;
  }, [viewIndex]);

  useLayoutEffect(() => {
    if (veil.current) gsap.set(veil.current, { autoAlpha: 0 });
    if (core.current) gsap.set(core.current, { autoAlpha: 0 });
    if (morph.current) gsap.set(morph.current, { autoAlpha: 0 });
  }, []);

  useLayoutEffect(() => {
    const fromIndex = viewIndexRef.current;
    if (index === fromIndex) return;
    const from = steps[fromIndex];
    const to = steps[index];
    const veilEl = veil.current;
    const coreEl = core.current;
    const morphEl = morph.current;
    dipTween.current?.kill();
    const settle = () => {
      if (veilEl) gsap.set(veilEl, { autoAlpha: 0 });
      if (coreEl) gsap.set(coreEl, { autoAlpha: 0 });
      if (morphEl) gsap.set(morphEl, { autoAlpha: 0 });
      setViewIndex(index);
    };
    if (reduced || !from || !to) {
      settle();
      return;
    }

    const stageRect = (el: HTMLElement) => {
      const frame = el.parentElement!.getBoundingClientRect();
      const scale = 1920 / frame.width;
      return { frame, scale };
    };
    const boxOf = (selector: string, el: HTMLElement) => {
      const node = document.querySelector(selector) as HTMLElement | null;
      if (!node) return null;
      const { frame, scale } = stageRect(el);
      const rect = node.getBoundingClientRect();
      return {
        left: (rect.left - frame.left) * scale,
        top: (rect.top - frame.top) * scale,
        width: rect.width * scale,
        height: rect.height * scale,
      };
    };
    const chipBox = (el: HTMLElement) => {
      const box = boxOf("[data-chapter-core]", el);
      return box ? { ...box, borderRadius: 20 } : null;
    };

    if (isClovekMove(from, to) && morphEl) {
      const card = document.querySelector('[data-uxax-card="left"]') as HTMLElement | null;
      const title = document.querySelector(".uxax-title") as HTMLElement | null;
      const right = document.querySelector('[data-uxax-card="right"]') as HTMLElement | null;
      const src = card ? boxOf('[data-uxax-card="left"]', morphEl) : null;
      if (!card || !src) {
        settle();
        return;
      }
      const copy = card.querySelector(".uxax-copy") ?? card;
      morphEl.replaceChildren();
      Array.from(copy.children).forEach((child) => morphEl.appendChild(child.cloneNode(true)));
      morphEl.classList.add("is-card");
      gsap.set(morphEl, { autoAlpha: 1, borderRadius: 40, ...src });
      gsap.set(card, { autoAlpha: 0 });
      const inner = morphEl.querySelectorAll(".uxax-mega, .uxax-pills");
      // Match the destination card exactly so the handoff has no geometry jump.
      const grown = { left: 934, top: 320, width: 906, height: 620, borderRadius: 40 };
      const tl = gsap.timeline();
      dipTween.current = tl;
      if (title) tl.to(title, { autoAlpha: 0, duration: 0.32, ease: "power2.out" }, 0);
      if (right) tl.to(right, { autoAlpha: 0, duration: 0.32, ease: "power2.out" }, 0);
      tl.to(morphEl, { ...grown, duration: T.camera, ease: EASE.move }, 0);
      if (inner.length) tl.to(inner, { autoAlpha: 0, duration: 0.28, ease: "power2.out" }, 0.4);
      tl.add(() => {
        flushSync(() => setViewIndex(index));
        const destNode = document.querySelector("[data-clovek-core]") as HTMLElement | null;
        const dest = destNode ? boxOf("[data-clovek-core]", morphEl) : null;
        if (dest) gsap.set(morphEl, dest);
        if (destNode) gsap.set(destNode, { autoAlpha: 1 });
      });
      tl.to(morphEl, { autoAlpha: 0, duration: 0.24, ease: "power2.out" });
      tl.add(() => {
        morphEl.replaceChildren();
        morphEl.classList.remove("is-card");
      });
      return () => {
        tl.kill();
        morphEl.replaceChildren();
        morphEl.classList.remove("is-card");
      };
    }

    if (isClovekMove(to, from) && morphEl) {
      const start = boxOf("[data-clovek-core]", morphEl);
      gsap.set(morphEl, {
        autoAlpha: 1,
        borderRadius: 40,
        ...(start ?? { left: 500, top: 280, width: 920, height: 520 }),
      });
      morphEl.classList.add("is-card");
      flushSync(() => setViewIndex(index));
      const dest = boxOf('[data-uxax-card="left"]', morphEl);
      if (!dest) {
        morphEl.classList.remove("is-card");
        gsap.set(morphEl, { autoAlpha: 0 });
        return;
      }
      const tl = gsap.timeline();
      dipTween.current = tl;
      tl.to(morphEl, { ...dest, borderRadius: 40, duration: T.camera, ease: EASE.move });
      tl.to(morphEl, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
      tl.add(() => morphEl.classList.remove("is-card"));
      return () => {
        tl.kill();
        morphEl.classList.remove("is-card");
      };
    }

    if (isKdoCoreExpand(from, to) && coreEl) {
      const box = chipBox(coreEl);
      if (!box) {
        settle();
        return;
      }
      gsap.set(coreEl, { autoAlpha: 1, ...box });
      const tl = gsap.timeline();
      dipTween.current = tl;
      tl.to(coreEl, {
        left: 0,
        top: 0,
        width: 1920,
        height: 1080,
        borderRadius: 0,
        duration: T.camera,
        ease: EASE.move,
      });
      tl.add(() => {
        flushSync(() => setViewIndex(index));
      });
      tl.to(coreEl, { autoAlpha: 0, duration: 0.36, ease: "power2.out" });
      return () => {
        tl.kill();
      };
    }

    if (isKdoCoreExpand(to, from) && coreEl) {
      flushSync(() => setViewIndex(index));
      const box = chipBox(coreEl);
      if (!box) {
        if (veilEl) gsap.set(veilEl, { autoAlpha: 0 });
        gsap.set(coreEl, { autoAlpha: 0 });
        return;
      }
      gsap.set(coreEl, { autoAlpha: 1, left: 0, top: 0, width: 1920, height: 1080, borderRadius: 0 });
      const tl = gsap.timeline();
      dipTween.current = tl;
      tl.to(coreEl, { ...box, duration: T.camera, ease: EASE.move });
      tl.to(coreEl, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
      return () => {
        tl.kill();
      };
    }

    if (isColorDip(from, to) && veilEl) {
      const tl = gsap.timeline();
      dipTween.current = tl;
      tl.fromTo(veilEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.in" });
      tl.add(() => {
        flushSync(() => setViewIndex(index));
      });
      tl.to(veilEl, { autoAlpha: 0, duration: 0.46, ease: "power2.out" }, "+=0.1");
      return () => {
        tl.kill();
      };
    }

    settle();
  }, [index, reduced]);

  useEffect(() => {
    const onHash = () => {
      const h = parseHash();
      if (h.sceneId && h.local != null) setIndex(findIndex(h.sceneId, h.local));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (delta: number | "restart") => {
    setIndex((i) => {
      if (delta === "restart") {
        const local = steps[i]?.local ?? 0;
        return i - local;
      }
      return Math.max(0, Math.min(TOTAL - 1, i + delta));
    });
  };

  const jumpTo = (next: number) => {
    dipTween.current?.kill();
    const clamped = Math.max(0, Math.min(TOTAL - 1, next));
    setIndex(clamped);
    setViewIndex(clamped);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) void document.documentElement.requestFullscreen();
    else void document.exitFullscreen();
  };

  useLayoutEffect(() => {
    return bindKeyboard({
      next: () => { if (modeRef.current === "play") go(1); },
      prev: () => { if (modeRef.current === "play") go(-1); },
      restart: () => go("restart"),
      fullscreen: toggleFullscreen,
      notes: () => setNotes((v) => !v),
      sources: () => setShowSources((v) => !v),
      chapters: () => setMode((m) => (m === "chapters" ? "play" : "chapters")),
      sorter: () => setMode((m) => (m === "sorter" ? "play" : "sorter")),
      escape: () => {
        if (modeRef.current !== "play") {
          setMode("play");
          return;
        }
        if (document.fullscreenElement) void document.exitFullscreen();
        setNotes(false);
      },
    });
  }, []);

  return (
    <>
      <Stage
        onPointerDown={(e) => { pointerType.current = e.pointerType; swiped.current = false; }}
        onTouchStart={(e) => {
          const t = e.touches[0];
          touchStart.current = e.touches.length === 1 && t ? { x: t.clientX, y: t.clientY } : null;
        }}
        onTouchEnd={(e) => {
          const start = touchStart.current;
          touchStart.current = null;
          const t = e.changedTouches[0];
          if (!start || !t || modeRef.current !== "play") return;
          const dx = t.clientX - start.x;
          const dy = t.clientY - start.y;
          // Horizontal swipe: left = next, right = previous.
          if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            swiped.current = true;
            go(dx < 0 ? 1 : -1);
          }
        }}
        onClick={(e) => {
          if (swiped.current) { swiped.current = false; return; }
          if (modeRef.current !== "play") return;
          if ((e.target as HTMLElement).closest(".presenter")) return;
          // Touch: tap the left third to go back, anywhere else to go forward. Mouse keeps click = next.
          if (pointerType.current === "touch" || pointerType.current === "pen") {
            const box = e.currentTarget.getBoundingClientRect();
            if (e.clientX - box.left < box.width / 3) { go(-1); return; }
          }
          go(1);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          if (modeRef.current !== "play") return;
          go(-1);
        }}
      >
        {debug && <div className="debug-safe" />}
        <div
          style={{ position: "absolute", inset: 0 }}
        >
          <SceneMotion key={view.sceneId} step={view} reduced={reduced}>
            <SlideContext.Provider value={view}>
              <Scene step={view.local} reduced={reduced} sceneId={view.sceneId} />
            </SlideContext.Provider>
          </SceneMotion>
          <SourceNote ids={view.sources} visible={showSources} />
          <div ref={morph} className="scene-morph" aria-hidden="true" />
          <div ref={core} className="scene-core" aria-hidden="true" />
          <div ref={veil} className="scene-dip" aria-hidden="true" />
        </div>
      </Stage>
      <DeckNav
        mode={mode}
        onMode={setMode}
        index={index}
        total={TOTAL}
        current={current}
        onJump={jumpTo}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onFullscreen={toggleFullscreen}
      />
      {notes && (
        <PresenterOverlay
          step={current}
          nextTitle={steps[index + 1]?.title ?? ""}
          showSources={showSources}
        />
      )}
      {debug && (
        <div className="debug">
          {`${index + 1}/${TOTAL}\n${current.sceneId}:${current.local}\n${current.id}\npage ${current.sourcePage ?? "—"}`}
        </div>
      )}
    </>
  );
}
