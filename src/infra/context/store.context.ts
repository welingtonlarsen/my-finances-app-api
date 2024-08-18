import { AsyncLocalStorage } from 'node:async_hooks';

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

export function Context(key: string) {
  return function (target: any, propertyKey: string) {
    const getter = function () {
      const store = asyncLocalStorage.getStore();
      return store ? store.get(key) : undefined;
    };

    Object.defineProperty(target, propertyKey, {
      get: getter,
      enumerable: true,
      configurable: true,
    });
  };
}
