import { ID, CACHE } from './constants';
import invariant from 'tiny-invariant';

export function ensureStyleElement(): HTMLStyleElement {
  const el = document.querySelector('style#' + ID);
  if (el) return el as HTMLStyleElement;

  const style = document.createElement('style');
  style.id = ID;

  return document.head.appendChild(style);
}

export function ensureScriptElement(): HTMLScriptElement {
  const el = document.querySelector('script#' + CACHE);

  if (el) {
    return el as HTMLScriptElement;
  }

  throw new Error('Script hydratation not found');
}

export function ensureBrowser(message: string) {
  invariant(typeof window !== 'undefined', message);
}

export function ensureServer(message: string) {
  invariant(typeof window === 'undefined', message);
}
