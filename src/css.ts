import { Cache } from './cache';
import { CSSOMInjector, DOMInjector, VirtualInjector } from './injector';
import { CSSKeyframeRules, ScopedCSSRules } from './utils/dto';
import { traverseKeyframes, traverse } from './utils/traverse';
import { stringify, toClassName, StringifyReturn } from './utils/string';

export function manager(
  injector: CSSOMInjector | DOMInjector | VirtualInjector,
  prefix: string,
  cache: Cache = new Cache()
) {
  return {
    clsx<T>(styles: ScopedCSSRules<T>[], props?: T) {
      const filter: StringifyReturn[] = [];

      const all = styles.reverse().map(style => {
        const declarations = stringify(style, props);

        const classNames = toClassName({
          declarations,
          filter,
          cache,
          injector,
          prefix,
        });

        return classNames.filter(Boolean);
      });

      return all.flat(2).join(' ');
    },
    keyframes(s: CSSKeyframeRules) {
      let style: string = traverseKeyframes(s);

      if (!cache.check(style)) {
        cache.set(style, false);
      }

      return `${prefix}${cache.get(style).hash}`;
    },
    css<T>(s: ScopedCSSRules<T>) {
      let style: ScopedCSSRules<T> = traverse<T>(s);

      return style;
    },
  };
}
