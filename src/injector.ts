import { ensureStyleElement, ensureBrowser } from './utils/get.style';

interface ConstructorOptions {
  nonce?: string;
}

export class CSSOMInjector {
  private sheet: CSSStyleSheet | null;

  public constructor({ nonce }: ConstructorOptions) {
    ensureBrowser('You cannot use this injector in non browser enviroments');

    this.sheet = ensureStyleElement().sheet;
    if (this?.sheet?.ownerNode) {
      (this.sheet.ownerNode as HTMLStyleElement).nonce = nonce;
    }
  }

  public inject(rule: string) {
    this.sheet?.insertRule(rule);
  }

  public clear() {
    this.sheet?.ownerNode?.parentElement?.removeChild(this.sheet.ownerNode);
    this.sheet = ensureStyleElement().sheet;
  }
}

export class DOMInjector {
  private target!: HTMLStyleElement | null;

  public constructor({ nonce }: ConstructorOptions) {
    ensureBrowser('You cannot use this injector in non browser enviroments');

    this.target = ensureStyleElement();
    if (this.target) {
      this.target.nonce = nonce;
    }
  }

  public inject(rule: string) {
    this.target?.appendChild(document.createTextNode(rule));
  }

  public clear() {
    this.target?.parentElement?.removeChild(this.target);
    this.target = ensureStyleElement();
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
