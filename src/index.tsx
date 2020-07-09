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

class Create {
  public injector = defaultInjector();
  private prefix = 'x';
  private cacheManager = new Cache();
  private cssManager!: ReturnType<typeof manager>;

  public constructor() {
    this.injector = defaultInjector();
    this.cssManager = manager(this.injector, this.prefix, this.cacheManager);
  }

  public setup = ({
    prefix = 'x',
    injector = defaultInjector(),
    cache = new Cache(),
  }: SetupOptions) => {
    this.prefix = prefix;
    this.injector = injector;

    if (this.cacheManager) {
      cache.flush(this.cacheManager.all());
    }

    this.cacheManager = cache;
    if (typeof window !== 'undefined') {
      this.cssManager = manager(this.injector, this.prefix, this.cacheManager);
    } else {
      this.cssManager = manager(this.injector, this.prefix, this.cacheManager);
    }
  };

  public css = (s: ScopedCSSRules) => {
    return this.cssManager.css(s);
  };

  public keyframes = (s: CSSKeyframeRules) => {
    return this.cssManager.keyframes(s);
  };

  public clsx = (...styles: ScopedCSSRules[]) => {
    return this.cssManager.clsx(styles);
  };

  public hydrate = () => {
    ensureBrowser('This method should run only in browser envs');
    const el = ensureScriptElement();

    if (el) {
      const cache = JSON.parse(el?.textContent ?? '');
      if (cache && Object.keys(cache).length) {
        this.cacheManager.flush(cache);
      }
    }
  };

  public getStyleTag = () => {
    ensureServer('getStyleTag should run only in server');

    if (isVirtual(this.injector)) {
      const rules = this.injector.getAll();
      return `<style id=${ID}>${rules.join('')}</style>`;
    }

    throw new Error('injector should be VirtualInjector');
  };

  public getScriptTag = () => {
    ensureServer('getScriptTag should run only in server');

    return `<script id=${CACHE} type="application/json">${JSON.stringify(
      this.cacheManager.all()
    )}</script>`;
  };

  public getStyleElement = () => {
    ensureServer('getStyleElement should run only in server');

    if (isVirtual(this.injector)) {
      const rules = this.injector.getAll();
      return <style id={ID}>{rules.join('')}</style>;
    }

    throw new Error('injector should be VirtualInjector');
  };

  public getScriptElement = () => {
    ensureServer('getScriptElement should run only in server');

    return (
      <script
        id={CACHE}
        type="application/json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(this.cacheManager.all()),
        }}
      ></script>
    );
  };

  public seal = () => {
    this.injector.clear();
    this.cacheManager.clear();
  };
}

const inst = new Create();

inst.setup({});

export const setup = inst.setup;
export const css = inst.css;
export const clsx = inst.clsx;
export const keyframes = inst.keyframes;
export const getStyleTag = inst.getStyleTag;
export const getScriptTag = inst.getScriptTag;
export const getStyleElement = inst.getStyleElement;
export const getScriptElement = inst.getScriptElement;
export const hydrate = inst.hydrate;
export const seal = inst.seal;
