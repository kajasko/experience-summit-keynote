export function parseHash(): { sceneId?: string; local?: number } {
  const raw = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(raw);
  const sceneId = params.get("scene") ?? undefined;
  const localRaw = params.get("step");
  const local = localRaw == null ? undefined : Number(localRaw);
  return { sceneId, local: Number.isFinite(local) ? local : undefined };
}

export function writeHash(sceneId: string, local: number, act: number): void {
  const next = `#act=${act}&scene=${sceneId}&step=${local}`;
  if (window.location.hash !== next) {
    history.replaceState(null, "", next);
  }
}

export function isDebug(): boolean {
  return new URLSearchParams(window.location.search).get("debug") === "1";
}
