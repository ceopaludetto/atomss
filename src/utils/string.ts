import { ScopedCSSRules, CSSGroupingRules } from './dto';
import { CSSOMInjector, DOMInjector, VirtualInjector } from '../injector';
import { Cache } from '../cache';

export function camelToDash(str: string) {
  return str.replace(/([A-Z])/g, function($1: string) {
    return '-' + $1.toLowerCase();
  });
}

export type StringifyReturn =
  | string
  | { parent: string; content: StringifyReturn[] };

export function isSub(prop: any): prop is Exclude<StringifyReturn, string> {
  return !!prop?.parent;
}

export function stringify<T>(
  rules: ScopedCSSRules<T> | CSSGroupingRules,
  props?: T
): StringifyReturn[] {
  const res: StringifyReturn[] = Object.entries(rules).map(([key, rule]) => {
    if (typeof rule === 'object') {
      return { parent: key, content: stringify(rule, props) } as Exclude<
        StringifyReturn,
        string
      >;
    }
    return `${camelToDash(key)}:${
      typeof rule === 'function' ? rule(props) : rule
    };` as string;
  });

  return res;
}

interface ToClassNameOptions {
  cache: Cache;
  prefix: string;
  declarations: StringifyReturn[];
  filter: StringifyReturn[];
  injector: CSSOMInjector | DOMInjector | VirtualInjector;
  parents?: string[];
}

export function isAtRule(str: string) {
  return str.includes('@media') || str.includes('@support');
}

export function toClassName({
  cache,
  prefix,
  declarations,
  filter,
  injector,
  parents = [],
}: ToClassNameOptions): any[] {
  return declarations.map(declaration => {
    if (isSub(declaration)) {
      return toClassName({
        cache,
        prefix,
        declarations: declaration.content,
        filter,
        injector,
        parents: [...parents, declaration.parent],
      });
    }

    declaration = declaration?.replace(/\s+/g, ' ');

    const [property, defs] = declaration.split(':');

    if (property.includes('animation')) {
      defs.split(' ').forEach(x => {
        const style = cache.getByHash(x.replace(prefix, ''));
        if (style && !cache.get(style).injected) {
          injector.inject(`@keyframes ${x}{${style}}`);
          cache.setInjected(style);
        }
      });
    }

    if (!filter.some(x => x === property + parents.join(''))) {
      filter.push(property + parents.join(''));

      if (!cache.check(declaration + parents.join(''))) {
        const hash = cache.set(declaration + parents.join(''));

        if (!parents.length) {
          injector.inject(`.${prefix}${hash}{${declaration}}`);
        } else {
          let rule: string[] = [];
          let inserted = false;
          let count = 0;

          parents.forEach(parent => {
            if (isAtRule(parent)) {
              count += 1;
              rule.push(`${parent}{`);
            }

            if (parent[0] === '&') {
              const pseudos = parent.split(',');
              pseudos.forEach(pseudo => {
                const effect = pseudo.replace('&', '').trim();
                rule.push(`.${prefix}${hash}${effect}{${declaration}}`);
              });
              inserted = true;
            }
          });

          if (count && !inserted) {
            rule.push(`.${prefix}${hash}{${declaration}}`);
          }

          while (count > 0) {
            rule.push('}');
            count -= 1;
          }

          if (!isAtRule(rule[0]) && rule.length) {
            injector.inject(rule.join(''));
          } else if (rule.length > 2) {
            injector.inject(rule.join(''));
          }
        }
      }

      return `${prefix}${cache.get(declaration + parents.join('')).hash}`;
    }

    return '';
  });
}
