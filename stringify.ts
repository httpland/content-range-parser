// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isNonNegativeInteger, isNumber } from "./deps.ts";
import type {
  ContentLength,
  ContentRange,
  InclRange,
  RangeResp,
  UnsatisfiedRange,
} from "./types.ts";
import {
  assertValidRangeResp,
  isRangeResp,
  isRangeUnitFormat,
} from "./validate.ts";
import { Char } from "./constants.ts";

/** Serialize {@link ContentRange} into string.
 *
 * @example
 * ```ts
 * import { stringifyContentRange } from "https://deno.land/x/content_range_parser@$VERSION/stringify.ts";
 * import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
 *
 * assertEquals(
 *   stringifyContentRange({
 *     rangeUnit: "bytes",
 *     firstPos: 0,
 *     lastPos: 100,
 *     completeLength: 1000,
 *   }),
 *   "bytes 0-100/1000",
 * );
 * assertEquals(
 *   stringifyContentRange({
 *     rangeUnit: "bytes",
 *     firstPos: 100,
 *     lastPos: 200,
 *     completeLength: undefined,
 *   }),
 *   "bytes 100-200/*",
 * );
 * assertEquals(
 *   stringifyContentRange({ rangeUnit: "bytes", completeLength: 1000 }),
 *   "bytes *\/1000",
 *   );
 * ```
 *
 * @throws {TypeError} If the {@link ContentRange} is invalid.
 */
export function stringifyContentRange(contentRange: ContentRange): string {
  const { rangeUnit } = contentRange;
  if (!isRangeUnitFormat(rangeUnit)) {
    throw TypeError(
      `rangeUnit is invalid <range-unit> syntax. "${rangeUnit}"`,
    );
  }

  const _isRangeResp = isRangeResp(contentRange);

  if (_isRangeResp) {
    assertValidRangeResp(contentRange);
  }

  const right = _isRangeResp
    ? stringifyRangeResp(contentRange)
    : stringifyUnsatisfiedRange(contentRange);
  const field = `${contentRange.rangeUnit} ${right}`;

  return field;
}

/**
 * @throws {TypeError}
 */
export function stringifyRangeResp(rangeResp: RangeResp): string {
  const { completeLength, ...inclRange } = rangeResp;

  const inclRangeStr = stringifyInclRange(inclRange);
  const right = isNumber(completeLength)
    ? stringifyCompleteLength({ completeLength })
    : Char.Star;

  return inclRangeStr + Char.Slash + right;
}

/**
 * @throws {TypeError}
 */
export function stringifyInclRange(inclRange: InclRange): string {
  const { firstPos, lastPos } = inclRange;
  if (!isNonNegativeInteger(firstPos)) {
    throw TypeError(`firstPos is not non-negative integer. ${firstPos}`);
  }

  if (!isNonNegativeInteger(lastPos)) {
    throw TypeError(`lastPos is not non-negative integer. ${lastPos}`);
  }

  return firstPos + Char.Hyphen + lastPos;
}

/**
 * @throws {TypeError}
 */
export function stringifyCompleteLength(input: ContentLength): string {
  const { completeLength } = input;

  if (!isNonNegativeInteger(completeLength)) {
    throw TypeError(
      `completeLength is not non-negative integer. ${completeLength}`,
    );
  }

  return completeLength.toString();
}

export function stringifyUnsatisfiedRange(
  unsatisfiedRange: UnsatisfiedRange,
): string {
  const completeLengthStr = stringifyCompleteLength(unsatisfiedRange);

  return Char.Star + Char.Slash + completeLengthStr;
}
