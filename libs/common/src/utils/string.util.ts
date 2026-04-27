// Shared string helpers

export function toSlug(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, '-');
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}
