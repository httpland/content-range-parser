// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isRangeUnitFormat } from "./validate.ts";
import type {
  ContentRange,
  InclRange,
  RangeResp,
  UnsatisfiedRange,
} from "./types.ts";
import { cause, divideTwo } from "./utils.ts";

const SP = " ";

/** Parses string into {@link ContentRange}.
 * @throws {SyntaxError}
 */
export function parseContentRange(input: string): ContentRange {
  const result = divideTwo(input, SP);
  const error = SyntaxError(`invalid <Content-Range> syntax. "${input}"`);

  if (!result) throw error;

  const [head, tail] = result;

  if (!isRangeUnitFormat(head)) throw error;

  const rangeUnit = head;
  const parser = isMaybeUnsatisfiedRangeFormat(tail)
    ? parseUnsatisfiedRange
    : parseRangeResp;
  const rangeLike = cause(() => parser(tail), error);

  return { ...rangeLike, rangeUnit };
}

function isMaybeUnsatisfiedRangeFormat(input: string): input is `*/${string}` {
  return input.startsWith("*/");
}

/** Parses string into {@link UnsatisfiedRange}.
 * @throws {SyntaxError}
 */
export function parseUnsatisfiedRange(input: string): UnsatisfiedRange {
  const error = SyntaxError(`invalid <unsatisfied-range> syntax. "${input}"`);

  if (!isMaybeUnsatisfiedRangeFormat(input)) throw error;

  const completeLength = cause(() => parseContentLength(input.slice(2)), error);

  return { completeLength };
}

/** Parses string into {@link RangeResp}.
 * @throws {SyntaxError}
 */
export function parseRangeResp(input: string): RangeResp {
  const result = divideTwo(input, "/");
  const error = SyntaxError(`invalid <range-resp> syntax. "${input}"`);

  if (!result) throw error;

  const [head, tail] = result;

  const inclRange = cause(() => parseInclRange(head), error);
  const completeLength = tail === "*"
    ? undefined
    : cause(() => parseContentLength(tail), error);

  return { ...inclRange, completeLength };
}

/** Parses string into {@link InclRange}.
 * @throws {SyntaxError}
 */
export function parseInclRange(input: string): InclRange {
  const result = divideTwo(input, "-");
  const error = SyntaxError(`invalid <incl-range> syntax. "${input}"`);

  if (!result) throw error;

  const [head, tail] = result;
  const firstPos = cause(() => parseFirstPos(head), error);
  const lastPos = cause(() => parseLastPos(tail), error);

  return { firstPos, lastPos };
}

const ReDigit1OrMore = /^\d+$/;

function parseNonNegativeInteger(input: string): number {
  if (!ReDigit1OrMore.test(input)) {
    throw SyntaxError(`invalid <DIGIT> syntax. ${input}`);
  }

  return Number.parseInt(input);
}

export function parseFirstPos(input: string): number {
  try {
    return parseNonNegativeInteger(input);
  } catch {
    throw SyntaxError(`${Msg.InvalidFirstPos} "${input}"`);
  }
}

export function parseLastPos(input: string): number {
  try {
    return parseNonNegativeInteger(input);
  } catch {
    throw SyntaxError(`${Msg.InvalidLastPos} "${input}"`);
  }
}

export function parseContentLength(input: string): number {
  try {
    return parseNonNegativeInteger(input);
  } catch {
    throw SyntaxError(`${Msg.InvalidContentLength} "${input}"`);
  }
}

const enum Msg {
  InvalidFirstPos = "invalid <first-pos> syntax.",
  InvalidLastPos = "invalid <last-pos> syntax.",
  InvalidContentLength = "invalid <content-length> syntax.",
}
