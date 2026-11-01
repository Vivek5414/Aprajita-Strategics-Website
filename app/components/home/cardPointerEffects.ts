import type { PointerEvent as ReactPointerEvent } from "react";

export function updateCardPointer(
  event: ReactPointerEvent<HTMLLIElement>,
  active: boolean,
) {
  const card = event.currentTarget;
  const hasFinePointer =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (
    !active ||
    !hasFinePointer ||
    reduceMotion ||
    event.pointerType !== "mouse"
  ) {
    card.style.setProperty("--pointer-x", "50%");
    card.style.setProperty("--pointer-y", "45%");
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    return;
  }

  const bounds = card.getBoundingClientRect();
  if (bounds.width === 0 || bounds.height === 0) return;

  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;

  card.style.setProperty("--pointer-x", `${x * 100}%`);
  card.style.setProperty("--pointer-y", `${y * 100}%`);
  card.style.setProperty("--tilt-x", `${(0.5 - y) * 4}deg`);
  card.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
}
