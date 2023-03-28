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

/** Serialize {@link ContentRange} into string.
 * @throws {TypeError} If the {@link ContentRange} is invalid.
 */
export function stringifyContentRange(contentRange: ContentRange): string {
  if (!isRangeUnitFormat(contentRange.rangeUnit)) {
    throw TypeError(
      `rangeUnit is invalid <range-unit> syntax. "${contentRange.rangeUnit}"`,
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
    : "*";

  return `${inclRangeStr}/${right}`;
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

  return `${firstPos}-${lastPos}`;
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

  return `*/${completeLengthStr}`;
}
