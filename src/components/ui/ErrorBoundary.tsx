import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Generic safety net: if a render-time error happens anywhere inside
 * `children` (for example, a third-party widget like Cloudflare Turnstile
 * throwing while being re-rendered after a retry), React would otherwise
 * unmount the ENTIRE app and leave a blank page. This boundary catches
 * that error locally and shows `fallback` instead, so the rest of the site
 * (and the rest of the form) keeps working.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('[ErrorBoundary] Caught a render error, showing fallback instead of blanking the page:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
