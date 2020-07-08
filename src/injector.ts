import { getStyleElement, ensureBrowser } from './utils/get.style';

interface ConstructorOptions {
  nonce?: string;
}

export class CSSOMInjector {
  private sheet: CSSStyleSheet | null;

  public constructor({ nonce }: ConstructorOptions) {
    ensureBrowser('You cannot use this injector in non browser enviroments');

    this.sheet = getStyleElement().sheet;
    if (this?.sheet?.ownerNode) {
      (this.sheet.ownerNode as HTMLStyleElement).nonce = nonce;
    }
  }

  public inject(rule: string) {
    this.sheet?.insertRule(rule);
  }

  public clear() {
    this.sheet?.ownerNode?.parentElement?.removeChild(this.sheet.ownerNode);
    this.sheet = getStyleElement().sheet;
  }
}

export class DOMInjector {
  private target!: HTMLStyleElement | null;

  public constructor({ nonce }: ConstructorOptions) {
    ensureBrowser('You cannot use this injector in non browser enviroments');

    this.target = getStyleElement();
    if (this.target) {
      this.target.nonce = nonce;
    }
  }

  public inject(rule: string) {
    this.target?.appendChild(document.createTextNode(rule));
  }

  public clear() {
    this.target?.parentElement?.removeChild(this.target);
    this.target = getStyleElement();
  }
}

export class VirtualInjector {
  private rules: string[] = [];

  public inject(rule: string) {
    this.rules.push(rule);
  }

  public getAll() {
    return this.rules;
  }

  public clear() {
    this.rules = [];
  }
}

export function isVirtual(injector: any): injector is VirtualInjector {
  return !!injector?.getAll;
}
