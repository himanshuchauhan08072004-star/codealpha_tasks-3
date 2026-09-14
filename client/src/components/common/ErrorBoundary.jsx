import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In production this is a good hook to send to an error-tracking service
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Something went wrong</h1>
          <p className="mt-2 max-w-sm text-sm text-ink/60">
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-navy-dark"
          >
            Refresh page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
