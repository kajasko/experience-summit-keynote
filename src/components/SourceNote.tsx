import { cite } from "../deck/sources";

export function SourceNote({ ids, visible }: { ids?: string[]; visible: boolean }) {
  if (!visible || !ids?.length) return null;
  const list = cite(ids);
  return (
    <div
      className="source"
      style={{
        position: "absolute",
        left: 80,
        bottom: 82,
        maxWidth: 980,
        padding: "10px 14px",
        borderRadius: 8,
        background: "rgba(244,246,241,.92)",
        color: "var(--text-deep)",
        zIndex: "var(--z-overlay)",
      }}
    >
      {list.map((s) => s.short).join(" · ")}
    </div>
  );
}
