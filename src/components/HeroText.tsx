import type { ReactNode } from "react";

export function HeroText({
  children,
  size = 160,
  reduced = false,
  align = "left",
  gradient,
}: {
  children: ReactNode;
  size?: number;
  reduced?: boolean;
  align?: "left" | "center";
  gradient?: boolean;
}) {
  void reduced;
  const useGradient = gradient ?? size >= 56;
  return (
    <div
      data-hero-text
      style={{
        fontSize: size,
        fontWeight: size >= 100 ? 800 : 700,
        letterSpacing: "-0.05em",
        lineHeight: 1.08,
        overflow: "visible",
        textAlign: align,
        width: align === "center" ? "100%" : undefined,
      }}
    >
      <div
        className={useGradient ? "display-gradient" : undefined}
        style={{ display: align === "center" ? "inline-block" : undefined }}
      >
        {children}
      </div>
    </div>
  );
}
