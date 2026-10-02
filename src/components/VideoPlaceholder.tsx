export function VideoPlaceholder({ stage = true }: { stage?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--paper)",
        borderRadius: 36,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ textAlign: "center", color: "var(--text-deep)" }}>
        <div className="label" style={{ color: "var(--teal)", marginBottom: 18 }}>
          Customer Journey Guide
        </div>
        <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: "-0.04em" }}>Video</div>
        {!stage && (
          <div style={{ marginTop: 24, fontSize: 14, color: "var(--muted)" }}>VIDEO CJG — ASSET REQUIRED</div>
        )}
      </div>
    </div>
  );
}
