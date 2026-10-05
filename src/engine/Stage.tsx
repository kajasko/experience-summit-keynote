import { useEffect, useRef } from "react";

function isFullscreen() {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.fullscreenElement ||
      // Safari
      (document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement ||
      document.documentElement.classList.contains("is-fullscreen"),
  );
}

function usableSize(box: HTMLElement) {
  // In true fullscreen, trust the viewport — getBoundingClientRect can lag
  // a frame behind dock hide / browser chrome collapse.
  if (isFullscreen()) {
    const vv = window.visualViewport;
    const width = Math.max(window.innerWidth, document.documentElement.clientWidth, vv?.width ?? 0);
    const height = Math.max(window.innerHeight, document.documentElement.clientHeight, vv?.height ?? 0);
    return { width, height };
  }
  const rect = box.getBoundingClientRect();
  const fallbackH = Math.max(window.innerHeight, document.documentElement.clientHeight) - 72;
  const fallbackW = Math.max(window.innerWidth, document.documentElement.clientWidth);
  const width = [rect.width, box.clientWidth, fallbackW].find((n) => n > 80) ?? fallbackW;
  const height = [rect.height, box.clientHeight, fallbackH].find((n) => n > 80) ?? fallbackH;
  return { width, height };
}

export function Stage({ children, ...handlers }: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    const box = frame.current;
    if (!el || !box) return;

    const fit = () => {
      const fs = isFullscreen();
      const { width, height } = usableSize(box);
      // Classic: never upscale past 1 (keeps UI crisp beside the dock).
      // Fullscreen: allow scale > 1 so 1920×1080 truly fills large displays.
      const raw = Math.min(width / 1920, height / 1080);
      const scale = fs ? raw : Math.min(raw, 1);
      const safe = Number.isFinite(scale) && scale > 0.08 ? scale : 0.5;
      el.style.transform = `translate(-50%, -50%) scale(${safe})`;
      if (fs) {
        box.style.top = "0";
        box.style.right = "0";
        box.style.bottom = "0";
        box.style.left = "0";
        box.style.width = "100vw";
        box.style.height = "100vh";
        box.style.height = "100dvh";
      } else {
        box.style.top = "";
        box.style.right = "";
        box.style.bottom = "";
        box.style.left = "";
        box.style.width = "";
        box.style.height = "";
      }
    };

    const frameFit = () => {
      window.requestAnimationFrame(() => {
        fit();
        // Second pass after layout/dock hide settles.
        window.requestAnimationFrame(fit);
      });
    };

    fit();
    frameFit();
    const later = window.setTimeout(fit, 200);
    const ro = new ResizeObserver(frameFit);
    ro.observe(box);
    window.addEventListener("resize", frameFit);
    window.visualViewport?.addEventListener("resize", frameFit);

    const onFs = () => {
      frameFit();
      // Browsers often animate chrome away; re-fit after settle.
      window.setTimeout(frameFit, 50);
      window.setTimeout(frameFit, 150);
      window.setTimeout(frameFit, 320);
    };
    document.addEventListener("fullscreenchange", onFs);
    document.addEventListener("webkitfullscreenchange", onFs as EventListener);

    return () => {
      window.clearTimeout(later);
      ro.disconnect();
      window.removeEventListener("resize", frameFit);
      window.visualViewport?.removeEventListener("resize", frameFit);
      document.removeEventListener("fullscreenchange", onFs);
      document.removeEventListener("webkitfullscreenchange", onFs as EventListener);
      box.style.top = "";
      box.style.right = "";
      box.style.bottom = "";
      box.style.left = "";
      box.style.width = "";
      box.style.height = "";
    };
  }, []);

  return (
    <div className="stage-frame" ref={frame} {...handlers}>
      <div className="stage" ref={stage} id="stage">
        {children}
      </div>
    </div>
  );
}
