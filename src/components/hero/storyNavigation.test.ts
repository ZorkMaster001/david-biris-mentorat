import { describe, expect, it } from "vitest";
import { nextIndex, prevIndex, tapZone } from "./storyNavigation";

describe("nextIndex", () => {
  it("advances", () => {
    expect(nextIndex(0, 5)).toBe(1);
  });

  it("wraps at the end", () => {
    expect(nextIndex(4, 5)).toBe(0);
  });

  it("stays put with a single slide", () => {
    expect(nextIndex(0, 1)).toBe(0);
  });
});

describe("prevIndex", () => {
  it("goes back", () => {
    expect(prevIndex(2, 5)).toBe(1);
  });

  it("wraps at the start", () => {
    expect(prevIndex(0, 5)).toBe(4);
  });
});

describe("tapZone", () => {
  it("treats the left third as previous", () => {
    expect(tapZone(50, 0, 360)).toBe("prev");
  });

  it("treats the rest as next", () => {
    expect(tapZone(200, 0, 360)).toBe("next");
    expect(tapZone(350, 0, 360)).toBe("next");
  });

  it("accounts for the element offset", () => {
    expect(tapZone(150, 100, 360)).toBe("prev");
    expect(tapZone(300, 100, 360)).toBe("next");
  });

  it("never returns prev for a zero-width element", () => {
    expect(tapZone(0, 0, 0)).toBe("next");
  });
});
