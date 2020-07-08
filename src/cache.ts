import hash from '@emotion/hash';

export class Cache {
  private keys: { [key: string]: { hash: string; injected: boolean } } = {};

  public check(key: string) {
    return key in this.keys;
  }

  public get(key: string) {
    return this.keys[key];
  }

  public getByHash(value: string) {
    return Object.keys(this.keys).find(x => this.keys[x].hash === value);
  }

  public all() {
    return this.keys;
  }

  public set(key: string, injected: boolean = true) {
    if (!this.check(key)) {
      const str = hash(key);
      this.keys[key] = { hash: str, injected };
      return str;
    }
    return false;
  }

  public setInjected(key: string) {
    const entry = this.keys[key];
    entry.injected = true;
    this.keys[key] = entry;
  }

  public flush(keys: { [key: string]: { hash: string; injected: boolean } }) {
    this.keys = { ...this.keys, ...keys };
  }

  public clear() {
    this.keys = {};
  }
}
