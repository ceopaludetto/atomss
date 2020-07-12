import { isVirtual } from './injector';
import { SetupOptions, CSSKeyframeRules, ScopedCSSRules } from './utils/dto';
import { defaultInjector } from './utils/defaults';
import {
  ensureScriptElement,
  ensureBrowser,
  ensureServer,
} from './utils/get.style';
import { Cache } from './cache';
import { ID, CACHE } from './utils/constants';
import * as React from 'react';

import { manager } from './css';

interface ReactProps {
  id: string;
  type?: string;
  dangerouslySetInnerHTML: React.DOMAttributes<any>['dangerouslySetInnerHTML'];
}

class Create {
  public injector = defaultInjector();
  private prefix = 'x';
  private cacheManager = new Cache();
  private cssManager!: ReturnType<typeof manager>;

  public constructor() {
    this.injector = defaultInjector();
    this.cssManager = manager(this.injector, this.prefix, this.cacheManager);

    this.setup = this.setup.bind(this);
    this.css = this.css.bind(this);
    this.clsx = this.clsx.bind(this);
    this.keyframes = this.keyframes.bind(this);
    this.hydrate = this.hydrate.bind(this);
    this.seal = this.seal.bind(this);
    this.getStyleTag = this.getStyleTag.bind(this);
    this.getScriptTag = this.getScriptTag.bind(this);
    this.getStyleProps = this.getStyleProps.bind(this);
    this.getScriptProps = this.getScriptProps.bind(this);
  }

  public setup({
    prefix = 'x',
    injector = defaultInjector(),
    cache = new Cache(),
  }: SetupOptions) {
    this.prefix = prefix;
    this.injector = injector;

    if (this.cacheManager) {
      cache.flush(this.cacheManager.all());
    }

    this.cacheManager = cache;
    this.cssManager = manager(this.injector, this.prefix, this.cacheManager);
  }

  public css<T>(s: ScopedCSSRules<T>) {
    return this.cssManager.css<T>(s);
  }

  public keyframes(s: CSSKeyframeRules) {
    return this.cssManager.keyframes(s);
  }

  public clsx<T>(styles: ScopedCSSRules<T>[], props?: T) {
    return this.cssManager.clsx(styles, props);
  }

  public hydrate() {
    ensureBrowser('This method should run only in browser envs');
    const el = ensureScriptElement();

    if (el) {
      const cache = JSON.parse(el?.textContent ?? '');
      if (cache && Object.keys(cache).length) {
        this.cacheManager.flush(cache);
      }
    }
  }

  public getStyleTag() {
    ensureServer('getStyleTag should run only in server');

    if (isVirtual(this.injector)) {
      const rules = this.injector.getAll();
      return `<style id=${ID}>${rules.join('')}</style>`;
    }

    throw new Error('injector should be VirtualInjector');
  }

  public getScriptTag() {
    ensureServer('getScriptTag should run only in server');

    return `<script id=${CACHE} type="application/json">${JSON.stringify(
      this.cacheManager.all()
    )}</script>`;
  }

  public getStyleProps(): ReactProps {
    ensureServer('getStyleElement should run only in server');

    if (isVirtual(this.injector)) {
      const rules = this.injector.getAll();
      return {
        id: ID,
        dangerouslySetInnerHTML: {
          __html: rules.join(''),
        },
      };
    }

    throw new Error('injector should be VirtualInjector');
  }

  public getScriptProps(): ReactProps {
    ensureServer('getScriptElement should run only in server');

    return {
      id: CACHE,
      type: 'application/json',
      dangerouslySetInnerHTML: {
        __html: JSON.stringify(this.cacheManager.all()),
      },
    };
  }

  public seal() {
    this.injector.clear();
    this.cacheManager.clear();
  }
}

const inst = new Create();

inst.setup({});

export const setup = inst.setup;
export const css = inst.css;
export const clsx = inst.clsx;
export const keyframes = inst.keyframes;
export const getStyleTag = inst.getStyleTag;
export const getScriptTag = inst.getScriptTag;
export const getStyleProps = inst.getStyleProps;
export const getScriptProps = inst.getScriptProps;
export const hydrate = inst.hydrate;
export const seal = inst.seal;
