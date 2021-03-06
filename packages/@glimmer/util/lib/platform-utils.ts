import { Maybe } from '@glimmer/interfaces';

export type Factory<T> = new (...args: unknown[]) => T;

export const HAS_NATIVE_SYMBOL = (function () {
  if (typeof Symbol !== 'function') {
    return false;
  }

  // eslint-disable-next-line symbol-description
  return typeof Symbol() === 'symbol';
})();

export function keys<T>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

export function unwrap<T>(val: Maybe<T>): T {
  if (val === null || val === undefined) throw new Error(`Expected value to be present`);
  return val as T;
}

export function expect<T>(val: Maybe<T>, message: string): T {
  if (val === null || val === undefined) throw new Error(message);
  return val as T;
}

export function unreachable(message = 'unreachable'): Error {
  return new Error(message);
}

export function exhausted(value: never): never {
  throw new Error(`Exhausted ${value}`);
}

export type Lit = string | number | boolean | undefined | null | void | {};

export const tuple = <T extends Lit[]>(...args: T) => args;

export const symbol = HAS_NATIVE_SYMBOL
  ? Symbol
  : (key: string) => `__${key}${Math.floor(Math.random() * Date.now())}__` as any;
