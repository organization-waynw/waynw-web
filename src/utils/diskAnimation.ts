export const APP_START_TIME = Date.now();
export const DISK_SPIN_DURATION = 12000;

export function getDiskAnimationDelay(): string {
  const elapsed = Date.now() - APP_START_TIME;
  const offset = -(elapsed % DISK_SPIN_DURATION);
  return `${offset}ms`;
}
