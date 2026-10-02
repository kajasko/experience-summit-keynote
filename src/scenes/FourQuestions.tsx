export const QUESTIONS = [
  { n: "01", t: "KDO?", s: "Od UX designu k designu pro lidi i AI" },
  { n: "02", t: "CO?", s: "Od personalizace k adaptaci" },
  { n: "03", t: "PROČ VĚŘIT?", s: "Od pozornosti k důvěře" },
  { n: "04", t: "JAK?", s: "Od kanálů k orchestraci" },
] as const;

export const QUESTION_IN = [
  { left: 900, top: 82, width: 760, height: 112, rotation: 0 },
  { left: 900, top: 222, width: 760, height: 112, rotation: 0 },
  { left: 900, top: 362, width: 760, height: 112, rotation: 0 },
  { left: 900, top: 502, width: 760, height: 112, rotation: 0 },
] as const;

export const QUESTION_OPEN = [
  { left: 900, top: 56, width: 760, height: 176, rotation: 0 },
  { left: 900, top: 250, width: 760, height: 176, rotation: 0 },
  { left: 900, top: 444, width: 760, height: 176, rotation: 0 },
  { left: 900, top: 638, width: 760, height: 176, rotation: 0 },
] as const;

export function FourQuestionsIntro({
  eyebrow,
  sub,
}: {
  eyebrow: string;
  sub: string;
}) {
  return (
    <div data-challenge-title-a className="challenge-intro">
      <div className="challenge-eyebrow">{eyebrow}</div>
      <div className="challenge-lockup">
        <div data-challenge-four className="challenge-four">4</div>
        <div className="challenge-intro-title">
          Otázky pro<br /><strong>dnešek.</strong>
        </div>
      </div>
      <div className="challenge-intro-sub">{sub}</div>
    </div>
  );
}

export function FourQuestionCards({
  positions,
  active,
  coreTo,
  revealed = false,
}: {
  positions: typeof QUESTION_IN | typeof QUESTION_OPEN;
  active?: number;
  coreTo?: number;
  revealed?: boolean;
}) {
  return QUESTIONS.map((q, i) => {
    const on = active === i;
    const core = coreTo === i;
    const kdo = q.n === "01";
    return (
      <article
        key={q.n}
        data-question-card={q.n}
        className={`challenge-card${on ? " is-on" : ""}`}
        style={positions[i]}
      >
        <div
          className={`glass-chip${on ? " is-on" : ""}`}
          data-kdo-core={kdo && core ? "" : undefined}
          data-chapter-core={core ? "" : undefined}
        >
          {q.n}
        </div>
        <div className="challenge-card-title">{q.t}</div>
        <div className="challenge-card-desc" style={revealed ? { opacity: 1 } : undefined}>{q.s}</div>
        <div className="challenge-card-line" />
      </article>
    );
  });
}
