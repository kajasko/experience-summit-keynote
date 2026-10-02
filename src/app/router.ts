export function parseRoute() {
  const params = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  return {
    act: params.get("act"),
    scene: params.get("scene"),
    step: params.get("step"),
  };
}
