export function formatTimestamp(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;
}
