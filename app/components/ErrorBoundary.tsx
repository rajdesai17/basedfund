"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Only show error boundary for non-Coinbase API errors
    const isCoinbaseError = error.message.includes('coinbase.com') || 
                           error.message.includes('401') || 
                           error.message.includes('400');
    
    return {
      hasError: !isCoinbaseError,
      error: isCoinbaseError ? undefined : error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log all errors for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Suppress Coinbase API errors from user view
    const isCoinbaseError = error.message.includes('coinbase.com') || 
                           error.message.includes('401') || 
                           error.message.includes('400');
    
    if (isCoinbaseError) {
      console.warn('Suppressing Coinbase API error from user view:', error.message);
      return;
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-semibold text-red-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
} 