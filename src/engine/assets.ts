/** Dev: `/assets/…`. Offline/file:// build: `./assets/…`. */
export function asset(file: string): string {
  return `${import.meta.env.BASE_URL}assets/${file}`;
}
