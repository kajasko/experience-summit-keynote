import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { AwardsData } from "./types";
import { awardsAreEncrypted, clearSessionAwards, loadSessionAwards, unlockAwards } from "./crypto";

type Ctx = {
  data: AwardsData | null;
  ready: boolean;
  encrypted: boolean;
  unlock: (password: string) => Promise<"ok" | "wrong" | "missing">;
  lock: () => void;
};

const AwardsCtx = createContext<Ctx | null>(null);

export function AwardsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AwardsData | null>(() => (typeof sessionStorage === "undefined" ? null : loadSessionAwards()));
  const encrypted = awardsAreEncrypted();
  const unlock = useCallback(async (password: string) => {
    if (!encrypted) return "missing" as const;
    try {
      const next = await unlockAwards(password);
      setData(next);
      return "ok" as const;
    } catch (err) {
      if (err instanceof Error && err.message === "wrong") return "wrong" as const;
      return "missing" as const;
    }
  }, [encrypted]);
  const lock = useCallback(() => {
    clearSessionAwards();
    setData(null);
  }, []);
  const value = useMemo(() => ({ data, ready: Boolean(data), encrypted, unlock, lock }), [data, encrypted, unlock, lock]);
  return <AwardsCtx.Provider value={value}>{children}</AwardsCtx.Provider>;
}

export function useAwards(): Ctx {
  const ctx = useContext(AwardsCtx);
  if (!ctx) throw new Error("useAwards outside provider");
  return ctx;
}
