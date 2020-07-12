import { CSSOMInjector, DOMInjector, VirtualInjector } from '../injector';
import { Cache } from '../cache';
import * as CSS from 'csstype';

export interface SetupOptions {
  injector?: CSSOMInjector | DOMInjector | VirtualInjector;
  prefix?: string;
  cache?: Cache;
}

export type CSSProperties<T = object> = CSS.PropertiesFallback<
  string | number | ((props: T) => string | number)
>;
export type ScopedCSSProperties = Omit<CSSProperties, 'all'>;

export type CSSRules<
  T = object,
  P extends Record<string, any> = CSSProperties<T>
> = CSSStyleRules<P> & CSSGroupingRules<P>;

export interface ScopedCSSRules<T> extends CSSRules<T, ScopedCSSProperties> {}

export type CSSStyleRules<P extends Record<string, any> = CSSProperties> = P &
  { [pseudo in CSS.SimplePseudos]?: P } & {
    selectors?: { [selector: string]: P };
  };

export interface CSSGroupingRules<
  P extends Record<string, any> = CSSProperties
> {
  '@media'?: {
    [conditionText: string]: CSSRules<P>;
  };
  '@supports'?: {
    [conditionText: string]: CSSRules<P>;
  };
}

export type CSSKeyframeRules =
  | { [time in 'from' | 'to']?: CSSProperties }
  | { [time: string]: CSSProperties };
