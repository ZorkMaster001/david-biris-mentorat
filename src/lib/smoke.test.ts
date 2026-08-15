import { describe, expect, it } from "vitest";

describe("toolchain", () => {
  it("runs typescript under vitest", () => {
    const value: string = "ok";
    expect(value).toBe("ok");
  });
});
