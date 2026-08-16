export const SLIDE_DURATION_MS = 6000;
export const HOLD_THRESHOLD_MS = 250;
export const SWIPE_THRESHOLD_PX = 40;

export function nextIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  return (current + 1) % total;
}

export function prevIndex(current: number, total: number): number {
  if (total <= 0) return 0;
  return (current - 1 + total) % total;
}

export function tapZone(clientX: number, left: number, width: number): "prev" | "next" {
  if (width <= 0) return "next";
  return clientX - left < width / 3 ? "prev" : "next";
}
