import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl py-16 px-4">
          <div className="glass-panel rounded-3xl border border-danger/30 bg-danger/5 p-8 shadow-glow text-center">
            <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-danger" />
            <h1 className="mb-2 text-2xl font-bold text-white">Something went wrong</h1>
            <p className="mb-4 text-slate-300">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <details className="mt-4 rounded-lg bg-surface/50 p-4 text-left">
                <summary className="cursor-pointer text-sm font-medium text-slate-200">
                  Error Details
                </summary>
                <pre className="mt-2 overflow-auto text-xs text-slate-400">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.href = "/"}
              className="mt-6 rounded-full bg-accent-500 px-6 py-3 font-semibold text-surface shadow-neon transition hover:bg-accent-400"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
