type Unrestrictive<T> = T & {
  [x: string]: any;
}

/**
 * Value of promise, if and only if `T` is promise.
 * E.g. if the method `F.foo` can return raw value or promise,
 * we can write `Promised<ReturnType<F['foo']>>` to get the
 * final resolved value type.
 */
export type Promised<T> = T extends Promise<infer U> ? U : T;

/**
 * Return object as an instance of type `T`.
 * Difference from operator `as` is that it keeps checking `T` properties
 * but doesn't go off if we extend it with new ones.
 * @param a an object
 */
export function __as<T>(a: Unrestrictive<T>): T {
  return a;
}
