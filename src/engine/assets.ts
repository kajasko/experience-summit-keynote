declare global {
  interface Window {
    /** Single-file offline build: every runtime file inlined as a data URI, keyed by its relative path. */
    __KEYNOTE_FILES__?: Record<string, string>;
  }
}

/** Any file from the public folder, e.g. `awards-icons/x.png`. Uses the inlined copy when present. */
export function publicUrl(path: string): string {
  // Cache-busting query (`?v=2`) is irrelevant for an inlined copy.
  const inlined = typeof window !== "undefined" ? window.__KEYNOTE_FILES__?.[path.split(/[?#]/)[0]] : undefined;
  return inlined ?? `${import.meta.env.BASE_URL}${path}`;
}

/** Dev: `/assets/…`. Offline/file:// build: `./assets/…`. Single-file build: inlined data URI. */
export function asset(file: string): string {
  return publicUrl(`assets/${file}`);
}
