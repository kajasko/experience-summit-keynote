export function bindKeyboard(handlers: {
  next: () => void;
  prev: () => void;
  restart: () => void;
  fullscreen: () => void;
  notes: () => void;
  sources: () => void;
  escape: () => void;
  chapters?: () => void;
  sorter?: () => void;
}): () => void {
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
    if (e.key === " " && t?.tagName === "BUTTON") return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault();
      handlers.next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      handlers.prev();
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      handlers.restart();
    } else if (e.key === "f" || e.key === "F") {
      e.preventDefault();
      handlers.fullscreen();
    } else if (e.key === "n" || e.key === "N") {
      e.preventDefault();
      handlers.notes();
    } else if (e.key === "g" || e.key === "G") {
      e.preventDefault();
      handlers.chapters?.();
    } else if (e.key === "o" || e.key === "O") {
      e.preventDefault();
      handlers.sorter?.();
    } else if (e.key === "s" || e.key === "S") {
      e.preventDefault();
      handlers.sources();
    } else if (e.key === "Escape") {
      handlers.escape();
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}
