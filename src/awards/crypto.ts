import type { AwardsData } from "./types";
import cipher from "./awards.cipher.json";

const SESSION_KEY = "cx-awards-unlocked-v1";

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
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AwardsData) : null;
  } catch {
    return null;
  }
}

export function clearSessionAwards(): void {
  sessionStorage.removeItem(SESSION_KEY);
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
  const data = JSON.parse(new TextDecoder().decode(plain)) as AwardsData;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  return data;
}
