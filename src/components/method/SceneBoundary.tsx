"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface SceneBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  onError: () => void;
}

/**
 * Fara granita asta, o eroare de WebGL pe un telefon vechi ia toata pagina cu ea.
 * Cu ea, sectiunea trece pe varianta statica si restul site-ului merge mai departe.
 */
export class SceneBoundary extends Component<SceneBoundaryProps, { hasError: boolean }> {
  override state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Scena 3D a esuat, se trece pe varianta statica", error, info);
    this.props.onError();
  }

  override render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
