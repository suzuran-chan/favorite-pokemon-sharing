// A tiny indirection to make page reload testable without poking at window.location
export function reloadPage(): void {
  if (typeof window !== 'undefined' && typeof window.location?.reload === 'function') {
    window.location.reload();
  }
}
