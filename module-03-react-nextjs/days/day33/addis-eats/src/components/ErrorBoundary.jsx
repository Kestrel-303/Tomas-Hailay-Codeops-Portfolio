import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`[ErrorBoundary:${this.props.name ?? 'unnamed'}]`, error, errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (!hasError) {
      return children;
    }

    if (typeof fallback === 'function') {
      return fallback(error, this.handleReset);
    }

    if (fallback) {
      return fallback;
    }

    return (
      <div className="error-boundary-fallback" role="alert">
        <p>Something went wrong.</p>
        <button type="button" onClick={this.handleReset}>Try again</button>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  name: PropTypes.string,
};

export default ErrorBoundary;
