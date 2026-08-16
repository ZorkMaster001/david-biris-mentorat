"use client";

import { useEffect, useState } from "react";

export interface DeviceCapabilities {
  reducedMotion: boolean;
  saveData: boolean;
  slowNetwork: boolean;
  lowEndCpu: boolean;
  webgl: boolean;
  /** True once `detect()` has actually run. False means these are still guesses. */
  confirmed: boolean;
}

export const INITIAL_CAPABILITIES: DeviceCapabilities = {
  reducedMotion: false,
  saveData: false,
  slowNetwork: false,
  lowEndCpu: true,
  webgl: false,
  confirmed: false,
};

export function shouldPlayVideo(caps: DeviceCapabilities): boolean {
  // Video asteapta confirmarea: un cadru de redare care se opreste e nevinovat,
  // dar o cerere de retea pe save-data, odata trimisa, nu mai poate fi anulata.
  return caps.confirmed && !caps.reducedMotion && !caps.saveData && !caps.slowNetwork;
}

export function shouldRender3D(caps: DeviceCapabilities): boolean {
  return caps.webgl && !caps.lowEndCpu && !caps.reducedMotion && !caps.saveData;
}

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function detect(): DeviceCapabilities {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  const effectiveType = connection?.effectiveType ?? "4g";
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;

  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: connection?.saveData === true,
    slowNetwork: effectiveType === "slow-2g" || effectiveType === "2g" || effectiveType === "3g",
    lowEndCpu: navigator.hardwareConcurrency <= 4 || memory <= 4,
    webgl: detectWebgl(),
    confirmed: true,
  };
}

/**
 * Incepe conservator peste tot si corecteaza dupa montare.
 * Nici video, nici 3D nu pornesc inainte ca detect() sa confirme capabilitatile:
 * un cadru de 3D nepotrivit sau o cerere de retea pe save-data, odata trimisa,
 * nu mai pot fi anulate retroactiv.
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(INITIAL_CAPABILITIES);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCapabilities(detect());

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setCapabilities(detect());
    motionQuery.addEventListener("change", onChange);
    return () => motionQuery.removeEventListener("change", onChange);
  }, []);

  return capabilities;
}
