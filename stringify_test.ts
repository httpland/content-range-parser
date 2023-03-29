import {
  ContentLength,
  stringifyCompleteLength,
  stringifyContentRange,
  stringifyInclRange,
  stringifyRangeResp,
  stringifyUnsatisfiedRange,
} from "./stringify.ts";
import {
  assertEquals,
  assertIsError,
  assertThrows,
  describe,
  it,
} from "./_dev_deps.ts";
import {
  ContentRange,
  InclRange,
  RangeResp,
  UnsatisfiedRange,
} from "./types.ts";

describe("stringifyCompleteLength", () => {
  it("should return string if the CompleteLength is valid", () => {
    const table: [ContentLength, string][] = [
      [{ completeLength: 0 }, "0"],
      [{ completeLength: 100 }, "100"],
    ];

    table.forEach(([contentLength, expected]) => {
      assertEquals(stringifyCompleteLength(contentLength), expected);
    });
  });

  it("should throw error if the CompleteLength is invalid", () => {
    const table: ContentLength[] = [
      { completeLength: NaN },
      { completeLength: -1 },
      { completeLength: 1.1 },
    ];

    table.forEach((contentLength) => {
      assertThrows(() => stringifyCompleteLength(contentLength));
    });
  });

  it("should be error message if the CompleteLength is invalid", () => {
    let err;

    try {
      stringifyCompleteLength({ completeLength: NaN });
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        TypeError,
        "completeLength is not non-negative integer. NaN",
      );
    }
  });
});

describe("stringifyUnsatisfiedRange", () => {
  it("should return string if the UnsatisfiedRange is valid", () => {
    const table: [UnsatisfiedRange, string][] = [
      [{ completeLength: 0 }, "*/0"],
      [{ completeLength: 100 }, "*/100"],
    ];

    table.forEach(([unsatisfiedRange, expected]) => {
      assertEquals(stringifyUnsatisfiedRange(unsatisfiedRange), expected);
    });
  });

  it("should throw error if the UnsatisfiedRange is invalid", () => {
    const table: UnsatisfiedRange[] = [
      { completeLength: NaN },
      { completeLength: -1 },
      { completeLength: 1.1 },
    ];

    table.forEach((contentLength) => {
      assertThrows(() => stringifyUnsatisfiedRange(contentLength));
    });
  });

  it("should be error message if the CompleteLength is invalid", () => {
    let err;

    try {
      stringifyUnsatisfiedRange({ completeLength: NaN });
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        TypeError,
        "completeLength is not non-negative integer. NaN",
      );
    }
  });
});

describe("stringifyInclRange", () => {
  it("should return string if the InclRange is valid", () => {
    const table: [InclRange, string][] = [
      [{ firstPos: 0, lastPos: 100 }, "0-100"],
    ];

    table.forEach(([inclRange, expected]) => {
      assertEquals(stringifyInclRange(inclRange), expected);
    });
  });

  it("should throw error if the InclRange is invalid", () => {
    const table: InclRange[] = [
      { firstPos: -1, lastPos: 0 },
      { firstPos: 1.1, lastPos: 0 },
      { firstPos: 0, lastPos: 1.1 },
      { firstPos: 0, lastPos: -1 },
      { firstPos: NaN, lastPos: 0 },
      { firstPos: 0, lastPos: NaN },
    ];

    table.forEach((inclRange) => {
      assertThrows(() => stringifyInclRange(inclRange));
    });
  });

  it("should be error message if the InclRange.firstPos is invalid", () => {
    let err;

    try {
      stringifyInclRange({ firstPos: NaN, lastPos: 100 });
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        TypeError,
        "firstPos is not non-negative integer. NaN",
      );
    }
  });

  it("should be error message if the InclRange.lastPos is invalid", () => {
    let err;

    try {
      stringifyInclRange({ firstPos: 0, lastPos: NaN });
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        TypeError,
        "lastPos is not non-negative integer. NaN",
      );
    }
  });
});

describe("stringifyRangeResp", () => {
  it("should return string if the RangeResp is valid", () => {
    const table: [RangeResp, string][] = [
      [{ firstPos: 0, lastPos: 100, completeLength: 100 }, "0-100/100"],
    ];

    table.forEach(([rangeResp, expected]) => {
      assertEquals(stringifyRangeResp(rangeResp), expected);
    });
  });

  it("should throw error if the RangeResp is invalid", () => {
    const table: RangeResp[] = [
      { firstPos: -1, lastPos: 0, completeLength: 0 },
      { firstPos: 1.1, lastPos: 0, completeLength: 0 },
      { firstPos: 0, lastPos: 1.1, completeLength: 0 },
      { firstPos: 0, lastPos: -1, completeLength: 0 },
      { firstPos: NaN, lastPos: 0, completeLength: 0 },
      { firstPos: 0, lastPos: NaN, completeLength: 0 },
      { firstPos: 0, lastPos: 1, completeLength: NaN },
      { firstPos: 0, lastPos: 1, completeLength: -1 },
      { firstPos: 0, lastPos: 1, completeLength: 1.1 },
    ];

    table.forEach((rangeResp) => {
      assertThrows(() => stringifyRangeResp(rangeResp));
    });
  });

  it("should be error message if the RangeResp.lastPos is invalid", () => {
    let err;

    try {
      stringifyRangeResp({ firstPos: 0, lastPos: NaN, completeLength: 100 });
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        TypeError,
        "lastPos is not non-negative integer. NaN",
      );
    }
  });
});

describe("stringifyContentRange", () => {
  it("should return string if the ContentRange is valid", () => {
    const table: [ContentRange, string][] = [
      [
        { rangeUnit: "bytes", firstPos: 0, lastPos: 99, completeLength: 100 },
        "bytes 0-99/100",
      ],
      [
        { rangeUnit: "bytes", firstPos: 0, completeLength: 100 },
        "bytes */100",
      ],
      [
        { rangeUnit: "bytes", lastPos: 0, completeLength: 100 },
        "bytes */100",
      ],
      [
        {
          rangeUnit: "bytes",
          firstPos: 0,
          lastPos: 100,
          completeLength: undefined,
        },
        "bytes 0-100/*",
      ],
      [
        { rangeUnit: "bytes", completeLength: 100 },
        "bytes */100",
      ],
    ];

    table.forEach(([contentRange, expected]) => {
      assertEquals(stringifyContentRange(contentRange), expected);
    });
  });

  it("should throw error if the ContentRange is invalid", () => {
    const table: ContentRange[] = [
      { rangeUnit: `"`, completeLength: 0 },
      { rangeUnit: `bytes`, completeLength: NaN },
      { rangeUnit: `bytes`, completeLength: NaN, firstPos: 100 },
      { rangeUnit: `bytes`, completeLength: 100, firstPos: NaN, lastPos: 100 },
      { rangeUnit: `bytes`, completeLength: 100, firstPos: 0, lastPos: NaN },
      {
        rangeUnit: `bytes`,
        completeLength: undefined,
        firstPos: 0,
        lastPos: NaN,
      },
    ];

    table.forEach((contentRange) => {
      assertThrows(() => stringifyContentRange(contentRange));
    });
  });

  it("should be error message if the RangeResp.rangeUnit is invalid", () => {
    let err;

    try {
      stringifyContentRange({
        rangeUnit: "",
        firstPos: 0,
        lastPos: NaN,
        completeLength: 100,
      });
    } catch (e) {
      err = e;
    } finally {
      assertIsError(
        err,
        TypeError,
        `rangeUnit is invalid <range-unit> syntax. ""`,
      );
    }
  });
});
