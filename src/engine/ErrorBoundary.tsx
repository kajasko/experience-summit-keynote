import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Per-slide safety net. A render/effect error inside one slide shows a calm fallback slide
 * instead of unmounting the whole React root (which used to leave a black screen with dead
 * keyboard navigation). The deck controller and its key bindings live outside this boundary,
 * so arrows / space / PageDown / PageUp / clicks keep working. Resets on every step change.
 */
export class SlideErrorBoundary extends Component<{ resetKey: string; children: ReactNode }, { failed: string | null }> {
  state = { failed: null as string | null };
  static getDerivedStateFromError() {
    return { failed: "error" };
  }
  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[slide] render error on", this.props.resetKey, error, info.componentStack);
    this.setState({ failed: this.props.resetKey });
  }
  componentDidUpdate(prev: { resetKey: string }) {
    if (prev.resetKey !== this.props.resetKey && this.state.failed) this.setState({ failed: null });
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="scene slide-fallback" role="status">
          <div className="slide-fallback-msg">
            <div className="slide-fallback-title">Tento slide se nepodařilo zobrazit</div>
            <div className="slide-fallback-sub">Pokračujte šipkou vpřed nebo zpět.</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Last-resort net around the whole app: never leave a blank screen; any nav key or click retries. */
export class RootErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean; gen: number }> {
  state = { failed: false, gen: 0 };
  private retry = () => this.setState((s) => ({ failed: false, gen: s.gen + 1 }));
  private onKey = (e: KeyboardEvent) => {
    if (["ArrowRight", "ArrowLeft", "PageDown", "PageUp", " ", "Enter"].includes(e.key)) {
      e.preventDefault();
      this.retry();
    }
  };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[app] render error", error, info.componentStack);
  }
  componentDidUpdate(_: unknown, prev: { failed: boolean }) {
    if (this.state.failed && !prev.failed) window.addEventListener("keydown", this.onKey);
    if (!this.state.failed && prev.failed) window.removeEventListener("keydown", this.onKey);
  }
  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKey);
  }
  render() {
    if (this.state.failed) {
      return (
        <div className="slide-fallback is-root" role="status" onClick={this.retry}>
          <div className="slide-fallback-msg">
            <div className="slide-fallback-title">Prezentaci se nepodařilo zobrazit</div>
            <div className="slide-fallback-sub">Stiskněte šipku nebo klikněte pro obnovení.</div>
          </div>
        </div>
      );
    }
    return <div key={this.state.gen} style={{ display: "contents" }}>{this.props.children}</div>;
  }
}
