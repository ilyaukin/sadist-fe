type Unrestrictive<T> = T & {
  [x: string]: any;
}

/**
 * Return object as an instance of type `T`.
 * Difference from operator `as` is that it keeps checking `T` properties
 * but doesn't go off if we extend it with new ones.
 * @param a an object
 */
export function __as<T>(a: Unrestrictive<T>): T {
  return a;
}
