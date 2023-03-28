import {
  assertValidRangeResp,
  isRangeResp,
  isUnsatisfiedRange,
} from "./validate.ts";
import {
  assert,
  assertFalse,
  assertIsError,
  assertThrows,
  describe,
  it,
} from "./_dev_deps.ts";
import { RangeResp } from "./types.ts";

describe("assertValidRangeResp", () => {
  it("should return void if the input is valid", () => {
    const table: RangeResp[] = [
      { completeLength: undefined, firstPos: 0, lastPos: 1 },
      { completeLength: 100, firstPos: 0, lastPos: 1 },
      { completeLength: 100, firstPos: 0, lastPos: 0 },
      { completeLength: 1, firstPos: 0, lastPos: 0 },

      // NaN is ok because each values check before
      { completeLength: NaN, firstPos: 0, lastPos: 0 },
      { completeLength: 1, firstPos: NaN, lastPos: 0 },
      { completeLength: 1, firstPos: 0, lastPos: NaN },
      { completeLength: NaN, firstPos: NaN, lastPos: NaN },
    ];

    table.forEach((rangeResp) => {
      assertFalse(assertValidRangeResp(rangeResp));
    });
  });

  it("should throw error if the input is invalid", () => {
    const table: RangeResp[] = [
      { completeLength: undefined, firstPos: 1, lastPos: 0 },
      { completeLength: 1, firstPos: 0, lastPos: 1 },
      { completeLength: 1, firstPos: 1, lastPos: 1 },
    ];

    table.forEach((rangeResp) => {
      assertThrows(() => assertValidRangeResp(rangeResp));
    });
  });

  it("should be error message if the input is invalid", () => {
    let err;

    try {
      assertValidRangeResp({
        firstPos: 1,
        lastPos: 0,
        completeLength: 100,
      });
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        Error,
        `firsPos must be less than or equal to lastPos. firstPos: 1, lastPos: 0`,
      );
    }
  });

  it("should be error message if the input is invalid", () => {
    let err;

    try {
      assertValidRangeResp({
        firstPos: 1,
        lastPos: 1,
        completeLength: 1,
      });
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        Error,
        `lastPos must be less than completeLength. lastPos: 1, completeLength: 1`,
      );
    }
  });
});

describe("isRangeResp", () => {
  it("should return true", () => {
    assert(isRangeResp({ completeLength: undefined, firstPos: 0, lastPos: 0 }));
    assert(isRangeResp({ completeLength: 0, firstPos: 0, lastPos: 0 }));
  });

  it("should return false", () => {
    assertFalse(isRangeResp({ completeLength: 0 }));
    assertFalse(isRangeResp({ completeLength: 0, firstPos: 0 }));
    assertFalse(isRangeResp({ completeLength: 0, lastPos: 0 }));
  });
});

describe("isUnsatisfiedRange", () => {
  it("should return true", () => {
    assert(isUnsatisfiedRange({ completeLength: 0 }));
    assert(isUnsatisfiedRange({ completeLength: 0, firstPos: 0 }));
    assert(isUnsatisfiedRange({ completeLength: 0, lastPos: 0 }));
  });

  it("should return false", () => {
    assertFalse(
      isUnsatisfiedRange({
        completeLength: undefined,
        firstPos: 0,
        lastPos: 0,
      }),
    );
    assertFalse(
      isUnsatisfiedRange({ completeLength: 0, firstPos: 0, lastPos: 0 }),
    );
  });
});
