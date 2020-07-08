import { CSSOMInjector, DOMInjector, VirtualInjector } from '../injector';

export function defaultInjector() {
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      return new CSSOMInjector({});
    }

    return new DOMInjector({});
  }

  return new VirtualInjector();
}
