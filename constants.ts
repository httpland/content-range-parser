// Copyright 2023-latest the httpland authors. All rights reserved. MIT license.
// This module is browser compatible.

/** Special character. */
export const enum Char {
  Star = "*",
  Slash = "/",
  Hyphen = "-",
  Space = " ",
}

/** ABNF syntax symbol. */
export const enum ABNF {
  FirstPos = "<first-pos>",
  LastPos = "<last-pos>",
  CompleteLength = "<complete-length>",
  ContentRange = "<Content-Range>",
  UnsatisfiedRange = "<unsatisfied-range>",
  RangeResp = "<range-resp>",
  InclRange = "<incl-range>",
  DIGIT = "<DIGIT>",
}
