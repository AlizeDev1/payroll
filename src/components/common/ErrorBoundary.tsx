import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enterprise Production Error Boundary
 * Prevents a single component or API rendering failure from crashing the entire application.
 * Captures stack traces, displays graceful recovery UI, and provides telemetry logging.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    // In production, dispatch to monitoring service (Sentry / Datadog / LogRocket)
    console.error('Enterprise Error Boundary caught an unhandled exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-[#F8FAFC] dark:bg-[#0B1120]">
          <div className="max-w-md w-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900/60">
              <AlertTriangle className="w-6 h-6 stroke-[2]" />
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 font-heading">
                {this.props.fallbackTitle || 'Module Encountered an Unexpected Issue'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                The application prevented a full crash. Your session remains secure. You can reload this module or return to the main dashboard.
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="text-left p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-rose-600 dark:text-rose-400 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex items-center justify-center gap-2.5 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => (window.location.href = '/dashboard')}
                leftIcon={<Home className="w-3.5 h-3.5" />}
              >
                Dashboard
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={this.handleReset}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Reload Module
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
