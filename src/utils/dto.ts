import { CSSOMInjector, DOMInjector, VirtualInjector } from '../injector';
import { Cache } from '../cache';
import * as CSS from 'csstype';

export interface SetupOptions {
  injector?: CSSOMInjector | DOMInjector | VirtualInjector;
  prefix?: string;
  cache?: Cache;
}

export type CSSProperties<T> = {
  [P in keyof CSS.PropertiesFallback<string | number>]:
    | CSS.PropertiesFallback<string | number>[P]
    | ((props: T) => CSS.PropertiesFallback<string | number>[P]);
};

export type ScopedCSSProperties<T> = Omit<CSSProperties<T>, 'all'>;

export type CSSRules<
  T,
  P extends Record<string, any> = CSSProperties<T> & Record<string, any>
> = CSSStyleRules<T, P>;

export interface ScopedCSSRules<T>
  extends CSSRules<T, ScopedCSSProperties<T> & Record<string, any>> {}

export type CSSStyleRules<
  T,
  P extends Record<string, any> = CSSProperties<T> & Record<string, any>
> = P;

export type CSSKeyframeRules =
  | { [time in 'from' | 'to']?: CSSProperties<never> }
  | { [time: string]: CSSProperties<never> };
