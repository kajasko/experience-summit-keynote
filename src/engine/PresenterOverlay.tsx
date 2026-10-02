import { useEffect, useRef, useState } from "react";
import type { FlatStep } from "../deck/types";
import { cite } from "../deck/sources";

export function PresenterOverlay({
  step,
  nextTitle,
  showSources,
}: {
  step: FlatStep;
  nextTitle: string;
  showSources: boolean;
}) {
  const started = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setElapsed(Math.floor((Date.now() - started.current) / 1000)), 1000);
    return () => window.clearInterval(t);
  }, []);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const src = cite(step.sources);
  return (
    <aside className="presenter">
      <div className="meta">
        Act {step.act} · {step.actName} · {step.sceneId} · {step.local + 1}/{step.sceneLength} · {mm}:{ss}
      </div>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{step.title}</div>
      <div style={{ opacity: 0.88 }}>{step.speakerNote}</div>
      <div style={{ marginTop: 10, opacity: 0.55 }}>Další: {nextTitle || "—"}</div>
      {showSources && src.length > 0 && (
        <div style={{ marginTop: 10, color: "#c9db3c" }}>
          {src.map((s) => (
            <div key={s.id}>{s.full}</div>
          ))}
        </div>
      )}
    </aside>
  );
}
