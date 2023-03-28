// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

export interface UnsatisfiedRange {
  readonly completeLength: number;
}

export interface RangeResp extends InclRange {
  readonly completeLength: undefined | number;
}

export interface InclRange {
  readonly firstPos: number;
  readonly lastPos: number;
}

export type ContentRange =
  & { readonly rangeUnit: string }
  & (RangeResp | UnsatisfiedRange);
