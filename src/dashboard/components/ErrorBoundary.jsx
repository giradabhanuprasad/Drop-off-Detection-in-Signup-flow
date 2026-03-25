import React from 'react';

// Wraps any child component subtree so crashes don't black out the whole app
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error(`[SignalFlow ErrorBoundary] Caught error in ${this.props.name || 'component'}:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel" style={{ padding: 24, borderLeft: '3px solid var(--danger)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: 4 }}>
            ⚠️ {this.props.name || 'Panel'} failed to render
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'monospace' }}>
            {this.state.error?.message}
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
