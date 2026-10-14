#!/usr/bin/env node
/**
 * Encrypt source/awards.plaintext.json → src/awards/awards.cipher.json
 * Key: PBKDF2-SHA256 (210k iters) from AWARDS_PASSWORD → AES-256-GCM.
 * Never writes the password or plaintext to the output.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { webcrypto } from "node:crypto";

const { subtle } = webcrypto;
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const plainPath = resolve(root, "source/awards.plaintext.json");
const outPath = resolve(root, "src/awards/awards.cipher.json");
const password = process.env.AWARDS_PASSWORD ?? "";

if (!password) {
  writeFileSync(outPath, JSON.stringify({
    v: 1,
    locked: true,
    note: "Set AWARDS_PASSWORD and run: node scripts/encrypt-awards.mjs",
  }, null, 2) + "\n");
  console.warn("[encrypt-awards] AWARDS_PASSWORD not set — wrote locked stub (no plaintext).");
  process.exit(0);
}

if (!existsSync(plainPath)) {
  console.error("[encrypt-awards] missing", plainPath);
  process.exit(1);
}

const plain = readFileSync(plainPath);
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const iv = webcrypto.getRandomValues(new Uint8Array(12));
const keyMaterial = await subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
const key = await subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: 210_000, hash: "SHA-256" },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"],
);
const cipher = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, key, plain));
const b64 = (u8) => Buffer.from(u8).toString("base64");
writeFileSync(outPath, JSON.stringify({
  v: 1,
  alg: "AES-GCM",
  kdf: "PBKDF2-SHA256",
  iter: 210_000,
  salt: b64(salt),
  iv: b64(iv),
  ct: b64(cipher),
}, null, 2) + "\n");
console.log("[encrypt-awards] wrote", outPath, "(" + cipher.byteLength, "bytes ciphertext)");
