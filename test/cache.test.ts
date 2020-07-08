import { Cache } from '../src';

describe('Cache', () => {
  it('should add key', () => {
    const cache = new Cache();

    cache.set('test');

    expect(cache.all()).toHaveProperty('test');
  });

  it('should add not injected key', () => {
    const cache = new Cache();

    cache.set('test', false);
    const entry = cache.get('test');

    expect(entry.injected).toBe(false);
  });

  it('should check key', () => {
    const cache = new Cache();

    cache.set('test');

    expect(cache.check('test')).toBe(true);
    expect(cache.check('teste')).toBe(false);
  });

  it('should set key injected to true', () => {
    const cache = new Cache();

    cache.set('test', false);

    const entry = cache.get('test');
    expect(entry.injected).toBe(false);

    cache.setInjected('test');

    const another = cache.get('test');
    expect(another.injected).toBe(true);
  });

  it('should get key', () => {
    const cache = new Cache();

    cache.set('test');

    const entry = cache.get('test');

    expect(entry).toBeTruthy();
    expect(entry.injected).toBe(true);
  });

  it('should get key by hash', () => {
    const cache = new Cache();

    const hash = cache.set('test');

    if (hash) {
      const entry = cache.getByHash(hash);

      expect(entry).toBeTruthy();
      expect(entry).toBe('test');
    }
  });

  it('should get all keys', () => {
    const cache = new Cache();

    cache.set('test');
    expect(cache.all()).toBeTruthy();
    expect(cache.all()).toHaveProperty('test');
  });

  it('should clear all keys', () => {
    const cache = new Cache();

    cache.set('test');
    expect(Object.keys(cache.all()).length).toBe(1);

    cache.clear();
    expect(Object.keys(cache.all()).length).toBe(0);
  });

  it('should merge keys', () => {
    const cache = new Cache();

    cache.set('test');
    expect(Object.keys(cache.all()).length).toBe(1);

    cache.flush({ test2: { hash: 'test', injected: true } });
    expect(Object.keys(cache.all()).length).toBe(2);
    expect(cache.all()).toHaveProperty('test2');
  });
});
