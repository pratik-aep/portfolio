import type Lenis from "lenis";

// The active Lenis instance, shared with components that need to move the
// page programmatically. Null when smooth scrolling is disabled.
let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}
