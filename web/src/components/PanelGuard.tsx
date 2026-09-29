"use client";
/**
 * Keeps a failure inside one panel (a word look-up, the vocabulary list, Echoes…): the panel says
 * so and can be closed, and the page around it, the text being read, carries on.
 */
import { Component, type ReactNode } from "react";

interface Props { name: string; className?: string; onClose?: () => void; children: ReactNode }

export default class PanelGuard extends Component<Props, { failed: string | null }> {
  state = { failed: null as string | null };
  static getDerivedStateFromError(e: Error) { return { failed: e.message || "unknown error" }; }
  componentDidCatch(e: Error) { console.error(e); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <aside role="alert" className={this.props.className} style={{ padding: 18, border: "1px solid var(--rule)", borderRadius: "var(--radius)", background: "var(--surface)", display: "grid", alignContent: "start", gap: 10 }}>
        <p><b>The {this.props.name} could not be shown.</b> The rest of the page still works.</p>
        <p className="muted" style={{ fontSize: "0.85rem", overflowWrap: "anywhere" }}>{this.state.failed}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="button" className="btn small" onClick={() => this.setState({ failed: null })}>Try again</button>
          {this.props.onClose && <button type="button" className="btn small ghost" onClick={() => { this.setState({ failed: null }); this.props.onClose!(); }}>Close</button>}
        </div>
      </aside>
    );
  }
}
