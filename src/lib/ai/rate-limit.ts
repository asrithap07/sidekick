const MIN_GAP_MS = 13_000;

let queue: Promise<unknown> = Promise.resolve();
let lastCallAt = 0;

export function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  const run = async (): Promise<T> => {
    const wait = Math.max(0, lastCallAt + MIN_GAP_MS - Date.now());
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    lastCallAt = Date.now();
    return fn();
  };

  const result = queue.then(run);
  queue = result.catch(() => {});
  return result;
}