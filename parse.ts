// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import {
  assertValidRangeResp,
  isRangeResp,
  isRangeUnitFormat,
} from "./validate.ts";
import type {
  ContentRange,
  InclRange,
  RangeResp,
  UnsatisfiedRange,
} from "./types.ts";
import { cause, divideTwo } from "./utils.ts";
import { ABNF, Char } from "./constants.ts";

const enum Msg {
  InvalidSemantics = "invalid semantics exist.",
}

/** Parses string into {@link ContentRange}.
 *
 * @example
 * ```ts
 * import { parseContentRange } from "https://deno.land/x/content_range_parser@$VERSION/parse.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * assertEquals(parseContentRange("bytes 0-100/1000"), {
 *   rangeUnit: "bytes",
 *   firstPos: 0,
 *   lastPos: 100,
 *   completeLength: 1000,
 * });
 * assertEquals(parseContentRange("bytes 100-200/*"), {
 *   rangeUnit: "bytes",
 *   firstPos: 100,
 *   lastPos: 200,
 *   completeLength: undefined,
 * });
 * assertEquals(parseContentRange("bytes *\/1000"), {
 *   rangeUnit: "bytes",
 *   completeLength: 1000,
 * });
 * ```
 *
 * @throws {SyntaxError} If the input is invalid [`<Content-Range>`](https://www.rfc-editor.org/rfc/rfc9110#section-14.4-2) syntax.
 * @throws {Error} If the input contains invalid semantics.
 */
export function parseContentRange(input: string): ContentRange {
  const result = divideTwo(input, Char.Space);
  const error = SyntaxError(message(ABNF.ContentRange, input));

  if (!result) throw error;

  const [head, tail] = result;

  if (!isRangeUnitFormat(head)) throw error;

  const rangeUnit = head;
  const parser = isMaybeUnsatisfiedRangeFormat(tail)
    ? parseUnsatisfiedRange
    : parseRangeResp;
  const rangeLike = cause(() => parser(tail), error);

  if (isRangeResp(rangeLike)) {
    cause(() => {
      assertValidRangeResp(rangeLike);
    }, Error(`${Msg.InvalidSemantics} "${input}"`));
  }

  return { ...rangeLike, rangeUnit };
}

function isMaybeUnsatisfiedRangeFormat(
  input: string,
): input is `${Char.Star}${Char.Slash}${string}` {
  return input.startsWith(Char.Star + Char.Slash);
}

/** Parses string into {@link UnsatisfiedRange}.
 * @throws {SyntaxError}
 */
export function parseUnsatisfiedRange(input: string): UnsatisfiedRange {
  const error = SyntaxError(message(ABNF.UnsatisfiedRange, input));

  if (!isMaybeUnsatisfiedRangeFormat(input)) throw error;

  const completeLength = cause(() => parseContentLength(input.slice(2)), error);

  return { completeLength };
}

/** Parses string into {@link RangeResp}.
 * @throws {SyntaxError}
 */
export function parseRangeResp(input: string): RangeResp {
  const result = divideTwo(input, Char.Slash);
  const error = SyntaxError(message(ABNF.RangeResp, input));

  if (!result) throw error;

  const [head, tail] = result;

  const inclRange = cause(() => parseInclRange(head), error);
  const completeLength = tail === Char.Star
    ? undefined
    : cause(() => parseContentLength(tail), error);

  return { ...inclRange, completeLength };
}

/** Parses string into {@link InclRange}.
 * @throws {SyntaxError}
 */
export function parseInclRange(input: string): InclRange {
  const result = divideTwo(input, Char.Hyphen);
  const error = SyntaxError(message(ABNF.InclRange, input));

  if (!result) throw error;

  const [head, tail] = result;
  const firstPos = cause(() => parseFirstPos(head), error);
  const lastPos = cause(() => parseLastPos(tail), error);

  return { firstPos, lastPos };
}

const ReDigit1OrMore = /^\d+$/;

function parseNonNegativeInteger(input: string): number {
  if (!ReDigit1OrMore.test(input)) {
    throw SyntaxError(message(ABNF.DIGIT, input));
  }

  return Number.parseInt(input);
}

export function parseFirstPos(input: string): number {
  try {
    return parseNonNegativeInteger(input);
  } catch {
    throw SyntaxError(message(ABNF.FirstPos, input));
  }
}

export function parseLastPos(input: string): number {
  try {
    return parseNonNegativeInteger(input);
  } catch {
    throw SyntaxError(message(ABNF.LastPos, input));
  }
}

export function parseContentLength(input: string): number {
  try {
    return parseNonNegativeInteger(input);
  } catch {
    throw SyntaxError(message(ABNF.CompleteLength, input));
  }
}

function message(abnf: ABNF, actual: string): string {
  return `invalid ${abnf} syntax. "${actual}"`;
}
