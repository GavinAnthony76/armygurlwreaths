import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Link } from 'react-router-dom';

interface Props { children: ReactNode; }
interface State { hasError: boolean; errorKey: number; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, errorKey: 0 };

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState((prev) => ({ hasError: false, errorKey: prev.errorKey + 1 }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-cream-50 p-8">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-crimson-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-crimson-600 text-2xl font-bold">!</span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-slate-900 mb-2">Something went wrong</h1>
            <p className="text-slate-500 mb-6">We're sorry for the inconvenience. Please try refreshing the page.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="btn-primary"
              >
                Try Again
              </button>
              <Link to="/" className="btn-outline" onClick={() => this.setState({ hasError: false })}>
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return <div key={this.state.errorKey}>{this.props.children}</div>;
  }
}
