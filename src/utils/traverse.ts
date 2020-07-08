import { CSSKeyframeRules, ScopedCSSRules } from './dto';
import { camelToDash } from './string';

export function traverseKeyframes(rules: CSSKeyframeRules) {
  const res: string[] = [];

  Object.entries(rules).forEach(([key, props]) => {
    res.push(key + '{');
    if (props) {
      Object.entries(props).forEach(([prop, value]) => {
        res.push(`${camelToDash(prop)}:${value};`);
      });
    }
    res.push('}');
  });

  return res.join('');
}

export function traverse(rules: ScopedCSSRules) {
  let copy: ScopedCSSRules = {};

  Object.entries(rules).forEach(([key, props]) => {
    if (typeof props !== 'object') {
      copy = { ...copy, [camelToDash(key)]: props };
    } else {
      copy = { ...copy, [key]: props };
    }
  });

  return copy;
}
