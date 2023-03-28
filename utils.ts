// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Divide string to two part by separator. */
export function divideTwo(
  str: string,
  separator: string,
): [head: string, tail: string] | null {
  const index = str.indexOf(separator);

  if (index === -1) return null;

  const head = str.slice(0, index);
  const tail = str.slice(index + separator.length);

  return [head, tail];
}

// deno-lint-ignore no-explicit-any
export function cause<T extends (...args: any) => any>(
  fn: T,
  error: Error,
): ReturnType<T> {
  try {
    return fn();
  } catch (e) {
    error.cause = e;

    throw error;
  }
}
