// Shared date helpers

export function toISOString(date: Date): string {
  return date.toISOString();
}

export function isExpired(date: Date): boolean {
  return date.getTime() < Date.now();
}
