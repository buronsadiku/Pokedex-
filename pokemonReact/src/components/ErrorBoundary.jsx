import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#ffebee', color: '#c62828' }}>
          <h1>⚠️ Something went wrong</h1>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Error Details (click to expand)</summary>
            <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
            <p><strong>Stack:</strong></p>
            <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              marginTop: '20px', 
              padding: '10px 20px', 
              backgroundColor: '#d32f2f', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

