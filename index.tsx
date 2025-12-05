import React from 'react';
import ReactDOM from 'react-dom/client';
// In a no-build environment, we must specify the extension
import App from './App.tsx';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-50">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full border border-red-100">
            <h1 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page or try again later.</p>
            <div className="bg-red-50 p-4 rounded-lg text-left overflow-auto text-xs text-red-800 font-mono max-h-40">
              {this.state.error?.message}
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors w-full"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);