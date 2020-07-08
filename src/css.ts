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
    clsx(styles: ScopedCSSRules[]) {
      const filter: StringifyReturn[] = [];

      const all = styles.reverse().map(style => {
        const declarations = stringify(style);

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
    css(s: ScopedCSSRules) {
      let style: ScopedCSSRules = traverse(s);

      return style;
    },
  };
}
