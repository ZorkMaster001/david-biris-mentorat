"use client";

import { useEffect, useState } from "react";

export interface DeviceCapabilities {
  reducedMotion: boolean;
  saveData: boolean;
  slowNetwork: boolean;
  lowEndCpu: boolean;
  webgl: boolean;
}

export const OPTIMISTIC_CAPABILITIES: DeviceCapabilities = {
  reducedMotion: false,
  saveData: false,
  slowNetwork: false,
  lowEndCpu: false,
  webgl: true,
};

export function shouldPlayVideo(caps: DeviceCapabilities): boolean {
  return !caps.reducedMotion && !caps.saveData && !caps.slowNetwork;
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
  };
}

/**
 * Porneste optimist ca sa nu blocheze primul render, apoi corecteaza dupa montare.
 * Consecinta: pe un device slab, 3D-ul nu se monteaza niciodata (se decide dupa efect),
 * iar video-ul poate porni si apoi sa fie oprit — acceptabil, e un singur cadru.
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>(OPTIMISTIC_CAPABILITIES);

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
