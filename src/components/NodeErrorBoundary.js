import React from "react";

export class NodeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Node render error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "8px",
            background: "#fee2e2",
            border: "1px solid #ef4444",
            borderRadius: "6px",
            fontSize: "12px",
          }}
        >
          Node failed to render
        </div>
      );
    }

    return this.props.children;
  }
}
