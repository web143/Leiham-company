"use client";
import React, { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ 
          background: "black", 
          color: "white", 
          padding: 20, 
          fontFamily: "monospace", 
          minHeight: "100vh",
          overflow: "auto"
        }}>
          <h2 style={{ color: "#0066B3" }}>Leiham Exception Tracker</h2>
          <p>Se ha detectado un error en el cliente:</p>
          <pre style={{ 
            whiteSpace: "pre-wrap", 
            fontSize: 12, 
            background: "#111", 
            padding: 15, 
            borderRadius: 8,
            border: "1px solid #333"
          }}>
            {this.state.error.message}
            {"\n\n"}
            {this.state.error.stack}
          </pre>
          <button 
            onClick={() => window.location.reload()}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "#0066B3",
              color: "white",
              border: "none",
              borderRadius: 5,
              cursor: "pointer"
            }}
          >
            Recargar página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
