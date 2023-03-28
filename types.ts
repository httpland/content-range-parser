// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Representation of [`unsatisfied-range`](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.4-2). */
export interface UnsatisfiedRange {
  /** Representation of [`<unsatisfied-range>`](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.4-2). */
  readonly completeLength: number;
}

/** Representation of [`range-resp`](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.4-2). */
export interface RangeResp extends InclRange {
  /** Representation of [`<unsatisfied-range>`](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.4-2). */
  readonly completeLength: undefined | number;
}

/** Representation of [`<incl-range>`](https://www.rfc-editor.org/rfc/rfc9110#section-14.4-2). */
export interface InclRange {
  /** Representation of [`<first-pos>`](https://www.rfc-editor.org/rfc/rfc9110.html#rule.int-range). */
  readonly firstPos: number;

  /** Representation of [`<last-pos>`](https://www.rfc-editor.org/rfc/rfc9110.html#rule.int-range). */
  readonly lastPos: number;
}

/** `Content-Range` header field.
 * Representation of [`Content-Range`](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.4-2).
 */
export type ContentRange =
  & {
    /** Representation of [`<range-unit>`](https://www.rfc-editor.org/rfc/rfc9110.html#section-14.1). */
    readonly rangeUnit: string;
  }
  & (RangeResp | UnsatisfiedRange);
