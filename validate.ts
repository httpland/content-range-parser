// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

import { isNumber } from "./deps.ts";
import type { RangeResp, UnsatisfiedRange } from "./types.ts";

export const ReRangeUnit = /^[\w!#$%&'*+.^`|~-]+$/;

/** Whether the input is `<range-unit>` format or not. */
export function isRangeUnitFormat(input: string): boolean {
  return ReRangeUnit.test(input);
}

/** Assert the {@lin RangeResp} is valid semantics.
 * @see https://www.rfc-editor.org/rfc/rfc9110#section-14.4-10
 * @throws {Error} If the {@link RangeResp} is invalid semantics.
 */
export function assertValidRangeResp(rangeResp: RangeResp): asserts rangeResp {
  const { lastPos, firstPos, completeLength } = rangeResp;

  if (lastPos < firstPos) {
    throw Error(
      `firsPos must be less than or equal to lastPos. firstPos: ${firstPos}, lastPos: ${lastPos}`,
    );
  }

  if (isNumber(completeLength) && completeLength <= lastPos) {
    throw Error(
      `lastPos must be less than completeLength. lastPos: ${lastPos}, completeLength: ${completeLength}`,
    );
  }
}

/** Whether the input is {@link RangeResp} or not.
 *
 * @example
 * ```ts
 * import {
 *   type ContentRange,
 *   isRangeResp,
 * } from "https://deno.land/x/content_range_parser@$VERSION/mod.ts";
 * import { assert } from "https://deno.land/std/testing/asserts.ts";
 *
 * declare const contentRange: ContentRange;
 * assert(isRangeResp(contentRange));
 * ```
 */
export function isRangeResp(
  input: RangeResp | UnsatisfiedRange,
): input is RangeResp {
  return "firstPos" in input && "lastPos" in input;
}

/** Whether the input is {@link UnsatisfiedRange} or not.
 *
 * @example
 * ```ts
 * import {
 *   type ContentRange,
 *   isUnsatisfiedRange,
 * } from "https://deno.land/x/content_range_parser@$VERSION/mod.ts";
 * import { assert } from "https://deno.land/std/testing/asserts.ts";
 *
 * declare const contentRange: ContentRange;
 * assert(isUnsatisfiedRange(contentRange));
 * ```
 */
export function isUnsatisfiedRange(
  input: RangeResp | UnsatisfiedRange,
): input is UnsatisfiedRange {
  return !isRangeResp(input);
}
