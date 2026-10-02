export function toggleFullscreen(el: HTMLElement = document.documentElement): void {
  if (!document.fullscreenElement) void el.requestFullscreen();
  else void document.exitFullscreen();
}

export function exitFullscreen(): void {
  if (document.fullscreenElement) void document.exitFullscreen();
}
