export const BASE = '/yanaka-history';

export function getCurrentPath(): string {
  const path = window.location.pathname;
  return path.startsWith(BASE) ? path.slice(BASE.length) || '/' : path;
}

export function navigate(path: string) {
  window.history.pushState({}, '', BASE + path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function href(path: string): string {
  return BASE + path;
}
