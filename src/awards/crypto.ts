import type { AwardsData } from "./types";
import cipher from "./awards.cipher.json";

// Session cache is bound to the exact ciphertext bundled in this build. Data decrypted by an
// older build (same tab, same origin; file:// shares one origin across copies) is discarded,
// otherwise a stale shape (e.g. 2 categories, no Changemakers) crashed the Awards slides.
const SESSION_PREFIX = "cx-awards-unlocked-";
const LEGACY_KEYS = ["cx-awards-unlocked-v1"];
const REQUIRED_CATEGORIES = ["impact", "pulse", "changemakers"] as const;

function fingerprint(): string {
  const pack = cipher as { iv?: string; ct?: string };
  const src = `${pack.iv ?? ""}:${(pack.ct ?? "").slice(0, 64)}:${(pack.ct ?? "").length}`;
  let h = 2166136261;
  for (let i = 0; i < src.length; i++) { h ^= src.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
}
const SESSION_KEY = `${SESSION_PREFIX}v2-${fingerprint()}`;

/** Fill optional arrays/maps and reject data that lacks what the Awards scenes require. */
export function normalizeAwards(raw: unknown): AwardsData | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as AwardsData;
  if (!Array.isArray(d.categories)) return null;
  const categories = d.categories
    .filter((c) => c && typeof c === "object" && typeof c.id === "string")
    .map((c) => ({ ...c, name: c.name ?? c.short ?? c.id, count: Number(c.count) || 0, jury: Array.isArray(c.jury) ? c.jury.filter(Boolean) : [], projects: Array.isArray(c.projects) ? c.projects.filter(Boolean) : [] }));
  if (!REQUIRED_CATEGORIES.every((id) => categories.some((c) => c.id === id))) return null;
  return {
    ...d,
    categories,
    criteria: Array.isArray(d.criteria) ? d.criteria : [],
    prizes: Array.isArray(d.prizes) ? d.prizes : [],
    logos: d.logos ?? {},
    people: d.people ?? {},
    logoRatio: d.logoRatio ?? {},
  };
}

function clearStale(): void {
  try {
    LEGACY_KEYS.forEach((k) => sessionStorage.removeItem(k));
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(SESSION_PREFIX) && k !== SESSION_KEY) sessionStorage.removeItem(k);
    }
  } catch { /* storage unavailable */ }
}

function b64(s: string): Uint8Array<ArrayBuffer> {
  const bin = atob(s);
  const out = new Uint8Array(new ArrayBuffer(bin.length));
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function awardsAreEncrypted(): boolean {
  return !("locked" in cipher && (cipher as { locked?: boolean }).locked) && "ct" in cipher;
}

export function loadSessionAwards(): AwardsData | null {
  clearStale();
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = normalizeAwards(JSON.parse(raw));
    if (!data) sessionStorage.removeItem(SESSION_KEY);
    return data;
  } catch {
    return null;
  }
}

export function clearSessionAwards(): void {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  clearStale();
}

export async function unlockAwards(password: string): Promise<AwardsData> {
  if (!awardsAreEncrypted()) {
    throw new Error("Awards ciphertext is not ready — set AWARDS_PASSWORD and re-encrypt.");
  }
  const pack = cipher as { salt: string; iv: string; ct: string; iter: number };
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: b64(pack.salt), iterations: pack.iter ?? 210_000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
  let plain: ArrayBuffer;
  try {
    plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: b64(pack.iv) }, key, b64(pack.ct));
  } catch {
    throw new Error("wrong");
  }
  const data = normalizeAwards(JSON.parse(new TextDecoder().decode(plain)));
  if (!data) throw new Error("Awards data is incomplete.");
  clearStale();
  // Caching is best effort only (Safari private mode / quota must never block the unlock).
  try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch { /* keep in memory only */ }
  return data;
}
