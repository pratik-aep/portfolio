/**
 * Runs `tasks` one per browser idle period (falling back to short timeouts
 * where requestIdleCallback is missing, e.g. Safari), so warm-up work such
 * as shader compilation never lands in a single long task. Returns a
 * cancel function, suitable as a React effect cleanup.
 */
export function runWhenIdle(tasks: (() => void)[]) {
  const idle = typeof window.requestIdleCallback === "function";
  const schedule = (fn: () => void) =>
    idle
      ? window.requestIdleCallback(fn, { timeout: 2000 })
      : window.setTimeout(fn, 200);
  const cancel = (handle: number) =>
    idle ? window.cancelIdleCallback(handle) : window.clearTimeout(handle);

  let index = 0;
  let cancelled = false;
  let handle = 0;
  const step = () => {
    if (cancelled || index >= tasks.length) return;
    tasks[index++]();
    handle = schedule(step);
  };
  handle = schedule(step);
  return () => {
    cancelled = true;
    cancel(handle);
  };
}
