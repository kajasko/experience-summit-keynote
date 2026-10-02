export function Cursor({ on = true }: { on?: boolean }) {
  if (!on) return null;
  return <span className="caret" aria-hidden="true" />;
}
