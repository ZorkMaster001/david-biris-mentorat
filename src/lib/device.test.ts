import { describe, expect, it } from "vitest";
import { shouldPlayVideo, shouldRender3D, type DeviceCapabilities } from "./device";

const capable: DeviceCapabilities = {
  reducedMotion: false,
  saveData: false,
  slowNetwork: false,
  lowEndCpu: false,
  webgl: true,
};

describe("shouldPlayVideo", () => {
  it("plays on a capable device", () => {
    expect(shouldPlayVideo(capable)).toBe(true);
  });

  it("refuses when the user asked for reduced motion", () => {
    expect(shouldPlayVideo({ ...capable, reducedMotion: true })).toBe(false);
  });

  it("refuses on data saver", () => {
    expect(shouldPlayVideo({ ...capable, saveData: true })).toBe(false);
  });

  it("refuses on a slow network", () => {
    expect(shouldPlayVideo({ ...capable, slowNetwork: true })).toBe(false);
  });

  it("still plays on a weak cpu — video decoding is hardware accelerated", () => {
    expect(shouldPlayVideo({ ...capable, lowEndCpu: true })).toBe(true);
  });
});

describe("shouldRender3D", () => {
  it("renders on a capable device", () => {
    expect(shouldRender3D(capable)).toBe(true);
  });

  it("refuses without webgl", () => {
    expect(shouldRender3D({ ...capable, webgl: false })).toBe(false);
  });

  it("refuses on a weak cpu", () => {
    expect(shouldRender3D({ ...capable, lowEndCpu: true })).toBe(false);
  });

  it("refuses on reduced motion", () => {
    expect(shouldRender3D({ ...capable, reducedMotion: true })).toBe(false);
  });

  it("refuses on data saver", () => {
    expect(shouldRender3D({ ...capable, saveData: true })).toBe(false);
  });
});
