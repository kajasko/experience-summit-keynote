import { useEffect, useRef } from "react";

function dockInset() {
  if (typeof document === "undefined") return 72;
  if (document.fullscreenElement || document.documentElement.classList.contains("is-fullscreen")) {
    return 0;
  }
  return 72;
}

function usableSize(box: HTMLElement) {
  const rect = box.getBoundingClientRect();
  const inset = dockInset();
  const fallbackH = Math.max(window.innerHeight, document.documentElement.clientHeight) - inset;
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
      const { width, height } = usableSize(box);
      const scale = Math.min(width / 1920, height / 1080, 1);
      const safe = Number.isFinite(scale) && scale > 0.08 ? scale : 0.5;
      el.style.transform = `translate(-50%, -50%) scale(${safe})`;
    };
    fit();
    const frameFit = () => window.requestAnimationFrame(fit);
    frameFit();
    const later = window.setTimeout(fit, 200);
    const ro = new ResizeObserver(frameFit);
    ro.observe(box);
    window.addEventListener("resize", frameFit);
    window.visualViewport?.addEventListener("resize", frameFit);
    document.addEventListener("fullscreenchange", frameFit);
    document.addEventListener("webkitfullscreenchange", frameFit as EventListener);
    return () => {
      window.clearTimeout(later);
      ro.disconnect();
      window.removeEventListener("resize", frameFit);
      window.visualViewport?.removeEventListener("resize", frameFit);
      document.removeEventListener("fullscreenchange", frameFit);
      document.removeEventListener("webkitfullscreenchange", frameFit as EventListener);
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
